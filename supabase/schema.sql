-- Nuru database schema
-- Run this in your Supabase project's SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Profiles table (extends Supabase's built-in auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('student', 'landlord')) default 'student',
  phone text,
  verified boolean not null default false,
  verified_since date,
  response_time_label text default 'Usually replies within a day',
  created_at timestamptz default now()
);

-- 2. Listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  city text not null,
  country text not null,
  price_per_month numeric not null,
  currency text not null,
  room_type text not null check (room_type in ('Private room', 'Shared room', 'Studio')),
  distance_label text,
  description text,
  amenities text[] default '{}',
  image_url text,
  verified boolean not null default false,
  created_at timestamptz default now()
);

-- 3. Bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  payment_status text not null check (payment_status in ('pending', 'held', 'released', 'refunded')) default 'pending',
  created_at timestamptz default now()
);

-- 4. Safety check-ins table
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  scheduled_for timestamptz not null,
  status text not null check (status in ('pending', 'confirmed', 'missed')) default 'pending',
  parent_contact text,
  created_at timestamptz default now()
);

-- Row Level Security: turn on for every table
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.bookings enable row level security;
alter table public.check_ins enable row level security;

-- Profiles: anyone can read profiles, users can only edit their own
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Listings: anyone can read; only the owning landlord can insert/update their own
create policy "Listings are viewable by everyone"
  on public.listings for select using (true);

create policy "Landlords can insert their own listings"
  on public.listings for insert with check (auth.uid() = landlord_id);

create policy "Landlords can update their own listings"
  on public.listings for update using (auth.uid() = landlord_id);

create policy "Landlords can delete their own listings"
  on public.listings for delete using (auth.uid() = landlord_id);

-- Bookings: a student can see/manage their own bookings;
-- a landlord can see bookings made on their listings
create policy "Students can view their own bookings"
  on public.bookings for select using (
    auth.uid() = student_id
    or auth.uid() in (
      select landlord_id from public.listings where listings.id = bookings.listing_id
    )
  );

create policy "Students can create bookings"
  on public.bookings for insert with check (auth.uid() = student_id);

-- Check-ins: visible to the student on the booking and the listing's landlord
create policy "Check-ins viewable by student and landlord"
  on public.check_ins for select using (
    auth.uid() in (
      select student_id from public.bookings where bookings.id = check_ins.booking_id
    )
    or auth.uid() in (
      select l.landlord_id from public.bookings b
      join public.listings l on l.id = b.listing_id
      where b.id = check_ins.booking_id
    )
  );

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for listing photos (run separately if it errors — buckets
-- can also be created from Dashboard > Storage > New bucket, name: listing-photos, public: true)
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "Listing photos are publicly viewable"
  on storage.objects for select using (bucket_id = 'listing-photos');

create policy "Authenticated users can upload listing photos"
  on storage.objects for insert with check (
    bucket_id = 'listing-photos' and auth.role() = 'authenticated'
  );

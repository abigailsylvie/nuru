
export type Listing = {
  id: string;
  title: string;
  city: string;
  country: string;
  image: string;
  pricePerMonth: number;
  currency: string;
  verified: boolean;
  roomType: "Private room" | "Shared room" | "Studio";
  distanceLabel: string;
  landlord: {
    name: string;
    verifiedSince: string;
    responseTime: string;
  };

  amenities: string[];
  description: string;
};

export const listings: Listing[] = [
  {
    id: "dakar-plateau-01",
    title: "Quiet studio near Plateau business district",
    city: "Dakar",
    image: "/images/dakar.avif",
    country: "Senegal",
    pricePerMonth: 145000,
    currency: "XOF",
    verified: true,
    roomType: "Studio",
    distanceLabel: "12 min to Plateau",
    landlord: {
      name: "Aïssatou D.",
      verifiedSince: "Mar 2026",
      responseTime: "Usually replies within 2 hours",
    },
    amenities: ["Wi-Fi", "Backup generator", "Private bathroom", "Kitchenette"],
    description:
      "A calm studio five minutes from the bus stop, popular with exchange students working downtown. Landlord has hosted 14 verified stays.",
  },
  {
    id: "yaounde-bastos-02",
    title: "Private room in shared house, Bastos",
    city: "Yaoundé",
    image: "/images/yaounde.jpg",
    country: "Cameroon",
    pricePerMonth: 80000,
    currency: "XAF",
    verified: true,
    roomType: "Private room",
    distanceLabel: "8 min to Bastos embassies area",
    landlord: {
      name: "Emmanuel N.",
      verifiedSince: "Jan 2026",
      responseTime: "Usually replies within 1 hour",
    },
    amenities: ["Wi-Fi", "Shared kitchen", "Laundry", "24/7 security"],
    description:
      "Room in a gated compound shared with two other students. Close to internship placements around Bastos.",
  },
  {
    id: "casablanca-maarif-03",
    title: "Furnished room, Maarif district",
    city: "Casablanca",
    image: "/images/casa.jpg",
    country: "Morocco",
    pricePerMonth: 2400,
    currency: "MAD",
    verified: true,
    roomType: "Private room",
    distanceLabel: "15 min to tram line 1",
    landlord: {
      name: "Rania B.",
      verifiedSince: "Feb 2026",
      responseTime: "Usually replies within 3 hours",
    },
    amenities: ["Wi-Fi", "Heating", "Private bathroom", "Elevator"],
    description:
      "Bright room in a family apartment. Landlord is a university-recommended host with a long history of student stays.",
  },
  {
    id: "cape-town-observatory-04",
    title: "Shared room near UCT and Woodstock",
    city: "Cape Town",
    image: "/images/cape-town.jpg",
    country: "South Africa",
    pricePerMonth: 3200,
    currency: "ZAR",
    verified: false,
    roomType: "Shared room",
    distanceLabel: "10 min to UCT lower campus",
    landlord: {
      name: "Sipho M.",
      verifiedSince: "Pending",
      responseTime: "Usually replies within 6 hours",
    },
    amenities: ["Wi-Fi", "Shared kitchen", "Study desk"],
    description:
      "Popular with exchange students during term time. Verification in progress — documents submitted, awaiting confirmation.",
  },
  {
    id: "nairobi-kilimani-05",
    title: "Studio apartment, Kilimani",
    city: "Nairobi",
    image: "/images/nairobi.jpg",
    country: "Kenya",
    pricePerMonth: 28000,
    currency: "KES",
    verified: true,
    roomType: "Studio",
    distanceLabel: "6 min to Yaya Centre",
    landlord: {
      name: "Grace W.",
      verifiedSince: "Apr 2026",
      responseTime: "Usually replies within 1 hour",
    },
    amenities: ["Wi-Fi", "Backup water tank", "Private bathroom", "Parking"],
    description:
      "Self-contained studio in a quiet residential block. Landlord has completed monthly safety check-ins for every past tenant.",
  },
];

export function getListingById(id: string) {
  return listings.find((listing) => listing.id === id);
}

export function formatPrice(amount: number, currency: string) {
  return `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`;
}

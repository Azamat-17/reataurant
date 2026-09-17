export interface RestaurantCardData {
  id: string;
  slug: string;
  name: string;
  nameSubtitle?: string | null;
  address: string;
  landmark?: string | null;
  landmarkDistanceM?: number | null;
  landmarkWalkMin?: number | null;
  type: string;
  avgCheck?: number | null;
  capacity?: number | null;
  hasVeranda: boolean;
  hasOpenKitchen: boolean;
  hasOnlineBooking: boolean;
  hasDiscounts: boolean;
  coverImage?: string | null;
  priceIcons?: string | null;
  city?: { name: string } | null;
}

export interface PriceIcon {
  icon: "cup" | "wine" | "beer" | "cocktail";
  price: number;
}

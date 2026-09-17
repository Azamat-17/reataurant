export const RESTAURANT_TYPES = [
  "Ресторан",
  "Кафе",
  "Бар",
  "Кофейня",
  "Фастфуд",
  "Пекарня",
  "Столовая",
] as const;

export type RestaurantType = (typeof RESTAURANT_TYPES)[number];

export interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_BANDS: PriceBand[] = [
  { id: "low", label: "до 500 сом", min: 0, max: 500 },
  { id: "mid", label: "500–1000 сом", min: 500, max: 1000 },
  { id: "high", label: "1000–2000 сом", min: 1000, max: 2000 },
  { id: "premium", label: "от 2000 сом", min: 2000, max: null },
];

export interface FeatureFlag {
  id: "hasVeranda" | "hasOpenKitchen" | "hasOnlineBooking" | "hasDiscounts";
  label: string;
  badgeLabel: string;
}

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "hasVeranda", label: "Веранды", badgeLabel: "ЛЕТНЯЯ ВЕРАНДА" },
  { id: "hasOpenKitchen", label: "Открытая кухня", badgeLabel: "ОТКРЫТАЯ КУХНЯ" },
  { id: "hasOnlineBooking", label: "Онлайн-бронирование", badgeLabel: "ОНЛАЙН-БРОНЬ" },
  { id: "hasDiscounts", label: "Скидки и подарки", badgeLabel: "СКИДКИ" },
];

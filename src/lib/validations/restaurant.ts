import { z } from "zod";
import { RESTAURANT_TYPES } from "@/lib/constants";

export const restaurantSchema = z.object({
  name: z.string().min(2, "Введите название"),
  nameSubtitle: z.string().optional(),
  description: z.string().min(10, "Опишите заведение подробнее"),
  address: z.string().min(3, "Введите адрес"),
  landmark: z.string().optional(),
  landmarkDistanceM: z.coerce.number().int().nonnegative().optional(),
  landmarkWalkMin: z.coerce.number().int().nonnegative().optional(),
  cityId: z.string().optional(),
  regionId: z.string().optional(),
  districtId: z.string().optional(),
  type: z.enum(RESTAURANT_TYPES),
  avgCheck: z.coerce.number().int().nonnegative().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  hasVeranda: z.coerce.boolean().default(false),
  hasOpenKitchen: z.coerce.boolean().default(false),
  hasOnlineBooking: z.coerce.boolean().default(false),
  hasDiscounts: z.coerce.boolean().default(false),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  coverImage: z.string().optional(),
});

export type RestaurantInput = z.input<typeof restaurantSchema>;

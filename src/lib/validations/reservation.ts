import { z } from "zod";

export const reservationSchema = z.object({
  restaurantId: z.string().min(1),
  guestName: z.string().min(2, "Введите имя"),
  guestPhone: z.string().min(6, "Введите телефон"),
  partySize: z.coerce.number().int().min(1).max(2000),
  preferredAt: z.string().min(1, "Выберите дату и время"),
  comment: z.string().optional(),
});

export type ReservationInput = z.input<typeof reservationSchema>;

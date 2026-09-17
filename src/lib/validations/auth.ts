import { z } from "zod";

const phoneRegex = /^[0-9+()\s-]{6,20}$/;

const passwordSchema = z
  .string()
  .min(8, "Минимум 8 символов")
  .regex(/^[\x21-\x7E]+$/, "Только латинские буквы, цифры и символы, без пробелов")
  .regex(/[0-9]/, "Должна быть хотя бы одна цифра")
  .regex(/[^A-Za-z0-9]/, "Должен быть хотя бы один символ (например, !@#$%)");

export const registerSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("USER"),
    name: z.string().min(2, "Введите имя"),
    phone: z.string().min(6, "Введите номер телефона").regex(phoneRegex, "Некорректный номер телефона"),
    email: z.union([z.string().email("Некорректный email"), z.literal("")]).optional(),
    password: passwordSchema,
  }),
  z.object({
    role: z.literal("OWNER"),
    name: z.string().min(2, "Введите имя"),
    email: z.string().email("Некорректный email"),
    phone: z.union([z.string().regex(phoneRegex, "Некорректный номер телефона"), z.literal("")]).optional(),
    password: passwordSchema,
  }),
]);

export type RegisterInput = z.input<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, "Введите email или телефон"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginInput = z.infer<typeof loginSchema>;

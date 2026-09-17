import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.email || undefined;
  const phone = data.phone || undefined;

  if (data.role === "USER") {
    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ error: "Пользователь с таким телефоном уже существует" }, { status: 409 });
    }
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email, phone, passwordHash, role: "USER" },
    });

    return NextResponse.json({ id: user.id, phone: user.phone, role: user.role });
  }

  // role === "OWNER"
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
  }
  if (phone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ error: "Пользователь с таким телефоном уже существует" }, { status: 409 });
    }
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, phone, passwordHash, role: "OWNER" },
  });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}

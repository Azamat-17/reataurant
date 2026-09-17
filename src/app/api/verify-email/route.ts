import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCodeSchema } from "@/lib/validations/auth";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/mailer";

const CODE_TTL_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = verifyCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const { email, code } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (
    !user.verificationCode ||
    user.verificationCode !== code ||
    !user.verificationCodeExpiresAt ||
    user.verificationCodeExpiresAt < new Date()
  ) {
    return NextResponse.json({ error: "Неверный или устаревший код" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email : undefined;
  if (!email) return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const code = generateVerificationCode();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationCode: code, verificationCodeExpiresAt: new Date(Date.now() + CODE_TTL_MS) },
  });
  await sendVerificationEmail(email, code);

  return NextResponse.json({ ok: true });
}

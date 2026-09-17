import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SUBSCRIPTION_PRICE_SOM, SUBSCRIPTION_PERIOD_DAYS, getSubscriptionInfo } from "@/lib/subscription";

// No payment provider is connected yet — this simulates an instant successful
// payment so the subscription flow can be built and tested end-to-end now.
// Swap the body of this handler for a real provider call once one is chosen.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (restaurant.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const now = new Date();
  const { isPaid, paidUntil } = getSubscriptionInfo(restaurant.subscriptionPaidUntil);
  const periodStart = isPaid && paidUntil ? paidUntil : now;
  const periodEnd = new Date(periodStart.getTime() + SUBSCRIPTION_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  const [updated] = await prisma.$transaction([
    prisma.restaurant.update({
      where: { id },
      data: { subscriptionPaidUntil: periodEnd },
    }),
    prisma.payment.create({
      data: {
        restaurantId: id,
        amount: SUBSCRIPTION_PRICE_SOM,
        periodStart,
        periodEnd,
      },
    }),
  ]);

  return NextResponse.json({ subscriptionPaidUntil: updated.subscriptionPaidUntil });
}

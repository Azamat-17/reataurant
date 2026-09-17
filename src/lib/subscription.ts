import type { Prisma } from "@prisma/client";

export const SUBSCRIPTION_PRICE_SOM = 1000;
export const SUBSCRIPTION_PERIOD_DAYS = 30;
export const SUBSCRIPTION_WARNING_DAYS = 5;

/** Prisma `where` fragment restricting results to restaurants currently visible to the public. */
export function publicVisibilityWhere(): Prisma.RestaurantWhereInput {
  return {
    status: "APPROVED",
    subscriptionPaidUntil: { gte: new Date() },
  };
}

export interface SubscriptionInfo {
  isPaid: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  paidUntil: Date | null;
}

export function getSubscriptionInfo(paidUntil: Date | null): SubscriptionInfo {
  const now = new Date();
  const isPaid = !!paidUntil && paidUntil.getTime() > now.getTime();
  const daysRemaining = paidUntil
    ? Math.max(0, Math.ceil((paidUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const isExpiringSoon = isPaid && daysRemaining <= SUBSCRIPTION_WARNING_DAYS;
  return { isPaid, isExpiringSoon, daysRemaining, paidUntil };
}

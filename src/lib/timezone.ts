// The app only serves restaurants in Kyrgyzstan (Asia/Bishkek, UTC+6, no DST).
// Local dev runs in that same timezone, but Vercel's serverless functions run
// in UTC, so any code that relied on the server process's ambient timezone
// (e.g. `new Date("2026-09-24T15:00")` or `new Date(y, m, d, h)`) silently
// parsed guest-submitted times as UTC in production, shifting every stored
// reservation time by 6 hours. These helpers pin every conversion to
// Kyrgyzstan time explicitly, so behavior is identical in dev and prod.
const RESTAURANT_TZ_SUFFIX = "+06:00";
const RESTAURANT_TZ_OFFSET_MS = 6 * 60 * 60 * 1000;
export const RESTAURANT_TIME_ZONE = "Asia/Bishkek";

const HAS_TIMEZONE_DESIGNATOR = /(Z|[+-]\d{2}:?\d{2})$/;

/** Parses a naive "YYYY-MM-DDTHH:mm[:ss]" wall-clock string as Kyrgyzstan local time. */
export function parseRestaurantDateTime(value: string): Date {
  const withZone = HAS_TIMEZONE_DESIGNATOR.test(value) ? value : `${value}${RESTAURANT_TZ_SUFFIX}`;
  return new Date(withZone);
}

/** UTC instants for the start/end of a "YYYY-MM-DD" calendar day in Kyrgyzstan time. */
export function restaurantDayRange(dateOnly: string): { start: Date; end: Date } {
  return {
    start: parseRestaurantDateTime(`${dateOnly}T00:00:00.000`),
    end: parseRestaurantDateTime(`${dateOnly}T23:59:59.999`),
  };
}

/** Reads the calendar date (in Kyrgyzstan time) that a stored instant falls on. */
export function restaurantDayOfMonth(date: Date): number {
  return new Date(date.getTime() + RESTAURANT_TZ_OFFSET_MS).getUTCDate();
}

/** Formats a stored instant for display in Kyrgyzstan time, regardless of the viewer's own timezone. */
export function formatRestaurantDateTime(value: Date | string, locale = "ru-RU"): string {
  return new Date(value).toLocaleString(locale, { timeZone: RESTAURANT_TIME_ZONE });
}

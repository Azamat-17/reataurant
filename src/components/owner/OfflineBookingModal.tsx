"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AvailabilityCalendar } from "@/components/restaurant/AvailabilityCalendar";
import { reservationSchema, type ReservationInput } from "@/lib/validations/reservation";

interface RestaurantOption {
  id: string;
  name: string;
}

interface Props {
  restaurants: RestaurantOption[];
  open: boolean;
  onClose: () => void;
}

export function OfflineBookingModal({ restaurants, open, onClose }: Props) {
  const t = useTranslations("owner");
  const tr = useTranslations("reservation");
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("18:00");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { restaurantId, partySize: 2 },
  });

  useEffect(() => {
    if (selectedDate) {
      setValue("preferredAt", `${selectedDate}T${selectedTime}`, { shouldValidate: true });
    }
  }, [selectedDate, selectedTime, setValue]);

  function handleRestaurantChange(id: string) {
    setRestaurantId(id);
    setSelectedDate(undefined);
  }

  async function onSubmit(data: ReservationInput) {
    setSubmitError(null);
    const res = await fetch(`/api/restaurants/${restaurantId}/reservations/offline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubmitError(body.error ?? "Не удалось сохранить");
      return;
    }
    setSuccess(true);
    reset();
    setSelectedDate(undefined);
    router.refresh();
  }

  function handleClose() {
    setSuccess(false);
    setSubmitError(null);
    setSelectedDate(undefined);
    onClose();
  }

  const restaurantName = restaurants.find((r) => r.id === restaurantId)?.name ?? "";

  return (
    <Modal open={open} onClose={handleClose} title={`${t("offlineBookingTitle")}${restaurantName ? ` · ${restaurantName}` : ""}`}>
      {success ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground">{t("offlineBookingSuccess")}</p>
          <Button onClick={handleClose}>OK</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <p className="text-xs text-muted">{t("offlineBookingHint")}</p>

          {restaurants.length > 1 && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">{t("selectRestaurant")}</label>
              <select
                value={restaurantId}
                onChange={(e) => handleRestaurantChange(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{tr("name")}</label>
            <input {...register("guestName")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            {errors.guestName && <p className="mt-1 text-xs text-red-500">{errors.guestName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{tr("phone")}</label>
            <input {...register("guestPhone")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            {errors.guestPhone && <p className="mt-1 text-xs text-red-500">{errors.guestPhone.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{tr("partySize")}</label>
            <input
              type="number"
              min={1}
              max={2000}
              {...register("partySize")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{tr("chooseDate")}</label>
            <AvailabilityCalendar restaurantId={restaurantId} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>

          {selectedDate && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">{tr("time")}</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
          )}
          {errors.preferredAt && <p className="text-xs text-red-500">{errors.preferredAt.message}</p>}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{tr("comment")}</label>
            <textarea {...register("comment")} rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          {submitError && <p className="text-xs text-red-500">{submitError}</p>}
          <Button type="submit" variant="green" disabled={isSubmitting || !restaurantId} className="mt-2 w-full">
            {t("addOfflineBooking")}
          </Button>
        </form>
      )}
    </Modal>
  );
}

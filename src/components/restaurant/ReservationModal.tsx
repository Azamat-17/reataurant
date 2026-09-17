"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { reservationSchema, type ReservationInput } from "@/lib/validations/reservation";

interface Props {
  restaurantId: string;
  restaurantName: string;
  open: boolean;
  onClose: () => void;
}

interface Availability {
  capacity: number | null;
  booked: boolean;
}

type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

function renderAvailabilityMessage(t: Translate, checking: boolean, availability: Availability | null): string {
  if (checking) return t("checkingAvailability");
  if (!availability) return t("dateFree");
  if (availability.booked) return t("dateBooked");
  if (availability.capacity != null) return t("dateFreeWithCapacity", { capacity: availability.capacity });
  return t("dateFree");
}

export function ReservationModal({ restaurantId, restaurantName, open, onClose }: Props) {
  const t = useTranslations("reservation");
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
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

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setCheckingAvailability(true);
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}/availability?date=${selectedDate}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAvailability(data);
      } finally {
        if (!cancelled) setCheckingAvailability(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedDate, restaurantId]);

  async function onSubmit(data: ReservationInput) {
    setSubmitError(null);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, restaurantId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubmitError(body.error ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }
    setSuccess(true);
    reset();
    setSelectedDate(undefined);
    setAvailability(null);
  }

  function handleClose() {
    setSuccess(false);
    setSubmitError(null);
    setAvailability(null);
    setSelectedDate(undefined);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={`${t("title")} · ${restaurantName}`}>
      {success ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground">{t("success")}</p>
          <Button onClick={handleClose}>OK</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("name")}</label>
            <input {...register("guestName")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            {errors.guestName && <p className="mt-1 text-xs text-red-500">{errors.guestName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("phone")}</label>
            <input {...register("guestPhone")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            {errors.guestPhone && <p className="mt-1 text-xs text-red-500">{errors.guestPhone.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("partySize")}</label>
            <input
              type="number"
              min={1}
              max={2000}
              {...register("partySize")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("chooseDate")}</label>
            <AvailabilityCalendar restaurantId={restaurantId} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>

          {selectedDate && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">{t("time")}</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div
                className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  availability?.booked
                    ? "bg-red-50 text-red-600"
                    : "bg-accent-green/10 text-accent-green-dark"
                }`}
              >
                {renderAvailabilityMessage(t, checkingAvailability, availability)}
              </div>
            </>
          )}
          {errors.preferredAt && <p className="text-xs text-red-500">{errors.preferredAt.message}</p>}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("comment")}</label>
            <textarea {...register("comment")} rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          {submitError && <p className="text-xs text-red-500">{submitError}</p>}
          <Button
            type="submit"
            variant="green"
            disabled={isSubmitting || availability?.booked === true}
            className="mt-2 w-full"
          >
            {t("submit")}
          </Button>
        </form>
      )}
    </Modal>
  );
}

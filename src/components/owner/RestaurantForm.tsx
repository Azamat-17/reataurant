"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { RESTAURANT_TYPES, FEATURE_FLAGS } from "@/lib/constants";
import { restaurantSchema, type RestaurantInput } from "@/lib/validations/restaurant";
import { SubscriptionPaymentModal } from "@/components/owner/SubscriptionPaymentModal";

interface RegionData {
  id: string;
  name: string;
  districts: { id: string; name: string }[];
}

interface Props {
  cities: { id: string; name: string }[];
  regions: RegionData[];
  mode: "create" | "edit";
  restaurantId?: string;
  defaultValues?: Partial<RestaurantInput> & { photos?: string[] };
}

export function RestaurantForm({ cities, regions, mode, restaurantId, defaultValues }: Props) {
  const t = useTranslations("publish");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | undefined>(defaultValues?.coverImage);
  const [photos, setPhotos] = useState<string[]>(defaultValues?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ id: string; name: string } | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantInput>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: defaultValues ?? { type: RESTAURANT_TYPES[0] },
  });

  const selectedRegionId = watch("regionId");
  const selectedRegion = regions.find((r) => r.id === selectedRegionId);

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (!res.ok) return null;
    const data = await res.json();
    return data.url as string;
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadFile(file);
    if (url) setCoverImage(url);
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) setPhotos((prev) => [...prev, url]);
    }
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url));
  }

  async function onSubmit(data: RestaurantInput) {
    setError(null);
    const payload = { ...data, coverImage, photos };
    const res = await fetch(mode === "create" ? "/api/restaurants" : `/api/restaurants/${restaurantId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Не удалось сохранить");
      return;
    }

    if (mode === "create") {
      const body = await res.json();
      setPendingPayment({ id: body.id, name: data.name });
      return;
    }

    router.push("/owner/dashboard");
    router.refresh();
  }

  function handlePaymentFlowDone() {
    router.push("/owner/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("basicInfo")}</h2>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("name")}</label>
          <input {...register("name")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("nameSubtitle")}</label>
          <input {...register("nameSubtitle")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("description")}</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("address")}</label>
          <input {...register("address")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="mb-1 block text-xs font-medium text-muted">{t("landmark")}</label>
            <input {...register("landmark")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("landmarkDistance")}</label>
            <input
              type="number"
              {...register("landmarkDistanceM", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("landmarkWalk")}</label>
            <input
              type="number"
              {...register("landmarkWalkMin", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("location")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("city")}</label>
            <select {...register("cityId")} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option value="">—</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("region")}</label>
            <select {...register("regionId")} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option value="">—</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("district")}</label>
            <select
              {...register("districtId")}
              disabled={!selectedRegion?.districts.length}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:bg-gray-50"
            >
              <option value="">—</option>
              {selectedRegion?.districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("type")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <select {...register("type")} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
              {RESTAURANT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("avgCheck")}</label>
            <input
              type="number"
              {...register("avgCheck", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("capacity")}</label>
            <input
              type="number"
              min={1}
              {...register("capacity", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("features")}</h2>
        <div className="flex flex-wrap gap-4">
          {FEATURE_FLAGS.map((f) => (
            <label key={f.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register(f.id)} className="h-4 w-4 rounded border-border" />
              {f.label}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("contacts")}</h2>
        <p className="text-xs text-muted">{t("contactsHint")}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("contactName")}</label>
            <input {...register("contactName")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("contactPhone")}</label>
            <input {...register("contactPhone")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("whatsapp")}</label>
            <input {...register("whatsapp")} placeholder="+996 700 00 00 00" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("website")}</label>
            <input {...register("website")} placeholder="https://" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("photos")}</h2>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted">{t("coverImage")}</label>
          <div className="flex items-center gap-3">
            {coverImage && (
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
                <Image src={coverImage} alt="" fill className="object-cover" />
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
              {coverImage ? t("changePhoto") : t("addPhoto")}
            </Button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted">{t("photos")}</label>
          {photos.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {photos.map((url) => (
                <div key={url} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    aria-label={t("removePhoto")}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="hidden"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => galleryInputRef.current?.click()}>
            {t("addPhoto")}
          </Button>
        </div>

        {uploading && <p className="text-xs text-muted">{t("uploading")}</p>}
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isSubmitting || uploading}>
        {mode === "edit" ? t("save") : t("submit")}
      </Button>

      {pendingPayment && (
        <SubscriptionPaymentModal
          open
          restaurantId={pendingPayment.id}
          restaurantName={pendingPayment.name}
          onClose={handlePaymentFlowDone}
          onDone={handlePaymentFlowDone}
        />
      )}
    </form>
  );
}

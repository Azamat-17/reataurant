import { useTranslations } from "next-intl";
import { MapIcon } from "@/components/ui/icons";

export function MapPlaceholder() {
  const t = useTranslations("map");
  return (
    <div className="flex h-[480px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-gray-50 text-muted">
      <MapIcon className="h-10 w-10" />
      <p className="text-sm font-medium">{t("placeholder")}</p>
    </div>
  );
}

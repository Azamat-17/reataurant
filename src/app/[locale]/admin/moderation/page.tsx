import { getTranslations } from "next-intl/server";
import { Header } from "@/components/header/Header";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { prisma } from "@/lib/prisma";

export default async function ModerationPage() {
  const t = await getTranslations("admin");

  const pending = await prisma.restaurant.findMany({
    where: { status: "PENDING" },
    include: { owner: true, city: true, region: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-foreground">{t("moderationTitle")}</h1>

        {pending.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-gray-50 p-10 text-center text-sm text-muted">
            {t("empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{r.name}</h2>
                  <p className="text-sm text-muted">
                    {r.address} · {r.owner.name} ({r.owner.email})
                  </p>
                  <p className="text-xs text-muted">
                    {[r.city?.name, r.region?.name].filter(Boolean).join(", ")}
                  </p>
                </div>
                <ModerationActions restaurantId={r.id} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

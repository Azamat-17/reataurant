"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@/components/ui/icons";

export function FavoriteButton({ restaurantId }: { restaurantId: string }) {
  const { data: session } = useSession();
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const ids = (data.favorites ?? []).map((f: { restaurantId: string }) => f.restaurantId);
        setFavorite(ids.includes(restaurantId));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [session?.user, restaurantId]);

  if (!session?.user) return null;

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    await fetch("/api/favorites", {
      method: favorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId }),
    });
    setFavorite((v) => !v);
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      aria-label="Избранное"
      aria-pressed={favorite}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-white/90 ${
        favorite ? "text-brand" : ""
      }`}
    >
      <HeartIcon className="h-[18px] w-[18px]" fill={favorite ? "currentColor" : "none"} />
    </button>
  );
}

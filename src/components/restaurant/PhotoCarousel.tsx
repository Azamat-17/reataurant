"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronDownIcon } from "@/components/ui/icons";

const DEFAULT_COVER_IMAGE = "/restaurant-placeholder.svg";

interface Props {
  images: string[];
  alt: string;
  badges?: React.ReactNode;
}

export function PhotoCarousel({ images: rawImages, alt, badges }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = rawImages.length > 0 ? rawImages : [DEFAULT_COVER_IMAGE];
  const hasMultiple = rawImages.length > 1;

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl bg-dark-surface">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 h-full w-full cursor-zoom-in"
          aria-label="Открыть фото на весь экран"
        >
          <Image src={images[index]} alt={alt} fill className="object-contain" priority={index === 0} />
        </button>

        {badges && <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">{badges}</div>}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущее фото"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <ChevronDownIcon className="h-5 w-5 rotate-90" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующее фото"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <ChevronDownIcon className="h-5 w-5 -rotate-90" />
            </button>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition-colors ${
                i === index ? "ring-brand" : "ring-transparent hover:ring-border"
              }`}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-black"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-white/80">
                {hasMultiple ? `${index + 1} / ${images.length}` : alt}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Закрыть"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="relative flex-1">
              <Image src={images[index]} alt={alt} fill className="object-contain" />
            </div>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Предыдущее фото"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
                >
                  <ChevronDownIcon className="h-6 w-6 rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Следующее фото"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
                >
                  <ChevronDownIcon className="h-6 w-6 -rotate-90" />
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

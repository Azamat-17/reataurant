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
  const sideImages = images.slice(1, 5);
  const extraCount = images.length - 5;

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function openAt(i: number) {
    setIndex(i);
    setLightboxOpen(true);
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
      {/* Mobile carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-dark-surface md:hidden">
        <button
          type="button"
          onClick={() => openAt(index)}
          className="absolute inset-0 h-full w-full cursor-zoom-in"
          aria-label="Открыть фото на весь экран"
        >
          <Image src={images[index]} alt={alt} fill className="object-cover" priority={index === 0} />
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

      {/* Desktop gallery grid: 1 large photo + up to 4 side photos */}
      <div className="hidden md:grid md:h-[440px] md:grid-cols-4 md:grid-rows-2 md:gap-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          className={`group relative overflow-hidden rounded-2xl bg-dark-surface ${
            sideImages.length === 0 ? "col-span-4 row-span-2" : "col-span-2 row-span-2"
          }`}
        >
          <Image
            src={images[0]}
            alt={alt}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
          {badges && <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">{badges}</div>}
        </button>

        {sideImages.length === 1 && (
          <button
            type="button"
            onClick={() => openAt(1)}
            className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl bg-dark-surface"
          >
            <Image
              src={sideImages[0]}
              alt={`${alt} 2`}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </button>
        )}

        {sideImages.length === 2 &&
          sideImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => openAt(i + 1)}
              className="group relative col-span-2 row-span-1 overflow-hidden rounded-2xl bg-dark-surface"
            >
              <Image
                src={src}
                alt={`${alt} ${i + 2}`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>
          ))}

        {sideImages.length === 3 && (
          <>
            <button
              type="button"
              onClick={() => openAt(1)}
              className="group relative col-span-2 row-span-1 overflow-hidden rounded-2xl bg-dark-surface"
            >
              <Image
                src={sideImages[0]}
                alt={`${alt} 2`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>
            <button
              type="button"
              onClick={() => openAt(2)}
              className="group relative col-span-1 row-span-1 overflow-hidden rounded-2xl bg-dark-surface"
            >
              <Image
                src={sideImages[1]}
                alt={`${alt} 3`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>
            <button
              type="button"
              onClick={() => openAt(3)}
              className="group relative col-span-1 row-span-1 overflow-hidden rounded-2xl bg-dark-surface"
            >
              <Image
                src={sideImages[2]}
                alt={`${alt} 4`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>
          </>
        )}

        {sideImages.length === 4 &&
          sideImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => openAt(i + 1)}
              className="group relative col-span-1 row-span-1 overflow-hidden rounded-2xl bg-dark-surface"
            >
              <Image
                src={src}
                alt={`${alt} ${i + 2}`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
              {i === 3 && extraCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-bold text-white">
                  +{extraCount}
                </div>
              )}
            </button>
          ))}
      </div>

      {lightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col bg-black" onClick={() => setLightboxOpen(false)}>
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

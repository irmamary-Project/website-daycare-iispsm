"use client";
import Image from "next/image";
import { useState, useCallback } from "react";

interface MediaItem {
  id: string;
  url: string;
  tipe: "foto" | "video";
}

export default function PortfolioMedia({ media }: { media: MediaItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const close = useCallback(() => setExpanded(null), []);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {media.map((m) => (
          <div
            key={m.id}
            className="rounded-xl overflow-hidden bg-primary-pale aspect-square cursor-pointer group relative"
            onClick={() => m.tipe === "foto" && setExpanded(m.url)}
          >
            {m.tipe === "foto" ? (
              <Image
                src={m.url}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <video
                src={m.url}
                className="w-full h-full object-cover"
                controls
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        ))}
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white text-xl hover:bg-white/30 transition-colors z-10"
          >
            ✕
          </button>
          <Image
            src={expanded}
            alt=""
            width={1200}
            height={900}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface Camera {
  id: string;
  name: string;
  url: string;
}

export default function LiveCCTVClient() {
  const [cameras, setCameras] = useState<Camera[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Fetch the camera list (with real stream URLs) only after this component
  // has mounted in an authenticated session — never hardcoded, never in the
  // page's initial HTML/source, never in the client bundle.
  useEffect(() => {
    let cancelled = false;

    async function loadCameras() {
      try {
        const res = await fetch("/api/cctv/stream-url", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `Gagal memuat daftar kamera (${res.status})`);
        }
        const body = await res.json();
        if (cancelled) return;
        setCameras(body.cameras);
        setActiveId(body.cameras[0]?.id ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat CCTV.");
        }
      }
    }

    loadCameras();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCamera = cameras?.find((c) => c.id === activeId) ?? null;

  // (Re)attach hls.js whenever the active camera changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeCamera) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setError(null);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(activeCamera.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError("Gagal memuat stream. Coba pilih kamera lain atau muat ulang halaman.");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeCamera.url; // Safari native HLS
    } else {
      setError("Browser Anda tidak mendukung pemutaran stream ini.");
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [activeCamera]);

  if (error && !cameras) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (!cameras) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg bg-gray-100 text-gray-500 text-sm">
        Memuat daftar kamera...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            playsInline
            className="w-full max-h-[650px] bg-black"
          />
        </div>
        <h2 className="mt-2 font-semibold text-gray-800">{activeCamera?.name}</h2>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="border rounded-lg divide-y">
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => setActiveId(cam.id)}
            className={`w-full text-left p-3 flex justify-between items-center transition ${
              activeId === cam.id ? "bg-blue-600 text-white" : "hover:bg-gray-50"
            }`}
          >
            <span>{cam.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-white">
              Online
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

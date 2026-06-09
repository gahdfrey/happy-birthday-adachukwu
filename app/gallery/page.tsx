"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const IMAGES = [
  "/fe3af7d7-e4df-4a08-8069-93dbd66e9cc6.JPG",
  "/38636c17-35e1-4a6a-8b63-27e956249af9.JPG",
  "/944d2e70-f128-492d-b03c-67682d613b81.JPG",
  "/d662e4a1-26f4-47da-a16b-baa1d861e28f.JPG",
  "/e18fd4ca-c4ef-40c0-9a50-dc21d9692347.JPG",
  "/IMG_4370.JPG",
  "/IMG_7764.JPG",
  "/IMG_7767.JPG",
  "/IMG_7808.JPG",
  "/IMG_7809.JPG",
  "/IMG_7810.JPG",
  "/IMG_7811.JPG",
  "/IMG_7812.JPG",
  "/IMG_7814.JPG",
  "/NYXF3509.JPG",
];

const VIDEOS: string[] = ["/IMG_2251 2.MOV"];

/* ─── Lightbox ────────────────────────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback(
    (d: "prev" | "next") => {
      if (transitioning) return;
      setDir(d);
      setPrev(current);
      setCurrent((c) =>
        d === "next"
          ? (c + 1) % images.length
          : (c - 1 + images.length) % images.length
      );
      setTransitioning(true);
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 380);
    },
    [current, images.length, transitioning]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full text-white text-xl font-bold z-10"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Counter */}
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full"
        style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
      >
        {current + 1} / {images.length}
      </div>

      {/* Images — full width on mobile, nav buttons overlaid on top */}
      <div
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outgoing image */}
        {prev !== null && (
          <img
            key={`prev-${prev}`}
            src={images[prev]}
            alt=""
            style={{
              position: "absolute",
              maxHeight: "92vh",
              maxWidth: "100%",
              width: "100%",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              opacity: 0,
              transform: dir === "next" ? "translateX(-80px)" : "translateX(80px)",
              transition: "opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        )}
        {/* Incoming image */}
        <img
          key={`cur-${current}`}
          src={images[current]}
          alt=""
          style={{
            maxHeight: "92vh",
            maxWidth: "100%",
            width: "100%",
            objectFit: "contain",
            borderRadius: "12px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            opacity: 1,
            transform: "translateX(0)",
            animation: transitioning
              ? `slideIn${dir === "next" ? "Right" : "Left"} 0.38s cubic-bezier(0.4,0,0.2,1) forwards`
              : "none",
          }}
        />

        {/* Prev — overlaid on the image */}
        <button
          onClick={(e) => { e.stopPropagation(); go("prev"); }}
          className="absolute left-3 flex items-center justify-center w-10 h-10 rounded-full text-white text-xl z-10"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(204,85,0,0.65)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
          aria-label="Previous"
        >
          ‹
        </button>

        {/* Next — overlaid on the image */}
        <button
          onClick={(e) => { e.stopPropagation(); go("next"); }}
          className="absolute right-3 flex items-center justify-center w-10 h-10 rounded-full text-white text-xl z-10"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(204,85,0,0.65)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (transitioning || i === current) return;
              const d: "next" | "prev" = i > current ? "next" : "prev";
              setDir(d);
              setPrev(current);
              setCurrent(i);
              setTransitioning(true);
              setTimeout(() => { setPrev(null); setTransitioning(false); }, 380);
            }}
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "#CC5500" : "rgba(255,255,255,0.35)",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Scroll reveal ───────────────────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── PhotoItem ───────────────────────────────────────────────────────────── */
function PhotoItem({
  src,
  index,
  onOpen,
}: {
  src: string;
  index: number;
  onOpen: () => void;
}) {
  const { ref, visible } = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const delay = `${(index % 6) * 0.08}s`;

  // Catch images that loaded from cache before onLoad was attached
  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: `opacity 0.6s ease ${delay}, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}`,
        boxShadow: hovered ? "0 20px 48px rgba(204,85,0,0.3)" : "0 4px 16px rgba(0,0,0,0.1)",
        background: "#f0ddd0",
      }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className="w-full h-auto block"
        style={{
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.4s ease, transform 0.5s ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      />
      {/* Hover overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "linear-gradient(to top, rgba(204,85,0,0.22), transparent 60%)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Always-visible tap/click badge — bottom-left */}
      <div
        className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-white"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.04em",
          background: "rgba(0,0,0,0.38)",
          backdropFilter: "blur(6px)",
          opacity: imgLoaded ? (hovered ? 0 : 0.85) : 0,
          transform: hovered ? "translateY(4px)" : "translateY(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
        Tap to view
      </div>

      {/* Hover: centred expand circle */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? "scale(1)" : "scale(0.7)" }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full text-white"
          style={{ background: "rgba(204,85,0,0.75)", backdropFilter: "blur(4px)", fontSize: 20 }}
        >
          ⤢
        </div>
      </div>
    </div>
  );
}

/* ─── VideoItem ───────────────────────────────────────────────────────────── */
function VideoItem({ src, index }: { src: string; index: number }) {
  const { ref, visible } = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  const delay = `${(index % 3) * 0.1}s`;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: `opacity 0.6s ease ${delay}, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}`,
        boxShadow: hovered ? "0 20px 48px rgba(204,85,0,0.35)" : "0 4px 20px rgba(0,0,0,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto block"
        style={{ transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 0.5s ease" }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: "linear-gradient(to top, rgba(204,85,0,0.2), transparent 60%)",
          opacity: hovered ? 1 : 0.4,
        }}
      />
      <div
        className="absolute bottom-2 left-2 text-xs font-semibold px-2 py-1 rounded-full"
        style={{ background: "rgba(204,85,0,0.85)", color: "white", backdropFilter: "blur(4px)" }}
      >
        Video
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const allMedia = [
    ...IMAGES.map((src) => ({ type: "img" as const, src })),
    ...VIDEOS.map((src) => ({ type: "vid" as const, src })),
  ];

  // Only images are lightbox-able; build a flat array of image srcs
  const imageSrcs = allMedia.filter((m) => m.type === "img").map((m) => m.src);

  const colA = allMedia.filter((_, i) => i % 2 === 0);
  const colB = allMedia.filter((_, i) => i % 2 === 1);

  // Map a media item to its image index (for lightbox)
  const imgIndex = (src: string) => imageSrcs.indexOf(src);

  return (
    <div className="min-h-screen bg-white">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={imageSrcs}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(204,85,0,0.1)",
        }}
      >
        <button
          onClick={() => router.push("/birthday")}
          className="flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-2"
          style={{ color: "#CC5500", background: "rgba(204,85,0,0.08)", transition: "background 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(204,85,0,0.15)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(204,85,0,0.08)"; }}
        >
          ← Back
        </button>
        <div className="flex-1 text-center">
          <h1
            className="font-bold orange-gradient-text"
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.1rem, 4vw, 1.5rem)" }}
          >
            Gallery
          </h1>
        </div>
        <div style={{ width: 72 }} />
      </div>

      {/* Hero text */}
      <div
        className="text-center pt-12 pb-8 px-6"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <p
          className="text-base italic"
          style={{ fontFamily: "Georgia, serif", color: "#9A3F00", opacity: 0.7 }}
        >
          Every picture, every moment — shared and created 🧡
        </p>
      </div>

      {/* Two-column masonry grid */}
      <div className="px-3 sm:px-6 pb-16 max-w-6xl mx-auto flex gap-3">
        <div className="flex flex-col gap-3 flex-1">
          {colA.map((item, i) => (
            <div key={item.src}>
              {item.type === "img" ? (
                <PhotoItem src={item.src} index={i * 2} onOpen={() => setLightboxIndex(imgIndex(item.src))} />
              ) : (
                <VideoItem src={item.src} index={i * 2} />
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 flex-1">
          {colB.map((item, i) => (
            <div key={item.src}>
              {item.type === "img" ? (
                <PhotoItem src={item.src} index={i * 2 + 1} onOpen={() => setLightboxIndex(imgIndex(item.src))} />
              ) : (
                <VideoItem src={item.src} index={i * 2 + 1} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 text-center" style={{ borderTop: "1px solid rgba(204,85,0,0.1)" }}>
        <div className="flex justify-center gap-2 text-2xl mb-3">
          {["🧡", "🌸", "🧡"].map((e, i) => (
            <span key={i} className="animate-heartbeat" style={{ animationDelay: `${i * 0.4}s` }}>
              {e}
            </span>
          ))}
        </div>
        <p className="text-xs" style={{ color: "#CC5500", opacity: 0.4, fontFamily: "Georgia, serif" }}>
          Made with spice, sugar and everything nice 🌸
        </p>
      </footer>
    </div>
  );
}

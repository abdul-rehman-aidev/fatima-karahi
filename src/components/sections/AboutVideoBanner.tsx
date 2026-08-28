"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/lib/cx";

/**
 * Full-width signature-dish banner with a centred play button. Clicking it
 * opens a lightbox playing the real behind-the-scenes clip — shot vertical
 * (9:16), so it plays in its own centred portrait box rather than inside
 * this section's wide 42vh banner, which would either crop it hard or
 * letterbox it. The banner itself (photo + button) is untouched by that;
 * it's just the trigger.
 *
 * Sizing: the video is bounded by both max-height and max-width (h-auto/
 * w-auto so the browser's intrinsic 716×1272 ratio picks whichever is
 * binding) — same two-constraint trick CateringGallery's photo lightbox
 * already uses. On mobile the viewport's own aspect is close to the
 * video's, so max-width usually binds and it fills most of the screen
 * naturally. On desktop max-height binds instead (a portrait clip at 85vh
 * is nowhere near 92vw), which is the "desktop adjustment" — without it,
 * a wide monitor would render the video at a fixed height regardless of
 * how much emptier the screen is, leaving it looking arbitrarily small OR
 * (with only a width cap) uncomfortably tall; capping height keeps it a
 * comfortable, consistent portrait size on any screen.
 *
 * Controls are custom (native `controls` hidden) to match the rest of the
 * site's hand-built icon buttons rather than the browser's default video
 * chrome: a play/pause toggle and a mute/unmute toggle, both reflecting
 * real <video> element state via its own play/pause/volumechange events
 * (not just optimistic state) so they stay correct if playback is ever
 * driven from outside these buttons (e.g. a hardware media key).
 */
export function AboutVideoBanner() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <section className="relative h-[42vh] min-h-[320px] overflow-hidden bg-emerald-deep">
      <Picture
        name="food-karahi"
        alt="Chicken karahi finishing in a cast-iron pan over open heat"
        widths={[480, 828, 1200, 1600]}
        sizes="100vw"
        width={1600}
        height={1200}
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--emerald-deep)_45%,transparent)]"
      />
      <div className="relative z-[1] flex h-full items-center justify-center">
        <Reveal>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play video: inside Fatima Karahi"
            className="grid h-[72px] w-[72px] cursor-pointer place-items-center rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_60%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_40%,transparent)] text-ivory backdrop-blur-[2px] transition-[transform,border-color,color,background-color] duration-[var(--dur)] ease-[var(--ease-soft)] hover:border-transparent hover:bg-gold hover:text-ink hover:shadow-glow-gold hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]"
          >
            <svg width="22" height="24" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true">
              <path d="M0 0 L22 12 L0 24 Z" />
            </svg>
          </button>
        </Reveal>
      </div>

      {open && <VideoLightbox onClose={close} />}
    </section>
  );
}

function VideoLightbox({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  // Scroll lock, Esc to close, focus trap across the three controls
  // (close/play/mute) — same mechanics as SiteNav's overlay menu, extended
  // to cycle Tab across more than one focusable element.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const dialog = dialogRef.current;
    const focusables = () =>
      dialog ? Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled])")) : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Inside Fatima Karahi"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink p-[clamp(20px,5vw,56px)]"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-[clamp(16px,4vw,40px)] top-[clamp(16px,4vw,40px)] z-[1] grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-pill border border-[color-mix(in_srgb,var(--ivory)_45%,transparent)] text-ivory transition-colors duration-[var(--dur)] hover:border-gold hover:text-gold-bright"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6L18 18M6 18L18 6" />
        </svg>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative inline-block overflow-hidden rounded-card shadow-lift"
      >
        {/* Real source is 716×1272 (portrait) — width/height here match
            that intrinsic ratio so h-auto/w-auto resolves consistently
            before metadata loads, same CLS-avoidance reasoning as Picture's
            width/height props. */}
        <video
          ref={videoRef}
          src="/video/about-video.mp4"
          width={716}
          height={1272}
          autoPlay
          loop
          muted
          playsInline
          onClick={togglePlay}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          className="block h-[min(85vh,720px)] w-auto max-w-[92vw] cursor-pointer"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-s4">
          <IconButton
            onClick={togglePlay}
            label={paused ? "Play" : "Pause"}
          >
            {paused ? (
              <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
                <path d="M0 0 L16 9 L0 18 Z" />
              </svg>
            ) : (
              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true">
                <rect x="0" y="0" width="4" height="16" />
                <rect x="10" y="0" width="4" height="16" />
              </svg>
            )}
          </IconButton>

          <IconButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
            {muted ? <MutedGlyph /> : <SoundGlyph />}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx(
        "grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-pill border-[1.5px] border-[color-mix(in_srgb,var(--ivory)_55%,transparent)] bg-[color-mix(in_srgb,var(--emerald-deep)_50%,transparent)] text-ivory backdrop-blur-[2px] transition-[transform,border-color,color,background-color] duration-[var(--dur)] ease-[var(--ease-soft)] hover:border-transparent hover:bg-gold hover:text-ink hover:scale-[var(--hover-scale)] active:scale-[var(--press-scale)]",
      )}
    >
      {children}
    </button>
  );
}

function SoundGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" stroke="none" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function MutedGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" stroke="none" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  );
}

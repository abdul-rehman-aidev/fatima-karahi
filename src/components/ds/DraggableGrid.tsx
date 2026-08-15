"use client";

import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
} from "motion/react";
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { cva } from "class-variance-authority";
import { cx } from "@/lib/cx";

type variants = "default" | "masonry" | "polaroid";

const GridVariantContext = createContext<variants | undefined>(undefined);

const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 1.5,
      duration: 1.4,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

/**
 * Infinite draggable/scrollable photo canvas (wheel + pointer drag, momentum,
 * `wrap()`-based tiling so the pattern loops seamlessly). Interaction physics
 * are load-bearing and untouched from the source; only branding (background,
 * radius/shadow, spacing, class-merge on `GridItem`, and `onDragStart` for a
 * dismissible hint) was adapted for this site. Only `masonry` is used today
 * (see GalleryGrid) — `default`/`polaroid` stay defined for future reuse.
 */
export const DraggableContainer = ({
  className,
  children,
  variant,
  onDragStart,
}: {
  className?: string;
  children: React.ReactNode;
  variant?: variants;
  onDragStart?: () => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const handleIsDragging = () => {
    setIsDragging(true);
    onDragStart?.();
  };
  const handleIsNotDragging = () => setIsDragging(false);
  // These read isDragging inside the wheel handler via a ref, not the state
  // value itself, so toggling drag state never has to re-run the effect
  // below mid-gesture (see the effect's comment for why that mattered).
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;
    const { width, height } = container;

    const xDrag = x.on("change", (latest) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });
    const yDrag = y.on("change", (latest) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });

    const handleWheelScroll = (event: WheelEvent) => {
      if (!isDraggingRef.current) {
        animate(y, y.get() - event.deltaY * 2.7, {
          type: "tween",
          duration: 1.2,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };

    window.addEventListener("wheel", handleWheelScroll);
    return () => {
      xDrag();
      yDrag();
      window.removeEventListener("wheel", handleWheelScroll);
    };
    // isDragging deliberately excluded: re-running this on every drag
    // start/stop tore down and rebuilt the x/y wrap subscriptions mid-
    // gesture, which was breaking the actual drag tracking in real browsers
    // (not just a headless-testing artifact). isDraggingRef reads the live
    // value from inside the still-mounted wheel handler instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className={cx("h-dvh overflow-hidden", className)}>
        <motion.div className="h-dvh overflow-hidden">
          <motion.div
            className="grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] active:cursor-grabbing will-change-transform"
            drag
            dragMomentum={true}
            dragTransition={{
              timeConstant: 200,
              power: 0.28,
              restDelta: 0,
              bounceStiffness: 0,
            }}
            onDragStart={handleIsDragging}
            onDragEnd={handleIsNotDragging}
            style={{ x, y }}
            ref={ref}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
};

// Generous vertical rhythm (site's s-scale) in place of the source's
// arbitrary Tailwind values. `default`/`polaroid` keep their original
// full-axis gap/padding; `masonry`/`polaroid` stay x-axis only — the row
// spacing there comes from the `even:mt-[60%]` stagger, not a row gap.
export const gridBodyStyles = cva("grid grid-cols-[repeat(6,1fr)] h-fit w-fit", {
  variants: {
    variant: {
      default: "gap-s6 p-s5 md:gap-s9 md:p-s7",
      masonry: "gap-x-s6 px-s5 md:gap-x-s9 md:px-s7",
      polaroid: "gap-x-s6 px-s5 md:gap-x-s9 md:px-s7",
    },
  },
  defaultVariants: { variant: "default" },
});

// Corner radius on the masonry variant matches the site's existing
// photo-frame convention (CateringGallery's PhotoTile / OccasionCard):
// rounded-card. No `will-change-transform` and no hover shadow here on
// purpose — this repeats across ~50+ tiles (13 photos × the 2x2 duplication
// GridBody needs for a seamless wrap), and `will-change` on every one of
// them was promoting each into its own GPU layer instead of letting them
// paint as part of the single already-promoted draggable canvas layer. That
// layer explosion, combined with a blurred box-shadow re-rasterizing on
// every :hover as tiles slid under a stationary cursor mid-drag, was the
// actual cause of the reported lag on both mobile and desktop — not the
// drag math itself. `shadow-card` alone (no hover swap, no transition) still
// reads as framed photography at a fraction of the paint cost.
// No w-full/h-full here on purpose: DraggableContainer's outer canvas is
// `width: fit-content` with plain `1fr` tracks (not Tailwind's built-in
// grid-cols-N, which uses `minmax(0px,1fr)`), so track sizing has to resolve
// against each item's own intrinsic content size — a percentage width here
// can't resolve against that indeterminate track and collapses to near-zero.
// Callers size each `<GridItem>` with an explicit px/rem width via its
// `className` (see GalleryGrid) and let height follow from an aspect-ratio
// on the content, which composes cleanly with a definite item width.
export const gridItemStyles = cva("overflow-hidden hover:cursor-pointer", {
  variants: {
    variant: {
      default: "rounded-sm",
      masonry: "even:mt-[60%] rounded-card shadow-card",
      polaroid:
        "border-10 border-b-28 border-white shadow-xl even:rotate-3 odd:-rotate-2 hover:rotate-0 transition-transform ease-out duration-300 even:mt-[60%]",
    },
  },
  defaultVariants: { variant: "default" },
});

export const GridItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const variant = useContext(GridVariantContext);
  return (
    <motion.div
      className={cx(gridItemStyles({ variant }), className)}
      variants={rowVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

export const GridBody = memo(
  ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const variant = useContext(GridVariantContext);
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={cx(gridBodyStyles({ variant }), className)}>
            {children}
          </div>
        ))}
      </>
    );
  },
);
GridBody.displayName = "GridBody";

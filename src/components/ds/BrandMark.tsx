/**
 * The karahi mark (design/assets/karahi-mark.svg) inlined for currentColor —
 * the one bespoke brand glyph: logotype, footer, order interstitial, 404.
 */
export function BrandMark({ className, width = 40 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 120 84"
      width={width}
      height={Math.round((width / 120) * 84)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 34 C10 32, 6 38, 10 44 C13 48, 20 47, 24 43" />
      <path d="M98 34 C110 32, 114 38, 110 44 C107 48, 100 47, 96 43" />
      <path d="M20 34 H100 C100 34, 96 70, 60 70 C24 70, 20 34, 20 34 Z" />
      <path d="M14 34 H106" />
      <path d="M48 22 C44 17, 52 13, 48 8" opacity="0.85" />
      <path d="M62 20 C58 15, 66 11, 62 6" opacity="0.85" />
      <path d="M76 22 C72 17, 80 13, 76 8" opacity="0.85" />
    </svg>
  );
}

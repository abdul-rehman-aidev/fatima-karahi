import type { ChangeEventHandler } from "react";
import { cx } from "@/lib/cx";

/**
 * Field — premium form control.
 *  - variant="light" (default): cream fill, ink text — for ivory/cream zones
 *    (the catering quote form, the contact form).
 *  - variant="dark": translucent-ivory fill on ivory text — for dark card
 *    zones (the reservation card). Colours mirror Button's existing "scrim"
 *    treatment (translucent ivory border/fill over a dark surface) rather
 *    than inventing a new dark-surface idiom; every structural convention
 *    (radius, focus ring, label weight, error colour) stays identical to
 *    the light variant — only the surface/text colours swap.
 * Always a visible label. `select` renders a native <select> with the same
 * box treatment as the text/textarea controls (the dropdown popup itself is
 * platform-owned chrome, same as the native date/time pickers already used
 * here — not something CSS can fully restyle either way).
 */
type FieldProps = {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  variant?: "light" | "dark";
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  name?: string;
  min?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  className?: string;
};

const base =
  "w-full rounded-input border px-s4 py-[14px] font-body text-[1rem] outline-none transition-[border-color,box-shadow] duration-[var(--dur)] ease-[var(--ease-soft)] focus:border-gold focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--saffron-bright)_35%,transparent)]";

const surface = {
  light: "bg-cream text-ink placeholder:text-[color-mix(in_srgb,var(--stone)_65%,transparent)]",
  dark: "bg-[color-mix(in_srgb,var(--ivory)_10%,transparent)] text-ivory placeholder:text-[color-mix(in_srgb,var(--ivory)_45%,transparent)]",
};

const borderIdle = {
  light: "border-[color-mix(in_srgb,var(--stone)_28%,transparent)]",
  dark: "border-[color-mix(in_srgb,var(--ivory)_25%,transparent)]",
};

export function Field({
  id,
  label,
  type = "text",
  textarea = false,
  select = false,
  options,
  variant = "light",
  hint,
  error,
  required,
  placeholder,
  value,
  onChange,
  name,
  min,
  inputMode,
  autoComplete,
  className,
}: FieldProps) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") ||
    undefined;
  const controlCls = cx(
    base,
    surface[variant],
    error ? "border-spice" : borderIdle[variant],
  );
  const shared = {
    id,
    name: name ?? id,
    placeholder,
    value,
    onChange,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    autoComplete,
  };

  return (
    <div className={cx("block", className)}>
      <label
        htmlFor={id}
        className={cx(
          "mb-s2 block font-body text-eyebrow font-semibold tracking-[0.04em]",
          variant === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        {label}
        {required && (
          <span className="text-gold-deep" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {select ? (
        <select {...shared} className={cx(controlCls, "cursor-pointer")}>
          {/* The dropdown popup itself is native OS chrome with a light
              background — in the dark variant, the <select>'s own text-ivory
              gets inherited into it too (Chrome/Firefox both do this),
              producing near-invisible light text on that light popup. Always
              forcing dark text on <option> (independent of `variant`) keeps
              the popup legible regardless of which variant the closed
              control is styled as. */}
          {options?.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea {...shared} className={cx(controlCls, "min-h-[120px] resize-y")} />
      ) : (
        <input {...shared} type={type} min={min} inputMode={inputMode} className={controlCls} />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-[6px] text-[0.8125rem] font-medium text-spice">
          {error}
        </p>
      )}
      {hint && !error && (
        <p
          id={`${id}-hint`}
          className={cx("mt-[6px] text-[0.8125rem]", variant === "dark" ? "text-ivory" : "text-stone")}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

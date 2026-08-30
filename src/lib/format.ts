/** Formats a CAD price as e.g. "$28.99". */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

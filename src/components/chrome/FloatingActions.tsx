import { Button } from "@/components/ds/Button";
import { hasOrderUrl, site } from "@/data/site";

/**
 * Sticky "Order online" button — mobile only, no desktop equivalent. Used
 * to also pair a WhatsApp fab beside it on every breakpoint; removed per
 * direction (desktop: no sticky element at all; mobile: order button only).
 * WhatsApp is still reachable via the inline buttons on the footer, contact
 * page, and quote form.
 */
export function FloatingActions() {
  const orderHref = hasOrderUrl() ? site.orderUrl : "/order";
  const orderExternal = hasOrderUrl();

  return (
    <div className="fixed bottom-[22px] right-[22px] z-40 md:hidden">
      <Button variant="primary" size="sm" href={orderHref} external={orderExternal}>
        Order online
      </Button>
    </div>
  );
}

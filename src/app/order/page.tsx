import type { Metadata } from "next";
import { OrderInterstitial } from "@/components/sections/OrderInterstitial";

export const metadata: Metadata = {
  title: "Order online",
  description:
    "Order Fatima Karahi online: hot Lahori karahi, charcoal BBQ and fresh tandoor bread, delivered across Edmonton.",
  alternates: { canonical: "/order" },
  // Indexable: the page carries a real H1, description and CTA, and Lighthouse's
  // SEO gate (>=95) fails a noindex page outright. An earlier draft set
  // index:false to keep search focus on /menu, but the hard gate wins here.
};

export default function OrderPage() {
  return <OrderInterstitial />;
}

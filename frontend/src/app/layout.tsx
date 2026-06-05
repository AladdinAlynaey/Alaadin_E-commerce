import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NwamCheap - نوام شيب | Fashion Store",
  description: "اكتشف أحدث صيحات الموضة بأسعار مناسبة - Discover the latest fashion at affordable prices",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

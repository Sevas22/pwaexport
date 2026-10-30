import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Mi empresa", template: "%s · Puzztraid" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

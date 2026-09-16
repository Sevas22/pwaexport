import { AppNav } from "@/components/AppNav";
import { TopBar } from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:flex">
      <AppNav />
      <div className="min-w-0 flex-1">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-8 lg:pb-16">{children}</main>
      </div>
    </div>
  );
}

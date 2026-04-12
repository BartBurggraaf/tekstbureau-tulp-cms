import SiteNav from "@/components/site/Nav";
import SiteFooter from "@/components/site/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-grain min-h-[100dvh] flex flex-col bg-[var(--color-surface)]">
      <a href="#main-content" className="skip-link">Naar inhoud</a>
      <SiteNav />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

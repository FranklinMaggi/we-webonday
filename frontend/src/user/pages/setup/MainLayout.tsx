import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../../../marketing/components/navbar/Navbar";
import Footer from "../../../marketing/components/footer/Footer";
import WhatsAppButton from "../../../marketing/components/whatsapp/WhatsAppButton";
import { CookieBanner } from "../../../marketing/components/cookie/CookieBanner";
import { setDocumentTitle } from "../../../shared/utils/seo";


/**
 * Props del layout principale dell'app
 */
interface MainLayoutProps {
  icon?: string;
  baseTitle?: string;
  suffix?: string;
}

export function MainLayout({
  icon = "☕",
  baseTitle = "WebOnDay",
  suffix = "Espresso digitale",
}: MainLayoutProps) {
  useEffect(() => {
    setDocumentTitle({ icon, title: baseTitle, suffix });
  }, [icon, baseTitle, suffix]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="site-content">
        <Outlet />
      </main>

      {/* Componenti flottanti globali */}
      <WhatsAppButton />
      <CookieBanner />
    

      <Footer />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import WhatsAppButton from "../whatsapp/WhatsAppButton";
import { CookieBanner } from "../cookie/CookieBanner";
import CartSticker from "../buyflow/cart/CartSticker";
import { setDocumentTitle } from "../../utils/seo";


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
      <CartSticker />

      <Footer />
    </div>
  );
}

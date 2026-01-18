import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../../../../../../../components/navbar/Navbar";
import Footer from "../../../../../../../components/footer/Footer";
import WhatsAppButton from "../../../../../../../components/whatsapp/WhatsAppButton";
import { CookieBanner } from "../../../../../../../components/cookie/CookieBanner";
import CartSticker from "../../../../../../../domains/buyflow/cart/CartSticker";
import { setDocumentTitle } from "../../../../../../../utils/seo";


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

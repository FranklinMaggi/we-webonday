import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import WhatsAppButton from "../whatsapp/WhatsAppButton";
import { CookieBanner } from "../cookie/CookieBanner";
import CartSticker from "../cart/CartSticker"; // <- assicurati percorso corretto
import { setDocumentTitle } from "../../utils/seo";
import "./mainLayout.css";

export function MainLayout({
  icon = "☕",
  baseTitle = "Webonday",
  suffix = "Espresso digitale"
}) {
  useEffect(() => {
    setDocumentTitle({ icon, title: baseTitle, suffix });
  }, [icon, baseTitle, suffix]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="site-content">
        <Outlet />
      </main>

      {/* Componenti “flottanti” o di utilità */}
      <WhatsAppButton />
      <CookieBanner />

      {/* Sticker del carrello visibile ovunque */}
      <CartSticker />

      <Footer />
    </div>
  );
}

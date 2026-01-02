import { useEffect, useState } from "react";
import iconUrl from "./WhatsApp.png";
import { uiBus } from "../../lib/ui/uiBus";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eventi UI
    const offHide = uiBus.on("whatsapp:hide", () => setVisible(false));
    const offShow = uiBus.on("whatsapp:show", () => setVisible(true));

    return () => {
      offHide();
      offShow();
    };
  }, []);

  if (!visible) return null;

  return (
    <a
      className="whatsapp-btn wd-whatsapp-neon"
      href="https://wa.me/393801888965"
      target="_blank"
      rel="noreferrer"
      aria-label="Apri chat WhatsApp"
    >
      <img src={iconUrl} alt="" width={28} height={28} />
    </a>
  );
}

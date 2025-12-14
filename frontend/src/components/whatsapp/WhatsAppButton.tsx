// components/whatsapp/WhatsAppButton.tsx
import iconUrl from "./WhatsApp.png";
import "./whatsapp.css";

export default function WhatsAppButton() {
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

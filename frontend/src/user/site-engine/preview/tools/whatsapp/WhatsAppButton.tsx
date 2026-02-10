// ======================================================
// FE || components/whatsapp/WhatsAppButton.tsx
// ======================================================
//
// AI-SUPERCOMMENT
// - CTA flottante globale (WhatsApp)
// - Visibilità guidata da uiBus
// - Nessuna logica di pagina
// ======================================================


import iconUrl from "./WhatsApp.png";
type Props = {
  phoneNumber: string;
};
function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}
export default function WhatsAppButtonClient({ phoneNumber }: Props) {
  const href = `https://wa.me/${normalizePhone(phoneNumber)}`;

  return (
    <div className="whatsapp-wrapper">
      <a
        className="whatsapp-btn wd-whatsapp-neon"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Scrivici su WhatsApp"
      >
        <img src={iconUrl} alt="" width={28} height={28} />
      </a>
    </div>
  );
}

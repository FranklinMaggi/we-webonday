// ======================================================
// FE || components/whatsapp/WhatsAppButton.tsx
// ======================================================
//
// AI-SUPERCOMMENT
// - CTA flottante globale (WhatsApp)
// - Visibilità guidata da uiBus
// - Nessuna logica di pagina
// ======================================================

import { useEffect, useState } from "react";
import iconUrl from "./WhatsApp.png";
import { uiBus } from "@src/shared/ui/uiBus";
import { whatsappClasses as cls } from "./whatsapp.classes";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offHide = uiBus.on("whatsapp:hide", () => setVisible(false));
    const offShow = uiBus.on("whatsapp:show", () => setVisible(true));

    return () => {
      offHide();
      offShow();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={cls.wrapper}>
      <a
        className={cls.button}
        href="https://wa.me/393801888965"
        target="_blank"
        rel="noreferrer"
        aria-label={cls.ariaLabel}
      >
        <img
          src={iconUrl}
          alt=""
          width={28}
          height={28}
          className={cls.icon}
        />
      </a>
    </div>
  );
}

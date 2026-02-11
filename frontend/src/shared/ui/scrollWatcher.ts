import { uiBus } from "./uiBus";

let isVisible = false;

export function initWhatsAppScrollWatcher() {
  function onScroll() {
    const atTop = window.scrollY < 40;

    if (atTop && !isVisible) {
      uiBus.emit("whatsapp:show");
      isVisible = true;
    }

    if (!atTop && isVisible) {
      uiBus.emit("whatsapp:hide");
      isVisible = false;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // init immediato

  return () => {
    window.removeEventListener("scroll", onScroll);
    isVisible = false;
  };
}

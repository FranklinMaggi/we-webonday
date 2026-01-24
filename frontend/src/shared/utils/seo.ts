export function setDocumentTitle({
    icon = "",
    title = "Webonday",
    suffix = "Espresso digitale"
  }) {
    document.title = `${icon} ${title} – ${suffix}`;
  }
  
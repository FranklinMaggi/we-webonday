export function applySeasonalTheme(): void {
  const month = new Date().getMonth();
  const isChristmas = month === 11 || month === 0;

  const id = "webonday-theme";
  let link = document.getElementById(id) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  link.href = isChristmas ? "/css/christmas.css" : "";
}

// sections/NavbarRenderer.tsx
type Props = {
  brandLabel: string;
  links: { label: string; anchor: string }[];
};

export function NavbarRenderer({ brandLabel, links }: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* BRAND */}
        <a href="#home" className="navbar-brand">
          {brandLabel}
        </a>

        {/* DROPDOWN MENU */}
        <div className="navbar-menu">
          <button
            className="navbar-menu-trigger"
            aria-haspopup="true"
            aria-label="Apri menu"
          >
            ☰
          </button>

          <ul className="navbar-menu-dropdown">
            {links.map((link) => (
              <li key={link.anchor}>
                <a href={link.anchor}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

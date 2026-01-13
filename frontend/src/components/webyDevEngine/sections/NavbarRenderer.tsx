// sections/NavbarRenderer.tsx

type Props = {
    brandLabel: string;
    links: { label: string; anchor: string }[];
  };
  
  export function NavbarRenderer({ brandLabel, links }: Props) {
    return (
      <nav className="navbar">
        <a href="#home" className="navbar-brand">
          {brandLabel}
        </a>
  
        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.anchor}>
              <a href={link.anchor}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  
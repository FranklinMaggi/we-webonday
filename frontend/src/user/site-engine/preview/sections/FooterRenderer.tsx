type Props = {
    poweredBy: string;
    href?: string;
    copyright: string;
  };
  
  export function FooterRenderer({
    poweredBy,
    href = "https://webonday.it",
    copyright,
  }: Props) {
    return (
      <footer className="footer">
        <p>
          Generato da <a href={href}>{poweredBy}</a>
        </p>
        <small>{copyright}</small>
      </footer>
    );
  }
  
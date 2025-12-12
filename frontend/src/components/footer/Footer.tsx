import './footer.css'

export default function Footer() {
  return (
    <footer className="wd-footer">

      <div className="wd-footer-col">
        <h4 className="wd-footer-title">Chi Siamo</h4>
        <a className="wd-footer-link" href="/chi-siamo">La nostra storia</a>
      </div>

      <div className="wd-footer-col">
        <h4 className="wd-footer-title">Contatti</h4>
        <a className="wd-footer-link" href="/contatti">Scrivici</a>
      </div>

      <div className="wd-footer-col">
        <h4 className="wd-footer-title">Policy</h4>
        <a className="wd-footer-link" href="/policy">Termini e condizioni</a>
      </div>

    </footer>
  );
}

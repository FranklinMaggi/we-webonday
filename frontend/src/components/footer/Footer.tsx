import { Link } from "react-router-dom";


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="wd-footer wd-footer-neon">
      <div className="wd-footer-grid">

        <div className="wd-footer-col">
          <h4 className="wd-footer-title">Policy</h4>
          <Link className="wd-footer-link" to="/policy/terms">Termini</Link>
          <Link className="wd-footer-link" to="/policy/privacy">Privacy</Link>
        </div>

        <div className="wd-footer-col">
          <h4 className="wd-footer-title">Chi siamo</h4>
          <Link className="wd-footer-link" to="/founder">Founder</Link>
        </div>

        <div className="wd-footer-col">
          <h4 className="wd-footer-title">Partner</h4>
          <p className="wd-footer-text">
            Accedi per scoprire servizi e prodotti disponibili.
          </p>
        </div>

      </div>

      <div className="wd-footer-bottom">
        © {year} WebOnDay. All rights reserved.
      </div>
    </footer>
  );
}

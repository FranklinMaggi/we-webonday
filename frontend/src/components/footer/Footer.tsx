import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="wd-footer">
      <div className="wd-footer-col">
        <h4 className="wd-footer-title">Policy</h4>

        <Link className="wd-footer-link" to="/policy/terms">
          Termini di Servizio
        </Link>

        <Link className="wd-footer-link" to="/policy/privacy">
          Privacy Policy
        </Link>

        <Link className="wd-footer-link" to="/policy">
           Policy
        </Link>
      </div>
    </footer>
  );
}

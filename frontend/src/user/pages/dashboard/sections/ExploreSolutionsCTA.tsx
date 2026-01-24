/**
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Sezione dashboard (presentazionale)
 *
 * INVARIANTI:
 * - Nessun fetch
 * - Nessuna side-effect
 *
 * EVOLUZIONE FUTURA:
 * - Collegamento a API dedicate
 */
import { Link } from "react-router-dom";

export default function ExploreSolutionsCTA() {
  return (
    <section>
      <Link to="/solution" className="user-cta primary">
        Esplora le soluzioni disponibili
      </Link>
    </section>
  );
}

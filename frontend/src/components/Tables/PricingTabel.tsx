// FE || components/pricing/PricingTable.tsx
// ======================================================
// PRICING TABLE — WEBONDAY LINEA CAFFÈ
// ======================================================
//
// RUOLO:
// - Componente riutilizzabile per mostrare
//   la tabella prezzi ufficiale WebOnDay
//
// UTILIZZO:
// <PricingTable />
//
// NOTE:
// - Contenuto = source of truth commerciale
// - Nessuna logica JS: solo presentazione
// - Stili isolati in pricing-table.css
//
// ======================================================



export default function PricingTable() {
  return (
    <section id="tabella-servizi" className="pricing-wrapper">
      <h2 className="pricing-title">
        Tabella Riepilogativa — Linea Caffè WebOnDay
      </h2>

      <div className="pricing-scroll">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Servizio</th>

              <th>
                Essential
                <span className="price-note">1.250€ • 300€/anno</span>
              </th>

              <th>
                Worker
                <span className="price-note">4.500€ • 2.500€/anno</span>
              </th>

              <th>
                Industrial
                <span className="price-note">7.000€ • 1.000€/mese</span>
              </th>

              <th>
                Governor
                <span className="price-note">25.000€ • 18.000€/anno</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Dominio + Hosting</td>
              <td>✓</td><td>✓</td><td>✓</td><td>✓</td>
            </tr>

            <tr>
              <td>Email aziendali</td>
              <td>5</td><td>Upgrade</td><td>Upgrade</td><td>Personalizzate</td>
            </tr>

            <tr>
              <td>Tipo di sito</td>
              <td>Vetrina</td>
              <td>Web-App Dinamica</td>
              <td>Backend Completo</td>
              <td>Architettura Dedicata</td>
            </tr>

            <tr>
              <td>Ricezione ordini</td>
              <td>Email / WhatsApp</td>
              <td>Clienti + Fornitori</td>
              <td>Automazioni + DB</td>
              <td>Processi Enterprise</td>
            </tr>

            <tr>
              <td>Pagamenti online</td>
              <td>✕</td>
              <td>Stripe / PayPal</td>
              <td>Completi + API</td>
              <td>Enterprise Sicuro</td>
            </tr>

            <tr>
              <td>E-commerce</td>
              <td>✕</td>
              <td>Opzionale</td>
              <td>Incluso</td>
              <td>Custom Multicanale</td>
            </tr>

            <tr>
              <td>API Business</td>
              <td>✕</td>
              <td>Opzionali</td>
              <td>2 incluse</td>
              <td>Su misura</td>
            </tr>

            <tr>
              <td>Assistenza</td>
              <td>Base</td>
              <td>Manager dedicato</td>
              <td>Alta intensità</td>
              <td>Operatori continui</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

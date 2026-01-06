/**
 * ======================================================
 * BE || seed/seedCheckoutPolicy.ts
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Seed iniziale POLICY CHECKOUT v1
 *
 * INVARIANTI:
 * - La policy versionata NON viene mai modificata
 * - Il puntatore latest può cambiare
 * - Questo file NON viene chiamato a runtime
 * ======================================================
 */

import type { Env } from "../types/env";

export async function seedCheckoutPolicyV1(env: Env) {
  const policy = {
    version: "v1",
    scope: "checkout",
    title: "Termini di Acquisto e Avvio Servizio",
    updatedAt: "2026-01-06T11:30:00Z",
    content: {
      sections: [
        {
          id: "object",
          title: "Oggetto del Servizio",
          text:
            "WebOnDay fornisce servizi digitali professionali, tra cui realizzazione di siti web, landing page, configurazioni tecniche e servizi digitali continuativi. I servizi sono personalizzati e avviati su richiesta dell’utente.",
        },
        {
          id: "digital-nature",
          title: "Natura Digitale del Prodotto",
          text:
            "Il servizio acquistato è digitale, immateriale e personalizzato. L’erogazione può iniziare immediatamente dopo il pagamento o dopo la fase di configurazione.",
        },
        {
          id: "payments",
          title: "Pagamenti",
          text:
            "Il pagamento può includere una quota di avvio una tantum e canoni ricorrenti. La quota di avvio viene addebitata immediatamente. I canoni ricorrenti non vengono addebitati al momento del checkout, salvo diversa indicazione.",
        },
        {
          id: "withdrawal",
          title: "Esclusione del Diritto di Recesso",
          text:
            "Ai sensi dell’art. 59 del D.Lgs. 206/2005, il diritto di recesso è escluso per i servizi digitali personalizzati avviati con il consenso espresso dell’utente. Con il pagamento, l’utente richiede l’avvio del servizio e rinuncia al diritto di recesso.",
        },
        {
          id: "no-guarantee",
          title: "Nessuna Garanzia di Risultato",
          text:
            "WebOnDay garantisce la corretta erogazione tecnica del servizio, ma non garantisce risultati economici, commerciali o di posizionamento.",
        },
        {
          id: "liability",
          title: "Limitazione di Responsabilità",
          text:
            "WebOnDay non è responsabile per contenuti forniti dall’utente, uso improprio dei servizi o interruzioni dovute a terze parti. La responsabilità è limitata all’importo effettivamente pagato.",
        },
        {
          id: "order-status",
          title: "Stato dell’Ordine",
          text:
            "Dopo il pagamento viene creato un ordine digitale tracciato, consultabile nell’area cliente.",
        },
        {
          id: "acceptance",
          title: "Accettazione Espressa",
          text:
            "Procedendo con il pagamento, l’utente dichiara di aver letto, compreso e accettato integralmente la presente Policy Checkout e di richiedere l’avvio del servizio digitale.",
        },
        {
          id: "jurisdiction",
          title: "Foro Competente",
          text:
            "Per ogni controversia è competente in via esclusiva il Foro di Bari (Italia).",
        },
      ],
    },
  };

  // 1️⃣ policy IMMUTABILE
  await env.POLICY_KV.put(
    "policy:checkout:v1",
    JSON.stringify(policy)
  );

  // 2️⃣ puntatore latest
  await env.POLICY_KV.put(
    "policy:checkout:latest",
    JSON.stringify({ version: "v1" })
  );
}

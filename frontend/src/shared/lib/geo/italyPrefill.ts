// ======================================================
// FE || GEO || ITALY PREFILL (HELPER)
// ======================================================
//
// RUOLO:
// - Fornire valori di default NON vincolanti
// - Usato solo per UX / prefill iniziale
//
// INVARIANTI:
// - FE ONLY
// - Sempre sovrascrivibile
// - Nessuna persistenza
// ======================================================

export type ItalyAddressPrefill = {
    country: "IT";
    city: string;
    province: string;
  };
  
  export function getItalyAddressPrefill(): ItalyAddressPrefill {
    return {
      country: "IT",
      city: "Bari",        // ← puoi cambiare in futuro
      province: "BA",
    };
  }
  
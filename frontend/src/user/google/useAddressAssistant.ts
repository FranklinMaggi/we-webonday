// ======================================================
// FE || lib/google/hooks/useAddressAssistant.ts
// ======================================================
//
// ADDRESS ASSISTANT — NOOP (STANDBY)
//
// RUOLO:
// - Interfaccia FE per autocomplete indirizzi
// - Attualmente DISATTIVATA (mock)
//
// NOTE:
// - Nessuna chiamata API
// - Nessuna side effect
// - Pronta per Google Places / OSM
// ======================================================

export type AddressSuggestion = {
    label: string;
    placeId: string;
  
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  
  export function useAddressAssistant() {
    /**
     * search
     * @param query string inserita dall’utente
     * @returns lista suggerimenti (attualmente vuota)
     *
     * FUTURO:
     * - Google Places
     * - OpenStreetMap
     */
    const search = async (
      _query: string
    ): Promise<AddressSuggestion[]> => {
      // 🔮 FUTURO: Google Places / OSM
      // ⛔ ORA: noop (build-safe)
      return [];
    };
  
    return { search };
  }
  
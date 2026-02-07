/* AI-SUPERCOMMENT
 * RUOLO:
 * - Client FE per Business OpeningHours
 */

import {type OpeningHours } from "./Business.store-model";

export async function updateBusinessOpeningHours(
  businessId: string,
  openingHours: OpeningHours
): Promise<void> {
  const res = await fetch(`/api/business/${businessId}/opening-hours`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(openingHours),
  });

  if (!res.ok) {
    throw new Error("Errore salvataggio orari");
  }
}


import { cartStore } from "./cart.store";
import { fetchCart } from "./cart.api";

/**
 * ======================================================
 * FE || Cart Sync
 * ======================================================
 *
 * RUOLO:
 * - Restore carrello da BE
 * - Usato post-login / bootstrap app
 * ======================================================
 */

export async function syncCartFromBackend() {
  const item = await fetchCart();
  if (item) {
    cartStore.getState().setItem(item);
  } else {
    cartStore.getState().clear();
  }
}

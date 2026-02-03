// routes/orders/index.ts
/**
 * ======================================================
 * ROUTES — CHECKOUT ORDERS (V1)
 * ======================================================
 *
 * SCOPO:
 * Questo modulo espone le API relative ai
 * CHECKOUT ORDERS (ordini derivanti dal carrello).
 *
 * COSA È UN CHECKOUT ORDER:
 * - nasce dal carrello
 * - può essere DRAFT / PENDING / CONFIRMED / ...
 * - vive tra checkout e pagamento
 *
 * COSA NON È:
 * - NON è un atto economico finale
 * - NON è una subscription
 * - NON è un milestone di progetto
 *
 * NOTE ARCHITETTURALI:
 * - L’atto economico finale è modellato separatamente
 *   come EconomicOrder (V2) nel dominio orders/*
 *
 * RINOMINA FUTURA (INTENZIONALE):
 * routes/orders → routes/checkout-orders
 * ======================================================
 */

// CheckoutOrder domain
export * from "./checkoutOrders.write";
export * from "./checkoutOrders.read";

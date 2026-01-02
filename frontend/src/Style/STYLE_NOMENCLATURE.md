# STYLE_NOMENCLATURE — WebOnDay

## Scopo del documento

Questo documento definisce le **regole invariabili di nomenclatura CSS** per il progetto WebOnDay.

Obiettivi:
- ridurre ambiguità
- rendere il CSS leggibile nel tempo
- permettere refactor progressivi senza regressioni
- allineare stile, dominio e architettura FE

Se una classe non rispetta questo documento, è da considerarsi **debito tecnico**.

---

## Principio guida

> **Il nome della classe racconta il dominio prima dello stile.**

Non si descrive *come appare*,  
si descrive *che cosa è* e *a quale dominio appartiene*.

---

## 1. Prefisso di dominio (OBBLIGATORIO)

Ogni classe CSS **DEVE** iniziare con un prefisso di dominio.

| Prefisso | Dominio | Dove vive |
|--------|--------|-----------|
| `wd-` | UI pubblica globale | `Style/css/layout/*` |
| `home-` | Home page | `Style/css/pages/home.css` |
| `checkout-` | Checkout | `Style/css/pages/checkout.css` |
| `login-` | Login | `Style/css/pages/login.css` |
| `cart-` | Carrello | `Style/css/components/cart-sticker.css` |
| `product-` | Prodotti | `Style/css/components/product-card.css` |
| `admin-` | Admin | `Style/css/admin/*` |
| `founder-` | Founder / Chi siamo | `Style/css/pages/founder.css` |

### Vietato
- classi senza prefisso
- prefissi misti (`wd-cart-*`)
- prefissi semantici (`primary-`, `dark-`, `big-`)

---

## 2. Blocco (BEM light)

Il **blocco** identifica un’unità UI autonoma.

Esempi corretti:
```css
.cart-sticker
.product-card
.wd-navbar
.checkout-card
.admin-sidebar

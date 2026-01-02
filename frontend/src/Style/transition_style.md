## Stato attuale (ripresa)

- index.css è caricato da main.tsx
- Esistono CSS locali importati nei componenti
- Il CSS locale vince sul globale
- Primo dominio da migrare: CART
- Nessuna modifica ancora effettuata
## Stato confermato (DevTools)

- base.css caricato e attivo
- legacy-style.css caricato e attivo
- CSS cart non più locale
- index.css governa la cascata
- duplicazioni presenti ma non dannose
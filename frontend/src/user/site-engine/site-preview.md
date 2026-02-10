# Domain — Site Preview

## 1. Purpose -Business-driven Preview

The Site Preview is strictly driven by Business data coming from the Backend.
It never owns, mutates, or infers Business information.
Missing data does not block rendering and is simply omitted.

## 2. What Site Preview Is Not
La Site Preview non è un’entità persistita.
È una vista calcolata, derivata dinamicamente dal Backend.
La Site Preview è calcolata ogni volta a partire da:

Business (BE)
→ dati reali dell’attività

Configuration (BE)
→ layoutId, styleId, paletteId, option abilitate

Media (BE / R2)
→ prompt images o immagini reali caricate
Se il Backend cambia, la Preview cambia.
Se il Backend è vuoto, la Preview è grezza.
Se il Backend è incompleto, la Preview è incompleta.
La Site Preview NON:

mantiene stato proprio

memorizza combinazioni di stile

salva “versioni” della preview

diventa cache di dati BE

introduce concetti come “draft di preview”

## 3. Inputs
- Configuration
- Business data
- Media (prompt / real)
- Style / Palette

## 4. Output
- Visual representation of the site
- Deterministic
- BE-driven

## 5. Relationship with Other Views
- Business View (dashboard)
- Solution Page (marketing)
- Public Site (future)

## 6. Media Strategy
- Prompt images
- Real images
- Replacement rules

## 7. Mutability Rules
Cosa può cambiare e cosa no (in questa fase).

## 8. Evolution
Cosa verrà dopo (layout selection, ecommerce, ecc.)

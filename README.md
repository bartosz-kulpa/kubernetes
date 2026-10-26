# BudMax — landing page budowlany

Prosty, w pełni responsywny landing page dla firmy budowlanej. Statyczny projekt
(HTML + CSS + JavaScript), bez zależności i bez procesu budowania.

## Podgląd

Otwórz `index.html` w przeglądarce albo uruchom lokalny serwer:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Zawartość

- `index.html` — struktura strony i ilustracje SVG,
- `styles.css` — style, layout, animacje i wersje responsywne,
- `script.js` — menu mobilne, animacje przy przewijaniu, liczniki i walidacja formularza.

## Sekcje

Hero z kluczowymi liczbami, usługi, proces realizacji, wybrane realizacje,
opinie klientów oraz formularz kontaktowy z bezpłatną wyceną.

Formularz jest demonstracyjny — po stronie frontendu pokazuje potwierdzenie
wysłania. Podłączenie backendu wymaga podmiany obsługi `submit` w `script.js`.

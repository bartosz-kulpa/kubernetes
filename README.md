# Kulpa Budownictwo — landing page

Prosty, w pełni responsywny landing page w tematyce budownictwa. Zbudowany w czystym HTML, CSS i JavaScript — bez frameworków i bez procesu budowania.

## Uruchomienie

Otwórz `index.html` bezpośrednio w przeglądarce albo uruchom lokalny serwer:

```bash
python3 -m http.server 8000
```

Następnie wejdź na <http://localhost:8000>.

## Co zawiera strona

- Hero z animowanymi licznikami i ilustracją placu budowy
- Ofertę (budowa domów, remonty, wykończenia, dachy i elewacje)
- Sekcję „O nas” z rysunkiem technicznym
- Realizacje z autorskimi ilustracjami SVG
- Proces współpracy w czterech krokach
- Opinie klientów
- Sekcję kontaktową z walidowanym formularzem
- Responsywne menu mobilne i animacje przy przewijaniu

## Struktura

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── favicon.svg
│   ├── hero-construction.svg
│   ├── about-blueprint.svg
│   ├── project-house.svg
│   ├── project-apartment.svg
│   └── project-renovation.svg
└── README.md
```

## Formularz

Formularz jest w pełni walidowany po stronie klienta (imię i nazwisko, telefon, e-mail, opis inwestycji oraz zgoda). Strona jest statyczna, więc wysyłka jest symulowana — w wersji produkcyjnej należy podłączyć backend lub usługę typu Formspree.

## Techniczne

- Brak zależności produkcyjnych; jedyne zewnętrzne zasoby to fonty Google (Barlow Condensed i Inter) z fallbackiem systemowym.
- Semantyczny HTML, obsługa klawiatury, skip link, stany focusu i wsparcie dla `prefers-reduced-motion`.
- Ilustracje to lokalne pliki SVG — strona działa bez dostępu do zewnętrznego hostingu obrazów.

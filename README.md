# WereldExplorer

Next.js + TypeScript web app met interactieve globe, landselectie en toeristische plekken.

## Setup

```bash
npm install
cp .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_SHARED_PASSWORD=wereld
```

## Run

```bash
npm run dev
npm run build
npm run start
```

Routes:
- `/login` lokale sessie-login (geen accounts)
- `/` home met trending
- `/explore` globe explorer (achter login gate)

## Caching en TTL

- Landdata wordt lokaal opgeslagen in IndexedDB via `idb-keyval`.
- Cache key: `country:<ISO2>`.
- TTL is 30 dagen; verlopen entries worden automatisch verwijderd bij lezen.
- Bij revisit gebruikt de app eerst cache voor snelle response (doel <1s op dezelfde browser).

## Share links

- Share knop kopieert URL met `country`, `lat`, `lng`, `alt` query params.
- Explore-route parseert deze params en herstelt land + camera.

## Tests

```bash
npm test
npm run test:e2e
```

Playwright dekt login gate, globe zichtbaarheid, zoek/selecteer flow en control buttons.

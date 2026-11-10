# ECRL Fare Calculator

Check the **starting fare** for ECRL Economy Transit between any two of the 16 stations from Gombak to Kota Bharu. The price is the same whichever way you travel.

The figures come from the published Economy Transit fare table. ECRL runs **dynamic pricing**, so what you pay at the counter or on an official channel can differ from what you see here. Treat this as a quick reference, not a live ticket price.

You can mix adults, students, and concession passengers. Student and concession amounts use the announced starting fare with the stated 40% or 50% taken off, still as **starting** rates, not guaranteed checkout prices.

From 12 Dec 2026 through 11 Jan 2027, Malaysian citizens get 30% off the starting fare. It does not stack with the student or concession rate: each passenger gets the larger discount. After 11 Jan 2027 the calculator shows the normal starting fares again. Turn the Malaysian citizen switch off to see the price without that offer.

Change the stations or party size and the link in your browser updates. Share that URL to open the same trip again.

## Views

The app is split into four short URLs. The tab bar keeps your station pick in the query string as you move between them.

| Path | What it does |
| --- | --- |
| [`/trip`](https://ecrl.shahrulestar.com/trip) | Pick two stations, set passengers, and see the starting fare. Open **View Map** to see that pair on the line map. |
| [`/station`](https://ecrl.shahrulestar.com/station) | Choose one station and browse fares to every other stop in line order. |
| [`/table`](https://ecrl.shahrulestar.com/table) | Full 16×16 Economy Transit starting-fare matrix. |
| [`/map`](https://ecrl.shahrulestar.com/map) | Zoomable route map of the peninsula with all 16 stops. A trip from **Your Trip** is highlighted when you land here with the same link. |

## Hosting

The live site is at **[ecrl.shahrulestar.com](https://ecrl.shahrulestar.com/trip)**. English is the default. Pages are `/trip`, `/station`, `/table`, and `/map`. The language choice is saved in a cookie on the device, and `functions/_middleware.ts` serves the prebuilt Malay HTML (`/ms/...`) at the same URL, so there is no flash. `/ms/...` also works directly and carries `hreflang` links. It is built as a static Next.js app and served on **Cloudflare Pages** from this repository.

Set `NEXT_PUBLIC_SITE_URL=https://ecrl.shahrulestar.com` in the Pages environment if you need to override the built-in default.

## Local development

```bash
npm install
npm run dev
```

`npm run build` produces the static export for Pages. Use `npm run typecheck` and `npm run lint` before you ship changes.

## Disclaimer

This project is unofficial. It is not affiliated with ECRL, its operators, or any ticket vendor. Confirm fares and availability through official channels before you travel.

## Data

- `src/data/fares.ts` — station list and starting fares, with notes on dynamic pricing and return journeys.
- `src/data/ecrl-line.ts` — schematic line geometry and stop positions for the map.

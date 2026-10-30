# ECRL Fare Calculator

Check the **starting fare** for ECRL Economy Transit between any two of the 16 stations from Gombak to Kota Bharu. The price is the same whichever way you travel.

The figures come from the published Economy Transit fare table. ECRL runs **dynamic pricing**, so what you pay at the counter or on an official channel can differ from what you see here. Treat this as a quick reference, not a live ticket price.

You can mix adults, students, and concession passengers. Student and concession amounts use the announced starting fare with the stated 40% or 50% taken off, still as **starting** rates, not guaranteed checkout prices.

Change the stations or party size and the link in your browser updates. Share that URL to open the same trip again.

## Hosting

The live site is built as a static Next.js app and served on **Cloudflare Pages** from this repository.

## Disclaimer

This project is unofficial. It is not affiliated with ECRL, its operators, or any ticket vendor. Confirm fares and availability through official channels before you travel.

## Data

Station list and starting fares live in `src/data/fares.ts`, with notes on dynamic pricing and return journeys.

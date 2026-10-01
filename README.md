# Holland Restaurant — Frontend

React/Vite customer ordering portal with separate customer, admin, and delivery dashboards.

## Start it

1. The local `.env` points to the live Render API. Changes made from localhost therefore update the production database. To use a separate local database instead, change `VITE_API_URL` to `http://localhost:5000`.
2. In this folder run `npm run dev`.
3. Open the address shown by Vite (normally `http://localhost:5173`).

Vite reads `VITE_API_URL` from `.env`; restart the dev server after changing it. The production Vercel deployment has its own environment variable and continues to use the Render API.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@holland.com` | `123456` |
| Admin | `admin@holland.co.tz` | `admin123` |
| Delivery | `juma@holland.co.tz` | `delivery123` |

The quick demo buttons use these same accounts. Product changes and customer orders are saved to the backend. Customers see only their own orders, delivery staff see orders assigned to them, and administrators can manage all orders. The backend seeds the requested Zanzibar food, juice, and snack menu into MySQL on startup. Menu cards use the original menu photographs and the Holland chips and avocado-juice illustrations. Tigo Pesa, M-Pesa, Airtel Money, and Halo Pesa use a manual payment flow to 0657281070: customers submit the SMS transaction ID and an admin must verify receipt and amount before marking the order paid. Cross-network transfers depend on the customer's provider. The app does not initiate or automatically verify mobile-money payments.

The language selector is available at the top of the sign-in screen and in the top system bar after sign-in. It remembers the chosen Kiswahili or English setting. Sign-in lasts for the current browser tab; closing the tab ends the session and requires signing in again.

## Checks

- `npm run build` creates a production build.
- `npm run lint` reports code-quality warnings.

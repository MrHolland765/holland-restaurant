# Holland Restaurant — Frontend

React/Vite customer ordering portal with separate customer, admin, and delivery dashboards.

## Start it

1. Start the backend first from `../holland-backend` with `npm start`.
2. In this folder run `npm run dev`.
3. Open the address shown by Vite (normally `http://localhost:5173`).

The frontend calls `http://localhost:5000` by default. To use a different API address, add `VITE_API_URL` to a `.env` file in this folder.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@holland.com` | `123456` |
| Admin | `admin@holland.co.tz` | `admin123` |
| Delivery | `juma@holland.co.tz` | `delivery123` |

The quick demo buttons use these same accounts. Product changes made in the admin portal are saved to the backend.

The language selector is available at the top of the sign-in screen and in the top system bar after sign-in. It remembers the chosen Kiswahili or English setting.

## Checks

- `npm run build` creates a production build.
- `npm run lint` reports code-quality warnings.

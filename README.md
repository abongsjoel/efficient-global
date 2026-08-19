# Efficient Global

Frontend for **Efficient Global Enterprises**, a medical courier service providing secure, time-sensitive transportation of medical materials, laboratory specimens, pharmaceuticals, and healthcare documents for healthcare providers across Minnesota and the Twin Cities.

The app has two surfaces:

- A **public marketing site** that presents the company's services, highlights its experience, and lets visitors request a delivery or get in touch through dedicated contact forms.
- A **private admin portal** at `/admin`, where the team signs in to review the delivery and information requests submitted through those forms.

Form submissions and admin authentication are handled by the companion [Efficient Global Backend](../efficieint_global_backend) Express API, which persists requests to MongoDB and emails a notification for each one.

## Tech Stack

- **[React 19](https://react.dev/)** with **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vite.dev/)** for development and bundling
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[React Router v7](https://reactrouter.com/)** for client-side routing
- **[Redux Toolkit](https://redux-toolkit.js.org/)** and **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** for admin data fetching and caching
- **[Fontsource Saira](https://fontsource.org/fonts/saira)** for self-hosted typography
- **[ESLint](https://eslint.org/)** for linting
- **[gh-pages](https://github.com/tschaub/gh-pages)** for deployment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)
- A running instance of the [backend API](../efficieint_global_backend) for the contact forms and admin portal

### Installation

```bash
git clone <repository-url>
cd efficient_global
npm install
```

### Environment

Create a local `.env` file using `.env.example` as the template.

```bash
VITE_API_BASE_URL=http://localhost:5050
```

`VITE_API_BASE_URL` points at the backend API. It defaults to `http://localhost:5050` when unset, and should be set to the deployed API URL for production builds.

### Development

Start the local dev server with hot module replacement:

```bash
npm run dev
```

The app is served at the URL printed in the terminal (typically `http://localhost:5173/logistics/`). Note the `/logistics/` path — the site is served from a subpath, configured as `base` in [vite.config.ts](vite.config.ts) and as the router `basename` in [src/App.tsx](src/App.tsx).

## Available Scripts

| Script                  | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Start the Vite development server                                 |
| `npm run build`         | Build the production bundle to `dist`                             |
| `npm run preview`       | Preview the production build locally                              |
| `npm run lint`          | Run ESLint across the project                                     |
| `npm run prepare-deploy`| Assemble the `deploy` folder from `dist` (runs as part of deploy) |
| `npm run deploy`        | Build, prepare, and publish the site to GitHub Pages              |

## Routes

| Path                          | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `/`                           | Marketing home page (hero, about, experience, services, who we serve, contact) |
| `/contact`                    | Contact page hosting both forms                      |
| `/contact?source=schedule-delivery` | Opens the contact page on the delivery request form |
| `/contact?source=request-information` | Opens the contact page on the information request form |
| `/admin`                      | Admin dashboard overview                             |
| `/admin/delivery-requests`    | Delivery request submissions table                   |
| `/admin/information-requests` | Information request submissions table                |
| `/admin/admins`               | Admin management (placeholder)                       |
| `/admin/profile`              | Signed-in admin's profile, password, and avatar      |

All `/admin` routes are wrapped by [AdminRoute](src/components/layout/AdminRoute.tsx), which shows the login screen until a session is verified against the backend.

## Project Structure

The codebase follows an [atomic design](https://atomicdesign.bradfrost.com/) approach, organizing components by complexity.

```
src/
├── assets/              # Images and static assets
├── components/
│   ├── atoms/           # Basic building blocks (Button, Input, Badge, Dropdown)
│   ├── molecules/       # Composite components (Header, Table, Toast, modals)
│   │   └── table/       # Table search, filtering, sorting, and column controls
│   ├── organisms/       # Page sections (Hero, Services, Contact, Footer, forms)
│   │   └── admin/       # Admin sidebar, dashboard summary, and request tables
│   ├── layout/          # Shared wrappers (MainLayout, AdminRoute, AppErrorBoundary)
│   └── icons/           # Inline SVG icon components
├── contexts/            # Admin authentication context and provider
├── pages/               # Route-level pages (HomePage, ContactPage, admin pages)
├── services/            # RTK Query API definitions
├── store/               # Redux store and typed hooks
├── utils/               # API client, auth, validation, formatting, storage helpers
├── App.tsx              # Application routes
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind setup
```

## Admin Portal

- **Authentication** — [AdminAuthProvider](src/contexts/AdminAuthProvider.tsx) checks the current session on load and exposes login, logout, and profile actions. The backend sets an httpOnly session cookie; the returned session token is also kept in `sessionStorage` (or `localStorage` when "keep me logged in" is checked) and sent as a `Bearer` header, so sign-in still works when cross-site cookies are blocked.
- **Data** — [adminApi](src/services/adminApi.ts) fetches delivery and information requests through RTK Query, with tagged cache invalidation and a 5-minute cache lifetime.
- **Tables** — the shared [Table](src/components/molecules/Table.tsx) component provides search with match highlighting, per-column filters, sorting, and column visibility toggles.
- **Profile** — admins can update their display name, change their password, and upload a cropped profile image (PNG, JPG, or WebP, up to 1 MB).

## Forms and Local Convenience Storage

The public [DeliveryRequestForm](src/components/organisms/DeliveryRequestForm.tsx) and [RequestInformationForm](src/components/organisms/RequestInformationForm.tsx) post to the backend, which validates the submission, stores it, and emails the team.

To make repeat submissions easier, the site can remember a visitor's name, email, phone, and organization in `localStorage` and prefill them on the next visit. This is controlled by a visible toggle on each form and can be cleared at any time — see [userInfoPrefill.ts](src/utils/userInfoPrefill.ts) and [formSuggestions.ts](src/utils/formSuggestions.ts).

## Deployment

The site is deployed to GitHub Pages at `www.efficientgloba.com/logistics`.

```bash
npm run deploy
```

This runs `predeploy` (build + prepare-deploy) and then publishes the `deploy` folder. [scripts/prepare-deploy.mjs](scripts/prepare-deploy.mjs) assembles that folder by:

1. Copying the Vite build from `dist` into `deploy/logistics`.
2. Copying `404.html` to the root so GitHub Pages can redirect deep links back into the SPA (paired with the restore script in [index.html](index.html)).
3. Writing an empty root `index.html` so the bare domain renders nothing.
4. Writing the `CNAME` file that preserves the custom domain.

Set `VITE_API_BASE_URL` to the production API URL before building, and make sure that origin is listed in the backend's `CORS_ORIGIN`.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2025-2026 Joel Chi.

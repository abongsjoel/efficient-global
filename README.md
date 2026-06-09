# Efficient Global

Marketing website for **Efficient Global Enterprises**, a medical courier service providing secure, time-sensitive transportation of medical materials, laboratory specimens, pharmaceuticals, and healthcare documents for healthcare providers across Minnesota and the Twin Cities.

The site presents the company's services, highlights its experience, and lets visitors request a delivery or get in touch through dedicated contact forms.

## Tech Stack

- **[React 19](https://react.dev/)** with **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vite.dev/)** for development and bundling
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[React Router v7](https://reactrouter.com/)** for client-side routing
- **[ESLint](https://eslint.org/)** for linting
- **[gh-pages](https://github.com/tschaub/gh-pages)** for deployment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)

### Installation

```bash
git clone <repository-url>
cd efficient_global
npm install
```

### Development

Start the local dev server with hot module replacement:

```bash
npm run dev
```

The app is served at the URL printed in the terminal (typically `http://localhost:5173`).

## Available Scripts

| Script            | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start the Vite development server                    |
| `npm run build`   | Type-check and build the production bundle to `dist` |
| `npm run preview` | Preview the production build locally                 |
| `npm run lint`    | Run ESLint across the project                        |
| `npm run deploy`  | Build and publish the site to GitHub Pages           |

## Project Structure

The codebase follows an [atomic design](https://atomicdesign.bradfrost.com/) approach, organizing components by complexity.

```
src/
├── assets/              # Images and static assets
├── components/
│   ├── atoms/           # Basic building blocks (Button, Badge, Hamburger)
│   ├── molecules/       # Composite components (Header, ScrollReveal, ScrollIndicator)
│   ├── organisms/       # Page sections (Hero, Services, Contact, Footer, forms)
│   └── layout/          # Shared layout wrappers (MainLayout)
├── pages/               # Route-level pages (HomePage, ContactPage)
├── App.tsx              # Application routes
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind setup
```

## Deployment

The site is deployed to GitHub Pages. Running the deploy script builds the project and publishes the contents of `dist`:

```bash
npm run deploy
```

## License

This project is private and not licensed for public use.

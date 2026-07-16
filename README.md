# StudyFlow

StudyFlow is a calm, local-first study planner built around an elegant scheduling engine. The interface is meticulously crafted to keep students focused on a single question: *what should I study right now?*

This repository is optimized for **production-grade serverless deployment** using **Next.js 15**, **OpenNext**, and the **Cloudflare Workers / D1 ecosystem**.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & Server Routes**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Motion (for transitions), and Zustand (client state).
- **Client Persistence**: IndexedDB for a resilient local-first, offline-capable experience.
- **Background Synchronization**: Structured transaction queue syncing client snapshots to the cloud.
- **Cloud Persistence**: Cloudflare D1 (SQLite-compatible edge database) managed with Drizzle ORM.
- **Serverless Edge Runtime**: Compiled via OpenNext into a single, high-performance Cloudflare Worker bundle using Cloudflare Assets.

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router layout and API routes (including OAuth & sync)
├── components/           # UI components, layout, study-cards, and the offline runtime provider
├── db/                   # Drizzle ORM database schemas, migrations, and seed scripts
├── lib/                  # Core application libraries:
│   └── engine/           # State-machine-based study scheduling & recurrence engine
├── storage/              # IndexedDB client-side schema, database client, and type declarations
├── sync/                 # Background sync-engine and transactional queues
├── repositories/         # Local and Cloud (D1) data persistence adapters
├── types/                # TypeScript global type definitions
└── public/               # Static assets, PWA manifest.webmanifest, and the Offline Service Worker
```

---

## 🚀 Local Development

### 1. Prerequisites
- **Node.js**: `22.x` or newer (Required for Cloudflare / OpenNext compatibility)
- **npm**: `10.x` or newer
- **Cloudflare Wrangler CLI**: (Optional, installed as dev dependency)

### 2. Installation
Install project dependencies on a clean clone:
```bash
npm install
```

### 3. Running the Dev Server
Launch the local development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Code Quality & Verification
To verify code formatting, type safety, and production build compliance:
```bash
npm run lint         # Run ESLint validation
npm run typecheck    # Validate TypeScript types
npm run build        # Build Next.js app in production mode
npm run cf:build     # Compile full-stack application using OpenNext
```

---

## 💾 Database Setup & Migrations (D1 + Drizzle)

StudyFlow uses **Drizzle ORM** for type-safe database queries. Cloudflare D1 is used as the relational storage layer.

### Generating Migrations
If you modify schemas in `db/schema/`, generate a new SQL migration file:
```bash
npm run db:generate
```

### Applying Migrations Locally
Apply existing Drizzle migrations to your local Wrangler D1 test database:
```bash
npm run db:migrate:local
```

### Applying Migrations to Production D1
Apply migrations to your live Cloudflare D1 instance:
```bash
npm run db:migrate
```

---

## ☁️ Cloudflare Workers Production Deployment

OpenNext bundles both the static pages and the full serverless API route layer into a single, cohesive Cloudflare Worker.

### 1. Pre-deployment Checklist
1. **Cloudflare D1 Database**: Create a new D1 instance:
   ```bash
   npx wrangler d1 create studyflow_db
   ```
2. **Update Database ID**: Copy the generated `database_id` from the CLI output and paste it into `wrangler.toml` under `[[d1_databases]]`.
3. **Run Initial Migration**: Apply schema migrations to your remote D1 database:
   ```bash
   npm run db:migrate
   ```

### 2. Compile & Deploy
Run the OpenNext compiler and deploy the unified worker bundle:
```bash
npm run cf:build
npm run cf:deploy
```

---

## 🔑 Environment Variables & Secrets

To ensure secure operation, variables must be configured depending on whether they are **public configuration**, **build-time flags**, **Worker runtime environment vars**, or **sensitive secrets**.

| Variable Name | Category | Exposure | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_STUDYFLOW_APP_URL` | Public / Runtime | Client & Server | The canonical base URL of your deployed application (e.g., `https://studyflow.pages.dev`). |
| `NEXT_PUBLIC_STUDYFLOW_API_URL` | Public / Runtime | Client & Server | (Optional) Explicit backend endpoint. If collocated on the same Worker, this can be omitted. |
| `GOOGLE_CLIENT_ID` | Public / Runtime | Server | Client ID for Google OAuth Integration. |
| `GOOGLE_CLIENT_SECRET` | Worker Secret | Server (Secret) | Client Secret for Google OAuth. **Must never be checked into git or public vars!** |
| `CLOUDFLARE_D1_DATABASE_ID` | Build-time Config | CLI Deploy | The database ID of your Cloudflare D1 instance. |

### Setting Secrets in Cloudflare
To set sensitive secrets such as your `GOOGLE_CLIENT_SECRET` in production:
```bash
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

---

## 📦 Progressive Web App (PWA) & Offline Engine

StudyFlow is an installable PWA that functions seamlessly offline:
- **Manifest**: Accessible via `/manifest.webmanifest`.
- **Service Worker**: `/sw.js` caches static bundle chunks and assets, offering network-first strategies with seamless client fallbacks when offline.
- **Offline Syncer**: Runs in the background, queuing local interactions in IndexedDB and flushing them via transactional sync routes (`/api/sync`) when connectivity is restored.

---

## 🔗 CI/CD Deployment with GitHub Actions

To enable automated zero-downtime deployment on pushes to `main`, create a `.github/workflows/deploy.yml` with the following contents:

```yaml
name: Deploy StudyFlow
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-size: 22

      - name: Install Dependencies
        run: npm ci

      - name: Build Next.js & OpenNext
        run: npm run cf:build
        env:
          NEXT_PUBLIC_STUDYFLOW_APP_URL: https://studyflow.pages.dev
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

---

## 🔍 Troubleshooting

### `nodejs_compat` is missing
Ensure your `wrangler.toml` contains `compatibility_flags = ["nodejs_compat"]`. OpenNext requires this flag to emulate Node APIs inside Cloudflare Workers.

### Database tables not found
Ensure you applied D1 migrations to the correct target (local vs remote). Run:
```bash
npm run db:migrate
```

### Google OAuth redirect mismatches
Make sure the redirect URI configured in your Google Developer Console matches:
`https://<your-deployed-domain>/api/auth/callback`

---

## 📄 License & Changelog

StudyFlow is licensed under the **MIT License**. Check `CHANGELOG.md` for historical release notes.

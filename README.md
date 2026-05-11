# Portfolio NFC

Experimental NFC-driven portfolio site built with Next.js, React Three Fiber,
Tailwind CSS, and Sanity Studio. The UI is a 3D gallery wall with a splash
unlock, loading sequence, HUD overlay, and modal project details.

## Features

- 3D gallery wall with scroll/touch navigation (React Three Fiber + Drei).
- Splash unlock and staged loading flow.
- HUD, panel label, dots navigation, and project overlay details.
- Sanity Studio at /studio for managing panels and projects.
- Fallback content when Sanity is not configured.

## Tech Stack

- Next.js (App Router)
- React 19
- React Three Fiber + Drei
- Tailwind CSS v4
- Sanity v5 (content + Studio)
- Motion (Framer Motion-compatible API)

## Project Structure

- app/ - Next.js App Router pages and layout.
- components/portfolio/ - 3D scene, UI overlays, and gallery logic.
- sanity/ - Sanity schema, client, and image helpers.
- app/studio/[[...index]] - Sanity Studio route.

## Running Locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>

## Sanity Configuration

This project expects the following environment variables:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-05-01
```

When not set, the app renders fallback panels defined in
components/portfolio/data.ts.

## Content Model

Two Sanity document types are used:

- projectproject: project details, tags, images, and links.
- panelpanel: panel ordering, optional external links, and project references.

## Scripts

```bash
npm run dev     # start dev server
npm run build   # build for production
npm run start   # run production server
npm run lint    # lint
```

## Deploy (Server)

これは 後の私用のscriptです
`./deploy.sh` はサーバー上の `portfolio-nfc` に配置しています。GitHub から
`git pull` を行い、`pm2` を自動更新するためのスクリプトです。

```bash
./deploy.sh
```

## directory

```
. // PORTFOLIO-NFC
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ studio/
│     ├─ [[...index]]/
│     │  ├─ layout.tsx
│     │  └─ page.tsx
│     └─ [[...tool]]/  # empty
├─ components/
│  └─ portfolio/
│     ├─ canvas-stage.tsx
│     ├─ data.ts
│     ├─ dots-nav.tsx
│     ├─ hud.tsx
│     ├─ loading.tsx
│     ├─ overlay.tsx
│     ├─ panel-label.tsx
│     ├─ portfolio-shell.tsx
│     ├─ splash.tsx
│     └─ types.ts
├─ sanity/
│  ├─ env.ts
│  ├─ lib/
│  │  ├─ client.ts
│  │  ├─ image.ts
│  │  └─ live.ts
│  ├─ schemaTypes/
│  │  ├─ index.ts
│  │  ├─ panelpanel.ts
│  │  └─ projectproject.ts
│  ├─ seed/
│  │  └─ seed.ndjson
│  └─ structure.ts
├─ public/  # empty
├─ 参照サイト/
│  └─ portfolioDEMO.html
├─ sanity.cli.ts
├─ sanity.config.ts
├─ STODIO_README.md
├─ next.config.ts
├─ package.json
└─ README.md
```

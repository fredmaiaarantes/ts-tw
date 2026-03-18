# Migration: JavaScript to TypeScript

## Overview

This document describes the migration of the `ts-tw` Meteor project from JavaScript/JSX to TypeScript/TSX.

## Prerequisites

The following were already in place before migration:

- Meteor `typescript@5.9.3` package in `.meteor/packages`
- `@types/meteor@^2.9.7` in devDependencies (updated to `^2.9.9` during migration)

The following type packages were added/updated:

```bash
meteor npm install --save-dev @types/react @types/react-dom @types/mocha @types/meteor@^2.9.9
```

## Steps Performed

### 1. Created `tsconfig.json` (replaced `jsconfig.json`)

The existing `jsconfig.json` contained verbose Meteor package path mappings pointing to runtime JS files. These were removed since `@types/meteor` provides type declarations via module augmentation.

Key settings:
- `strict: false` — relaxed for initial migration, can be tightened later
- `noEmit: true` — Meteor handles compilation; TypeScript is only for type-checking
- `resolveJsonModule: true` — enables `import` of `.json` files (used in tests)
- `jsx: "react"` — React JSX transform
- `paths: { "/*": ["./*"] }` — supports Meteor's absolute import convention

### 2. Converted data layer (`imports/api/links.ts`)

- Added `Link` interface defining the document shape: `title`, `url`, `createdAt`, and optional `_id`
- Applied generic type parameter to the collection: `new Mongo.Collection<Link>('links')`

### 3. Converted React components to TSX

**`imports/ui/Hello.tsx`** — No type annotations needed. `useState(0)` infers `number` automatically.

**`imports/ui/Info.tsx`** — Typed the `classNames` utility function parameter as `(string | boolean | undefined | null)[]`. The `useFind` and `useSubscribe` hooks infer types from the typed collection.

**`imports/ui/App.tsx`** — Updated import paths from `'./Hello.jsx'` and `'./Info.jsx'` to `'./Hello'` and `'./Info'` (TypeScript does not allow `.tsx` in import specifiers).

### 4. Converted entry points

**`client/main.tsx`** — Added null guard on `document.getElementById('react-target')` since it returns `HTMLElement | null`.

**`server/main.ts`** — Imported the `Link` interface and typed `insertLink` parameter as `Pick<Link, 'title' | 'url'>` to reuse the existing type.

### 5. Converted test file (`tests/main.ts`)

- Added explicit `import { Meteor } from "meteor/meteor"` (was previously using the global without importing)

### 6. Updated `package.json` entry points

Changed `meteor.mainModule` and `meteor.testModule` paths:
- `client/main.jsx` → `client/main.tsx`
- `server/main.js` → `server/main.ts`
- `tests/main.js` → `tests/main.ts`

### 7. Deleted `jsconfig.json`

Superseded by `tsconfig.json`.

### 8. Upgraded React from 17 to 18

Updated dependencies:
- `react` and `react-dom`: `^17.0.2` → `^18.2.0`
- `@types/react`: → `^18.2.5`
- `@types/react-dom`: → `^18.2.4`

**`client/main.tsx`** — Migrated from the legacy `render` API (`react-dom`) to the React 18 `createRoot` API (`react-dom/client`).

### 9. Added `ts-checker-rspack-plugin`

Added `ts-checker-rspack-plugin@^1.1.5` as a devDependency and registered `TsCheckerRspackPlugin` in `rspack.config.js`. This plugin runs TypeScript type-checking in a separate worker process during the Rspack build, surfacing type errors as build warnings/errors in the terminal without slowing down the bundling itself.

**Important:** The plugin is only registered in the client build (`Meteor.isClient` block) to avoid duplicate `[type-check]` logs. Since Meteor runs two Rspack builds (client + server), registering it unconditionally would trigger two identical type-check passes. This is safe because the plugin spawns a `tsc` worker that checks all files included by `tsconfig.json` — not just the files in the build it's attached to — so server code is still fully type-checked.

### 10. Added `typescript` as a devDependency

Added `typescript@^5.9.3` as an npm devDependency. While the Meteor `typescript` package in `.meteor/packages` handles compilation at build time, having `typescript` in `package.json` ensures that `ts-checker-rspack-plugin`, IDE tooling, and any npm scripts that invoke `tsc` all resolve a local TypeScript installation consistently.

### 11. Converted `rspack.config.js` to TypeScript and removed dead `tailwind.config.js`

**`rspack.config.js` → `rspack.config.ts`** — Converted to ESM with TypeScript imports, matching the official Meteor TypeScript skeleton.

**`tailwind.config.js` → deleted** — This file used Tailwind v3 syntax (`purge`, `variants`) which is ignored by Tailwind v4. With `@tailwindcss/postcss` and `@import "tailwindcss"` in CSS, configuration is handled via CSS — no JS config file is needed.

**`postcss.config.js` — kept as JS** — PostCSS does not natively support `.ts` config files.

## Type Conventions

- **Document interfaces** live alongside their collections in `imports/api/`
- **No `React.FC`** — plain arrow functions with inferred return types
- **`Pick<T, K>`** for partial document types (e.g., insert parameters) instead of separate interfaces
- **Minimal typing** — rely on TypeScript inference where possible; only annotate where it adds clarity

## Verification

1. Run `meteor run` — app should start without errors and render correctly
2. Run `meteor test --once --driver-package meteortesting:mocha` — tests should pass
3. Check IDE for TypeScript errors (none expected)

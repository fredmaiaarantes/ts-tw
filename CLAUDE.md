# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meteor 3.4 app with React 18 frontend and Tailwind CSS v4 styling, written in TypeScript. Uses Rspack as the bundler (via `rspack` Meteor package) and MongoDB via Meteor's built-in Mongo integration.

## Commands

- **Dev server:** `meteor run` (or `npm start`)
- **Unit tests:** `meteor test --once --driver-package meteortesting:mocha`
- **Full-app tests (watch mode):** `TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha`
- **Bundle analysis:** `meteor --production --extra-packages bundle-visualizer`
- **Generate types:** `meteor lint` (uses `zodern:types` to generate TypeScript definitions for Meteor packages)

## Architecture

- **client/main.tsx** — Client entry point. Renders the React app into `#react-target` and imports `main.css` (Tailwind).
- **server/main.ts** — Server entry point. Seeds the `links` collection and publishes it.
- **imports/ui/** — React components (TSX). Uses `useSubscribe` and `useFind` from `react-meteor-data` for reactive data.
- **imports/api/links.ts** — Defines the `Link` interface and `LinksCollection` typed Mongo collection shared between client and server.
- **tests/main.ts** — Test entry point (configured via `meteor.testModule` in package.json).

## Build & Styling

- Rspack config (`rspack.config.ts`) adds PostCSS loader for CSS on the client side only.
- Tailwind v4 is used via `@tailwindcss/postcss` plugin (configured in `postcss.config.js`).
- CSS entry point is `client/main.css` which imports Tailwind with `@import "tailwindcss"`.

## TypeScript

- `tsconfig.json` at project root; Meteor's `typescript` package handles compilation (`noEmit: true`).
- `strict: false` — relaxed mode; can be tightened incrementally.
- Mongo document interfaces live in `imports/api/` alongside their collections.
- Minimal typing approach: rely on inference, only annotate where it adds value.

## Key Conventions

- Meteor package imports use the `meteor/` prefix (e.g., `import { Meteor } from 'meteor/meteor'`).
- Absolute imports from project root use `/` prefix (e.g., `import { App } from '/imports/ui/App'`).
- Mongo operations use async variants (`insertAsync`, `countAsync`).
- `.meteor/packages` lists Meteor packages; use `meteor add`/`meteor remove` to manage them.

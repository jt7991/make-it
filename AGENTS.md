# Agent Instructions for make-it

## Commands
- **Package manager**: Bun
- **Build**: `vite build`
- **Dev server**: `vite dev --port 3000`
- **Test all**: `vitest run`
- **Test single**: `vitest run <test-file>`
- **Lint**: `biome lint`
- **Format**: `biome format`
- **Check**: `biome check`

## Code Style
- **TypeScript**: Strict mode, no unused locals/parameters, ES2022 target
- **Formatting**: Tabs, double quotes, Biome (auto-organize imports)
- **Imports**: Path aliases `@/*` for `./src/*`, functional components
- **React**: JSX with React 19, functional components, hooks
- **Backend**: Convex with `v` validators, TanStack Query for data fetching
- **UI**: Shadcn/ui + Tailwind CSS v4, `cn()` utility for classes
- **Routing**: TanStack Router with SSR support
- **Forms**: React Hook Form with Zod validation

## Convex Schema Rules
- Use `v` validators: `v.string()`, `v.id("table")`, `v.optional()`, `v.union()`
- System fields: `_id`, `_creationTime` (auto-generated, no manual indexing needed)
- Index frequently queried fields: `.index("fieldName", ["fieldName"])`
- Follow .cursorrules for schema design and built-in types

## Component Installation
Use `pnpx shadcn@latest add <component>` for new UI components
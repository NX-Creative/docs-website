# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Documentation site for **docs.nxcreative.tech** — Fumadocs on Next.js
15, exported to static HTML for Cloudflare Pages. Sister repo to
`../nx-creative-site/` (the marketing SPA at nxcreative.tech) — shares
the brand tokens, doesn't share code.

Content flow: FiveM resources live in `city/resources/[nx]/nx_<name>/`.
The `/f-docs` skill parses a resource's `fxmanifest.lua` + config +
Lua source and writes MDX into this repo's `content/docs/scripts/<name>/`.
There is no separate "docs content" repo — this repo *is* the docs site,
and its content tree is populated by the skill.

## Commands

- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` — builds to `out/`. This is what Cloudflare Pages runs.

No tests, no linter configured. `pnpm build` is the single gate.

## Hard constraints

Cloudflare Pages serves `out/` as static HTML. Nothing in this repo may
introduce a server runtime:

- `output: 'export'` is set in `next.config.mjs` — don't change it.
- No server components that fetch request data, no API routes, no ISR.
- `images.unoptimized: true` — don't use `next/image` loaders.
- `trailingSlash: true` — URLs end with `/`. Keep it.

If a change breaks the build's "Exporting" phase, that's the signal —
something tried to run at request time.

## Non-obvious architecture

### Fumadocs version skew bridge (`lib/source.ts`)

`fumadocs-mdx@11.10.1` returns `source.files` as a **lazy function**.
`fumadocs-core@15.8.5` expects `source.files` as an **array** and calls
`.map()` on it. The mismatch produces a cryptic runtime error during
"Collecting page data":

```
TypeError: a.map is not a function at a.type.format (...)
```

`lib/source.ts` invokes the function once at module load and rewraps
the result. If you bump either package, re-check whether the bridge is
still needed — matched majors (both 15/11 or both 16/14) should no
longer need it.

### MDX component auto-registration

Custom components in `components/fivem/` are exported from
`components/fivem/index.ts` and registered globally in
`mdx-components.tsx`. MDX files can use them without an import. To add
a new component, export it from `components/fivem/index.ts` and spread
it into `getMDXComponents()`.

### Shared layout config

`app/layout.config.tsx` (`baseOptions`) is consumed by **both**
`app/(home)/layout.tsx` and `app/docs/layout.tsx`. Changing nav items,
logo, or the top-right link cluster happens here — don't fork per
layout.

### Theme token pipeline

The brand tokens in `app/global.css` are ported verbatim from
`../nx-creative-site/index.css`. Fumadocs exposes theme variables
prefixed `--color-fd-*`; we map the NX palette onto those instead of
defining parallel variables. When a marketing-site token changes,
update `app/global.css` to match — don't diverge.

The theme is **dark-only by design**. `app/layout.tsx` pins
`class="dark"` on `<html>`. Light mode exists as a functional fallback
but isn't the target experience.

### Content source generation

`fumadocs-mdx` generates `.source/index.ts` via the `postinstall` hook.
`.source/` is gitignored. If MDX changes don't show up after editing,
the generator didn't re-run — restart `pnpm dev` or run
`fumadocs-mdx` manually (it's on the `postinstall` script).

### meta.json sidebar control

Each folder in `content/docs/` has a `meta.json` with a `pages` array
that controls sidebar order. Top-level `content/docs/meta.json` lists
section folders (`getting-started`, `scripts`). Separators with
`---Label---` work but I've kept them out for cleaner rendering —
prefer folder-level grouping.

## Skills

Two user-level skills live at `~/.claude/skills/f-docs/` and
`~/.claude/skills/f-docs-update/`:

- **`/f-docs <resource>`** — full scaffold for a new script.
- **`/f-docs-update <resource> [version]`** — regens auto-derivable
  pages only; leaves `index.mdx` and `installation.mdx` alone;
  prepends a changelog entry.

Both read `~/.nx-creative.json` for `resources_dir` and
`docs_site_dir`. If `docs_site_dir` is missing from the config, they
fall back to this repo's absolute path.

**Skill invariants** (enforce these if editing skills or running them
manually):

1. Don't invent APIs. Only document exports/commands/events/config
   entries that actually exist in the resource's Lua source.
2. Don't leak source. Document the public surface (how to call an
   export, what event to listen to) — never paste implementation bodies.
3. Don't overwrite hand-edits silently. `index.mdx` and
   `installation.mdx` are off-limits for `/f-docs-update`. For
   `/f-docs` on an existing target, diff first and ask.

## Branding assets

- `public/logo.png` — 512×512 white monogram on transparent (master).
  Used via `components/brand/nx-logo.tsx`. White-on-transparent looks
  correct on the dark background; don't re-tint it.
- `public/fonts/sora-*.woff2` — self-hosted Sora, copied from the
  marketing site. Bricolage Grotesque loads from Google Fonts (done by
  Fumadocs UI's default preset).

## Known issue / context

- **Node 20 pinned** via `.nvmrc` and `engines`. Cloudflare Pages reads
  this. Local dev works on 22 but deploy will complain if bumped.
- **pnpm 9** via `packageManager` field + corepack.
- **No git remote yet.** Initial commit is on `main` locally. Remote
  will be `NX-Creative/docs-website` (pushed by the user, not by
  automation).

## Reference paths

- Marketing site source (brand tokens, logo, fonts):
  `../nx-creative-site/`
- FiveM server project (resources the skill reads):
  `../city/resources/[nx]/`
- NX config (skills look here): `~/.nx-creative.json`

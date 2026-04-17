# NX Creative — Documentation Site

Source for [docs.nxcreative.tech](https://docs.nxcreative.tech) — the
documentation hub for NX Creative FiveM scripts.

Built with [Fumadocs](https://fumadocs.dev) on Next.js, exported as
static HTML, and deployed on Cloudflare Pages.

## Prerequisites

- **Node 20** (see `.nvmrc`)
- **pnpm 9** (enable with `corepack enable && corepack prepare pnpm@9 --activate`)

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Production build

```bash
pnpm build
```

Output goes to `out/` — that's the directory Cloudflare Pages serves.

The build command on Cloudflare Pages is:

```bash
pnpm install && pnpm build
```

with **build output directory** set to `out` and **Node version** set to
`20`.

## Content

All docs live under [`content/docs/`](./content/docs) as MDX files:

| Path | Purpose |
| --- | --- |
| `index.mdx` | Landing page for the docs site |
| `getting-started/` | Generic prerequisites, framework notes, dependencies, support policy |
| `scripts/` | Per-script docs. Populated via the `/f-docs` skill |
| `*/meta.json` | Sidebar order + section titles |

Sidebar order is controlled by each folder's `meta.json#pages` array.

### Custom MDX components

The docs use a small FiveM-specific component library in
[`components/fivem/`](./components/fivem):

- `<DependencyList>` — card grid of required / optional resources
- `<ConfigOption>` — a single `config.lua` entry with type, default, description
- `<ExportSignature>` — an export's name, side (server/client), params, return
- `<FrameworkTabs>` / `<FrameworkTab>` — tabbed code blocks for ESX / QBCore / QBox
- `<CommandReference>` — a chat command with args and permission

Components are registered in
[`mdx-components.tsx`](./mdx-components.tsx), so they're usable in any
MDX file without importing them explicitly.

### Adding a new script's docs

Use the `/f-docs` skill from Claude Code:

```
/f-docs nx_fourseasons
```

It parses the resource's `fxmanifest.lua`, `config.lua`, and Lua source,
then scaffolds the full page set (`index`, `installation`,
`configuration`, `exports`, `commands`, `events`, `changelog`) under
`content/docs/scripts/fishing/` and registers it in the scripts sidebar.

When a script gets a new release, use `/f-docs-update`:

```
/f-docs-update nx_fourseasons 1.4.0
```

It re-derives `configuration`, `exports`, `commands`, `events` from the
current source (leaving hand-edited `index.mdx` / `installation.mdx`
alone) and prepends a new changelog entry.

Both skills live under `~/.claude/skills/f-docs/` and
`~/.claude/skills/f-docs-update/`, and read `~/.nx-creative.json` for
`resources_dir` and `docs_site_dir`.

## Theming

One theme, always dark. The design system is ported from the main
marketing site ([nxcreative.tech](https://nxcreative.tech)) — brand red
on chroma-tinted neutrals (hue 27), Sora body + Bricolage Grotesque
display, and tight architectural radii.

Tokens live in [`app/global.css`](./app/global.css), mapped onto
Fumadocs' `--color-fd-*` variables. Nav and footer branding live in
[`components/brand/`](./components/brand).

## Deployment

- **Host:** Cloudflare Pages (Git integration against
  `NX-Creative/docs-website`)
- **Build:** `pnpm install && pnpm build`
- **Output dir:** `out`
- **Node version:** `20`

Static export is enforced in
[`next.config.mjs`](./next.config.mjs):

- `output: 'export'`
- `images.unoptimized: true`
- `trailingSlash: true`
- No server components that read request data, no API routes.

## Known caveats

- **Fumadocs version skew.** `fumadocs-mdx@11` returns `source.files` as
  a lazy function; `fumadocs-core@15`'s loader expects it as an array.
  [`lib/source.ts`](./lib/source.ts) bridges the two by invoking the
  function once at module load. If you upgrade either package, re-check
  whether the bridge is still needed.

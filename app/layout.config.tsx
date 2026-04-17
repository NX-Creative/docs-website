import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { ArrowUpRight } from 'lucide-react';
import { NxLogo } from '@/components/brand/nx-logo';

// Shared nav/header config used by both the marketing home layout and
// the docs layout. Mirrors the parent marketing site: logo plus a
// compact link cluster back to the main site, the Tebex store, and
// Discord.
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight">
        <NxLogo className="h-7 w-7" />
        <span>
          NX Creative
          <span className="ml-1.5 font-mono text-[11px] font-medium tracking-[0.02em] text-fd-muted-foreground">
            Docs
          </span>
        </span>
      </span>
    ),
    url: '/',
  },
  links: [
    {
      text: 'Docs',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Store',
      url: 'https://nxcreative.tech/products',
      external: true,
    },
    {
      text: 'Discord',
      url: 'https://discord.gg/UYrWRyrUqY',
      external: true,
    },
    {
      type: 'custom',
      children: (
        <a
          href="https://nxcreative.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.02em] text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
        >
          nxcreative.tech
          <ArrowUpRight size={12} strokeWidth={2.25} />
        </a>
      ),
    },
  ],
  githubUrl: 'https://github.com/NX-Creative/docs-website',
};

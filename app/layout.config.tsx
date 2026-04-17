import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NxLogo } from '@/components/brand/nx-logo';

/**
 * Shared nav/header config used by both the marketing home layout and
 * the docs layout. The site is a subdomain of the NX Creative marketing
 * site, so the nav mirrors the parent: logo + a compact link cluster
 * leading back to the main site, the Tebex store, and Discord.
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight">
        <NxLogo className="h-7 w-7" />
        <span>
          NX Creative
          <span className="ml-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-fd-muted-foreground">
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
      text: '← nxcreative.tech',
      url: 'https://nxcreative.tech',
      external: true,
    },
  ],
  githubUrl: 'https://github.com/NX-Creative',
};

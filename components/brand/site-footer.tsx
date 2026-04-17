import Link from 'next/link';
import { NxLogo } from './nx-logo';

/**
 * Minimal footer for the docs site. The full marketing footer lives on
 * nxcreative.tech — here we just echo the brand line, ownership, and the
 * core outbound links.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-fd-border bg-fd-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-md flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-semibold text-fd-foreground transition-colors hover:text-fd-primary"
          >
            <NxLogo className="h-6 w-6" />
            NX Creative
          </Link>
          <p className="text-sm text-fd-muted-foreground">
            Built for FiveM. Engineered for Growth. Premium scripts for ESX,
            QBCore, and QBox roleplay servers.
          </p>
          <p className="mt-2 text-xs text-fd-muted-foreground">
            © {new Date().getFullYear()} NX Creative. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterColumn
            heading="Docs"
            links={[
              { label: 'Introduction', href: '/docs' },
              {
                label: 'Installation',
                href: '/docs/getting-started/installation',
              },
              {
                label: 'Frameworks',
                href: '/docs/getting-started/frameworks',
              },
              { label: 'Scripts', href: '/docs/scripts' },
            ]}
          />
          <FooterColumn
            heading="Product"
            links={[
              { label: 'Main site', href: 'https://nxcreative.tech' },
              { label: 'Tebex store', href: 'https://nxcreative.tech/products' },
              { label: 'About', href: 'https://nxcreative.tech/about' },
            ]}
          />
          <FooterColumn
            heading="Community"
            links={[
              { label: 'Discord', href: 'https://discord.gg/UYrWRyrUqY' },
              { label: 'YouTube', href: 'https://www.youtube.com/@NX_Creative' },
              { label: 'GitHub', href: 'https://github.com/NX-Creative' },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="mono-label">{heading}</p>
      <ul className="flex flex-col gap-2 text-sm text-fd-muted-foreground">
        {links.map((link) => {
          const isExternal = /^https?:/.test(link.href);
          return (
            <li key={link.href}>
              {isExternal ? (
                <a
                  href={link.href}
                  className="transition-colors hover:text-fd-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="transition-colors hover:text-fd-primary"
                >
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

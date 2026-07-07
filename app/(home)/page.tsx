import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Strands from '@/components/reactbits/strands';
import BorderGlow from '@/components/reactbits/border-glow';

interface ScriptEntry {
  slug: string;
  resource: string;
  title: string;
  body: string;
}

const FEATURED: ScriptEntry = {
  slug: 'fourseasons',
  resource: 'nx_fourseasons',
  title: 'Four Seasons',
  body: 'Weather, seasons, time sync, body-temperature survival, and storms. Server-authoritative, with a weather platform API other scripts can build on.',
};

const SCRIPTS: ScriptEntry[] = [
  {
    slug: 'laptop',
    resource: 'nx_laptop',
    title: 'Laptop',
    body: 'A 3D in-world laptop: stocks, crypto wallet, vehicle marketplace, darknet, jobs hub, forums, and a casino app.',
  },
  {
    slug: 'realbanking',
    resource: 'nx_realbanking',
    title: 'Real Banking',
    body: '3D in-world ATM panels, a premium bank app, invoicing, and a credit-card layer.',
  },
  {
    slug: 'employeemanagement',
    resource: 'nx_employeemanagement',
    title: 'Employee Management',
    body: 'Employee tracking, payroll, invoicing, and society-fund management in a tablet-style UI.',
  },
  {
    slug: 'write',
    resource: 'nx_write',
    title: 'Write',
    body: 'Physical paper and notepads. A live DUI surface renders handwriting onto the prop while arm IK traces the pen.',
  },
  {
    slug: 'slotmachine',
    resource: 'nx_slotmachine',
    title: 'Slot Machine',
    body: 'Four custom slot games rendered onto the vanilla casino cabinets. Multiplayer-synced.',
  },
  {
    slug: 'ox_target',
    resource: 'ox_target',
    title: 'ox_target Redesign',
    body: 'Drop-in visual replacement for ox_target with the same API and a liquid glass UI.',
  },
];

const GUIDES = [
  {
    href: '/docs/getting-started/installation',
    title: 'Installation',
    body: 'Prerequisites, server setup, and the first-boot checklist.',
  },
  {
    href: '/docs/getting-started/frameworks',
    title: 'Frameworks',
    body: 'How the scripts adapt to ESX, QBCore, and QBox.',
  },
  {
    href: '/docs/getting-started/dependencies',
    title: 'Dependencies',
    body: 'The ox ecosystem: ox_lib, ox_target, ox_inventory, oxmysql.',
  },
  {
    href: '/docs/getting-started/support',
    title: 'Support',
    body: 'License verification, Tebex tickets, and how to reach us.',
  },
];

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col">
      {/* Hero — text up top on clean ground, the strands as a full-width
          band below it. No overlap, no contrast compromise. */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 text-center md:pt-28">
          <h1
            className="font-display-tight nx-fade-up text-4xl font-semibold leading-[1.02] text-fd-foreground md:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            Built for FiveM.
            <br />
            Documented for builders.
          </h1>
          <p
            className="nx-fade-up mt-5 max-w-md text-sm text-fd-muted-foreground md:text-base"
            style={{ animationDelay: '100ms' }}
          >
            Guides and references for every NX Creative script. ESX, QBCore,
            and QBox.
          </p>
          <div
            className="nx-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '200ms' }}
          >
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 rounded-md bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
            >
              Read the docs
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="https://nxcreative.tech/products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-fd-border bg-fd-secondary px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:border-fd-primary/60 hover:bg-fd-accent hover:text-fd-primary"
            >
              Browse the store
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* The strand band lives below the copy in normal flow; its taper
            keeps the top edge dark so it never touches the text. */}
        <div
          aria-hidden
          className="pointer-events-none relative -mt-6 h-80 w-full md:-mt-10 md:h-[30rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent, black 35%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 35%)',
          }}
        >
          <Strands
            colors={['#7f1d1d', '#dc2626', '#ff8a70']}
            count={5}
            speed={0.3}
            amplitude={1.5}
            waviness={0.85}
            thickness={0.85}
            glow={2.6}
            taper={2.6}
            spread={1.2}
            intensity={0.6}
            saturation={1.1}
            opacity={1}
            scale={1.9}
          />
        </div>
      </section>

      {/* Script catalog */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-fd-foreground md:text-4xl">
            Script documentation
          </h2>
          <p className="mt-3 text-base text-fd-muted-foreground">
            Every published script with its own configuration reference,
            exports, commands, events, and changelog.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BorderGlow className="md:col-span-2 lg:col-span-3">
            <Link
              href={`/docs/scripts/${FEATURED.slug}`}
              className="group flex flex-col gap-4 p-7 md:flex-row md:items-end md:justify-between md:p-9"
            >
              <div className="max-w-xl">
                <span className="font-mono text-xs text-fd-muted-foreground">
                  {FEATURED.resource}
                </span>
                <h3 className="font-display mt-2 text-2xl font-semibold text-fd-foreground md:text-3xl">
                  {FEATURED.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground md:text-base">
                  {FEATURED.body}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-fd-foreground transition-colors group-hover:text-fd-primary">
                Open docs
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </BorderGlow>

          {SCRIPTS.map((script) => (
            <BorderGlow key={script.slug}>
              <Link
                href={`/docs/scripts/${script.slug}`}
                className="group flex h-full flex-col p-6"
              >
                <span className="font-mono text-xs text-fd-muted-foreground">
                  {script.resource}
                </span>
                <h3 className="font-display mt-2 text-xl font-semibold text-fd-foreground">
                  {script.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fd-muted-foreground">
                  {script.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground transition-colors group-hover:text-fd-primary">
                  Open docs
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* Getting started */}
      <section className="border-t border-fd-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
          <div className="gap-12 md:grid md:grid-cols-[minmax(0,20rem)_1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold text-fd-foreground">
                New server?
              </h2>
              <p className="mt-3 text-base text-fd-muted-foreground">
                Four short guides cover everything the scripts assume about
                your setup.
              </p>
            </div>
            <ul className="mt-10 md:mt-0">
              {GUIDES.map((guide) => (
                <li key={guide.href} className="border-b border-fd-border first:border-t">
                  <Link
                    href={guide.href}
                    className="group flex items-baseline justify-between gap-6 py-5 transition-colors"
                  >
                    <span>
                      <span className="text-base font-semibold text-fd-foreground transition-colors group-hover:text-fd-primary">
                        {guide.title}
                      </span>
                      <span className="mt-1 block text-sm text-fd-muted-foreground">
                        {guide.body}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      className="shrink-0 self-center text-fd-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-fd-primary"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

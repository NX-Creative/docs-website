import Link from 'next/link';
import { ArrowRight, BookOpen, Package, MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,color-mix(in_oklch,var(--color-fd-primary)_18%,transparent)_0%,transparent_80%)]"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
          <p className="mono-label mb-6">NX Creative · Documentation</p>
          <h1 className="font-display-tight text-5xl font-semibold leading-[0.95] text-fd-foreground md:text-7xl">
            Built for FiveM.
            <br />
            <span className="text-fd-muted-foreground">
              Documented for Builders.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-fd-muted-foreground md:text-xl">
            Installation guides, configuration references, exports, commands,
            and events for every NX Creative script. Covering ESX, QBCore,
            and QBox.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 rounded-md bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-all hover:brightness-110"
            >
              <BookOpen size={16} />
              Read the Docs
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="https://nxcreative.tech/products"
              className="inline-flex items-center gap-2 rounded-md border border-fd-border px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:border-fd-primary/60 hover:text-fd-primary"
            >
              <Package size={16} />
              Browse Store
            </a>
            <a
              href="https://discord.gg/UYrWRyrUqY"
              className="inline-flex items-center gap-2 rounded-md border border-fd-border px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:border-fd-primary/60 hover:text-fd-primary"
            >
              <MessageCircle size={16} />
              Join Discord
            </a>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <p className="mono-label mb-5">Start here</p>
        <div className="grid gap-3 md:grid-cols-2">
          <QuickLink
            href="/docs/getting-started/installation"
            title="Installation"
            body="Prerequisites, server setup, and the first-boot checklist."
          />
          <QuickLink
            href="/docs/getting-started/frameworks"
            title="Frameworks"
            body="How our scripts adapt to ESX, QBCore, and QBox."
          />
          <QuickLink
            href="/docs/getting-started/dependencies"
            title="Dependencies"
            body="The ox ecosystem: ox_lib, ox_target, ox_inventory, oxmysql."
          />
          <QuickLink
            href="/docs/getting-started/support"
            title="Support"
            body="License verification, Tebex tickets, and how to reach us."
          />
        </div>
      </section>
    </main>
  );
}

function QuickLink({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-fd-border bg-fd-card p-5 transition-all hover:border-fd-primary/60 hover:bg-fd-accent/40"
    >
      <span className="flex items-center justify-between text-base font-semibold text-fd-foreground">
        {title}
        <ArrowRight
          size={14}
          className="text-fd-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-fd-primary"
        />
      </span>
      <span className="mt-1.5 text-sm text-fd-muted-foreground">{body}</span>
    </Link>
  );
}

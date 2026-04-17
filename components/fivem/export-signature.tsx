import type { ReactNode } from 'react';

export interface ExportParam {
  name: string;
  type: string;
  description?: string;
  optional?: boolean;
}

export interface ExportSignatureProps {
  /** Export identifier, e.g. `nx_inventory:getItem`. */
  name: string;
  /** Where the export runs. */
  side: 'server' | 'client' | 'shared';
  params?: ExportParam[];
  returns?: string;
  /** Optional one-liner summary rendered under the name. */
  description?: string;
  /** Lua usage example — rendered inside the block's `children` slot. */
  children?: ReactNode;
}

/**
 * Documents a single export's signature, parameters, return, and an
 * inline example. The server/client badge is not optional — callers must
 * declare where the export executes.
 */
export function ExportSignature({
  name,
  side,
  params,
  returns,
  description,
  children,
}: ExportSignatureProps) {
  return (
    <section className="my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <header className="flex flex-wrap items-center gap-2 border-b border-fd-border bg-fd-accent/40 px-4 py-3">
        <code className="font-mono text-sm font-semibold text-fd-foreground">
          {name}
        </code>
        <SideBadge side={side} />
      </header>

      {description ? (
        <p className="border-b border-fd-border px-4 py-3 text-sm text-fd-muted-foreground">
          {description}
        </p>
      ) : null}

      {params && params.length > 0 ? (
        <div className="border-b border-fd-border px-4 py-3">
          <p className="mono-label mb-2">Parameters</p>
          <ul className="flex flex-col gap-2">
            {params.map((param) => (
              <li
                key={param.name}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
              >
                <code className="font-mono font-semibold text-fd-foreground">
                  {param.name}
                  {param.optional ? '?' : ''}
                </code>
                <code className="rounded-sm bg-fd-muted px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground">
                  {param.type}
                </code>
                {param.description ? (
                  <span className="text-fd-muted-foreground">
                    — {param.description}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {returns ? (
        <div className="border-b border-fd-border px-4 py-3">
          <p className="mono-label mb-1">Returns</p>
          <code className="font-mono text-sm text-fd-foreground">
            {returns}
          </code>
        </div>
      ) : null}

      {children ? (
        <div className="px-4 py-3 [&_pre]:my-0">{children}</div>
      ) : null}
    </section>
  );
}

function SideBadge({ side }: { side: 'server' | 'client' | 'shared' }) {
  const styles: Record<typeof side, string> = {
    server: 'bg-fd-primary/15 text-fd-primary',
    client: 'bg-sky-500/15 text-sky-400',
    shared: 'bg-fd-muted text-fd-muted-foreground',
  };
  return (
    <span
      className={[
        'rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        styles[side],
      ].join(' ')}
    >
      {side}
    </span>
  );
}

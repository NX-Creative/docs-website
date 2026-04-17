import type { ReactNode } from 'react';

export interface CommandArg {
  name: string;
  type: string;
  optional?: boolean;
  description?: string;
}

export interface CommandReferenceProps {
  /** Command name, without the slash. */
  name: string;
  args?: CommandArg[];
  /** Required permission level or ACE principal. */
  permission?: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Documents a chat command. Mirrors the shape of ExportSignature so the
 * two feel consistent when stacked on a single page.
 */
export function CommandReference({
  name,
  args,
  permission,
  description,
  children,
}: CommandReferenceProps) {
  const signature =
    '/' +
    name +
    (args && args.length > 0
      ? ' ' +
        args
          .map((a) => (a.optional ? `[${a.name}]` : `<${a.name}>`))
          .join(' ')
      : '');

  return (
    <section className="my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-fd-border bg-fd-accent/40 px-4 py-3">
        <code className="font-mono text-sm font-semibold text-fd-foreground">
          {signature}
        </code>
        {permission ? (
          <span className="rounded-sm bg-fd-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-fd-primary">
            {permission}
          </span>
        ) : null}
      </header>

      {description ? (
        <p className="border-b border-fd-border px-4 py-3 text-sm text-fd-muted-foreground">
          {description}
        </p>
      ) : null}

      {args && args.length > 0 ? (
        <div className="border-b border-fd-border px-4 py-3">
          <p className="mono-label mb-2">Arguments</p>
          <ul className="flex flex-col gap-2">
            {args.map((arg) => (
              <li
                key={arg.name}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
              >
                <code className="font-mono font-semibold text-fd-foreground">
                  {arg.name}
                  {arg.optional ? '?' : ''}
                </code>
                <code className="rounded-sm bg-fd-muted px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground">
                  {arg.type}
                </code>
                {arg.description ? (
                  <span className="text-fd-muted-foreground">
                    — {arg.description}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {children ? (
        <div className="px-4 py-3 [&_pre]:my-0">{children}</div>
      ) : null}
    </section>
  );
}

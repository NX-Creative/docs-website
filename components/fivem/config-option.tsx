import type { ReactNode } from 'react';

export interface ConfigOptionProps {
  name: string;
  type: string;
  /** Default value as it appears in source. Will be rendered in a monospace pill. */
  default?: string;
  /** Short one-line description shown next to the name. */
  description?: string;
  /** Optional marker — "new", "deprecated", etc. */
  badge?: string;
  /** Longer-form examples or notes rendered below the summary row. */
  children?: ReactNode;
}

/**
 * Documents a single entry of a Config table. Designed to stack vertically
 * with `<ConfigOption>` blocks back-to-back, producing a readable key/value
 * list without needing an HTML table.
 */
export function ConfigOption({
  name,
  type,
  default: defaultValue,
  description,
  badge,
  children,
}: ConfigOptionProps) {
  return (
    <section className="my-5 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-fd-border bg-fd-accent/40 px-4 py-3">
        <code className="font-mono text-sm font-semibold text-fd-foreground">
          {name}
        </code>
        <code className="rounded-sm bg-fd-muted px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground">
          {type}
        </code>
        {badge ? (
          <span className="rounded-sm bg-fd-primary/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fd-primary">
            {badge}
          </span>
        ) : null}
        {defaultValue ? (
          <span className="ml-auto font-mono text-xs text-fd-muted-foreground">
            default: <span className="text-fd-foreground">{defaultValue}</span>
          </span>
        ) : null}
      </header>
      {description || children ? (
        <div className="px-4 py-3 text-sm text-fd-muted-foreground">
          {description ? <p>{description}</p> : null}
          {children ? (
            <div className="mt-2 [&_pre]:my-2 [&_p]:my-1.5">{children}</div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

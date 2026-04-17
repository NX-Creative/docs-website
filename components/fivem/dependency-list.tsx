import type { ReactNode } from 'react';
import { ExternalLink, CheckCircle2, CircleDashed } from 'lucide-react';

export interface Dependency {
  name: string;
  /** Short description of what this resource provides to the script. */
  description?: string;
  /** Set to false for optional / recommended-but-not-required dependencies. */
  required?: boolean;
  /** Minimum version the script has been tested against. */
  version?: string;
  /** Upstream link — repo or download page. */
  href?: string;
}

export interface DependencyListProps {
  dependencies: Dependency[];
  children?: ReactNode;
}

/**
 * Renders a resource's dependency list as a 2-column card grid. Required
 * vs optional is distinguished by both an icon and a subtle border color,
 * so it's scannable without relying on color alone.
 */
export function DependencyList({ dependencies, children }: DependencyListProps) {
  return (
    <div className="my-6">
      {children ? (
        <div className="mb-4 text-sm text-fd-muted-foreground [&>p]:m-0">
          {children}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {dependencies.map((dep) => {
          const required = dep.required !== false;
          return (
            <div
              key={dep.name}
              className={[
                'relative flex flex-col gap-1.5 rounded-2xl border p-4 transition-colors',
                required
                  ? 'border-fd-border bg-fd-card'
                  : 'border-dashed border-fd-border bg-fd-card/50',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {required ? (
                    <CheckCircle2
                      size={14}
                      className="shrink-0 text-fd-primary"
                    />
                  ) : (
                    <CircleDashed
                      size={14}
                      className="shrink-0 text-fd-muted-foreground"
                    />
                  )}
                  <span className="font-mono text-sm font-semibold text-fd-foreground">
                    {dep.name}
                  </span>
                </div>
                <span
                  className={[
                    'shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.02em]',
                    required
                      ? 'bg-fd-primary/15 text-fd-primary'
                      : 'bg-fd-muted text-fd-muted-foreground',
                  ].join(' ')}
                >
                  {required ? 'Required' : 'Optional'}
                </span>
              </div>
              {dep.description ? (
                <p className="text-sm text-fd-muted-foreground">
                  {dep.description}
                </p>
              ) : null}
              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-fd-muted-foreground">
                {dep.version ? (
                  <span className="font-mono">≥ {dep.version}</span>
                ) : (
                  <span />
                )}
                {dep.href ? (
                  <a
                    href={dep.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-fd-primary"
                  >
                    docs <ExternalLink size={11} />
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

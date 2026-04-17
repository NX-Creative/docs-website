'use client';

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

export type FrameworkId = 'esx' | 'qbcore' | 'qbox' | 'standalone';

const FRAMEWORK_LABELS: Record<FrameworkId, string> = {
  esx: 'ESX',
  qbcore: 'QBCore',
  qbox: 'QBox',
  standalone: 'Standalone',
};

export interface FrameworkTabProps {
  framework: FrameworkId;
  children: ReactNode;
}

/**
 * A single tab panel. Must only appear as a direct child of `<FrameworkTabs>`.
 */
export function FrameworkTab(_props: FrameworkTabProps): ReactElement {
  // Rendering is handled by FrameworkTabs — this component exists purely
  // to let MDX authors declare panels with a clean, declarative API.
  return null as unknown as ReactElement;
}

export interface FrameworkTabsProps {
  children: ReactNode;
  /** Which framework should be selected on mount. */
  defaultFramework?: FrameworkId;
}

export function FrameworkTabs({
  children,
  defaultFramework,
}: FrameworkTabsProps) {
  const tabs = useMemo(() => {
    const found: { framework: FrameworkId; node: ReactNode }[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement<FrameworkTabProps>(child)) return;
      if (child.type !== FrameworkTab) return;
      found.push({
        framework: child.props.framework,
        node: child.props.children,
      });
    });
    return found;
  }, [children]);

  const initial =
    defaultFramework && tabs.some((t) => t.framework === defaultFramework)
      ? defaultFramework
      : tabs[0]?.framework ?? 'esx';

  const [active, setActive] = useState<FrameworkId>(initial);
  const activeTab = tabs.find((t) => t.framework === active);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <div
        role="tablist"
        aria-label="Framework variants"
        className="flex flex-wrap gap-0.5 border-b border-fd-border bg-fd-accent/30 p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.framework === active;
          return (
            <button
              key={tab.framework}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.framework)}
              className={[
                'rounded-sm px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors',
                selected
                  ? 'bg-fd-background text-fd-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground',
              ].join(' ')}
            >
              {FRAMEWORK_LABELS[tab.framework]}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="p-4 [&_pre]:my-0">
        {activeTab?.node}
      </div>
    </div>
  );
}

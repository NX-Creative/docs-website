import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  MessageCircle,
  LifeBuoy,
  Mail,
  BookOpen,
  Github,
} from 'lucide-react';

type IconKey = 'discord' | 'ticket' | 'email' | 'docs' | 'github';

const ICONS: Record<IconKey, React.ComponentType<{ size?: number; className?: string }>> = {
  discord: MessageCircle,
  ticket: LifeBuoy,
  email: Mail,
  docs: BookOpen,
  github: Github,
};

export interface SupportChannel {
  name: string;
  /** Short sentence describing what the channel is for. */
  description?: string;
  /** Very short qualifier like "Fastest response" or "Billing only". */
  bestFor?: string;
  /** Where the card links to. */
  href: string;
  /** Icon keyword. Defaults to docs. */
  icon?: IconKey;
}

export interface SupportChannelsProps {
  channels: SupportChannel[];
  children?: ReactNode;
}

/**
 * Presents support/contact options as action cards. Each card is a single
 * external link — no required/optional distinction, no version fields.
 */
export function SupportChannels({ channels, children }: SupportChannelsProps) {
  return (
    <div className="my-6">
      {children ? (
        <div className="mb-4 text-sm text-fd-muted-foreground [&>p]:m-0">
          {children}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((channel) => {
          const Icon = ICONS[channel.icon ?? 'docs'];
          const external =
            channel.href.startsWith('http://') ||
            channel.href.startsWith('https://');
          return (
            <a
              key={channel.name}
              href={channel.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group relative flex flex-col rounded-2xl border border-fd-border bg-fd-card p-5 no-underline transition-all hover:border-fd-primary/60 hover:bg-fd-accent/40 [&_*]:no-underline"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className="shrink-0 text-fd-primary"
                  />
                  <span className="text-base font-semibold text-fd-foreground underline decoration-fd-primary/40 decoration-1 underline-offset-4 transition-colors group-hover:decoration-fd-primary">
                    {channel.name}
                  </span>
                </div>
                <ArrowUpRight
                  size={14}
                  className="mt-1 shrink-0 text-fd-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fd-primary"
                />
              </div>
              {channel.description ? (
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  {channel.description}
                </p>
              ) : null}
              {channel.bestFor ? (
                <p className="mono-label mt-3">{channel.bestFor}</p>
              ) : null}
            </a>
          );
        })}
      </div>
    </div>
  );
}

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { baseOptions } from '../layout.config';
import { FooterAscii } from '@/components/brand/footer-ascii';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
      {/* Closing brand mark under every docs page — just the ASCII wordmark,
          not the full home footer. */}
      <FooterAscii />
    </>
  );
}

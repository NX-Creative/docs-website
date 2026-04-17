import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';
import { baseOptions } from '../layout.config';
import { SiteFooter } from '@/components/brand/site-footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions}>
      {children}
      <SiteFooter />
    </HomeLayout>
  );
}

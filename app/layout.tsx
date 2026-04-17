import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NX Creative Docs',
  description:
    'Documentation for NX Creative. Premium FiveM scripts for ESX, QBCore, and QBox roleplay servers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <RootProvider
          theme={{
            enabled: true,
            defaultTheme: 'dark',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Bricolage_Grotesque } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'NX Creative Docs',
  description:
    'Documentation for NX Creative. Premium FiveM scripts for ESX, QBCore, and QBox roleplay servers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${bricolage.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <RootProvider
          theme={{
            enabled: true,
            defaultTheme: 'dark',
          }}
          search={{
            options: {
              type: 'static',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

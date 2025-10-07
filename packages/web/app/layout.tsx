import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'antd/dist/reset.css';
import './globals.css';
import { AppProviders } from './providers';
import { getServerSession } from '../lib/auth';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Unified Inbox',
  description: 'Manage conversations, forms, and FAQs in one place.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppShell session={session}>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}

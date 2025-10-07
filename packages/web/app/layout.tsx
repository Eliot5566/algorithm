import type { Metadata } from 'next';
import './globals.css';
import 'antd/dist/reset.css';
import QueryClientProvider from '@/providers/query-client-provider';

export const metadata: Metadata = {
  title: 'Support Console',
  description: 'Manage conversations, FAQs, forms, orders, and settings.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}

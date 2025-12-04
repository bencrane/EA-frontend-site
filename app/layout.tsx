import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Everything Automation',
  description: 'Discover automation systems that streamline your business processes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

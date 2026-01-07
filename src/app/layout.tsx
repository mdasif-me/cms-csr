import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import { Footer } from '../lib/features/root/components/footer';
import { Toaster } from './components/shared/ui/sonner';
import './styles/globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Coaching Management System',
  description:
    'Coaching Management System is a comprehensive web application designed to streamline the operations of coaching centers. It offers features such as student enrollment, course management, attendance tracking, fee management, and performance analytics, all aimed at enhancing the efficiency and effectiveness of coaching institutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${publicSans.variable} antialiased`}>
        {children}
        <Footer />
        <Toaster position='top-center' />
      </body>
    </html>
  );
}

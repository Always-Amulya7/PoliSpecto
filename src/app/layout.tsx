
import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import {AuthProvider} from './auth-provider';
import { AppContextProvider } from '@/context/app-context';

export const metadata: Metadata = {
  title: 'PoliSpecto',
  description: 'Get instant, AI-powered answers from your policy documents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <AppContextProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

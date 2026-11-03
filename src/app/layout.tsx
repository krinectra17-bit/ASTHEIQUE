import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/store-context';
import { AnnouncementBar } from '@/components/storefront/announcement-bar';
import { Header } from '@/components/storefront/header';
import { Footer } from '@/components/storefront/footer';
import { CartDrawer } from '@/components/storefront/cart-drawer';
import { SearchModal } from '@/components/storefront/search-modal';
import { ToastNotification } from '@/components/ui/toast';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: {
    default: 'AESTHIQUE — Little Things, Better Living.',
    template: '%s | AESTHIQUE',
  },
  description:
    'Thoughtfully selected everyday lifestyle essentials. Elevated ceramics, French linens, brass accoutrements, and grounding body care.',
  keywords: [
    'AESTHIQUE',
    'lifestyle essentials',
    'home decor',
    'minimalist ceramics',
    'luxury linen',
    'kitchen essentials',
    'mindful living',
  ],
  authors: [{ name: 'AESTHIQUE Studio' }],
  metadataBase: new URL('https://aesthique.com'),
  openGraph: {
    title: 'AESTHIQUE — Little Things, Better Living.',
    description: 'Thoughtfully selected essentials for a more beautiful, comfortable and effortless everyday life.',
    url: 'https://aesthique.com',
    siteName: 'AESTHIQUE',
    images: [
      {
        url: '/brand/aesthique-logo.png',
        width: 800,
        height: 800,
        alt: 'AESTHIQUE Emblem',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/brand/aesthique-logo.png',
    apple: '/brand/aesthique-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#30251F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-screen flex flex-col justify-between selection:bg-aesthique-gold selection:text-white">
        <StoreProvider>
          <div className="flex-1 flex flex-col">
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <SearchModal />
          <ToastNotification />
        </StoreProvider>
      </body>
    </html>
  );
}

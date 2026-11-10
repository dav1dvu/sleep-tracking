import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#06080F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Somna | Elite Sleep & Circadian Intelligence',
  description:
    'Nền tảng theo dõi giấc ngủ, tính toán chu kỳ 90 phút, phân tích nợ ngủ và huấn luyện viên AI chuẩn khoa học y sinh.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Somna',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark h-full antialiased scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-[#070B18] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                // Ensure existing workers are updated and old caches purged
                if ('caches' in window) {
                  caches.delete('somna-cache-v1');
                }
                if (window.location.protocol === 'https:') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                      reg.update();
                    }).catch(function(err) {
                      console.log('SW registration failed:', err);
                    });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { readFileSync } from 'fs';
import { join } from 'path';

// Read favicon html content
const faviconHtml = readFileSync(join(process.cwd(), 'public', 'favicon.html'), 'utf-8');

export const metadata = {
  title: "LAN File Share",
  description: "Share files across your local network quickly and securely",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  themeColor: '#4F46E5',
  other: {
    favicon: faviconHtml
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site">
          <Header />
          <main className="container">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

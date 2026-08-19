import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { CustomerToast } from "@/components/storefront/CustomerToast";
import { ToastNotification } from "@/components/storefront/ToastNotification";
import { FloatingWhatsApp } from "@/components/storefront/FloatingWhatsApp";
import { CartDrawer } from "@/components/storefront/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIKI Baby SL - Baby Room Wall Art, Nursery Gifts & Decor Sri Lanka",
  description:
    "Explore adorable Sri Lankan baby room wall art, personalized birth stats plaques, wooden growth charts, and luxury baby shower gift sets. Cash on delivery islandwide.",
  keywords: [
    "baby room wall art Sri Lanka",
    "baby gifts Sri Lanka",
    "nursery wall art Sri Lanka",
    "children gifts online Sri Lanka",
    "baby room decor Sri Lanka",
    "MIKI baby wall art",
    "Miky baby Sl Colombo",
  ],
  openGraph: {
    title: "MIKI Baby SL - Baby Room Wall Art & Gifts",
    description: "Artful nursery treasures and custom baby wall art with Cash on Delivery islandwide.",
    url: "https://mikibaby.lk",
    siteName: "MIKI Baby SL",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "MIKI Baby Room Wall Art Collection",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Meta Pixel Async Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '123456789012345');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-miki-cream text-miki-dark flex flex-col justify-between">
        <StoreProvider>
          <CartProvider>
            <CustomerAuthProvider>
              <AdminAuthProvider>
                <ToastNotification />
                <CustomerToast />
                <CartDrawer />
                <div className="flex-1">{children}</div>
                <FloatingWhatsApp />
              </AdminAuthProvider>
            </CustomerAuthProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/storeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Trim Tree",
    template: "%s | Trim Tree Haldwani",
  },
  description:
    "Trim Tree is a premium unisex salon in Haldwani, Uttarakhand offering haircuts, hair color, bridal & party makeup, skincare facials, manicure & pedicure, nail art, and relaxing spa services. Expert stylists, hygienic setup, and easy online booking.",
  keywords: [
    "Trim Tree",
    "Haldwani salon",
    "unisex salon Haldwani",
    "best salon in Haldwani",
    "haircut Haldwani",
    "men haircut Haldwani",
    "women haircut Haldwani",
    "kids haircut Haldwani",
    "bridal makeup Haldwani",
    "party makeup Haldwani",
    "makeup artist Haldwani",
    "hair color Haldwani",
    "global hair color Haldwani",
    "highlights Haldwani",
    "keratin treatment Haldwani",
    "smoothening Haldwani",
    "hair spa Haldwani",
    "facial Haldwani",
    "skincare Haldwani",
    "manicure pedicure Haldwani",
    "nail art Haldwani",
    "beauty parlour Haldwani",
    "spa Haldwani",
    "Kathgodam salon",
    "Nainital Road salon",
  ],
  applicationName: "Trim Tree Salon",
  category: "Beauty & Personal Care",
  authors: [{ name: "Trim Tree" }],
  creator: "Trim Tree",
  publisher: "Trim Tree",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
    ],
  },
  other: {
    "geo.region": "IN-UT",
    "geo.placename": "Haldwani",
    "geo.position": "29.2183;79.5120",
    ICBM: "29.2183, 79.5120",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

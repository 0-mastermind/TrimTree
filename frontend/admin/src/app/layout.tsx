import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/storeProvider";
import { Toaster } from "react-hot-toast";
import AppProvider from "@/utils/AppProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trim Tree Salon",
  description: "manager admin panel",
  icons: {
    icon: [
      {
        url: "/favicon.ico"
      }
    ]
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster
        reverseOrder={true}
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            border: "1px solid #713200",
            padding: "10px",
            color: "#713200",
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
        <StoreProvider>
          <AppProvider>{children}</AppProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

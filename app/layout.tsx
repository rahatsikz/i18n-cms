import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "i18n CMS",
  description: "Created by rahat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${GeistSans.className}`}>
      <body>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}

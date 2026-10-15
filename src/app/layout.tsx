import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* Editorial Serif: Cormorant Garamond — institutional, authoritative, refined */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* Geometric Sans: Plus Jakarta Sans — clear, modern, excellent at small sizes */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://niventracapitaladvisory.com"),
  title: "Niventra Capital Advisory India | Structured Capital & Real Estate Advisory",
  description:
    "Connecting eligible capital with professionally evaluated real-estate opportunities. Specializing in secured debt debentures, rigorous due diligence, and institutional capital structuring.",
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/images/logo.png",
  },
  openGraph: {
    title: "Niventra Capital Advisory India | Structured Capital & Real Estate Advisory",
    description:
      "Connecting eligible capital with professionally evaluated real-estate opportunities through structured debt and debenture channels.",
    url: "https://niventracapitaladvisory.com",
    siteName: "Niventra Capital Advisory",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1355,
        height: 1160,
        alt: "Niventra Capital Advisory Official Emblem",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-[#FAFAF7] text-[#1A1A1A]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1A1A1A] focus:text-white focus:text-sm focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

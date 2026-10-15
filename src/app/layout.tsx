import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://niventracapitaladvisory.com"),
  title: "Niventra Capital Advisory India | Professional Structured Capital & Real Estate Advisory",
  description:
    "Connecting eligible capital with professionally evaluated real-estate opportunities. Specializing in secured debt debentures, rigorous due diligence, and capital structuring.",
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/images/logo.png",
  },
  openGraph: {
    title: "Niventra Capital Advisory India | Professional Structured Capital",
    description:
      "Connecting eligible capital with professionally evaluated real-estate opportunities.",
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
      className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-sans-body antialiased bg-[#F8F9FA] text-[#1F2937]">
        {children}
      </body>
    </html>
  );
}

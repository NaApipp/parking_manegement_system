import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "ParkingLogic",
    template: "%s | ParkingLogic",
  },
  description:
"ParkingLogic adalah platform system management parkir yang modern dan efisien.",

  keywords: [
    "ParkingLogicTeam",
    "ParkingLogic",
    "ParkingLogic",
    "ParkingLogic",
  ],
  metadataBase: new URL("https://parkinglogic.vercel.app/"),
  openGraph: {
    title: "ParkingLogic",
    description: "ParkingLogic adalah platform system management parkir yang modern dan efisien.",
    url: "https://parkinglogic.vercel.app",
    siteName: "ParkingLogic",
    images: [
      {
        url: "/parkinglogic_logo_new.png",
        width: 1200,
        height: 630,
        alt: "ParkingLogic",
      },
    ],
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
        {children}
      </body>
    </html>
  );
}

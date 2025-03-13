import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Toasterprovider from "@/provider/ToastProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ConfettiProvider } from "@/provider/ConfettiProvider";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Learnify | AI-Powered Learning Platform",
  description: "Revolutionary learning platform using AI to generate personalized educational materials, with a vibrant marketplace where educators and students can buy and sell courses.",
  keywords: "AI education, course marketplace, sell courses online, buy courses, personalized learning, educational content creator",
  authors: [{ name: "Learnify Team" }],
  openGraph: {
    title: "Learnify - AI Learning & Course Marketplace",
    description: "Create, sell, and discover AI-generated educational content tailored to your learning journey.",
    images: ['/images/learnify-og-image.jpg'],
  },
  icons: {
    icon: '/logo.svg', // You can also add a favicon here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >  
         
          <EdgeStoreProvider>
          <ConfettiProvider/>
          <Toasterprovider/>
          {children}
          </EdgeStoreProvider>
          
        </body>
      </html>
    </ClerkProvider>
  );
}

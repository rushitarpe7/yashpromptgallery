import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Creative Yash's PromptGallery — Curated AI Art & Image Prompts",
  description:
    "Discover, browse, and copy high-quality AI prompts for Midjourney, DALL-E, Stable Diffusion, and more.",
  openGraph: {
    title: "Creative Yash's PromptGallery — Curated AI Art & Image Prompts",
    description:
      "Discover, browse, and copy high-quality AI prompts for Midjourney, DALL-E, Stable Diffusion, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#2B3034",
              border: "1px solid #B9C7D2",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px -5px rgba(233, 60, 53, 0.15)",
            },
          }}
        />
      </body>
    </html>
  );
}

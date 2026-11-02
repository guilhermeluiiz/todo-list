import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = { title: "Todo List" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          <Header />
          <main>{children}</main>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
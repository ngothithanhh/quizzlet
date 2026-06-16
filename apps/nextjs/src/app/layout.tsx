import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import AuthProvider from "~/contexts/auth-context";
import CreateFolderDialog from "~/components/layout/create-folder-dialog";
import Navbar from "~/components/layout/navbar";
import SignInDialog from "~/components/layout/sign-in-dialog";
import FolderDialogProvider from "~/contexts/folder-dialog-context";
import SignInDialogProvider from "~/contexts/sign-in-dialog-context";
import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Quizzlet",
  description: "Quizzlet application built with turbo.t3.gg",
  openGraph: {
    title: "Quizzlet",
    description: "Quizzlet application built with turbo.t3.gg",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Quizzlet",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable,
        )}
      >
        <AuthProvider>
          <SignInDialogProvider>
            <FolderDialogProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <TRPCReactProvider>
                  <Navbar />
                  <main className="container min-h-[calc(100vh-65px)] py-8">
                    {props.children}
                  </main>
                  <Toaster richColors />
                  <SignInDialog />
                  <CreateFolderDialog />
                </TRPCReactProvider>
              </ThemeProvider>
            </FolderDialogProvider>
          </SignInDialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

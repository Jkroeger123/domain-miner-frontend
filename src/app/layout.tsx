import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { BookmarksLink } from "@/components/bookmark-link";

export const metadata: Metadata = {
  title: "Domain Finder",
  description: "Describe the domain you are looking for...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="min-h-screen bg-gray-50">
          <header className="flex w-full items-center justify-between bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Link className="text-2xl font-bold" href={"/"}>
                Domain Finder
              </Link>
              <SignedIn>
                <BookmarksLink />
              </SignedIn>
            </div>

            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

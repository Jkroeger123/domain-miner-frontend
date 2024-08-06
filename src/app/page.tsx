/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vX6G1nYNaOI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { type JSX, type SVGProps } from "react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <header className="flex w-full items-center justify-between p-4">
        <div className="text-2xl font-bold">Domain Finder</div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold">Generate. Refine. Ship.</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Generate UI with shadcn/ui from simple text prompts and images.
        </p>
        <div className="relative mt-6 w-full max-w-xl">
          <Input
            type="text"
            placeholder="Describe the domain you are looking for..."
            className="w-full rounded-md border px-4 py-2"
          />
          <Button
            variant="default"
            className="absolute right-0 top-0 h-full px-4"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}

function ArrowRightIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

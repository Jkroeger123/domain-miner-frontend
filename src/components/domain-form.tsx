"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, type JSX, type SVGProps } from "react";
import Spinner from "./spinner";
import { useAuth } from "@clerk/nextjs";
import { createSearchAndRedirect } from "@/server/search";
import { Textarea } from "./ui/textarea";

export const DomainForm = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const createSearch = async (prompt: string) => {
    setLoading(true);
    setError("");
    try {
      await createSearchAndRedirect(prompt);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) setError(error.message);
    }
  };

  const isSignedIn = userId !== null;

  return (
    <>
      {error && <div className="text-destructive">{error}</div>}
      <div className="relative mt-6 w-full max-w-xl">
        <Textarea
          placeholder="Describe the domain you are looking for..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-md border px-4 py-2 min-h-[100px] resize-none pr-16"
          disabled={loading}
        />
        <Button
          variant="default"
          className="absolute right-2 bottom-2 px-4"
          onClick={() => createSearch(prompt)}
          disabled={loading || !isSignedIn || !prompt}
        >
          {loading ? <Spinner /> : <ArrowRightIcon className="h-5 w-5" />}
        </Button>
      </div>
    </>
  );
};

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

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Spinner from "./spinner";
import { useAuth } from "@clerk/nextjs";
import { createSearchAndRedirect } from "@/server/search";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "./ui/input";

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
      <div className="relative mt-6 w-full">
        <Input
          className="mr-4 h-12 w-full rounded-full border-gray-200 bg-white pl-12 pr-12 shadow-sm"
          placeholder="Describe the domain you are looking for..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <Search className="absolute left-4 top-3 h-6 w-6 text-gray-400" />

        <Button
          size="sm"
          className="absolute right-2 top-2 z-[50] h-8 cursor-pointer rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          onClick={() => createSearch(prompt)}
          disabled={loading || !isSignedIn || !prompt}
        >
          {loading ? <Spinner /> : <ArrowRight className="h-4 w-4" />}

          <span className="sr-only">Search domains</span>
        </Button>
      </div>
    </>
  );
};

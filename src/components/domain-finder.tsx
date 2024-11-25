"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainForm } from "./domain-form";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { createSearchFromForm } from "@/server/search";
import { FreeTextMultiSelect } from "@/components/ui/free-multi-select";

interface FormState {
  keywords: string[];
  tlds: string[];
  industry: string;
  maxLength: string;
}

export function DomainFinder() {
  const [searchType, setSearchType] = useState("prompt");
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>({
    keywords: [],
    tlds: [],
    industry: "",
    maxLength: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate maxLength is a number
    const maxLength = parseInt(formState.maxLength);
    if (isNaN(maxLength)) {
      alert("Please enter a valid number for max length");
      return;
    }

    // Validate required fields
    if (
      formState.keywords.length === 0 ||
      formState.tlds.length === 0 ||
      !formState.industry
    ) {
      alert("Please fill in all fields");
      return;
    }

    startTransition(() => {
      void createSearchFromForm(
        formState.keywords.join(", "),
        formState.tlds.join(", "),
        formState.industry,
        maxLength,
      );
    });
  };

  return (
    <Tabs
      value={searchType}
      onValueChange={setSearchType}
      className="mt-8 w-full max-w-4xl"
    >
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="prompt">Prompt Search</TabsTrigger>
        <TabsTrigger value="advanced">Simple Search</TabsTrigger>
      </TabsList>
      <TabsContent value="prompt">
        <DomainForm />
      </TabsContent>
      <TabsContent value="advanced">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="keywords"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Keywords
            </label>
            <FreeTextMultiSelect
              selected={formState.keywords}
              onValueChange={(keywords) =>
                setFormState((prev) => ({ ...prev, keywords }))
              }
              placeholder="Type keywords and press Enter..."
            />
          </div>
          <div>
            <label
              htmlFor="tld"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              TLDs (e.g., com, net, org)
            </label>
            <FreeTextMultiSelect
              selected={formState.tlds}
              onValueChange={(tlds) =>
                setFormState((prev) => ({ ...prev, tlds }))
              }
              placeholder="Type TLDs and press Enter..."
            />
          </div>
          <div>
            <label
              htmlFor="industry"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Industry
            </label>
            <Input
              id="industry"
              placeholder="Enter industry"
              value={formState.industry}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="maxLength"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Max Length
            </label>
            <Input
              id="maxLength"
              type="number"
              placeholder="Max characters"
              value={formState.maxLength}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <SignedIn>
          <Button
            className="mt-4 w-full"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Searching..." : "Search Domains"}
          </Button>
        </SignedIn>
        <SignedOut>
          <Button disabled className="mt-4 w-full">
            Sign In to Search
          </Button>
        </SignedOut>
      </TabsContent>
    </Tabs>
  );
}

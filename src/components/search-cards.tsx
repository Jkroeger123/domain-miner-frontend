import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Search {
  id: string;
  prompt: string;
  createdAt: Date;
  searching: boolean;
}

interface SearchCardsProps {
  searches: Search[];
}

export default function SearchCards({ searches }: SearchCardsProps) {
  return (
    <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {searches.map((search) => (
        <Link href={`/search/${search.id}`} passHref key={search.id}>
          <Card className="flex flex-col">
            <CardContent className="flex-grow p-4">
              <h3 className="mb-2 truncate text-lg font-semibold">
                {search.prompt}
              </h3>
              <p className="mb-2 text-sm text-gray-500">
                Created: {new Date(search.createdAt).toLocaleDateString()}
              </p>
              <Badge variant={search.searching ? "default" : "secondary"}>
                {search.searching ? "Searching" : "Completed"}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

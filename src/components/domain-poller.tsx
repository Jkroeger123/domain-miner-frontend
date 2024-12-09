"use client";

import React, { useState, useEffect, useCallback } from "react";
import { type DomainWithBookmark, getDomains } from "@/server/domains";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingBar from "@/components/ui/loading-bar";
import Link from "next/link";
import { BookmarkIcon, LayoutGrid, List } from "lucide-react";
import { toggleBookmark } from "@/server/bookmark";
import { useAuth } from "@clerk/nextjs";

interface DomainListProps {
  searchId: string;
  initialDomains: DomainWithBookmark[];
  initialSearching: boolean;
}

export default function DomainPoller({
  searchId,
  initialDomains,
  initialSearching,
}: DomainListProps) {
  const { userId } = useAuth();
  const [domains, setDomains] = useState<DomainWithBookmark[]>(initialDomains);
  const [isSearching, setIsSearching] = useState(initialSearching);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const handleBookmarkClick = async (e: React.MouseEvent, domainId: string) => {
    e.preventDefault();
    if (!userId) return;

    setDomains((currentDomains) =>
      currentDomains.map((domain) =>
        domain.id === domainId
          ? { ...domain, isBookmarked: !domain.isBookmarked }
          : domain,
      ),
    );

    try {
      await toggleBookmark(domainId);
    } catch (error) {
      setDomains((currentDomains) =>
        currentDomains.map((domain) =>
          domain.id === domainId
            ? { ...domain, isBookmarked: !domain.isBookmarked }
            : domain,
        ),
      );
      console.error("Error toggling bookmark:", error);
    }
  };

  const fetchNewDomains = useCallback(async () => {
    if (!isSearching) return;
    const {
      domains: newDomains,
      searching,
      error,
    } = await getDomains(searchId);
    if (error) {
      console.error("Error polling domains:", error);
      return;
    }
    if (newDomains.length > 0) {
      setDomains(newDomains);
    }
    setIsSearching(searching);
  }, [searchId, isSearching]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      void fetchNewDomains();
    }, 5000);
    return () => clearInterval(pollInterval);
  }, [fetchNewDomains]);

  const BoardView = () => (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {domains.map((domain) => (
        <motion.div
          key={domain.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="flex"
        >
          <Link href={`/domain/${domain.id}`} passHref className="w-full">
            <Card className="flex h-40 border-gray-200 bg-white transition-shadow duration-200 hover:shadow-md">
              <CardContent className="flex w-full flex-col justify-between p-4">
                <div>
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 text-lg font-semibold">
                      {domain.name}
                    </h3>
                    {userId && (
                      <Button
                        variant={domain.isBookmarked ? "default" : "outline"}
                        size="sm"
                        className="ml-2 shrink-0"
                        onClick={(e) => void handleBookmarkClick(e, domain.id)}
                      >
                        <BookmarkIcon
                          className={domain.isBookmarked ? "fill-current" : ""}
                          size={16}
                        />
                        <span className="sr-only">
                          {domain.isBookmarked
                            ? "Remove bookmark"
                            : "Add bookmark"}
                        </span>
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {Boolean(domain.searchVolume) && (
                      <span className="text-blue-600">
                        Monthly Searches: {domain.searchVolume}
                      </span>
                    )}
                    {domain.competition &&
                      domain.competition !== "UNSPECIFIED" && (
                        <span className="text-amber-600">
                          Competition: {domain.competition}
                        </span>
                      )}
                  </div>
                </div>
                {(domain.highBid ?? domain.lowBid) && (
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {domain.highBid && (
                      <span>High Bid: ${domain.highBid.toFixed(2)}</span>
                    )}
                    {domain.lowBid && (
                      <span>Low Bid: ${domain.lowBid.toFixed(2)}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[auto,2fr,1fr,1fr,1fr,1fr] gap-4 border-b border-gray-200 p-4 font-medium">
          <div></div>
          <div>Domain</div>
          <div>Monthly Searches</div>
          <div>Competition</div>
          <div>High Bid</div>
          <div>Low Bid</div>
        </div>
        {domains.map((domain) => (
          <Link
            href={`/domain/${domain.id}`}
            key={domain.id}
            className="block hover:bg-gray-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-[auto,2fr,1fr,1fr,1fr,1fr] items-center gap-4 border-b border-gray-200 p-4 text-sm"
            >
              {userId && (
                <Button
                  variant={domain.isBookmarked ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => void handleBookmarkClick(e, domain.id)}
                >
                  <BookmarkIcon
                    className={domain.isBookmarked ? "fill-current" : ""}
                    size={16}
                  />
                  <span className="sr-only">
                    {domain.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  </span>
                </Button>
              )}
              <div className="font-medium">{domain.name}</div>
              <div className="text-blue-600">{domain.searchVolume ?? "-"}</div>
              <div className="text-amber-600">
                {domain.competition !== "UNSPECIFIED"
                  ? domain.competition
                  : "-"}
              </div>
              <div>
                {domain.highBid ? `$${domain.highBid.toFixed(2)}` : "-"}
              </div>
              <div>{domain.lowBid ? `$${domain.lowBid.toFixed(2)}` : "-"}</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {isSearching && <LoadingBar />}
      <div className="mb-4 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${viewMode === "board" ? "bg-gray-100" : ""}`}
          onClick={() => setViewMode("board")}
        >
          <LayoutGrid className="h-4 w-4" />
          Board View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
          List View
        </Button>
      </div>
      <AnimatePresence mode="wait">
        {viewMode === "board" ? <BoardView /> : <ListView />}
      </AnimatePresence>
    </div>
  );
}

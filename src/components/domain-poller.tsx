"use client";

import React, { useState, useEffect, useCallback } from "react";
import { type DomainWithBookmark, getDomains } from "@/server/domains";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingBar from "@/components/ui/loading-bar";
import Link from "next/link";
import { BookmarkIcon } from "lucide-react";
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

  const handleBookmarkClick = async (e: React.MouseEvent, domainId: string) => {
    e.preventDefault(); // Prevent the Link navigation
    if (!userId) return;

    // Optimistic update
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
      // Revert on error
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

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchNewDomains]);

  return (
    <div>
      {isSearching && <LoadingBar />}
      <div className="mx-auto mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {domains.map((domain) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Link href={`/domain/${domain.id}`} passHref key={domain.id}>
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{domain.name}</h3>
                      {userId && (
                        <Button
                          variant={domain.isBookmarked ? "default" : "outline"}
                          size="sm"
                          className="ml-2"
                          onClick={(e) =>
                            void handleBookmarkClick(e, domain.id)
                          }
                        >
                          <BookmarkIcon
                            className={
                              domain.isBookmarked ? "fill-current" : ""
                            }
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
                    {domain.searchVolume ? (
                      <p className="text-sm text-gray-500">
                        Monthly Searches: {domain.searchVolume}
                      </p>
                    ) : null}

                    {domain.competition &&
                    domain.competition !== "UNSPECIFIED" ? (
                      <p className="text-sm text-gray-500">
                        Competition: {domain.competition}
                      </p>
                    ) : null}

                    {domain.highBid ? (
                      <p className="text-sm text-gray-500">
                        High Bid: ${domain.highBid.toFixed(2)}
                      </p>
                    ) : null}

                    {domain.lowBid ? (
                      <p className="text-sm text-gray-500">
                        Low Bid: ${domain.lowBid.toFixed(2)}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getDomains } from "@/server/domains";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import LoadingBar from "@/components/ui/loading-bar";
import { type Domain } from "@prisma/client";

interface DomainListProps {
  searchId: string;
  initialDomains: Domain[];
  initialSearching: boolean;
}

export default function DomainPoller({
  searchId,
  initialDomains,
  initialSearching,
}: DomainListProps) {
  const [domains, setDomains] = useState(initialDomains);
  const [isSearching, setIsSearching] = useState(initialSearching);

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
    }, 5000); // Poll every 5 seconds

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
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{domain.name}</h3>
                  {domain.searchVolume ? (
                    <p className="text-sm text-gray-500">
                      Monthly Searches: {domain.searchVolume}
                    </p>
                  ) : (
                    <></>
                  )}

                  {domain.competition &&
                  domain.competition !== "UNSPECIFIED" ? (
                    <p className="text-sm text-gray-500">
                      Competition: {domain.competition}
                    </p>
                  ) : (
                    <></>
                  )}

                  {domain.highBid ? (
                    <p className="text-sm text-gray-500">
                      High Bid: ${domain.highBid.toFixed(2)}
                    </p>
                  ) : (
                    <></>
                  )}

                  {domain.lowBid ? (
                    <p className="text-sm text-gray-500">
                      Low Bid: ${domain.lowBid.toFixed(2)}
                    </p>
                  ) : (
                    <></>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

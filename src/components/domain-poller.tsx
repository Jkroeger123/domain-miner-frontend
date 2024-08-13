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
  const [lastId, setLastId] = useState(
    initialDomains[initialDomains.length - 1]?.id,
  );
  const [isSearching, setIsSearching] = useState(initialSearching);

  const fetchNewDomains = useCallback(async () => {
    if (!isSearching) return;

    const {
      domains: newDomains,
      searching,
      error,
    } = await getDomains(searchId, lastId);
    if (error) {
      console.error("Error polling domains:", error);
      return;
    }
    if (newDomains.length > 0) {
      setDomains((prevDomains) => [...prevDomains, ...newDomains]);
      setLastId(newDomains[newDomains.length - 1]!.id);
    }
    setIsSearching(searching);
  }, [searchId, lastId, isSearching]);

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
      <div className="mt-4 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {domains.map((domain) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{domain.name}</h3>
                  <p className="text-sm text-gray-500">
                    Added: {new Date(domain.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

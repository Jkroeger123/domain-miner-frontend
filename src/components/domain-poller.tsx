"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getDomains } from "@/server/domains";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import LoadingBar from "@/components/ui/loading-bar";
import { type Domain } from "@prisma/client";
import Link from "next/link";

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
  const [isVisible, setIsVisible] = useState(false);

  // use for demo purposes
  function getRandomNumber(min: number, max: number) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }
  function generateRandomArrayCpc(length: number, min: number, max: number) {
    return Array.from({ length }, () => getRandomNumber(min, max));
  }
  const cpc = generateRandomArrayCpc(100, 0.5, 7.0);
  const searchVolume = ["10-100", "100-1k", "1k-10k", "10k-100k"];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      return () => {
        clearInterval(interval);
      };
    }, 5000);
  }, []);
  return (
    <div>
      {isSearching && <LoadingBar />}
      <div className="mx-auto mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              key={"sodasurge"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/domain/99f17526-f229-46a3-a557-63950e7e8795`}
                passHref
              >
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">SodaSurge.com</h3>
                    <p className="text-sm">Avg CPC: $3.27</p>
                    <p className="text-sm">Search volume: 10k-100k</p>
                    <p className="text-sm text-gray-500">
                      Added: 8/13/2024, 1:12:08 PM
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}
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
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{domain.name}</h3>
                    <p className="text-sm">
                      Avg CPC: ${cpc[Math.floor(Math.random() * cpc.length)]}
                    </p>
                    <p className="text-sm">
                      Search volume:{" "}
                      {
                        searchVolume[
                          Math.floor(Math.random() * searchVolume.length)
                        ]
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      Added: {new Date(domain.createdAt).toLocaleString()}
                    </p>
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

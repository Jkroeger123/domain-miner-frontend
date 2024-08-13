"use server";

import { db as prisma } from "@/server/db";
import { type Domain } from "@prisma/client";

export async function getDomains(
  searchId: string,
  lastId?: string,
): Promise<{ domains: Domain[]; searching: boolean; error: string | null }> {
  try {
    const search = await prisma.search.findUnique({
      where: { id: searchId },
      select: { searching: true },
    });

    if (!search) {
      return { domains: [], searching: false, error: "Search not found" };
    }

    const domains = await prisma.domain.findMany({
      where: {
        searchId,
        id: lastId ? { gt: lastId } : undefined,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 100,
    });

    return { domains, searching: Boolean(search.searching), error: null };
  } catch (error) {
    console.error("Error fetching domains:", error);
    return { domains: [], searching: false, error: "Error fetching domains" };
  }
}

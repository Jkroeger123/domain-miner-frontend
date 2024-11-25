"use server";

import { db as prisma } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { type User, type Domain } from "@prisma/client";

export interface DomainWithBookmark extends Domain {
  isBookmarked: boolean;
}

export async function getDomains(
  searchId: string,
  lastId?: string,
): Promise<{
  domains: DomainWithBookmark[];
  searching: boolean;
  error: string | null;
}> {
  try {
    const { userId } = auth();

    let user: User | null = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });
    }

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
      include: user
        ? {
            bookmarks: {
              where: {
                userId: user.id,
              },
              select: {
                id: true,
              },
            },
          }
        : undefined,
    });

    // Transform the domains to include isBookmarked flag
    const transformedDomains = domains.map((domain) => {
      // If we included bookmarks, remove the bookmarks array and add isBookmarked flag
      if ("bookmarks" in domain) {
        const { bookmarks, ...domainWithoutBookmarks } = domain;
        return {
          ...domainWithoutBookmarks,
          isBookmarked: (bookmarks as []).length > 0,
        };
      }
      return domain;
    }) as DomainWithBookmark[];

    return {
      domains: transformedDomains,
      searching: Boolean(search.searching),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching domains:", error);
    return { domains: [], searching: false, error: "Error fetching domains" };
  }
}

export async function getDomain(domainId: string) {
  try {
    const domain = await prisma.domain.findUnique({
      where: {
        id: domainId,
      },
    });

    return { data: domain, error: null };
  } catch (error) {
    console.error("Error fetching domain:", error);
    return { data: null, error: "Error fetching domain" };
  }
}

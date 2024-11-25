"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(domainId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  });

  try {
    // Check if bookmark exists
    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_domainId: {
          userId: user.id,
          domainId,
        },
      },
    });

    if (existingBookmark) {
      // Delete if exists
      await db.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
    } else {
      // Create if doesn't exist
      await db.bookmark.create({
        data: {
          userId: user.id,
          domainId,
        },
      });
    }

    revalidatePath("/domains/[domainId]");
    return { success: true };
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
  }
}

export async function getBookmarkStatus(domainId: string) {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  });

  const bookmark = await db.bookmark.findUnique({
    where: {
      userId_domainId: {
        userId: user.id,
        domainId,
      },
    },
  });

  return !!bookmark;
}

export async function getBookmarkedDomains(userId: string) {
  const user = await db.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  });

  const bookmarks = await db.bookmark.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { domain: true },
  });

  return bookmarks;
}

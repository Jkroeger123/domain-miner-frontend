"use server";

import { db as prisma } from "@/server/db";
import { getUser } from "./user";
import { redirect } from "next/navigation";

export const createSearchAndRedirect = async (prompt: string) => {
  const search = await createSearch(prompt);
  //kick off modal process
  redirect(`/search/${search.id}`);
};

const createSearch = async (prompt: string) => {
  const user = await getUser();

  const search = await prisma.search.create({
    data: {
      prompt,
      userId: user.id,
    },
  });

  return search;
};

export const getSearch = async (id: string) => {
  const user = await getUser();

  const search = await prisma.search.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  return search;
};

export const getSearches = async () => {
  const user = await getUser();

  const searches = await prisma.search.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 6, // Limit to the 6 most recent searches
  });

  return searches;
};

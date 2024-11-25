"use server";

import { db as prisma } from "@/server/db";
import { getUser } from "./user";
import { redirect } from "next/navigation";

export const createSearchAndRedirect = async (prompt: string) => {
  const search = await createSearch(prompt);

  const response = await fetch(
    `https://jkroeger123--domain-miner-find-domains.modal.run/?search_id=${search.id}`,
  );

  if (response.ok) {
    redirect(`/search/${search.id}`);
  }
};

export const createSearchFromForm = async (
  keywords: string,
  tld: string,
  industry: string,
  maxLength: number,
) => {
  const prompt = `Domains branching from the following keywords: ${keywords} where tlds are: ${tld}, in Industry: ${industry}, with domain max length: ${maxLength}`;
  return createSearchAndRedirect(prompt);
};

const createSearch = async (prompt: string) => {
  const user = await getUser();

  const search = await prisma.search.create({
    data: {
      prompt,
      userId: user.id,
      searching: true,
    },
  });

  return search;
};

export const getSearch = async (id: string) => {
  const search = await prisma.search.findUnique({
    where: {
      id,
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

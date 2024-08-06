"use server";

import { db as prisma } from "@/server/db";
import { getUser } from "./user";

export const createSearch = async (prompt: string) => {
  const user = await getUser();

  const search = await prisma.search.create({
    data: {
      prompt,
      userId: user.id,
    },
  });

  return search;
};

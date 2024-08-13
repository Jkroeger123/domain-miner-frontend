"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "./db";

export const getUser = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
      },
    });
  }

  return user;
};

"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ReviewType } from "@prisma/client";
import { getCurrentUserId } from "@/lib/current-user";

export async function getReviews() {
  const userId = await getCurrentUserId();
  return prisma.review.findMany({
    where: { userId },
    orderBy: { periodEndDate: "desc" },
  });
}

export async function createReview(formData: FormData) {
  const type = formData.get("type") as ReviewType;
  const wins = formData.get("wins") as string;
  const improvements = formData.get("improvements") as string;
  const learnings = formData.get("learnings") as string;
  const rating = parseInt(formData.get("rating") as string, 10);

  if (!wins || !type) return;

  const endDate = new Date();
  const startDate = new Date();

  if (type === "WEEKLY") startDate.setDate(endDate.getDate() - 7);
  else if (type === "MONTHLY") startDate.setMonth(endDate.getMonth() - 1);
  else if (type === "QUARTERLY") startDate.setMonth(endDate.getMonth() - 3);
  else if (type === "YEARLY") startDate.setFullYear(endDate.getFullYear() - 1);

  const userId = await getCurrentUserId();

  await prisma.review.create({
    data: {
      type,
      periodStartDate: startDate,
      periodEndDate: endDate,
      wins,
      improvements,
      learnings,
      rating: isNaN(rating) ? null : rating,
      userId,
    },
  });

  revalidatePath("/reviews");
}

export async function deleteReview(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const userId = await getCurrentUserId();
  await prisma.review.deleteMany({ where: { id, userId } });

  revalidatePath("/reviews");
}

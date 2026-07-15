"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  return await prisma.review.findMany();
}

export async function createReview(formData: FormData) {
  const type = formData.get("type") as string;
  const wins = formData.get("wins") as string;
  const improvements = formData.get("improvements") as string;
  const learnings = formData.get("learnings") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  
  if (!wins || !type) return;

  const endDate = new Date();
  const startDate = new Date();
  
  // Basic date math based on review type
  if (type === "WEEKLY") startDate.setDate(endDate.getDate() - 7);
  else if (type === "MONTHLY") startDate.setMonth(endDate.getMonth() - 1);
  else if (type === "QUARTERLY") startDate.setMonth(endDate.getMonth() - 3);
  else if (type === "YEARLY") startDate.setFullYear(endDate.getFullYear() - 1);

  await prisma.review.create({
    data: {
      type,
      periodStartDate: startDate.toISOString().split('T')[0],
      periodEndDate: endDate.toISOString().split('T')[0],
      wins,
      improvements,
      learnings,
      rating: isNaN(rating) ? null : rating,
    },
  });

  revalidatePath("/reviews");
}

export async function deleteReview(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.review.delete({
    where: { id },
  });

  revalidatePath("/reviews");
}

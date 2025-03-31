import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { category } from "@/server/db/schema";
import { eq, isNull, or } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getCategoryType: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .select()
        .from(category)
        .where(
          or(eq(category.user_id, input.user_id), isNull(category.user_id)),
        )
        .orderBy(category.user_id, category.id)
        .execute();
    }),
});

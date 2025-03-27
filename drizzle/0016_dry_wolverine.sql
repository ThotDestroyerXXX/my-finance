ALTER TABLE "category_budget" RENAME COLUMN "amount" TO "amount_limit";--> statement-breakpoint
ALTER TABLE "monthly_budget" RENAME COLUMN "amount" TO "amount_limit";--> statement-breakpoint
ALTER TABLE "category_budget" ALTER COLUMN "amount_limit" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "monthly_budget" ALTER COLUMN "amount_limit" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_account" ALTER COLUMN "balance" SET DATA TYPE text;
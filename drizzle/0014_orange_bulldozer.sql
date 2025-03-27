-- Custom SQL migration file, put you code below! --
CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"description" text,
	"transaction_date" date NOT NULL,
	"transaction_type" TEXT NOT NULL USING transaction_type::transaction_type,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"category_id" integer NOT NULL,
	"user_account_id" text NOT NULL
);
DO $$ BEGIN
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DATA TYPE bigint;
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_account_id_user_account_id_fk" FOREIGN KEY ("user_account_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;



DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('Income', 'Expense');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "transaction" ALTER COLUMN "transaction_type" SET DATA TYPE transaction_type;
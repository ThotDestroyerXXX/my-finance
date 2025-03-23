CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');
ALTER TYPE "transaction_type" ADD VALUE 'Income';--> statement-breakpoint
ALTER TYPE "transaction_type" ADD VALUE 'Expense';
ALTER TABLE "public"."o2_provider" ADD COLUMN "address" text;
ALTER TABLE "public"."o2_provider" ALTER COLUMN "address" DROP NOT NULL;

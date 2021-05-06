ALTER TABLE "public"."c19_vitals" ADD COLUMN "pulse" text;
ALTER TABLE "public"."c19_vitals" ALTER COLUMN "pulse" DROP NOT NULL;

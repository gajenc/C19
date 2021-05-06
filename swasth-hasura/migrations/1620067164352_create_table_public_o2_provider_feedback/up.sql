CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."o2_provider_feedback"("uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "requirement_id" uuid NOT NULL, "rating" text, "reason" text, "additional" jsonb, "usable" Boolean NOT NULL, PRIMARY KEY ("uuid") , FOREIGN KEY ("requirement_id") REFERENCES "public"."o2_requirement"("uuid") ON UPDATE cascade ON DELETE cascade);

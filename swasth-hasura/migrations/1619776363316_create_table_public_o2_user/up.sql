CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."o2_user"("uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text, "mobile" text NOT NULL, "mobile_hash" text NOT NULL, "email" text, "email_hash" text, "type" text NOT NULL, "additionalDetails" jsonb, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("uuid") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_o2_user_updated_at"
BEFORE UPDATE ON "public"."o2_user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_o2_user_updated_at" ON "public"."o2_user" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

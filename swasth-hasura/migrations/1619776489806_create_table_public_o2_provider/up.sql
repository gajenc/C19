CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."o2_provider"("uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "status" text, "pin_code" text, "address" text, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("uuid") , FOREIGN KEY ("user_id") REFERENCES "public"."o2_user"("uuid") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_o2_provider_updated_at"
BEFORE UPDATE ON "public"."o2_provider"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_o2_provider_updated_at" ON "public"."o2_provider" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

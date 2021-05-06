ALTER TABLE o2_user ADD CONSTRAINT o2_user_uniqueness UNIQUE (mobile_hash, type);
CREATE UNIQUE INDEX on o2_requirement (user_id, type) where active = true;
ALTER TABLE o2_service ADD CONSTRAINT o2_service_uniqueness UNIQUE (search_id, provider_id, status);
CREATE INDEX IF NOT EXISTS  idx_o2_user_mobile_hash ON o2_user (mobile_hash);
CREATE INDEX IF NOT EXISTS  idx_o2_user_type ON o2_user (type);

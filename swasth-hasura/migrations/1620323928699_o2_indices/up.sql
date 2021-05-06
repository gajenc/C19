CREATE INDEX IF NOT EXISTS  idx_o2_provider_feedback_rating ON o2_provider_feedback (rating);
CREATE INDEX IF NOT EXISTS  idx_o2_provider_feedback_usable ON o2_provider_feedback (usable);

CREATE INDEX IF NOT EXISTS  idx_o2_provider_pin_code ON o2_provider (pin_code);
CREATE INDEX IF NOT EXISTS  idx_o2_provider_status ON o2_provider (status);

CREATE INDEX IF NOT EXISTS  idx_o2_requirement_pin_code on o2_requirement (pin_code);
CREATE INDEX IF NOT EXISTS  idx_o2_requirement_type on o2_requirement (type);
CREATE INDEX IF NOT EXISTS  idx_o2_requirement_id on o2_requirement (id);
CREATE INDEX IF NOT EXISTS  idx_o2_requirement_active on o2_requirement (active);

CREATE INDEX IF NOT EXISTS  idx_o2_service_type on o2_service (type);
CREATE INDEX IF NOT EXISTS  idx_o2_service_status on o2_service (status);

CREATE INDEX IF NOT EXISTS  idx_o2_user_email_hash on o2_user (email_hash);
CREATE INDEX IF NOT EXISTS  idx_o2_user_phone_hash on o2_user (phone_hash);

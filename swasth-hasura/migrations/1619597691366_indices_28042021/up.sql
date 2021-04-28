CREATE INDEX IF NOT EXISTS  idx_person_mobile_hash ON person (mobile_hash);
CREATE INDEX IF NOT EXISTS  idx_person_created_at ON person (created_at);
CREATE INDEX IF NOT EXISTS  idx_person_uuid ON person (uuid);

CREATE INDEX IF NOT EXISTS  idx_triage_subscribe ON c19_triage (subscribe);
CREATE INDEX IF NOT EXISTS  idx_triage_created_at ON c19_triage (created_at);
CREATE INDEX IF NOT EXISTS  idx_triage_comorbidities ON c19_triage (comorbidities);
CREATE INDEX IF NOT EXISTS  idx_triage_spo2 ON c19_triage (spo2);
CREATE INDEX IF NOT EXISTS  idx_triage_symptoms ON c19_triage (symptoms);
CREATE INDEX IF NOT EXISTS  idx_triage_rt_pcr_status ON c19_triage (rt_pcr_status);

CREATE INDEX IF NOT EXISTS  idx_vitals_created_at ON c19_vitals (created_at);
CREATE INDEX IF NOT EXISTS  idx_vitals_temperature ON c19_vitals (temperature);
CREATE INDEX IF NOT EXISTS  idx_vitals_spo2 ON c19_vitals (spo2);

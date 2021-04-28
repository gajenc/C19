CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.c19_triage (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    person_id uuid NOT NULL,
    comorbidities text,
    subscribe boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    rt_pcr_status text,
    spo2 text,
    symptoms text
);
CREATE TABLE public.c19_vitals (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    person_id uuid NOT NULL,
    temperature text NOT NULL,
    spo2 text NOT NULL,
    pulse text,
    rt_pcr_status boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.eg_chat_state_v2 (
    id integer NOT NULL,
    user_id text,
    active boolean,
    state jsonb
);
CREATE SEQUENCE public.eg_chat_state_v2_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.eg_chat_state_v2_id_seq OWNED BY public.eg_chat_state_v2.id;
CREATE TABLE public.person (
    title text,
    first_name text NOT NULL,
    middle_name text,
    last_name text,
    dob text,
    gender text,
    mobile_code text,
    mobile text,
    email text,
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    age integer,
    mobile_hash text
);
CREATE TABLE public.person_details (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    person_id uuid NOT NULL,
    image_type text,
    image_data text,
    ll_country_code text,
    ll_std_code text,
    ll_number text,
    ll_extension text
);
CREATE TABLE public.prov (
    id bigint NOT NULL,
    json_col1 jsonb,
    json_col2 jsonb,
    name text NOT NULL,
    test json
);
CREATE TABLE public.prov_adr (
    prov_id bigint NOT NULL,
    json_col3 jsonb,
    json_col4 jsonb,
    something text NOT NULL
);
CREATE SEQUENCE public.prov_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.prov_id_seq OWNED BY public.prov.id;
CREATE TABLE public.test (
    id integer NOT NULL,
    test text NOT NULL,
    json_col json
);
CREATE SEQUENCE public.test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.test_id_seq OWNED BY public.test.id;
CREATE TABLE public.test_new (
    id integer NOT NULL,
    id_ref integer NOT NULL,
    jsondata json
);
CREATE SEQUENCE public.test_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.test_new_id_seq OWNED BY public.test_new.id;
ALTER TABLE ONLY public.eg_chat_state_v2 ALTER COLUMN id SET DEFAULT nextval('public.eg_chat_state_v2_id_seq'::regclass);
ALTER TABLE ONLY public.prov ALTER COLUMN id SET DEFAULT nextval('public.prov_id_seq'::regclass);
ALTER TABLE ONLY public.test ALTER COLUMN id SET DEFAULT nextval('public.test_id_seq'::regclass);
ALTER TABLE ONLY public.test_new ALTER COLUMN id SET DEFAULT nextval('public.test_new_id_seq'::regclass);
ALTER TABLE ONLY public.c19_triage
    ADD CONSTRAINT c19_triage_person_id_key UNIQUE (person_id);
ALTER TABLE ONLY public.c19_triage
    ADD CONSTRAINT c19_triage_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.c19_vitals
    ADD CONSTRAINT c19_vitals_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.eg_chat_state_v2
    ADD CONSTRAINT eg_chat_state_v2_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.person_details
    ADD CONSTRAINT person_details_person_id_key UNIQUE (person_id);
ALTER TABLE ONLY public.person_details
    ADD CONSTRAINT person_details_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.prov_adr
    ADD CONSTRAINT prov_adr_pkey PRIMARY KEY (prov_id);
ALTER TABLE ONLY public.prov
    ADD CONSTRAINT prov_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_id_key UNIQUE (id);
ALTER TABLE ONLY public.test_new
    ADD CONSTRAINT test_new_id_ref_key UNIQUE (id_ref);
CREATE INDEX eg_chat_idx_user_id_active_v2 ON public.eg_chat_state_v2 USING btree (user_id, active);
CREATE TRIGGER set_public_c19_triage_updated_at BEFORE UPDATE ON public.c19_triage FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_c19_triage_updated_at ON public.c19_triage IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_c19_vitals_updated_at BEFORE UPDATE ON public.c19_vitals FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_c19_vitals_updated_at ON public.c19_vitals IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_person_updated_at BEFORE UPDATE ON public.person FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_person_updated_at ON public.person IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.c19_triage
    ADD CONSTRAINT c19_triage_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.c19_vitals
    ADD CONSTRAINT c19_vitals_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.person_details
    ADD CONSTRAINT person_details_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.prov_adr
    ADD CONSTRAINT prov_adr_prov_id_fkey FOREIGN KEY (prov_id) REFERENCES public.prov(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.test_new
    ADD CONSTRAINT test_new_id_ref_fkey FOREIGN KEY (id_ref) REFERENCES public.test(id) ON UPDATE CASCADE ON DELETE CASCADE;

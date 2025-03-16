--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-03-02 19:34:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 902 (class 1247 OID 16483)
-- Name: enum_budgets_period; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_budgets_period AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'yearly'
);


ALTER TYPE public.enum_budgets_period OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 16472)
-- Name: enum_categories_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_categories_type AS ENUM (
    'income',
    'expense'
);


ALTER TYPE public.enum_categories_type OWNER TO postgres;

--
-- TOC entry 908 (class 1247 OID 16513)
-- Name: enum_chatrooms_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_chatrooms_type AS ENUM (
    'private',
    'public'
);


ALTER TYPE public.enum_chatrooms_type OWNER TO postgres;

--
-- TOC entry 956 (class 1247 OID 16600)
-- Name: enum_fees_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_fees_status AS ENUM (
    'paid',
    'unpaid'
);


ALTER TYPE public.enum_fees_status OWNER TO postgres;

--
-- TOC entry 953 (class 1247 OID 16584)
-- Name: enum_fees_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_fees_type AS ENUM (
    'building',
    'development',
    'maintenance',
    'insurance',
    'late_loan_repayment',
    'late_recurrent_payment',
    'entrance_fee'
);


ALTER TYPE public.enum_fees_type OWNER TO postgres;

--
-- TOC entry 875 (class 1247 OID 16389)
-- Name: enum_groups_recurrent_payment_frequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_groups_recurrent_payment_frequency AS ENUM (
    'daily',
    'weekly',
    'bi-weekly',
    'monthly',
    'quarterly',
    'yearly'
);


ALTER TYPE public.enum_groups_recurrent_payment_frequency OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 16402)
-- Name: enum_groups_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_groups_type AS ENUM (
    'typeA',
    'typeB'
);


ALTER TYPE public.enum_groups_type OWNER TO postgres;

--
-- TOC entry 962 (class 1247 OID 16622)
-- Name: enum_kyc_records_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_kyc_records_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public.enum_kyc_records_status OWNER TO postgres;

--
-- TOC entry 926 (class 1247 OID 16643)
-- Name: enum_loan_applications_employment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_loan_applications_employment_status AS ENUM (
    'employed',
    'unemployed',
    'selfEmployed'
);


ALTER TYPE public.enum_loan_applications_employment_status OWNER TO postgres;

--
-- TOC entry 929 (class 1247 OID 16650)
-- Name: enum_loan_applications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_loan_applications_status AS ENUM (
    'active',
    'inactive',
    'pending'
);


ALTER TYPE public.enum_loan_applications_status OWNER TO postgres;

--
-- TOC entry 935 (class 1247 OID 16676)
-- Name: enum_logs_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_logs_type AS ENUM (
    'system',
    'finance',
    'ticket',
    'user'
);


ALTER TYPE public.enum_logs_type OWNER TO postgres;

--
-- TOC entry 941 (class 1247 OID 16701)
-- Name: enum_messages_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_messages_status AS ENUM (
    'sent',
    'delivered',
    'read'
);


ALTER TYPE public.enum_messages_status OWNER TO postgres;

--
-- TOC entry 986 (class 1247 OID 16823)
-- Name: enum_rates_currency_pair; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_rates_currency_pair AS ENUM (
    'NGN/USD',
    'NGN/EUR',
    'NGN/AUD'
);


ALTER TYPE public.enum_rates_currency_pair OWNER TO postgres;

--
-- TOC entry 998 (class 1247 OID 16860)
-- Name: enum_sub_wallets_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_sub_wallets_type AS ENUM (
    'typeA',
    'typeB',
    'typeC'
);


ALTER TYPE public.enum_sub_wallets_type OWNER TO postgres;

--
-- TOC entry 1004 (class 1247 OID 16888)
-- Name: enum_subscription_plan_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_subscription_plan_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.enum_subscription_plan_status OWNER TO postgres;

--
-- TOC entry 1010 (class 1247 OID 16903)
-- Name: enum_subscriptions_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_subscriptions_status AS ENUM (
    'active',
    'non-renewing',
    'attention',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_subscriptions_status OWNER TO postgres;

--
-- TOC entry 1016 (class 1247 OID 16937)
-- Name: enum_tickets_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_tickets_status AS ENUM (
    'open',
    'in_progress',
    'closed'
);


ALTER TYPE public.enum_tickets_status OWNER TO postgres;

--
-- TOC entry 971 (class 1247 OID 16758)
-- Name: enum_transactions_class; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_transactions_class AS ENUM (
    'charge',
    'transaction'
);


ALTER TYPE public.enum_transactions_class OWNER TO postgres;

--
-- TOC entry 974 (class 1247 OID 16764)
-- Name: enum_transactions_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_transactions_status AS ENUM (
    'pending',
    'success',
    'failed'
);


ALTER TYPE public.enum_transactions_status OWNER TO postgres;

--
-- TOC entry 968 (class 1247 OID 16752)
-- Name: enum_transactions_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_transactions_type AS ENUM (
    'credit',
    'debit'
);


ALTER TYPE public.enum_transactions_type OWNER TO postgres;

--
-- TOC entry 1022 (class 1247 OID 16962)
-- Name: enum_user_applications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_user_applications_status AS ENUM (
    'pending',
    'success',
    'failed'
);


ALTER TYPE public.enum_user_applications_status OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 16420)
-- Name: enum_users_kyc_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_kyc_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);


ALTER TYPE public.enum_users_kyc_status OWNER TO postgres;

--
-- TOC entry 887 (class 1247 OID 16428)
-- Name: enum_users_loan_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_loan_status AS ENUM (
    'active',
    'inactive',
    'pending'
);


ALTER TYPE public.enum_users_loan_status OWNER TO postgres;

--
-- TOC entry 920 (class 1247 OID 16552)
-- Name: enum_wallets_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_wallets_type AS ENUM (
    'typeA',
    'typeB'
);


ALTER TYPE public.enum_wallets_type OWNER TO postgres;

--
-- TOC entry 1034 (class 1247 OID 17013)
-- Name: enum_withdraw_requests_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_withdraw_requests_status AS ENUM (
    'successful',
    'unsuccessful',
    'pending'
);


ALTER TYPE public.enum_withdraw_requests_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16454)
-- Name: beneficiaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beneficiaries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    account_number character varying(255) NOT NULL,
    bank_name character varying(255) NOT NULL,
    swift_code character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    beneficiary_id uuid
);


ALTER TABLE public.beneficiaries OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16491)
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    category_id uuid NOT NULL,
    amount double precision NOT NULL,
    period public.enum_budgets_period DEFAULT 'monthly'::public.enum_budgets_period,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    budget_id uuid
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16477)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    type public.enum_categories_type NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16522)
-- Name: chatroom_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatroom_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    chatroom_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chatroom_users OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16517)
-- Name: chatrooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatrooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    type public.enum_chatrooms_type NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chatrooms OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16539)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id1 uuid NOT NULL,
    user_id1_name character varying(255) NOT NULL,
    user_id2 uuid NOT NULL,
    user_id2_name character varying(255) NOT NULL,
    last_message_id uuid,
    last_message_content character varying(2000),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16605)
-- Name: fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public.enum_fees_type NOT NULL,
    amount integer NOT NULL,
    currency character varying(255) DEFAULT 'NGN'::character varying NOT NULL,
    status public.enum_fees_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    fees_id uuid,
    wallet_id uuid
);


ALTER TABLE public.fees OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16407)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) DEFAULT 0 NOT NULL,
    description character varying(255),
    entrance_fee integer NOT NULL,
    recurrent_payment integer DEFAULT 1150 NOT NULL,
    recurrent_payment_frequency public.enum_groups_recurrent_payment_frequency DEFAULT 'weekly'::public.enum_groups_recurrent_payment_frequency NOT NULL,
    type public.enum_groups_type DEFAULT 'typeA'::public.enum_groups_type,
    is_active boolean DEFAULT true,
    wallet_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16629)
-- Name: kyc_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kyc_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    identification_document character varying(255) NOT NULL,
    status public.enum_kyc_records_status DEFAULT 'pending'::public.enum_kyc_records_status NOT NULL,
    rejection_reason character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.kyc_records OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16657)
-- Name: loan_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    phone bigint,
    gender character varying(255),
    dob timestamp with time zone,
    amount bigint,
    address character varying(255),
    employment_status public.enum_loan_applications_employment_status,
    employer_name character varying(255),
    job_title character varying(255),
    employment_address character varying(255),
    nok_first_name character varying(255),
    nok_last_name character varying(255),
    nok_email character varying(255),
    nok_phone bigint,
    nok_relationship character varying(255),
    bvn character varying(255),
    nin character varying(255),
    verification_document character varying(255),
    guarantor_first_name character varying(255),
    guarantor_last_name character varying(255),
    guarantor_email character varying(255),
    guarantor_phone bigint,
    guarantor_occupation character varying(255),
    guarantor_office_address character varying(255),
    guarantor_home_address character varying(255),
    status public.enum_loan_applications_status DEFAULT 'inactive'::public.enum_loan_applications_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    loan_application_id uuid,
    user_id uuid
);


ALTER TABLE public.loan_applications OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16685)
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action character varying(255) DEFAULT 'SYSTEM'::character varying NOT NULL,
    type public.enum_logs_type DEFAULT 'system'::public.enum_logs_type NOT NULL,
    description character varying(255) DEFAULT 'log for specified action'::character varying NOT NULL,
    details json,
    created_at timestamp with time zone,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16707)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    content character varying(2000),
    file_url character varying(255),
    status public.enum_messages_status DEFAULT 'sent'::public.enum_messages_status,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    conversation_id uuid,
    message_id uuid,
    user_id uuid
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16730)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message character varying(255) NOT NULL,
    is_read boolean DEFAULT false,
    user_id uuid NOT NULL,
    ticket_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    notification_id uuid
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16741)
-- Name: passwords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passwords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid
);


ALTER TABLE public.passwords OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16803)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    method character varying(255) NOT NULL,
    gateway character varying(255) NOT NULL,
    total numeric(10,2) NOT NULL,
    status character varying(255),
    currency character varying(255) NOT NULL,
    extra json NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    transaction_id uuid
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16815)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16829)
-- Name: rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rates (
    id bigint NOT NULL,
    currency_pair public.enum_rates_currency_pair DEFAULT 'NGN/USD'::public.enum_rates_currency_pair NOT NULL,
    rate character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.rates OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16842)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid,
    permission_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16835)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16867)
-- Name: sub_wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    type public.enum_sub_wallets_type DEFAULT 'typeA'::public.enum_sub_wallets_type NOT NULL,
    balance numeric(10,2) DEFAULT 0 NOT NULL,
    currency character varying(255) DEFAULT 'NGN'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    subwallet_id uuid,
    wallet_id uuid
);


ALTER TABLE public.sub_wallets OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16893)
-- Name: subscription_plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plan (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    currency character varying(255) DEFAULT 'NGN'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    "interval" character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    code character varying(255) NOT NULL,
    status public.enum_subscription_plan_status DEFAULT 'active'::public.enum_subscription_plan_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.subscription_plan OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16913)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    currency character varying(255) DEFAULT 'NGN'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    "interval" character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    code character varying(255) NOT NULL,
    status public.enum_subscriptions_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    wallet_id uuid,
    subscription_id uuid,
    subscription_plan_id uuid
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16943)
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status public.enum_tickets_status DEFAULT 'open'::public.enum_tickets_status NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    ticket_id uuid
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16771)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(255) DEFAULT 'NGN'::character varying NOT NULL,
    reference character varying(255),
    code character varying(255),
    type public.enum_transactions_type DEFAULT 'credit'::public.enum_transactions_type NOT NULL,
    class public.enum_transactions_class DEFAULT 'transaction'::public.enum_transactions_class NOT NULL,
    status public.enum_transactions_status DEFAULT 'pending'::public.enum_transactions_status NOT NULL,
    description character varying(255) NOT NULL,
    meta_data json DEFAULT '{"from":{"senderid":"","senderName":""},"to":{"receiverId":"","receiverName":""},"bank":{"name":""}}'::json NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    category_id uuid,
    group_id uuid,
    transaction_id uuid,
    wallet_id uuid
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16969)
-- Name: user_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone bigint,
    "group" uuid NOT NULL,
    password character varying(255) NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    referral_code bigint,
    unique_string bigint,
    otp character varying(255),
    otp_expiry timestamp with time zone,
    status public.enum_user_applications_status DEFAULT 'pending'::public.enum_user_applications_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_applications OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16978)
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    permission_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16995)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    role_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16435)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    address character varying(255),
    country character varying(255),
    state character varying(255),
    gender character varying(255),
    phone bigint,
    kyc_status public.enum_users_kyc_status DEFAULT 'pending'::public.enum_users_kyc_status NOT NULL,
    is_activated boolean DEFAULT true,
    is_verified boolean DEFAULT false NOT NULL,
    profile_image character varying(255),
    referral_code bigint,
    unique_string bigint,
    otp character varying(255),
    otp_expiry timestamp with time zone,
    loan_balance numeric(20,2) DEFAULT 0 NOT NULL,
    loan_status public.enum_users_loan_status DEFAULT 'inactive'::public.enum_users_loan_status NOT NULL,
    loan_application_id uuid,
    wallet_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    group_id uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16557)
-- Name: wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    balance numeric(20,2) DEFAULT 0 NOT NULL,
    currency character varying(255) DEFAULT 'NGN'::character varying NOT NULL,
    reference character varying(255),
    type public.enum_wallets_type DEFAULT 'typeA'::public.enum_wallets_type NOT NULL,
    pin character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    group_id uuid,
    user_id uuid,
    wallet_id uuid
);


ALTER TABLE public.wallets OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17019)
-- Name: withdraw_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.withdraw_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    amount integer NOT NULL,
    reason character varying(255) NOT NULL,
    status public.enum_withdraw_requests_status DEFAULT 'pending'::public.enum_withdraw_requests_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id uuid,
    withdraw_request_id uuid
);


ALTER TABLE public.withdraw_requests OWNER TO postgres;

--
-- TOC entry 5218 (class 0 OID 16454)
-- Dependencies: 219
-- Data for Name: beneficiaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beneficiaries (id, user_id, name, account_number, bank_name, swift_code, created_at, updated_at, beneficiary_id) FROM stdin;
\.


--
-- TOC entry 5220 (class 0 OID 16491)
-- Dependencies: 221
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, user_id, category_id, amount, period, start_date, end_date, created_at, updated_at, budget_id) FROM stdin;
\.


--
-- TOC entry 5219 (class 0 OID 16477)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5222 (class 0 OID 16522)
-- Dependencies: 223
-- Data for Name: chatroom_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatroom_users (id, user_id, chatroom_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5221 (class 0 OID 16517)
-- Dependencies: 222
-- Data for Name: chatrooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatrooms (id, name, type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5223 (class 0 OID 16539)
-- Dependencies: 224
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, user_id1, user_id1_name, user_id2, user_id2_name, last_message_id, last_message_content, created_at, updated_at, deleted_at, user_id) FROM stdin;
\.


--
-- TOC entry 5225 (class 0 OID 16605)
-- Dependencies: 226
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fees (id, type, amount, currency, status, created_at, updated_at, deleted_at, fees_id, wallet_id) FROM stdin;
\.


--
-- TOC entry 5216 (class 0 OID 16407)
-- Dependencies: 217
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, description, entrance_fee, recurrent_payment, recurrent_payment_frequency, type, is_active, wallet_id, created_at, updated_at, deleted_at) FROM stdin;
5d97da4e-d11f-47cf-b776-a5a0a5526eac	Peoples Club 	At peoples club we connect you to men that matters	50000	20000	weekly	typeA	t	\N	2024-08-03 13:32:43.130645+01	2024-08-03 13:32:43.130645+01	\N
\.


--
-- TOC entry 5226 (class 0 OID 16629)
-- Dependencies: 227
-- Data for Name: kyc_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kyc_records (id, user_id, identification_document, status, rejection_reason, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5227 (class 0 OID 16657)
-- Dependencies: 228
-- Data for Name: loan_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_applications (id, first_name, last_name, email, phone, gender, dob, amount, address, employment_status, employer_name, job_title, employment_address, nok_first_name, nok_last_name, nok_email, nok_phone, nok_relationship, bvn, nin, verification_document, guarantor_first_name, guarantor_last_name, guarantor_email, guarantor_phone, guarantor_occupation, guarantor_office_address, guarantor_home_address, status, created_at, updated_at, loan_application_id, user_id) FROM stdin;
\.


--
-- TOC entry 5228 (class 0 OID 16685)
-- Dependencies: 229
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs (id, user_id, action, type, description, details, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5229 (class 0 OID 16707)
-- Dependencies: 230
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, recipient_id, content, file_url, status, created_at, updated_at, deleted_at, conversation_id, message_id, user_id) FROM stdin;
\.


--
-- TOC entry 5230 (class 0 OID 16730)
-- Dependencies: 231
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, message, is_read, user_id, ticket_id, created_at, updated_at, notification_id) FROM stdin;
\.


--
-- TOC entry 5231 (class 0 OID 16741)
-- Dependencies: 232
-- Data for Name: passwords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.passwords (id, password, created_at, updated_at, deleted_at, user_id) FROM stdin;
1f3705c6-13b0-44f1-8508-40d5231a743d	$2a$10$XlPPhlVGIRpQZ7Z11AvjEeKkjUOnQq/Y2UKCiJ078o.vurksGop7G	2025-02-26 11:53:40.029+01	2025-02-26 11:53:40.029+01	\N	0d9734bf-0f75-4ebd-80f4-47c509415d3d
32eeb042-af0d-4bde-aa57-ec244dce34e0	$2a$10$XlPPhlVGIRpQZ7Z11AvjEeKkjUOnQq/Y2UKCiJ078o.vurksGop7G	2025-02-26 11:53:40.029+01	2025-02-26 11:53:40.029+01	\N	02b1a3d0-39d2-42af-8dfe-183064a1c490
\.


--
-- TOC entry 5233 (class 0 OID 16803)
-- Dependencies: 234
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, method, gateway, total, status, currency, extra, created_at, updated_at, deleted_at, transaction_id) FROM stdin;
\.


--
-- TOC entry 5234 (class 0 OID 16815)
-- Dependencies: 235
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, created_at, updated_at, deleted_at) FROM stdin;
d9943632-1b72-4756-b321-c54e3729d070	create_user	2025-02-26 11:20:16.169+01	2025-02-26 11:20:16.169+01	\N
aecc546f-2399-4159-9571-20d4c685d5e3	update_user	2025-02-26 11:20:16.169+01	2025-02-26 11:20:16.169+01	\N
57717e2a-c842-4cf6-bfe8-2b5a4caa40b1	delete_user	2025-02-26 11:20:16.169+01	2025-02-26 11:20:16.169+01	\N
7084d7f9-41f1-4573-b65b-fd65c2ddcc6e	read_user	2025-02-26 11:20:16.169+01	2025-02-26 11:20:16.169+01	\N
\.


--
-- TOC entry 5235 (class 0 OID 16829)
-- Dependencies: 236
-- Data for Name: rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rates (id, currency_pair, rate, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5237 (class 0 OID 16842)
-- Dependencies: 238
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, role_id, permission_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5236 (class 0 OID 16835)
-- Dependencies: 237
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, created_at, updated_at, deleted_at) FROM stdin;
bc681d00-7a23-4399-af62-7a475dbe7ea1	SuperAdmin	2025-02-26 11:20:16.191+01	2025-02-26 11:20:16.191+01	\N
95d721da-e165-4df4-9af5-5300ca081846	Admin	2025-02-26 11:20:16.191+01	2025-02-26 11:20:16.191+01	\N
79bf6a1a-caac-4b68-811b-a19e70ac2bb8	EndUser	2025-02-26 11:20:16.191+01	2025-02-26 11:20:16.191+01	\N
\.


--
-- TOC entry 5238 (class 0 OID 16867)
-- Dependencies: 239
-- Data for Name: sub_wallets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_wallets (id, name, type, balance, currency, created_at, updated_at, deleted_at, subwallet_id, wallet_id) FROM stdin;
\.


--
-- TOC entry 5239 (class 0 OID 16893)
-- Dependencies: 240
-- Data for Name: subscription_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plan (id, currency, name, "interval", amount, code, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5240 (class 0 OID 16913)
-- Dependencies: 241
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, currency, name, "interval", amount, code, status, created_at, updated_at, deleted_at, wallet_id, subscription_id, subscription_plan_id) FROM stdin;
\.


--
-- TOC entry 5241 (class 0 OID 16943)
-- Dependencies: 242
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tickets (id, title, description, status, user_id, created_at, updated_at, ticket_id) FROM stdin;
\.


--
-- TOC entry 5232 (class 0 OID 16771)
-- Dependencies: 233
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, amount, currency, reference, code, type, class, status, description, meta_data, created_at, updated_at, deleted_at, category_id, group_id, transaction_id, wallet_id) FROM stdin;
7fba9159-18f3-478f-9dab-bf3f6f6f9d2c	50000.00	NGN	s5tbmqv1e3	qg35ojnx63cc0rb	credit	transaction	pending	entrance fee	{"from":{"senderid":null,"senderName":"Nnebuchi Osigbo"},"to":{"receiverId":null,"receiverName":"root"},"bank":{"name":null}}	2025-03-01 20:17:24.477+01	2025-03-01 20:17:29.903+01	\N	\N	5d97da4e-d11f-47cf-b776-a5a0a5526eac	\N	0acc1a0e-0ac6-4126-b2ec-8056afca2403
3eeb3737-7c32-4181-9b39-4d9a978b8107	50000.00	NGN	fo0aptgai3	78fduuztrbcgbqy	credit	transaction	pending	entrance fee	{"from":{"senderid":null,"senderName":"Nnebuchi Osigbo"},"to":{"receiverId":null,"receiverName":"root"},"bank":{"name":null}}	2025-03-01 20:22:09.461+01	2025-03-01 20:22:13.121+01	\N	\N	5d97da4e-d11f-47cf-b776-a5a0a5526eac	\N	0acc1a0e-0ac6-4126-b2ec-8056afca2403
\.


--
-- TOC entry 5242 (class 0 OID 16969)
-- Dependencies: 243
-- Data for Name: user_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_applications (id, first_name, last_name, email, phone, "group", password, is_verified, referral_code, unique_string, otp, otp_expiry, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5243 (class 0 OID 16978)
-- Dependencies: 244
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, user_id, permission_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5244 (class 0 OID 16995)
-- Dependencies: 245
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, role_id, created_at, updated_at, deleted_at) FROM stdin;
83f76799-f790-4b74-bd22-66892b2d63ef	0d9734bf-0f75-4ebd-80f4-47c509415d3d	79bf6a1a-caac-4b68-811b-a19e70ac2bb8	2025-02-26 11:53:40.001+01	2025-02-26 11:53:40.001+01	\N
47d05491-2e6f-4ad2-8836-f00fd01553bc	02b1a3d0-39d2-42af-8dfe-183064a1c490	bc681d00-7a23-4399-af62-7a475dbe7ea1	2025-02-26 11:53:40.001+01	2025-02-26 11:53:40.001+01	\N
\.


--
-- TOC entry 5217 (class 0 OID 16435)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, address, country, state, gender, phone, kyc_status, is_activated, is_verified, profile_image, referral_code, unique_string, otp, otp_expiry, loan_balance, loan_status, loan_application_id, wallet_id, created_at, updated_at, deleted_at, group_id) FROM stdin;
0d9734bf-0f75-4ebd-80f4-47c509415d3d	buchess	johnson	nnebuchiosigbo340@gmail.com	\N	\N	\N	\N	9047254936	pending	t	f	\N	\N	3774810	\N	\N	0.00	inactive	\N	\N	2025-02-26 11:53:39.974+01	2025-02-26 11:53:39.974+01	\N	\N
02b1a3d0-39d2-42af-8dfe-183064a1c490	Admin	Buchi	admin@gmail.com	\N	\N	\N	\N	\N	pending	t	t	\N	\N	3774811	\N	\N	0.00	inactive	\N	\N	2025-02-26 11:53:39.974+01	2025-02-26 11:53:39.974+01	\N	\N
\.


--
-- TOC entry 5224 (class 0 OID 16557)
-- Dependencies: 225
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallets (id, balance, currency, reference, type, pin, is_active, created_at, updated_at, deleted_at, group_id, user_id, wallet_id) FROM stdin;
0acc1a0e-0ac6-4126-b2ec-8056afca2403	0.00	NGN	\N	typeA	\N	t	2025-02-26 11:53:40.173+01	2025-02-26 11:53:40.173+01	\N	5d97da4e-d11f-47cf-b776-a5a0a5526eac	0d9734bf-0f75-4ebd-80f4-47c509415d3d	\N
\.


--
-- TOC entry 5245 (class 0 OID 17019)
-- Dependencies: 246
-- Data for Name: withdraw_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.withdraw_requests (id, amount, reason, status, created_at, updated_at, user_id, withdraw_request_id) FROM stdin;
\.


--
-- TOC entry 4961 (class 2606 OID 16460)
-- Name: beneficiaries beneficiaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beneficiaries
    ADD CONSTRAINT beneficiaries_pkey PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 16496)
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 16481)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 16528)
-- Name: chatroom_users chatroom_users_chatroom_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatroom_users
    ADD CONSTRAINT chatroom_users_chatroom_id_user_id_key UNIQUE (chatroom_id, user_id);


--
-- TOC entry 4971 (class 2606 OID 16526)
-- Name: chatroom_users chatroom_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatroom_users
    ADD CONSTRAINT chatroom_users_pkey PRIMARY KEY (id);


--
-- TOC entry 4967 (class 2606 OID 16521)
-- Name: chatrooms chatrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatrooms
    ADD CONSTRAINT chatrooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 16545)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 16610)
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 16418)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 16636)
-- Name: kyc_records kyc_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_records
    ADD CONSTRAINT kyc_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 16664)
-- Name: loan_applications loan_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_applications
    ADD CONSTRAINT loan_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 16694)
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 16714)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 16735)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 16745)
-- Name: passwords passwords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passwords
    ADD CONSTRAINT passwords_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 16809)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 16821)
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- TOC entry 4997 (class 2606 OID 16819)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 16834)
-- Name: rates rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 16848)
-- Name: role_permissions role_permissions_permission_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_role_id_key UNIQUE (permission_id, role_id);


--
-- TOC entry 5007 (class 2606 OID 16846)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 16841)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 5003 (class 2606 OID 16839)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5009 (class 2606 OID 16876)
-- Name: sub_wallets sub_wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_wallets
    ADD CONSTRAINT sub_wallets_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 16901)
-- Name: subscription_plan subscription_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plan
    ADD CONSTRAINT subscription_plan_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 16920)
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 5015 (class 2606 OID 16950)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 16782)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 16977)
-- Name: user_applications user_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_applications
    ADD CONSTRAINT user_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 16984)
-- Name: user_permissions user_permissions_permission_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_permission_id_user_id_key UNIQUE (permission_id, user_id);


--
-- TOC entry 5021 (class 2606 OID 16982)
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5023 (class 2606 OID 16999)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 17001)
-- Name: user_roles user_roles_role_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_user_id_key UNIQUE (role_id, user_id);


--
-- TOC entry 4957 (class 2606 OID 16448)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4959 (class 2606 OID 16446)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 16567)
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- TOC entry 5027 (class 2606 OID 17024)
-- Name: withdraw_requests withdraw_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdraw_requests
    ADD CONSTRAINT withdraw_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 16466)
-- Name: beneficiaries beneficiaries_beneficiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beneficiaries
    ADD CONSTRAINT beneficiaries_beneficiary_id_fkey FOREIGN KEY (beneficiary_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5030 (class 2606 OID 16461)
-- Name: beneficiaries beneficiaries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beneficiaries
    ADD CONSTRAINT beneficiaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5031 (class 2606 OID 16507)
-- Name: budgets budgets_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 16502)
-- Name: budgets budgets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 16497)
-- Name: budgets budgets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5034 (class 2606 OID 16534)
-- Name: chatroom_users chatroom_users_chatroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatroom_users
    ADD CONSTRAINT chatroom_users_chatroom_id_fkey FOREIGN KEY (chatroom_id) REFERENCES public.chatrooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5035 (class 2606 OID 16529)
-- Name: chatroom_users chatroom_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatroom_users
    ADD CONSTRAINT chatroom_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5036 (class 2606 OID 16546)
-- Name: conversations conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 16611)
-- Name: fees fees_fees_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_fees_id_fkey FOREIGN KEY (fees_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5041 (class 2606 OID 16616)
-- Name: fees fees_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5042 (class 2606 OID 16637)
-- Name: kyc_records kyc_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_records
    ADD CONSTRAINT kyc_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 16665)
-- Name: loan_applications loan_applications_loan_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_applications
    ADD CONSTRAINT loan_applications_loan_application_id_fkey FOREIGN KEY (loan_application_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5044 (class 2606 OID 16670)
-- Name: loan_applications loan_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_applications
    ADD CONSTRAINT loan_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5045 (class 2606 OID 16695)
-- Name: logs logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5046 (class 2606 OID 16715)
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5047 (class 2606 OID 16720)
-- Name: messages messages_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5048 (class 2606 OID 16725)
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5049 (class 2606 OID 16736)
-- Name: notifications notifications_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5050 (class 2606 OID 16746)
-- Name: passwords passwords_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passwords
    ADD CONSTRAINT passwords_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5055 (class 2606 OID 16810)
-- Name: payments payments_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 16854)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 16849)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5058 (class 2606 OID 16877)
-- Name: sub_wallets sub_wallets_subwallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_wallets
    ADD CONSTRAINT sub_wallets_subwallet_id_fkey FOREIGN KEY (subwallet_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5059 (class 2606 OID 16882)
-- Name: sub_wallets sub_wallets_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_wallets
    ADD CONSTRAINT sub_wallets_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5060 (class 2606 OID 16926)
-- Name: subscriptions subscriptions_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5061 (class 2606 OID 16931)
-- Name: subscriptions subscriptions_subscription_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_subscription_plan_id_fkey FOREIGN KEY (subscription_plan_id) REFERENCES public.subscription_plan(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5062 (class 2606 OID 16921)
-- Name: subscriptions subscriptions_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5063 (class 2606 OID 16956)
-- Name: tickets tickets_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5064 (class 2606 OID 16951)
-- Name: tickets tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 16783)
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5052 (class 2606 OID 16788)
-- Name: transactions transactions_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 16793)
-- Name: transactions transactions_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 16798)
-- Name: transactions transactions_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5065 (class 2606 OID 16990)
-- Name: user_permissions user_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5066 (class 2606 OID 16985)
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 17007)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5068 (class 2606 OID 17002)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5028 (class 2606 OID 16449)
-- Name: users users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5037 (class 2606 OID 16568)
-- Name: wallets wallets_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5038 (class 2606 OID 16573)
-- Name: wallets wallets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 16578)
-- Name: wallets wallets_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 17025)
-- Name: withdraw_requests withdraw_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdraw_requests
    ADD CONSTRAINT withdraw_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5070 (class 2606 OID 17030)
-- Name: withdraw_requests withdraw_requests_withdraw_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdraw_requests
    ADD CONSTRAINT withdraw_requests_withdraw_request_id_fkey FOREIGN KEY (withdraw_request_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-03-02 19:34:22

--
-- PostgreSQL database dump complete
--


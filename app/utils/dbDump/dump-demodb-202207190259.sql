--
-- PostgreSQL database dump
--

-- Dumped from database version 12.11 (Ubuntu 12.11-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 14.2

-- Started on 2022-07-19 02:59:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 24638)
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    "First_name" character varying(255),
    "Last_name" character varying(255),
    "Phone_number" bigint,
    "Email_address" character varying(255),
    "Address" character varying(255),
    "Customerid" integer NOT NULL,
    recordstate boolean DEFAULT true,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24636)
-- Name: Customer_Customerid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Customer_Customerid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Customer_Customerid_seq" OWNER TO postgres;

--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 222
-- Name: Customer_Customerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Customer_Customerid_seq" OWNED BY public."Customer"."Customerid";


--
-- TOC entry 221 (class 1259 OID 24592)
-- Name: gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender (
    name character varying(255),
    genderid integer NOT NULL,
    recordstate boolean DEFAULT true,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.gender OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24590)
-- Name: gender_genderid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gender_genderid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gender_genderid_seq OWNER TO postgres;

--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 220
-- Name: gender_genderid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gender_genderid_seq OWNED BY public.gender.genderid;


--
-- TOC entry 208 (class 1259 OID 16414)
-- Name: inventories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventories (
    firstname character varying(255),
    lastname character varying(255),
    age integer,
    phone bigint,
    modnameid integer[],
    inventoriesid integer NOT NULL,
    recordstate boolean DEFAULT true,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.inventories OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16423)
-- Name: inventories_inventoriesid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventories_inventoriesid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventories_inventoriesid_seq OWNER TO postgres;

--
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 209
-- Name: inventories_inventoriesid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventories_inventoriesid_seq OWNED BY public.inventories.inventoriesid;


--
-- TOC entry 210 (class 1259 OID 16425)
-- Name: modname; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modname (
    mname character varying(255),
    recordstate boolean DEFAULT true,
    modnameid integer NOT NULL,
    created_date timestamp with time zone DEFAULT now() NOT NULL,
    updated_date timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.modname OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16431)
-- Name: modname_modnameid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modname_modnameid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modname_modnameid_seq OWNER TO postgres;

--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 211
-- Name: modname_modnameid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modname_modnameid_seq OWNED BY public.modname.modnameid;


--
-- TOC entry 212 (class 1259 OID 16433)
-- Name: mrole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mrole (
    roleid integer,
    modnameid integer,
    accesstype character varying(255),
    recordstate boolean DEFAULT true,
    mroleid integer NOT NULL,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.mrole OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16439)
-- Name: mrole_mroleid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mrole_mroleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mrole_mroleid_seq OWNER TO postgres;

--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 213
-- Name: mrole_mroleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mrole_mroleid_seq OWNED BY public.mrole.mroleid;


--
-- TOC entry 214 (class 1259 OID 16441)
-- Name: muser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.muser (
    email character varying(255),
    username character varying(255),
    password character varying(255),
    isactive boolean DEFAULT true,
    muserid integer NOT NULL,
    recordstate boolean DEFAULT true,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.muser OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16451)
-- Name: muser_muserid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.muser_muserid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.muser_muserid_seq OWNER TO postgres;

--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 215
-- Name: muser_muserid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.muser_muserid_seq OWNED BY public.muser.muserid;


--
-- TOC entry 225 (class 1259 OID 32894)
-- Name: orville; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orville (
    first_name character varying(255),
    last_name character varying(255),
    genderid integer,
    modnameid integer,
    orvilleid integer NOT NULL,
    recordstate boolean DEFAULT true,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.orville OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 32892)
-- Name: orville_orvilleid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orville_orvilleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orville_orvilleid_seq OWNER TO postgres;

--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 224
-- Name: orville_orvilleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orville_orvilleid_seq OWNED BY public.orville.orvilleid;


--
-- TOC entry 216 (class 1259 OID 16464)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    rolename character varying(255),
    roleid integer NOT NULL,
    recordstate character varying(255) DEFAULT 'active'::character varying
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16471)
-- Name: role_roleid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_roleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_roleid_seq OWNER TO postgres;

--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 217
-- Name: role_roleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_roleid_seq OWNED BY public.role.roleid;


--
-- TOC entry 218 (class 1259 OID 16473)
-- Name: userrolemapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userrolemapping (
    roleid integer,
    muserid integer,
    isactive boolean DEFAULT true,
    userrolemappingid integer NOT NULL,
    created_date timestamp with time zone DEFAULT now(),
    updated_date timestamp with time zone DEFAULT now() NOT NULL,
    recordstate boolean DEFAULT true
);


ALTER TABLE public.userrolemapping OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16480)
-- Name: userrolemapping_userrolemappingid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.userrolemapping_userrolemappingid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userrolemapping_userrolemappingid_seq OWNER TO postgres;

--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 219
-- Name: userrolemapping_userrolemappingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.userrolemapping_userrolemappingid_seq OWNED BY public.userrolemapping.userrolemappingid;


--
-- TOC entry 2894 (class 2604 OID 24641)
-- Name: Customer Customerid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN "Customerid" SET DEFAULT nextval('public."Customer_Customerid_seq"'::regclass);


--
-- TOC entry 2890 (class 2604 OID 24595)
-- Name: gender genderid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender ALTER COLUMN genderid SET DEFAULT nextval('public.gender_genderid_seq'::regclass);


--
-- TOC entry 2869 (class 2604 OID 16483)
-- Name: inventories inventoriesid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories ALTER COLUMN inventoriesid SET DEFAULT nextval('public.inventories_inventoriesid_seq'::regclass);


--
-- TOC entry 2873 (class 2604 OID 16484)
-- Name: modname modnameid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modname ALTER COLUMN modnameid SET DEFAULT nextval('public.modname_modnameid_seq'::regclass);


--
-- TOC entry 2877 (class 2604 OID 16485)
-- Name: mrole mroleid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mrole ALTER COLUMN mroleid SET DEFAULT nextval('public.mrole_mroleid_seq'::regclass);


--
-- TOC entry 2882 (class 2604 OID 16486)
-- Name: muser muserid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muser ALTER COLUMN muserid SET DEFAULT nextval('public.muser_muserid_seq'::regclass);


--
-- TOC entry 2898 (class 2604 OID 32897)
-- Name: orville orvilleid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orville ALTER COLUMN orvilleid SET DEFAULT nextval('public.orville_orvilleid_seq'::regclass);


--
-- TOC entry 2884 (class 2604 OID 16488)
-- Name: role roleid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN roleid SET DEFAULT nextval('public.role_roleid_seq'::regclass);


--
-- TOC entry 2889 (class 2604 OID 16489)
-- Name: userrolemapping userrolemappingid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userrolemapping ALTER COLUMN userrolemappingid SET DEFAULT nextval('public.userrolemapping_userrolemappingid_seq'::regclass);


--
-- TOC entry 3587 (class 0 OID 24638)
-- Dependencies: 223
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" ("First_name", "Last_name", "Phone_number", "Email_address", "Address", "Customerid", recordstate, created_date, updated_date) FROM stdin;
QoZDYCYuHkXfmglgkXbjGbvETMqZmkAwgsVzBlpwStbhQhbvXboEMtwpVOjEcOLhSymZvsCYGTyOGhCw	xJfbSMwmvnmNEhfSaJEpzEGYmzNbGDXIPMNHowtuzlIvqtOEnjpzarPniMwlhMdhxHPxCnGsXTDonjUt	8058000922	eg44f434@dbc454.com	GkBbPTlRFNzEgyOXppetfVRiHiInpjwECxUZBgzVlMHWKiTpyrTwHzMYpIVyegFEqBBVlDdvnOgWQWzszAEzyCLODLFhDXMFemgojiYSihEZMolZOoCZMDOaJBDkVAqMKsFpAitnTOHmoHGDcgyLxq	1	t	2022-06-28 05:51:56.528511+05:30	2022-06-28 05:51:56.528511+05:30
cxXXJsgNsZzaaWHYAOoZhDEIyUhvUwTYFZjPBINklEOOljGtSNcorwODcAOlXIUEEnoldkxmUXzrWnuV	FCUxLNCYcUrfflhawQFAgoeEmQxsCqUoOGjJUkUjVPUqSQhYZudedGXurhgwqJNwVavKDeophwluZmcf	3971603868	34f3e3d5db@gde34f4d.com	aCvaVhsAlWCyADPUDmakCbTNOxuGsXLGLHlawflxjMIuzoJPZfCUsmcTOvDfmeiuMdzLaqCmalCQwagAceFvKZiITwjNfwwbNmtLSfEYFDwNMTpioMUvQLNYUGHDuNdBGZpaqBETVUOcwbZgpmYyTe	2	t	2022-06-28 05:51:56.609404+05:30	2022-06-28 05:51:56.609404+05:30
aRvkflHvLlAcozSiIiJXoBNrgfvpXYLUpYkoyAxyVAOjeWddXshMqwHeYaaTNzqszpkjceIXrHqGgNcf	wAUfHHhnWnKDERUwgtfjtNFulJJcQgpgVMRWonJsMCYQWDIkLHAGsRQBPsqxoGDpMPTSOSWyAqOVODoR	8466288458	13e4de2c2@g454eb.com	DolXGEoPUYKaGHmWaytoIVvwkeuhrWsfsmrlvezfUDpGEjqRvghssXwjSRhtbhGmFwpWMZvEAZtHoFeJMhwCvFNALAqctQJRPFMinlkjdDSQhExIWXMeGZqVJiZPmRyWShPSUIoffBiFjLXtzgFPGS	3	t	2022-06-28 05:51:56.633308+05:30	2022-06-28 05:51:56.633308+05:30
AQQDAEEFaYYNfRaDeYjAAKYivEBxxfgWwHuCMwyMCsXKKLmvOOcQRcjBMztmARXNkReCyPOeblYgrmGk	XBkQZoWPaugVExgJTzpFPFOtZEBGIdmcCIUHxGcHYGJIITmaxBXcnfVggRMWuYBvMAclFfwiPYnsoGbt	602277277	2b3cb2edg@5bd3c545.com	gQgwagtwVVWcinZareZbIHngUrzjcDxjjObjbVWaKghYWkTmWeVHdrXrdYJtQLNZqcKrHBjYkIouPexZHkfmoqvDBQEVhfZUFBJUdYvqYFgghgOLhJczTeihuHtwiCvxBoKEKGqEStTxmtTXKiItkm	4	t	2022-06-28 05:51:57.888105+05:30	2022-06-28 05:51:57.888105+05:30
\.


--
-- TOC entry 3585 (class 0 OID 24592)
-- Dependencies: 221
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gender (name, genderid, recordstate, created_date, updated_date) FROM stdin;
GHsGSsmqduQrdLuCXWUQMOFWayUFHrllLxzpepjTZvKKzNtbpRMsWULdSOIbsDjrzfeWNAprKzMdrHgq	343	t	2022-06-30 22:33:31.953831+05:30	2022-06-30 22:33:31.953831+05:30
cBtlPOIbyIQATAULXRgjtnsjXpmtBCcmfJmboamqJBMmnwMtnuZLlroZCnzexldDNyZAxYUULvAwKjTR	344	t	2022-06-30 22:33:32.059667+05:30	2022-06-30 22:33:32.059667+05:30
YzJGFCrtoKRFZDLxzXGMQGMsapitSxjEwUZjXNbQLupQmBUgnzOMMIpvnCXzPqCrieIHqlAyDgqUrgAs	345	t	2022-06-30 22:33:32.120193+05:30	2022-06-30 22:33:32.120193+05:30
pksTbplLrJpdqopUuFDOdlzTGLAZwaayxjHDRhZCpjFcOMvBidUYDftUvdxUjKFyEvqYWExUlBKqXnXx	346	t	2022-06-30 22:36:24.241083+05:30	2022-06-30 22:36:24.241083+05:30
CYOzbZnKZukzcgyaQiqTWkwacAdfYVWJEGuPWPWaEiJKhmustMLmAPXUKbtsiFdvqmInHWwaeKwvhnEr	347	t	2022-06-30 22:36:24.368858+05:30	2022-06-30 22:36:24.368858+05:30
QHqOWFKuainGYOQBFyTIUkIareUDuoHxmRLbjSuXVlufXyOTWaEEkTGpKfNvmlEjHJfvumuxCjOXcoPs	348	t	2022-06-30 22:36:24.442714+05:30	2022-06-30 22:36:24.442714+05:30
kWqdhnIcRhPdYwlVXJAbRsKQVPtpUoSiDVGaOqqkXyPEqxBTRsJzvUfxdEOutoPqeYGrJZfkrpJaQMJr	349	t	2022-06-30 22:37:44.279993+05:30	2022-06-30 22:37:44.279993+05:30
XZqACQEmIuXpMySePcKcnjsLpbjzUvAFrDrbtcXuLUjcUXIHWxlumAjKysBUGFaFZPmxlcTAriSsvAGB	350	t	2022-06-30 22:37:44.347675+05:30	2022-06-30 22:37:44.347675+05:30
iBFlLlGcguCABoHbwVhTfWfktqWkFKFjnkPAHvaImJtZbBTfDenQAzirNrODKoKVtJwxeIokOkwyJdfi	351	t	2022-06-30 22:37:44.381854+05:30	2022-06-30 22:37:44.381854+05:30
ULUhMXOaysBkCSlyGEcHEpUEGCALdLsOdyeXAIkwAKIXPGFdqXjZjNTaAbyoDhdHvtgztDJXltrVhWwW	352	t	2022-06-30 22:51:57.805967+05:30	2022-06-30 22:51:57.805967+05:30
CGwLVzLzfXCWvhjgwFcLSQNXNVZcyjMAjTjUGkfZWAXDlKRAcVCDHuWaNUibpwIUDrtYYRYUPKSObNFB	353	t	2022-06-30 22:51:57.91324+05:30	2022-06-30 22:51:57.91324+05:30
ZaxxzosvCKGSdTkfdokDgowKbuMGepfpluOLyYUYlDSxLLWGikPFYaAoDEdBXBIZyYbpVgKFBtQSWvpi	354	t	2022-06-30 22:51:57.946086+05:30	2022-06-30 22:51:57.946086+05:30
vcoPfhBCtTQQPhmqvhhbpsBjpVquORlftnDmrhSmuAtqsbETJRajJdInrZTNjDiLNSFBBSpSjAgKDktZ	355	t	2022-06-30 22:53:30.082765+05:30	2022-06-30 22:53:30.082765+05:30
qTfojERJgNxRYYzmQLYtkRDVQZrBGHEsVIfyUHZoPGjusJmxFLRIZOrsOnXDgehmuFYHescytYohXizz	356	t	2022-06-30 22:53:30.286049+05:30	2022-06-30 22:53:30.286049+05:30
QjHpDTQYfuuDgakMWYmYquDRHpGhjlFugsxjvavdyZkiPwaeDzRpMIZXdxiWOxOExRACkegpVNjARssH	357	t	2022-06-30 22:53:30.363753+05:30	2022-06-30 22:53:30.363753+05:30
WZzADaRApMSwYPXNtHYOKakUsKmNXJrBBAwcJEjBntDsogJwGJHbdhhTGpBVAtJicTHHEzGwQDPPrMKU	358	t	2022-06-30 22:55:10.843+05:30	2022-06-30 22:55:10.843+05:30
ZwXGlmeBBXqctXkVApQYJCjawHrZhDUsQqimuVQlWGtrFQVylUyJRQxuXwBbGJfVEnvglacnjxWaLGIS	359	t	2022-06-30 22:55:10.942031+05:30	2022-06-30 22:55:10.942031+05:30
bDoySAYzcMtdINFMfAQTwqpCklksUyxSFdzidtnCJMSoQFgKUoOtZUXRyidwwJyPXTMAeWNgvAGmydCz	360	t	2022-06-30 22:55:10.970986+05:30	2022-06-30 22:55:10.970986+05:30
gowtdJtDdzFcONclClHwgogDtGlHtuXjTeTxxCeKneXKxNLmyQnrUIgKLUdCkIUVApvPnwFHprbaKJLJ	361	t	2022-06-30 23:03:12.451533+05:30	2022-06-30 23:03:12.451533+05:30
tcbZpYNSDhWuLNUxDXZzSFcSIuPljTPixXAcnVdcMyuZBmgLItBHITeVAgIKDBzCFEWNWjrhqdlmfbte	362	t	2022-06-30 23:03:12.618193+05:30	2022-06-30 23:03:12.618193+05:30
yJxZlVXlsyIPjSwWFTYYjCQzTIwMaQXzRhrqXIMyauYCCInyWfnDbGXYaFHTKRWwnDUHqeTnEJANyWzk	363	t	2022-06-30 23:03:12.653367+05:30	2022-06-30 23:03:12.653367+05:30
tCtvLoCnlEBzNmKEXdCgcjzfEHaKIPbINpDwulqaEBKZbpqFoTCVfUWuASBRilaTkUPGKPhbXCYZPVeE	364	t	2022-06-30 23:05:59.841684+05:30	2022-06-30 23:05:59.841684+05:30
UkzNvBEwjwiERcYcEHutPlNluIYiTlCgMTTWjghyFwmRxrkfpoEDPUzOAEqWuowUcsKoWrQPvICNDuFz	365	t	2022-06-30 23:05:59.999879+05:30	2022-06-30 23:05:59.999879+05:30
CPYqhkFOeBALaxSSLKWmkNSYAIcgMSViPQpnaTAUTwzVmmGRTKiLEsPNhqkJCuXQUByFyVAiFmzylOON	366	t	2022-06-30 23:06:00.035687+05:30	2022-06-30 23:06:00.035687+05:30
QSNmpflPdOtLHEaWftZlYDAOvyfwilqHpLfNEJKehYrlDPlXsXfsfVGcEzcOlkSUEBcXIDNZbGYPamag	367	t	2022-06-30 23:08:29.852401+05:30	2022-06-30 23:08:29.852401+05:30
CExPYVENZXpbyegnIrOzTRJRVGqhaVmTpZseULtRzDTvIWXFtkDlUnogVRFbkhDCpqgLsSObBMGkQNoX	368	t	2022-06-30 23:08:29.911038+05:30	2022-06-30 23:08:29.911038+05:30
NinUFCttiNeUfGCgxmoBshCjnZsrfTreEOPDhRLGLqiZutFwHFHFEwQxSNFBBxiPfiIDFisGYJhfeUpi	369	t	2022-06-30 23:08:29.944725+05:30	2022-06-30 23:08:29.944725+05:30
seQlAoFnIWlAYZCidhpNQNwSXzbMEGhhLtLtCYxUDQYgoZggYjnNBGBtkgEpfevPpNPGDnkeiyXENKHp	370	t	2022-06-30 23:09:03.084009+05:30	2022-06-30 23:09:03.084009+05:30
sARANUIlguZIaAfvTlMVbpIHCavKeTucMAhhCsdADhzVVeZmzmuGJwYIMmPeEQovVsmzizDtgczHqZsG	371	t	2022-06-30 23:09:03.157848+05:30	2022-06-30 23:09:03.157848+05:30
zaMQftKWjmJfGtIWnUeuxlHzwXMDGKeOdkmSwxdbMAiOqPCqaPhKTNTmTBnLOKlVnZYQTSXfGTnwjsdy	372	t	2022-06-30 23:09:03.198498+05:30	2022-06-30 23:09:03.198498+05:30
gCgFAmhOTxdVQHrUBesHzsqHVYkxJadsmZeyZRTiTMZpSsGjkMGpmwxwTWSXREhDHiSGziydtNueqnyP	373	t	2022-06-30 23:09:33.939969+05:30	2022-06-30 23:09:33.939969+05:30
YaLhljmsWjHCtFQgrLhkNuHjYpzdIioWfOolWTQPdseKNKToMybepZCoOwLLximsyowsMUJiSqqaqEeF	374	t	2022-06-30 23:09:33.993375+05:30	2022-06-30 23:09:33.993375+05:30
YNdAidUqvfjWVUWqmWShRaNOsQyVUDgtFBfPJpwFJHjgGJRrLSIpEnaHhkKmmDeUfmBMKoTQCtOvAfzF	375	t	2022-06-30 23:09:34.043857+05:30	2022-06-30 23:09:34.043857+05:30
dXhKtTDtXZChstIZXfglLicCRmqKrqUPCbnHXFkEdeOVCsNhqXwerXuVvUwtKtSWnObvSSLpoTVWXkJh	376	t	2022-06-30 23:10:54.727126+05:30	2022-06-30 23:10:54.727126+05:30
yIXjlVwZImAsJrGmJkLKqPdMjSyvpMPUkSudpdkOwMwRWOenqUPacyReezuXQFfSmcAWIOXvUOFsefjz	377	t	2022-06-30 23:10:54.863172+05:30	2022-06-30 23:10:54.863172+05:30
ifDCkvnNBJjQUoBpAKnWxDtnnhQjflibqpHjGGIXKytlJltMzLnJXurAxIEhYWqFhBrwRgmxObkOkTPz	378	t	2022-06-30 23:10:54.895351+05:30	2022-06-30 23:10:54.895351+05:30
ZnxWBZoYXTazQsozQYjNyLGNQZtTlNrsBkclPNbNyfusgbMiqLcnMONRZSMTJUwwEMArnEFVenYessbg	379	t	2022-06-30 23:13:55.523813+05:30	2022-06-30 23:13:55.523813+05:30
sgvXXuoEemGMpuGWZicCvNnfYmmJAwdjNfMDYLFpGcmLzYfDZurJAurDNPPzWsolfIxwfzsgJlyLYsAT	380	t	2022-06-30 23:13:55.6401+05:30	2022-06-30 23:13:55.6401+05:30
aJxyUPpcOqwYMKWdpdBEuQIcXfzcyQzCqsprRfoTiGFJTjNrLIjLsGEiBBROrvJsbgEyOJLiauDLMpeK	381	t	2022-06-30 23:13:55.672812+05:30	2022-06-30 23:13:55.672812+05:30
mgdvetvrUWKuepRSzhUZaVbzSGFXpPMjakCbqFQvhefrIqHGYDicKJyuCAoBWEvuUayCortNBOuYJyjS	382	t	2022-06-30 23:18:15.396029+05:30	2022-06-30 23:18:15.396029+05:30
gZmgSRtUnKItNWEkovQmvqFTzqbJbKMUDBqjFMkiQtCUHhsufokvoGAJkaEFjwFCsXfEOzkLawnZVVIR	383	t	2022-06-30 23:18:15.513644+05:30	2022-06-30 23:18:15.513644+05:30
gwGihVYRfhPnIUTLGrLeVghFZPdcYBuuVEHviJqiuzucxfWzXCfbXsfcguAyljzdKtKfhlGdqCtGzytD	384	t	2022-06-30 23:18:15.546343+05:30	2022-06-30 23:18:15.546343+05:30
GUTRigiNNbZOuWGAOmogaxKLgDiUFLmJrkyPKqxgKdmwexuWPCdTtfKXsxXFUjJBZcAjxTziFuCXQhDV	385	t	2022-06-30 23:20:31.762594+05:30	2022-06-30 23:20:31.762594+05:30
oefPEgKqYqKnLLVnvpSNEtkvVOanxwHDoAaygIijnvVcNsSnobqBnrtIYmbuXMGIezJYAsGLlSVPDOGH	386	t	2022-06-30 23:20:31.856255+05:30	2022-06-30 23:20:31.856255+05:30
lPPVsoKRIcqTPNRzXkkjbRiYLgyahXgGVTYqOOQFQeagZswKcACTlTTPAhBzCAhLBLRaUzlGDKFQfPuc	387	t	2022-06-30 23:20:31.895497+05:30	2022-06-30 23:20:31.895497+05:30
gZwbgMyveOYCtCIoichLUaPAeFVIXJJdTSkWGDDWYaYzxvRZASHqZhPZuaWLyerYJbrvBojNsWTBAvrX	388	t	2022-06-30 23:21:39.762907+05:30	2022-06-30 23:21:39.762907+05:30
MXbPzwOqUjvGDTtoivRaXQXiFRpcvaGYaLCwzHtpGcnRYzpxViqiEMhisiqiKqvPhTnlHUuBspffoDtt	389	t	2022-06-30 23:21:39.834982+05:30	2022-06-30 23:21:39.834982+05:30
DSkfmXTOWTVskfmiwXcoiVliLXcopbIiIkanNROBFEUScnnZUcfxwZywhHoTzwXJXQLCpZwntOOMFoom	390	t	2022-06-30 23:21:39.867734+05:30	2022-06-30 23:21:39.867734+05:30
OhAneblhzvkyIzcazwzJNPHRUJTeBjevIFRXsjoWxrjCKdBWjHSumjXCeTLuPBRVeAUOftYPdPWvrNOZ	391	t	2022-06-30 23:24:12.862903+05:30	2022-06-30 23:24:12.862903+05:30
foHWyZmNGeCUaQzvkSxhoOwRbwgbkvxqKrrynUbSxndjceSJuLEjRPMMnSGuzhMFMVLMMGoKByyQmlWl	392	t	2022-06-30 23:24:12.923825+05:30	2022-06-30 23:24:12.923825+05:30
xMixewvjAkncGfoMSzXTGNJVFJmzNprsHoJEiErXBnxUYDfJGDWHUXtCUpTawIFtUteZshQdBbFwAuBL	393	t	2022-06-30 23:24:12.971158+05:30	2022-06-30 23:24:12.971158+05:30
ruIOprxUxXzeQOiSoRTqkxlYZboasDLGsWZoKxCGEKzEKfMUVXWFiXcSjvngaWzxUnZCtNPDVNLBKeIF	394	t	2022-06-30 23:25:32.045705+05:30	2022-06-30 23:25:32.045705+05:30
fIWVYCbNBFVpajRJiQCgmeIiYUtARtBsCtnFIsDtDsrXVptwHhWrEfAzmnvwNWMklxCreKLdZWEuaDOy	395	t	2022-06-30 23:25:32.124211+05:30	2022-06-30 23:25:32.124211+05:30
PlsNPVixAaePccOZlEzKVxjsBKNmhoFCYGDiLjZVvzLBvVJnZrAmVaDCcIgATJSYdhlqaZUmfKsyoPlY	396	t	2022-06-30 23:25:32.153536+05:30	2022-06-30 23:25:32.153536+05:30
qFbkUVLtNdnYrIskpCJMSxXwHqtbGaFsHxFmIvuEVqclQBJeXLOUAjQAVVZBIOyikJtdeJnfFuGrwZih	397	t	2022-06-30 23:28:16.021708+05:30	2022-06-30 23:28:16.021708+05:30
CHGShvnMNtmOmMeqpUkWmHXFKRiPqPgIdzDavvuhSCYUPJUwpqeWzCpEnnyVPJnaUvtkPNVOhSFfdRHv	398	t	2022-06-30 23:28:16.120663+05:30	2022-06-30 23:28:16.120663+05:30
eoElLqhrVYjMqyzhxWMTqMJqKhudRSNOHTgJKAcgOjIMeDKznLXhXMacmWeMJKErrViwhrISqNMQrtgk	399	t	2022-06-30 23:28:16.168524+05:30	2022-06-30 23:28:16.168524+05:30
JarpFpRlZXOblUZbiXbnSeVKZwwsLPivshbxkbRlEuOvJQvPKqAIiKzfJHTLuwXHweZutGvRAibVESef	400	t	2022-06-30 23:31:41.220549+05:30	2022-06-30 23:31:41.220549+05:30
pzcMqdwrMSvLGnNfBDFaiEGhzhqYBPYBxCJRjsKNHUxGCxYorcDZwdrOsRxYRuXbSniAsKHeyLqHNTdo	401	t	2022-06-30 23:31:41.290336+05:30	2022-06-30 23:31:41.290336+05:30
TpQEoJcoHWSyrJzBhjwpcJzpjofEBLooBcyjujoyMAjOegOepuscccoBNmfRKICVnojIhACIRCCOnanz	402	t	2022-06-30 23:31:41.357094+05:30	2022-06-30 23:31:41.357094+05:30
CdZnPlAOTxGkrrtVwYbtBRFMsqCuUWRVGXDEIkPpetXLHPsOwPMahRUvDHLUBnuSqIywRvUVccrLiomt	403	t	2022-06-30 23:40:03.620991+05:30	2022-06-30 23:40:03.620991+05:30
eGVkaOdmQLqLbDFtAYPGZoqgxxZWugQmDTdhMxgzvLCDpDcDtxbZOcdqbscBZLSNdFeSgsysfKqfDlUO	404	t	2022-06-30 23:40:03.772094+05:30	2022-06-30 23:40:03.772094+05:30
okzGpEkKiaLfUqZNyFRYfsboJerYYEgzsabhPOrozwTnLqDfeKDxHCjMucTSjgOkVHkLJqWfdRwgREvk	405	t	2022-06-30 23:40:03.818205+05:30	2022-06-30 23:40:03.818205+05:30
ZgNKyiqBpPMUoKfIaXrAuFqhoNqDmuDiqTPPuNXSGOMjRBFFiLaFMsusrfQkPnGecjQWwnTjtYEJKotP	406	t	2022-06-30 23:40:49.834809+05:30	2022-06-30 23:40:49.834809+05:30
bJFWWIIbuYWWhlVQFUPNXdgvnbSwKVdDaDcyGjmIdKmoljIEVBdxLITwuWDTAtxLQKlcLTypanMUinMc	407	t	2022-06-30 23:40:49.917179+05:30	2022-06-30 23:40:49.917179+05:30
UeozwbzKmeeNpqAFCHbIaladxhzmUaoviEjNBJOYCBcnfPAVrWdSQJaFZtgHKUWBWqiUnqmwxlqhEPtf	408	t	2022-06-30 23:40:49.954865+05:30	2022-06-30 23:40:49.954865+05:30
SSJCCWdJJDAGYiONCVDxFiZRuWBRYaHOpYPlvlIKKaEBAlwPYddhjozXFTdOvMfiPcsTelzLbLTQWJJK	409	t	2022-06-30 23:46:44.615721+05:30	2022-06-30 23:46:44.615721+05:30
gfUfOCYGeFfbAXFXfdGqczHGGBnwFvUpbcOHcpVdvCwUNSbOFNizbpYsDMKGtcXMNGFxMTkpnitiOEPM	410	t	2022-06-30 23:46:44.728844+05:30	2022-06-30 23:46:44.728844+05:30
KzGhLGMGquhmDpamgeiAGdrolqceTXxPLjdkxXGpsLqNyYLogtpUsmOdgftDCdypZHSTQKJlaSMJgRtG	411	t	2022-06-30 23:46:44.778078+05:30	2022-06-30 23:46:44.778078+05:30
UGodTStniWTLfTBICgwyVQFhxuIdzehOuKkmEHglubasogIPooVGACvovhqMuVStXvfNtCkasIYSIMGJ	412	t	2022-06-30 23:47:26.799039+05:30	2022-06-30 23:47:26.799039+05:30
OonZMBouviSiBxLoKgUPhFqLCvFElyonKRANyDDbjctclgMimjHowtcdPzptLVOLbHrCeEwWxeIaOPAk	413	t	2022-06-30 23:47:26.926811+05:30	2022-06-30 23:47:26.926811+05:30
mwnpBYkkJUEbFxQzVzcZkXPAMlgLXEXFOEGFSMMtClRPRtjWsjeIlBvONRjUMPVbkIEPngvKUNstUCyF	414	t	2022-06-30 23:47:26.951812+05:30	2022-06-30 23:47:26.951812+05:30
TNLGrgJCNJbuMHyJutrrSHEkAgdYPACSxPDjuswcENWRtAHNblMyiOaavRAYUIAnemHqazqXXleSRJjW	415	t	2022-07-01 00:07:09.871847+05:30	2022-07-01 00:07:09.871847+05:30
NSEKfRoYctWhHKvjDMwvWseJGJsyrxojbiIUKUTfjPLPhmYXXxFrRdwpTCsTGyldGMUGMGxIYDVlJLuq	416	t	2022-07-01 00:07:09.998954+05:30	2022-07-01 00:07:09.998954+05:30
fLmBKFgYUQtOGbPTfpdZoAaYAfexPiCCqCWQYifnymFhKhFraAmKaugdfabpZSLWgmbiiDBrvbdUmcXj	417	t	2022-07-01 00:07:10.031451+05:30	2022-07-01 00:07:10.031451+05:30
rPyFbgbKaHtNUwpBbbFuBGPMgCIDPXIgLijWnVWyHvqsLIICjVQLoGUWuSTIWQrMwnLXBqWRqohKmipe	418	t	2022-07-01 01:21:08.260465+05:30	2022-07-01 01:21:08.260465+05:30
oEMRsfsunMcirtWoCYjpIdEiHSySdlCKZodKlhMWVZwoRTFXPcLHFyCmeLwBwJhZZzSAhEvnvzMNZrsC	419	t	2022-07-01 01:21:08.441907+05:30	2022-07-01 01:21:08.441907+05:30
PTCFNSALRNYAtimRAlfNaXrmZzjiVchApjZejYWluJKuQMDBVOpBmQVVTjMsEzpNgLdHifesAsRIwKym	420	t	2022-07-01 01:21:08.472802+05:30	2022-07-01 01:21:08.472802+05:30
NUrpOYSAvaXpUwTNhyfVcgsHXJmYfcevjXOulmeLndmXKrtXwnbwsVjeihRpNQlSsXnlqQzUJCnSFYTe	421	t	2022-07-01 01:22:04.163688+05:30	2022-07-01 01:22:04.163688+05:30
JZJrLGIiKjcbBMrGbOsgSfgOANeeOCxAlPXZbewDtcYLFyHfAqqtZSiXpkCAPWJipzsQcApTVpYWDSBo	422	t	2022-07-01 01:22:04.285246+05:30	2022-07-01 01:22:04.285246+05:30
XZNLWxpEPqasUyXQfVbtYQTZHqUHNxjpYBUuhQBIWGorHzGRAApspwbLjyXMcuclmjcnhwgpZVvOemVK	423	t	2022-07-01 01:22:04.314928+05:30	2022-07-01 01:22:04.314928+05:30
eWcOglgleHFgudJrPxXpfOSjiLkUObWrtcyctZTAoXHfJlPVySZIOLYdpJXaNZhUQDixwlXviSQpgnLE	424	t	2022-07-01 01:23:47.110295+05:30	2022-07-01 01:23:47.110295+05:30
aIbqEYubkMmltotdxwcJaJakgWRavjaXcaejTyIwIcffgSrgODOjXBqzOFikqrwHmoDJdanhKyNJlysy	425	t	2022-07-01 01:23:47.212726+05:30	2022-07-01 01:23:47.212726+05:30
EBFnAmRLvasFjeLHiDRbfcYnhelFTJDacZjwOwMhZwYZdJAvjUMzZmcoaZEoAYLqhWxKUOrUFKZptSpM	426	t	2022-07-01 01:23:47.25919+05:30	2022-07-01 01:23:47.25919+05:30
aZlVsLOAFrHPMrNxweyGUeHTWOHtZztjTAMBsahLxDkKFgVNmeUZhALcePByhnkOptrMiuYyFYuOsFNl	427	t	2022-07-01 01:24:49.535166+05:30	2022-07-01 01:24:49.535166+05:30
SPiSPYlRYoxCCUGRhySBKultisVLpqInoMSlzqdqiTPfRljDuDTdwbEzLQFxPscNnwXItNXiXRDBMeJc	428	t	2022-07-01 01:24:49.643864+05:30	2022-07-01 01:24:49.643864+05:30
kDsXYpVNqObrxyVALOQqRWfaHRzaoLhQGwAhCWRjsYmpFjghYbVzEzLuLQQuXiyOhVOecTNEPCvjMzFk	429	t	2022-07-01 01:24:49.673061+05:30	2022-07-01 01:24:49.673061+05:30
apVxoTxCZytHfuErSRDoWNXGrLFYUxPUltZKQCPYjRUYjPnUfSsKCAWbYzoWuwCFMDVQDmUmSlMaClde	430	t	2022-07-01 01:25:59.686941+05:30	2022-07-01 01:25:59.686941+05:30
OOJPiKWZjuGycihQgPAwAsCeedEEjivOuCoWNUdaiNEmKwNdMZupuvTRMBXhTHrIxHscMXVYtkRvjTDd	431	t	2022-07-01 01:25:59.802435+05:30	2022-07-01 01:25:59.802435+05:30
llVFassrnUYgcAGjetcUmiekUtocBLRnVoVUEODUXmxvOUtPoljVBavLprskEpPOuKCSQtPSkcCstrSn	432	t	2022-07-01 01:25:59.83454+05:30	2022-07-01 01:25:59.83454+05:30
CebUxkQoVfDjQzmtNHqYkfOjHfRhKGwUBcnYCsYRsqhnFLYjohcLPtjVZOzCQXUZMRUktgQozMTwTGHP	433	t	2022-07-01 01:27:01.264964+05:30	2022-07-01 01:27:01.264964+05:30
lynjaaYaSUEdLpLyXTtOAGHbyQaEPFDMnZkQcBEDWRDroSVYMsNfpelQqofKWEnOEDKgAeBWXzxzLoch	434	t	2022-07-01 01:27:01.37803+05:30	2022-07-01 01:27:01.37803+05:30
bvtFKlpLIFUQtBklpyqzETYeuRCDpplsPDhWfppbMCLeHzsacreiLbwkuQzGaIxwENcdRPBoRfqkwiKK	435	t	2022-07-01 01:27:01.426804+05:30	2022-07-01 01:27:01.426804+05:30
HBaHCTPNfXWVCruQRCgrQkRPKWYSFMoDCtMCxeEdlGTrPAlIQuNBehlmRZPtFGftURsGbTfqaJpQhuGF	436	t	2022-07-01 01:42:41.783563+05:30	2022-07-01 01:42:41.783563+05:30
VJHKsZtnkMtRfafjHQuPBduCzxFzmtFQbbZfxqFNLWqDiNNCCwqAnsZwJQCbYlMBBngpTRoasxgszTGl	437	t	2022-07-01 01:42:41.906839+05:30	2022-07-01 01:42:41.906839+05:30
ffZMtTmETfHAdbHWPRcNOksGSyRPNmLSXsCkLcLTBYuTQRrdyGhPHXqzhHEhRjZvclGLqxXOGLrmvEUz	438	t	2022-07-01 01:42:41.937153+05:30	2022-07-01 01:42:41.937153+05:30
rFQQSxoyNzovqtgCnOBtGGrzyKRXITKLHoawpRRGNOgRYHxIDjvjWkxPBqmrtQgeZhuXkjeaaGrTUCTO	439	t	2022-07-01 02:03:52.660938+05:30	2022-07-01 02:03:52.660938+05:30
qydRqaxJYUPqjGyiSKaXXgYopDffqGCIGGmMktnHvnBXhdHCJOxzHuxSotFWUOTYdFsBzDEUEnehuvpB	440	t	2022-07-01 02:03:52.747313+05:30	2022-07-01 02:03:52.747313+05:30
epldiBxtXVOOvBBuYzprnNGIyheaEUtfAYVKJhHwoLrnnpsGHArSHFLxGBzJqIfakgvpNxoHWZqGxgeT	441	t	2022-07-01 02:03:52.794489+05:30	2022-07-01 02:03:52.794489+05:30
KNnSygDtnpHjjxUXWZkUlhSkvxvylCpIlxXFDBXBOrDBNgmjIqdhDlIvDUIQpbNxFNJpMczVESTcOdBD	442	t	2022-07-01 02:13:32.699226+05:30	2022-07-01 02:13:32.699226+05:30
KwLViDGVgXWfQGTpStPAPVaaUlMkiDctfcwmtKvnlCjnUEKJDyhdMkWVFADcqcelfnzYFgSJvpVKTCBc	443	t	2022-07-01 02:13:33.000725+05:30	2022-07-01 02:13:33.000725+05:30
kYQLtsaVDxQXXydRiVUCyqMeIktfiYAjVoggiWrQAPLsFcUbpNAtbbBGoIGGgKSSPJHViLSDgmalhpbC	444	t	2022-07-01 02:13:33.140689+05:30	2022-07-01 02:13:33.140689+05:30
KmmZEmHEbGnFeRCZqxRQequQkuAfYqtLzPwoDWUVmkpCPSUjreFozYIVCUhbjFHLATGuaeTjrQwGlnkw	445	t	2022-07-01 02:20:47.817341+05:30	2022-07-01 02:20:47.817341+05:30
MZKAKwhsyyCSyMwDpWZLglkCxBIrLRQUjioYDOadRCsGHCMHsCODQqrDVhfhJRzzfbMzVUuxIyrJuWDM	446	t	2022-07-01 02:20:47.942874+05:30	2022-07-01 02:20:47.942874+05:30
sbwfpLOIKmWDBZSEtlvcDnTElHAXpztiGqVtVaKRNdnuCtsRlhWuHbmbtKgniqaSgxVJoyWvroSQFkBh	447	t	2022-07-01 02:20:47.977071+05:30	2022-07-01 02:20:47.977071+05:30
bsupsbYBWBfjjUDCSGONuDrcIkRTbycKsXHmAzNkMkztEUjaGFGuEeEQWrLFCpdQztmnoIFvOadctMcS	448	t	2022-07-01 02:22:03.960816+05:30	2022-07-01 02:22:03.960816+05:30
fpgxHUjTeYumbeKGcTVENUXfeSNaxGllqVxmgvncWryrIMjJPGObWuYDJMqFisddoSdzyXvVpviigGcv	449	t	2022-07-01 02:22:04.045307+05:30	2022-07-01 02:22:04.045307+05:30
FMKLVCnebkgUXNCuIBtqnUOqXavJxMohgJdolLfnqYqBLjnYuwZDxdfUdMaHHEyNounsBoXwDBEmqise	450	t	2022-07-01 02:22:04.073691+05:30	2022-07-01 02:22:04.073691+05:30
mjlfQitbjgAPNAepJVQejufPuAmyZMznLaPTMGwkNXkiuYjmteImsnxiDrFnlpiFZQZFuJlVzKTfIgzU	451	t	2022-07-01 02:29:54.709779+05:30	2022-07-01 02:29:54.709779+05:30
zyFzFTcTRuoWpgOATzjxPADteIRVRyKqaxsDoFxpqQRXLBhUlzyKqVOtZPkBCzZLYkDbVYMzvMNPAuNm	452	t	2022-07-01 02:29:54.779756+05:30	2022-07-01 02:29:54.779756+05:30
CGTkUbNhaIbFOlldLMNZKbkNLmHlMVORRDsfpgzdtrAxQPpgboSrZGmkbGeUgBKtWYsGEfdvhDGpqgws	453	t	2022-07-01 02:29:54.827455+05:30	2022-07-01 02:29:54.827455+05:30
lwdbdHPAMCbJhqZUDBwVzrsRvHRkSLCoPQOxsSOQepQyfIWKJSHGttleFEjEsMpwjpkxMLYmMkYYzHFL	454	t	2022-07-01 02:37:21.44636+05:30	2022-07-01 02:37:21.44636+05:30
SCVhmfEHjtVlWHKLXtptkvEpQAaPYMdYHjdxpSGeZmOEtdgOJbzzwAeTemDlNuKdroeWvOHsCdAVDAFS	455	t	2022-07-01 02:37:21.559378+05:30	2022-07-01 02:37:21.559378+05:30
NGzCVCHWdNeNaOgGliEkkYaIzhcPmLpjjZglZRfMlMWjrfvUcXAgkILwkPykiZPeLicGUvbtgkYwjMdn	456	t	2022-07-01 02:37:21.587699+05:30	2022-07-01 02:37:21.587699+05:30
JpMUdKDSXCStoeoKAKqfMsShyGALWROEIGovvdWbdvJyFRJZXSthZAwmOBQojdaMgIZsCnjHWtoPVkMY	457	t	2022-07-01 02:39:36.415541+05:30	2022-07-01 02:39:36.415541+05:30
DCOMfCVPrQrhwSbcFPOKxqslpExFJrVzAaxMFbhUVdtLJSTtlKWjvrQwmgxmeAyApvOJptNiaeyQDvWM	458	t	2022-07-01 02:39:36.481231+05:30	2022-07-01 02:39:36.481231+05:30
QJvfPEGhnYfeGfCIuePXxGqmHednOIeoOaxktixBiEcpXMzMeAPpGMEjklsMDYBQMTEfFZikWPyHjXOW	459	t	2022-07-01 02:39:36.524668+05:30	2022-07-01 02:39:36.524668+05:30
BkLFKsNhQKhUBEIszpJpfXoOaeRnBfsxumDWJAhGGVsEyFFsnXswdWvNnvAiznbJNluDRsFCoextKZbU	460	t	2022-07-01 02:41:45.989243+05:30	2022-07-01 02:41:45.989243+05:30
VJNftaTHWclGGVcvRRgWGctVkCHFCCeuavxAPlotWBnWGmcSxBcjBtsvsPJMvonVwYVfsLkLwetnYLfQ	461	t	2022-07-01 02:41:46.091242+05:30	2022-07-01 02:41:46.091242+05:30
TsLoRjelHPukZrmPJAwOOoHBlHQDyPpBfWgUeLWGAyGYyNMEnzOWcYFPOTvPTjyOoYuJJNzlPcZMLfUj	462	t	2022-07-01 02:41:46.137368+05:30	2022-07-01 02:41:46.137368+05:30
SakhrHZxMHhhUldITHpaacQIDVmHNueXXFLOaNTsJWjMXhuQIdfCpCuoMOCEOsFiwpecgjFAMGLWZNTM	463	t	2022-07-01 02:42:30.110197+05:30	2022-07-01 02:42:30.110197+05:30
EGBXcNVNUsrsePdtbppGFRqrWhURfzgTwBLYsgucwhttVDNQuMUWxTVjaZjnWcuxDHHcMLVqVXPjzxmj	464	t	2022-07-01 02:42:30.215168+05:30	2022-07-01 02:42:30.215168+05:30
BpcyRBODaeNozsHUiFrnbOJfSocdXGrFqarsrWiqkYChIRMfGfaQQgvbjMKHqTOoogXqkztFzwNPeyeI	465	t	2022-07-01 02:42:30.242942+05:30	2022-07-01 02:42:30.242942+05:30
vCZbROuuigBxmUMAtbETZGJtsvhYUdnheUMkxvzoNQZafNcwimDPVSwksWynhIfavQnTmiwPmWoAtHoa	466	t	2022-07-01 02:43:34.017428+05:30	2022-07-01 02:43:34.017428+05:30
DrvNtouzxxkKbkjPqVsGEFtNqzzHSzaWdwmqJtQHwuHafemdmllcIQlGrQembyROnWzKCzNnJhIhaGWV	467	t	2022-07-01 02:43:34.098311+05:30	2022-07-01 02:43:34.098311+05:30
nWPFARHvThiNZsXdXsJDGSkSAASEcIFdjPzwECpbUnUFYfrBWyqXhRzbNWzLNHhkISZdECXJknrwMPlM	468	t	2022-07-01 02:43:34.12761+05:30	2022-07-01 02:43:34.12761+05:30
JuMqFukLoBlFjYzLjPsHQqDDtmrEQfCmZNXVvBCeFGZqUXdoydAXjLFkAZhWLAISJEmtajQEazATPZtK	469	t	2022-07-01 14:14:08.341909+05:30	2022-07-01 14:14:08.341909+05:30
oVZCHCQJRlGvYaIDJdyHdXqHRUemMeoNtSZEKOECYBqcjIoVSFPMchoVfFDLXugNPlBxCgDdOIBSUOBx	470	t	2022-07-01 14:14:08.535441+05:30	2022-07-01 14:14:08.535441+05:30
EfwUuyHsGcIDIRFOjIDKeFixoFnBEGEnBCuUKxgaIeTvmOenciWpiwFYRrgHVwmPJFtpKuNtfnDithkH	471	t	2022-07-01 14:14:08.586532+05:30	2022-07-01 14:14:08.586532+05:30
CXvRhXQBQEHxmjJCtPaAXceuKISgBJtbqfSfdnnVQGkbWurujiozcNtVPZGCfydzRJnxOepKebzRDhBC	472	t	2022-07-01 14:56:20.001231+05:30	2022-07-01 14:56:20.001231+05:30
jRdzuTZvzUXtiHBZPRNzvJoaVUmNWwiEjAXvTKFSkqSGFsurgLzVRRZmCNgnTmxvLlchmlHzbquzCzcH	473	t	2022-07-01 14:56:20.165442+05:30	2022-07-01 14:56:20.165442+05:30
eTTWdPgbKaCXFwKRDIPSzybFifPfvDzgyVgLMIPNtTMjxsFsbFfDDyspfjOyfkjusAriLmSSrGjJZcEK	474	t	2022-07-01 14:56:20.199004+05:30	2022-07-01 14:56:20.199004+05:30
tgMARFIxMovJbGpvBCaoWekbkvawCvdDTvpOOdLXdWXqCWQNEsfkLYvaEbbUlnDfvFhyamxudwBvuyjL	475	t	2022-07-01 14:59:41.379645+05:30	2022-07-01 14:59:41.379645+05:30
aaTyiYXDSLwWIDRmybHQTFUFsNhIKTmZBdmDPGqQbxDfnYBuGcAXnkbSeBmTAzdYTTfEMhdaJBgJQEzY	476	t	2022-07-01 14:59:41.548315+05:30	2022-07-01 14:59:41.548315+05:30
fJBRqsZVWIdbnrMQBNonPysjQnRxaOWjVUygQbzFYMHeiSVgcQrnizaDPulChhKIclDlUQtmQrKDMqjs	477	t	2022-07-01 14:59:41.623838+05:30	2022-07-01 14:59:41.623838+05:30
hxTgOyVpxSgYvNrqxGxbjwvEWxiTTsrDSkUjegeSglpUjTfahMGVsWNKcdUhLowfUiQzWwHQTlLaZmTr	478	t	2022-07-01 15:00:45.028063+05:30	2022-07-01 15:00:45.028063+05:30
yxxYaRONroHKSwBLkvRFpkwxCXijmnwAwNFQtofCSwZtnjlAniaZIStGYqyhivuUcERrkblZhtnPKjwQ	479	t	2022-07-01 15:00:45.14253+05:30	2022-07-01 15:00:45.14253+05:30
gDDoxqMEhpohOWzQJwTojguensdsdSKgGuJNPxfcspsUMbfpihFkRdamVLDSNpgYzwJgAPBehaSdFRGz	480	t	2022-07-01 15:00:45.188331+05:30	2022-07-01 15:00:45.188331+05:30
dcClgQzTFAcOlmUFJkEEOnTlcjzuSxKdwrBEjmMXpPQbZElRSZmqcBclIkHmZsycryhUeRIoeqAKaRfq	481	t	2022-07-01 15:16:24.225349+05:30	2022-07-01 15:16:24.225349+05:30
vIRArnbvbHSQTQXomkmFUjhUbYSZHBDhWgRGNFfkWLinPPPIHKvkYskPAwHqBqqDtmFyBWIFhfVOHpQW	482	t	2022-07-01 15:16:24.319561+05:30	2022-07-01 15:16:24.319561+05:30
PsuCZtMPgUuiTGKzGGJhRjmXKbGUaumHgdqYGSvvLUymgCtYPVCQzIxFQPVQtvRzpcgAlFWNrCLXCoLh	483	t	2022-07-01 15:16:24.349277+05:30	2022-07-01 15:16:24.349277+05:30
\.


--
-- TOC entry 3572 (class 0 OID 16414)
-- Dependencies: 208
-- Data for Name: inventories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventories (firstname, lastname, age, phone, modnameid, inventoriesid, recordstate, created_date, updated_date) FROM stdin;
\.


--
-- TOC entry 3574 (class 0 OID 16425)
-- Dependencies: 210
-- Data for Name: modname; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modname (mname, recordstate, modnameid, created_date, updated_date) FROM stdin;
poli	t	28	2020-11-29 22:05:50.84144+05:30	2020-11-29 22:05:50.84144+05:30
poli	t	29	2020-11-29 22:30:27.348347+05:30	2020-11-29 22:30:27.348347+05:30
poli	t	30	2020-11-29 22:49:55.672732+05:30	2020-11-29 22:49:55.672732+05:30
\.


--
-- TOC entry 3576 (class 0 OID 16433)
-- Dependencies: 212
-- Data for Name: mrole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mrole (roleid, modnameid, accesstype, recordstate, mroleid, created_date, updated_date) FROM stdin;
\.


--
-- TOC entry 3578 (class 0 OID 16441)
-- Dependencies: 214
-- Data for Name: muser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.muser (email, username, password, isactive, muserid, recordstate, created_date, updated_date) FROM stdin;
krennic@orson.com	krennic	orson	t	1	t	2019-02-26 14:12:04.131773+05:30	2019-02-26 14:12:04.131773+05:30
a@a.in	scarif	orson	t	2	t	2020-12-12 00:51:00.310262+05:30	2020-12-12 00:51:00.310262+05:30
\.


--
-- TOC entry 3589 (class 0 OID 32894)
-- Dependencies: 225
-- Data for Name: orville; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orville (first_name, last_name, genderid, modnameid, orvilleid, recordstate, created_date, updated_date) FROM stdin;
\.


--
-- TOC entry 3580 (class 0 OID 16464)
-- Dependencies: 216
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (rolename, roleid, recordstate) FROM stdin;
\.


--
-- TOC entry 3582 (class 0 OID 16473)
-- Dependencies: 218
-- Data for Name: userrolemapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userrolemapping (roleid, muserid, isactive, userrolemappingid, created_date, updated_date, recordstate) FROM stdin;
\.


--
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 222
-- Name: Customer_Customerid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Customer_Customerid_seq"', 93, true);


--
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 220
-- Name: gender_genderid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gender_genderid_seq', 585, true);


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 209
-- Name: inventories_inventoriesid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventories_inventoriesid_seq', 1, false);


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 211
-- Name: modname_modnameid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modname_modnameid_seq', 99, true);


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 213
-- Name: mrole_mroleid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mrole_mroleid_seq', 60, true);


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 215
-- Name: muser_muserid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.muser_muserid_seq', 2, true);


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 224
-- Name: orville_orvilleid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orville_orvilleid_seq', 3, true);


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 217
-- Name: role_roleid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_roleid_seq', 63, true);


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 219
-- Name: userrolemapping_userrolemappingid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.userrolemapping_userrolemappingid_seq', 1, false);


--
-- TOC entry 3443 (class 2606 OID 24649)
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("Customerid");


--
-- TOC entry 3441 (class 2606 OID 24600)
-- Name: gender gender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (genderid);


--
-- TOC entry 2903 (class 2606 OID 16493)
-- Name: inventories inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_pkey PRIMARY KEY (inventoriesid);


--
-- TOC entry 2905 (class 2606 OID 16495)
-- Name: modname modname_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modname
    ADD CONSTRAINT modname_pkey PRIMARY KEY (modnameid);


--
-- TOC entry 2907 (class 2606 OID 16497)
-- Name: mrole mrole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mrole
    ADD CONSTRAINT mrole_pkey PRIMARY KEY (mroleid);


--
-- TOC entry 2909 (class 2606 OID 16499)
-- Name: muser muser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muser
    ADD CONSTRAINT muser_pkey PRIMARY KEY (muserid);


--
-- TOC entry 3445 (class 2606 OID 32905)
-- Name: orville orville_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orville
    ADD CONSTRAINT orville_pkey PRIMARY KEY (orvilleid);


--
-- TOC entry 2911 (class 2606 OID 16503)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (roleid);


--
-- TOC entry 2913 (class 2606 OID 16505)
-- Name: role role_rolename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key UNIQUE (rolename);


--
-- TOC entry 2915 (class 2606 OID 16507)
-- Name: role role_rolename_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key1 UNIQUE (rolename);


--
-- TOC entry 2917 (class 2606 OID 16509)
-- Name: role role_rolename_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key10 UNIQUE (rolename);


--
-- TOC entry 2919 (class 2606 OID 16511)
-- Name: role role_rolename_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key100 UNIQUE (rolename);


--
-- TOC entry 2921 (class 2606 OID 16513)
-- Name: role role_rolename_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key101 UNIQUE (rolename);


--
-- TOC entry 2923 (class 2606 OID 16515)
-- Name: role role_rolename_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key102 UNIQUE (rolename);


--
-- TOC entry 2925 (class 2606 OID 16517)
-- Name: role role_rolename_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key103 UNIQUE (rolename);


--
-- TOC entry 2927 (class 2606 OID 16519)
-- Name: role role_rolename_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key104 UNIQUE (rolename);


--
-- TOC entry 2929 (class 2606 OID 16521)
-- Name: role role_rolename_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key105 UNIQUE (rolename);


--
-- TOC entry 2931 (class 2606 OID 16523)
-- Name: role role_rolename_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key106 UNIQUE (rolename);


--
-- TOC entry 2933 (class 2606 OID 16525)
-- Name: role role_rolename_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key107 UNIQUE (rolename);


--
-- TOC entry 2935 (class 2606 OID 16527)
-- Name: role role_rolename_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key108 UNIQUE (rolename);


--
-- TOC entry 2937 (class 2606 OID 16529)
-- Name: role role_rolename_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key109 UNIQUE (rolename);


--
-- TOC entry 2939 (class 2606 OID 16531)
-- Name: role role_rolename_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key11 UNIQUE (rolename);


--
-- TOC entry 2941 (class 2606 OID 16533)
-- Name: role role_rolename_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key110 UNIQUE (rolename);


--
-- TOC entry 2943 (class 2606 OID 16535)
-- Name: role role_rolename_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key111 UNIQUE (rolename);


--
-- TOC entry 2945 (class 2606 OID 16537)
-- Name: role role_rolename_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key112 UNIQUE (rolename);


--
-- TOC entry 2947 (class 2606 OID 16539)
-- Name: role role_rolename_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key113 UNIQUE (rolename);


--
-- TOC entry 2949 (class 2606 OID 16541)
-- Name: role role_rolename_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key114 UNIQUE (rolename);


--
-- TOC entry 2951 (class 2606 OID 16543)
-- Name: role role_rolename_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key115 UNIQUE (rolename);


--
-- TOC entry 2953 (class 2606 OID 16545)
-- Name: role role_rolename_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key116 UNIQUE (rolename);


--
-- TOC entry 2955 (class 2606 OID 16547)
-- Name: role role_rolename_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key117 UNIQUE (rolename);


--
-- TOC entry 2957 (class 2606 OID 16549)
-- Name: role role_rolename_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key118 UNIQUE (rolename);


--
-- TOC entry 2959 (class 2606 OID 16551)
-- Name: role role_rolename_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key119 UNIQUE (rolename);


--
-- TOC entry 2961 (class 2606 OID 16553)
-- Name: role role_rolename_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key12 UNIQUE (rolename);


--
-- TOC entry 2963 (class 2606 OID 16555)
-- Name: role role_rolename_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key120 UNIQUE (rolename);


--
-- TOC entry 2965 (class 2606 OID 16557)
-- Name: role role_rolename_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key121 UNIQUE (rolename);


--
-- TOC entry 2967 (class 2606 OID 16559)
-- Name: role role_rolename_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key122 UNIQUE (rolename);


--
-- TOC entry 2969 (class 2606 OID 16561)
-- Name: role role_rolename_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key123 UNIQUE (rolename);


--
-- TOC entry 2971 (class 2606 OID 16563)
-- Name: role role_rolename_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key124 UNIQUE (rolename);


--
-- TOC entry 2973 (class 2606 OID 16565)
-- Name: role role_rolename_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key125 UNIQUE (rolename);


--
-- TOC entry 2975 (class 2606 OID 16567)
-- Name: role role_rolename_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key126 UNIQUE (rolename);


--
-- TOC entry 2977 (class 2606 OID 16569)
-- Name: role role_rolename_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key127 UNIQUE (rolename);


--
-- TOC entry 2979 (class 2606 OID 16571)
-- Name: role role_rolename_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key128 UNIQUE (rolename);


--
-- TOC entry 2981 (class 2606 OID 16573)
-- Name: role role_rolename_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key129 UNIQUE (rolename);


--
-- TOC entry 2983 (class 2606 OID 16575)
-- Name: role role_rolename_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key13 UNIQUE (rolename);


--
-- TOC entry 2985 (class 2606 OID 16577)
-- Name: role role_rolename_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key130 UNIQUE (rolename);


--
-- TOC entry 2987 (class 2606 OID 16579)
-- Name: role role_rolename_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key131 UNIQUE (rolename);


--
-- TOC entry 2989 (class 2606 OID 16581)
-- Name: role role_rolename_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key132 UNIQUE (rolename);


--
-- TOC entry 2991 (class 2606 OID 16583)
-- Name: role role_rolename_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key133 UNIQUE (rolename);


--
-- TOC entry 2993 (class 2606 OID 16585)
-- Name: role role_rolename_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key134 UNIQUE (rolename);


--
-- TOC entry 2995 (class 2606 OID 16587)
-- Name: role role_rolename_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key135 UNIQUE (rolename);


--
-- TOC entry 2997 (class 2606 OID 16589)
-- Name: role role_rolename_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key136 UNIQUE (rolename);


--
-- TOC entry 2999 (class 2606 OID 16591)
-- Name: role role_rolename_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key137 UNIQUE (rolename);


--
-- TOC entry 3001 (class 2606 OID 16593)
-- Name: role role_rolename_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key138 UNIQUE (rolename);


--
-- TOC entry 3003 (class 2606 OID 16595)
-- Name: role role_rolename_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key139 UNIQUE (rolename);


--
-- TOC entry 3005 (class 2606 OID 16597)
-- Name: role role_rolename_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key14 UNIQUE (rolename);


--
-- TOC entry 3007 (class 2606 OID 16599)
-- Name: role role_rolename_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key140 UNIQUE (rolename);


--
-- TOC entry 3009 (class 2606 OID 16601)
-- Name: role role_rolename_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key141 UNIQUE (rolename);


--
-- TOC entry 3011 (class 2606 OID 16603)
-- Name: role role_rolename_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key142 UNIQUE (rolename);


--
-- TOC entry 3013 (class 2606 OID 16605)
-- Name: role role_rolename_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key143 UNIQUE (rolename);


--
-- TOC entry 3015 (class 2606 OID 16607)
-- Name: role role_rolename_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key144 UNIQUE (rolename);


--
-- TOC entry 3017 (class 2606 OID 16609)
-- Name: role role_rolename_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key145 UNIQUE (rolename);


--
-- TOC entry 3019 (class 2606 OID 16611)
-- Name: role role_rolename_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key146 UNIQUE (rolename);


--
-- TOC entry 3021 (class 2606 OID 16613)
-- Name: role role_rolename_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key147 UNIQUE (rolename);


--
-- TOC entry 3023 (class 2606 OID 16615)
-- Name: role role_rolename_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key148 UNIQUE (rolename);


--
-- TOC entry 3025 (class 2606 OID 16617)
-- Name: role role_rolename_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key149 UNIQUE (rolename);


--
-- TOC entry 3027 (class 2606 OID 16619)
-- Name: role role_rolename_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key15 UNIQUE (rolename);


--
-- TOC entry 3029 (class 2606 OID 16621)
-- Name: role role_rolename_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key150 UNIQUE (rolename);


--
-- TOC entry 3031 (class 2606 OID 16623)
-- Name: role role_rolename_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key151 UNIQUE (rolename);


--
-- TOC entry 3033 (class 2606 OID 16625)
-- Name: role role_rolename_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key152 UNIQUE (rolename);


--
-- TOC entry 3035 (class 2606 OID 16627)
-- Name: role role_rolename_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key153 UNIQUE (rolename);


--
-- TOC entry 3037 (class 2606 OID 16629)
-- Name: role role_rolename_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key154 UNIQUE (rolename);


--
-- TOC entry 3039 (class 2606 OID 16631)
-- Name: role role_rolename_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key155 UNIQUE (rolename);


--
-- TOC entry 3041 (class 2606 OID 16633)
-- Name: role role_rolename_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key156 UNIQUE (rolename);


--
-- TOC entry 3043 (class 2606 OID 16635)
-- Name: role role_rolename_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key157 UNIQUE (rolename);


--
-- TOC entry 3045 (class 2606 OID 16637)
-- Name: role role_rolename_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key158 UNIQUE (rolename);


--
-- TOC entry 3047 (class 2606 OID 16639)
-- Name: role role_rolename_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key159 UNIQUE (rolename);


--
-- TOC entry 3049 (class 2606 OID 16641)
-- Name: role role_rolename_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key16 UNIQUE (rolename);


--
-- TOC entry 3051 (class 2606 OID 16643)
-- Name: role role_rolename_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key160 UNIQUE (rolename);


--
-- TOC entry 3053 (class 2606 OID 16645)
-- Name: role role_rolename_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key161 UNIQUE (rolename);


--
-- TOC entry 3055 (class 2606 OID 16647)
-- Name: role role_rolename_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key162 UNIQUE (rolename);


--
-- TOC entry 3057 (class 2606 OID 16649)
-- Name: role role_rolename_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key163 UNIQUE (rolename);


--
-- TOC entry 3059 (class 2606 OID 16651)
-- Name: role role_rolename_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key164 UNIQUE (rolename);


--
-- TOC entry 3061 (class 2606 OID 16653)
-- Name: role role_rolename_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key165 UNIQUE (rolename);


--
-- TOC entry 3063 (class 2606 OID 16655)
-- Name: role role_rolename_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key166 UNIQUE (rolename);


--
-- TOC entry 3065 (class 2606 OID 16657)
-- Name: role role_rolename_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key167 UNIQUE (rolename);


--
-- TOC entry 3067 (class 2606 OID 16659)
-- Name: role role_rolename_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key168 UNIQUE (rolename);


--
-- TOC entry 3069 (class 2606 OID 16661)
-- Name: role role_rolename_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key169 UNIQUE (rolename);


--
-- TOC entry 3071 (class 2606 OID 16663)
-- Name: role role_rolename_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key17 UNIQUE (rolename);


--
-- TOC entry 3073 (class 2606 OID 16665)
-- Name: role role_rolename_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key170 UNIQUE (rolename);


--
-- TOC entry 3075 (class 2606 OID 16667)
-- Name: role role_rolename_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key171 UNIQUE (rolename);


--
-- TOC entry 3077 (class 2606 OID 16669)
-- Name: role role_rolename_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key172 UNIQUE (rolename);


--
-- TOC entry 3079 (class 2606 OID 16671)
-- Name: role role_rolename_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key173 UNIQUE (rolename);


--
-- TOC entry 3081 (class 2606 OID 16673)
-- Name: role role_rolename_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key174 UNIQUE (rolename);


--
-- TOC entry 3083 (class 2606 OID 16675)
-- Name: role role_rolename_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key175 UNIQUE (rolename);


--
-- TOC entry 3085 (class 2606 OID 16677)
-- Name: role role_rolename_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key176 UNIQUE (rolename);


--
-- TOC entry 3087 (class 2606 OID 16679)
-- Name: role role_rolename_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key177 UNIQUE (rolename);


--
-- TOC entry 3089 (class 2606 OID 16681)
-- Name: role role_rolename_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key178 UNIQUE (rolename);


--
-- TOC entry 3091 (class 2606 OID 16683)
-- Name: role role_rolename_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key179 UNIQUE (rolename);


--
-- TOC entry 3093 (class 2606 OID 16685)
-- Name: role role_rolename_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key18 UNIQUE (rolename);


--
-- TOC entry 3095 (class 2606 OID 16687)
-- Name: role role_rolename_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key180 UNIQUE (rolename);


--
-- TOC entry 3097 (class 2606 OID 16689)
-- Name: role role_rolename_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key181 UNIQUE (rolename);


--
-- TOC entry 3099 (class 2606 OID 16691)
-- Name: role role_rolename_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key182 UNIQUE (rolename);


--
-- TOC entry 3101 (class 2606 OID 16693)
-- Name: role role_rolename_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key183 UNIQUE (rolename);


--
-- TOC entry 3103 (class 2606 OID 16695)
-- Name: role role_rolename_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key184 UNIQUE (rolename);


--
-- TOC entry 3105 (class 2606 OID 16697)
-- Name: role role_rolename_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key185 UNIQUE (rolename);


--
-- TOC entry 3107 (class 2606 OID 16699)
-- Name: role role_rolename_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key186 UNIQUE (rolename);


--
-- TOC entry 3109 (class 2606 OID 16701)
-- Name: role role_rolename_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key187 UNIQUE (rolename);


--
-- TOC entry 3111 (class 2606 OID 16703)
-- Name: role role_rolename_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key188 UNIQUE (rolename);


--
-- TOC entry 3113 (class 2606 OID 16705)
-- Name: role role_rolename_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key189 UNIQUE (rolename);


--
-- TOC entry 3115 (class 2606 OID 16707)
-- Name: role role_rolename_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key19 UNIQUE (rolename);


--
-- TOC entry 3117 (class 2606 OID 16709)
-- Name: role role_rolename_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key190 UNIQUE (rolename);


--
-- TOC entry 3119 (class 2606 OID 16711)
-- Name: role role_rolename_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key191 UNIQUE (rolename);


--
-- TOC entry 3121 (class 2606 OID 16713)
-- Name: role role_rolename_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key192 UNIQUE (rolename);


--
-- TOC entry 3123 (class 2606 OID 16715)
-- Name: role role_rolename_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key193 UNIQUE (rolename);


--
-- TOC entry 3125 (class 2606 OID 16717)
-- Name: role role_rolename_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key194 UNIQUE (rolename);


--
-- TOC entry 3127 (class 2606 OID 16719)
-- Name: role role_rolename_key195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key195 UNIQUE (rolename);


--
-- TOC entry 3129 (class 2606 OID 16721)
-- Name: role role_rolename_key196; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key196 UNIQUE (rolename);


--
-- TOC entry 3131 (class 2606 OID 16723)
-- Name: role role_rolename_key197; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key197 UNIQUE (rolename);


--
-- TOC entry 3133 (class 2606 OID 16725)
-- Name: role role_rolename_key198; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key198 UNIQUE (rolename);


--
-- TOC entry 3135 (class 2606 OID 16727)
-- Name: role role_rolename_key199; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key199 UNIQUE (rolename);


--
-- TOC entry 3137 (class 2606 OID 16729)
-- Name: role role_rolename_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key2 UNIQUE (rolename);


--
-- TOC entry 3139 (class 2606 OID 16731)
-- Name: role role_rolename_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key20 UNIQUE (rolename);


--
-- TOC entry 3141 (class 2606 OID 16733)
-- Name: role role_rolename_key200; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key200 UNIQUE (rolename);


--
-- TOC entry 3143 (class 2606 OID 16735)
-- Name: role role_rolename_key201; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key201 UNIQUE (rolename);


--
-- TOC entry 3145 (class 2606 OID 16737)
-- Name: role role_rolename_key202; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key202 UNIQUE (rolename);


--
-- TOC entry 3147 (class 2606 OID 16739)
-- Name: role role_rolename_key203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key203 UNIQUE (rolename);


--
-- TOC entry 3149 (class 2606 OID 16741)
-- Name: role role_rolename_key204; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key204 UNIQUE (rolename);


--
-- TOC entry 3151 (class 2606 OID 16743)
-- Name: role role_rolename_key205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key205 UNIQUE (rolename);


--
-- TOC entry 3153 (class 2606 OID 16745)
-- Name: role role_rolename_key206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key206 UNIQUE (rolename);


--
-- TOC entry 3155 (class 2606 OID 16747)
-- Name: role role_rolename_key207; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key207 UNIQUE (rolename);


--
-- TOC entry 3157 (class 2606 OID 16749)
-- Name: role role_rolename_key208; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key208 UNIQUE (rolename);


--
-- TOC entry 3159 (class 2606 OID 16751)
-- Name: role role_rolename_key209; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key209 UNIQUE (rolename);


--
-- TOC entry 3161 (class 2606 OID 16753)
-- Name: role role_rolename_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key21 UNIQUE (rolename);


--
-- TOC entry 3163 (class 2606 OID 16755)
-- Name: role role_rolename_key210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key210 UNIQUE (rolename);


--
-- TOC entry 3165 (class 2606 OID 16757)
-- Name: role role_rolename_key211; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key211 UNIQUE (rolename);


--
-- TOC entry 3167 (class 2606 OID 16759)
-- Name: role role_rolename_key212; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key212 UNIQUE (rolename);


--
-- TOC entry 3169 (class 2606 OID 16761)
-- Name: role role_rolename_key213; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key213 UNIQUE (rolename);


--
-- TOC entry 3171 (class 2606 OID 16763)
-- Name: role role_rolename_key214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key214 UNIQUE (rolename);


--
-- TOC entry 3173 (class 2606 OID 16765)
-- Name: role role_rolename_key215; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key215 UNIQUE (rolename);


--
-- TOC entry 3175 (class 2606 OID 16767)
-- Name: role role_rolename_key216; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key216 UNIQUE (rolename);


--
-- TOC entry 3177 (class 2606 OID 16769)
-- Name: role role_rolename_key217; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key217 UNIQUE (rolename);


--
-- TOC entry 3179 (class 2606 OID 16771)
-- Name: role role_rolename_key218; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key218 UNIQUE (rolename);


--
-- TOC entry 3181 (class 2606 OID 16773)
-- Name: role role_rolename_key219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key219 UNIQUE (rolename);


--
-- TOC entry 3183 (class 2606 OID 16775)
-- Name: role role_rolename_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key22 UNIQUE (rolename);


--
-- TOC entry 3185 (class 2606 OID 16777)
-- Name: role role_rolename_key220; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key220 UNIQUE (rolename);


--
-- TOC entry 3187 (class 2606 OID 16779)
-- Name: role role_rolename_key221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key221 UNIQUE (rolename);


--
-- TOC entry 3189 (class 2606 OID 16781)
-- Name: role role_rolename_key222; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key222 UNIQUE (rolename);


--
-- TOC entry 3191 (class 2606 OID 16783)
-- Name: role role_rolename_key223; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key223 UNIQUE (rolename);


--
-- TOC entry 3193 (class 2606 OID 16785)
-- Name: role role_rolename_key224; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key224 UNIQUE (rolename);


--
-- TOC entry 3195 (class 2606 OID 16787)
-- Name: role role_rolename_key225; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key225 UNIQUE (rolename);


--
-- TOC entry 3197 (class 2606 OID 16789)
-- Name: role role_rolename_key226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key226 UNIQUE (rolename);


--
-- TOC entry 3199 (class 2606 OID 16791)
-- Name: role role_rolename_key227; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key227 UNIQUE (rolename);


--
-- TOC entry 3201 (class 2606 OID 16793)
-- Name: role role_rolename_key228; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key228 UNIQUE (rolename);


--
-- TOC entry 3203 (class 2606 OID 16795)
-- Name: role role_rolename_key229; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key229 UNIQUE (rolename);


--
-- TOC entry 3205 (class 2606 OID 16797)
-- Name: role role_rolename_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key23 UNIQUE (rolename);


--
-- TOC entry 3207 (class 2606 OID 16799)
-- Name: role role_rolename_key230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key230 UNIQUE (rolename);


--
-- TOC entry 3209 (class 2606 OID 16801)
-- Name: role role_rolename_key231; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key231 UNIQUE (rolename);


--
-- TOC entry 3211 (class 2606 OID 16803)
-- Name: role role_rolename_key232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key232 UNIQUE (rolename);


--
-- TOC entry 3213 (class 2606 OID 16805)
-- Name: role role_rolename_key233; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key233 UNIQUE (rolename);


--
-- TOC entry 3215 (class 2606 OID 16807)
-- Name: role role_rolename_key234; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key234 UNIQUE (rolename);


--
-- TOC entry 3217 (class 2606 OID 16809)
-- Name: role role_rolename_key235; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key235 UNIQUE (rolename);


--
-- TOC entry 3219 (class 2606 OID 16811)
-- Name: role role_rolename_key236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key236 UNIQUE (rolename);


--
-- TOC entry 3221 (class 2606 OID 16813)
-- Name: role role_rolename_key237; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key237 UNIQUE (rolename);


--
-- TOC entry 3223 (class 2606 OID 16815)
-- Name: role role_rolename_key238; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key238 UNIQUE (rolename);


--
-- TOC entry 3225 (class 2606 OID 16817)
-- Name: role role_rolename_key239; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key239 UNIQUE (rolename);


--
-- TOC entry 3227 (class 2606 OID 16819)
-- Name: role role_rolename_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key24 UNIQUE (rolename);


--
-- TOC entry 3229 (class 2606 OID 16821)
-- Name: role role_rolename_key240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key240 UNIQUE (rolename);


--
-- TOC entry 3231 (class 2606 OID 16823)
-- Name: role role_rolename_key241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key241 UNIQUE (rolename);


--
-- TOC entry 3233 (class 2606 OID 16825)
-- Name: role role_rolename_key242; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key242 UNIQUE (rolename);


--
-- TOC entry 3235 (class 2606 OID 16827)
-- Name: role role_rolename_key243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key243 UNIQUE (rolename);


--
-- TOC entry 3237 (class 2606 OID 16829)
-- Name: role role_rolename_key244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key244 UNIQUE (rolename);


--
-- TOC entry 3239 (class 2606 OID 16831)
-- Name: role role_rolename_key245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key245 UNIQUE (rolename);


--
-- TOC entry 3241 (class 2606 OID 16833)
-- Name: role role_rolename_key246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key246 UNIQUE (rolename);


--
-- TOC entry 3243 (class 2606 OID 16835)
-- Name: role role_rolename_key247; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key247 UNIQUE (rolename);


--
-- TOC entry 3245 (class 2606 OID 16837)
-- Name: role role_rolename_key248; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key248 UNIQUE (rolename);


--
-- TOC entry 3247 (class 2606 OID 16839)
-- Name: role role_rolename_key249; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key249 UNIQUE (rolename);


--
-- TOC entry 3249 (class 2606 OID 16841)
-- Name: role role_rolename_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key25 UNIQUE (rolename);


--
-- TOC entry 3251 (class 2606 OID 16843)
-- Name: role role_rolename_key250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key250 UNIQUE (rolename);


--
-- TOC entry 3253 (class 2606 OID 16845)
-- Name: role role_rolename_key251; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key251 UNIQUE (rolename);


--
-- TOC entry 3255 (class 2606 OID 16847)
-- Name: role role_rolename_key252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key252 UNIQUE (rolename);


--
-- TOC entry 3257 (class 2606 OID 16849)
-- Name: role role_rolename_key253; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key253 UNIQUE (rolename);


--
-- TOC entry 3259 (class 2606 OID 16851)
-- Name: role role_rolename_key254; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key254 UNIQUE (rolename);


--
-- TOC entry 3261 (class 2606 OID 16853)
-- Name: role role_rolename_key255; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key255 UNIQUE (rolename);


--
-- TOC entry 3263 (class 2606 OID 16855)
-- Name: role role_rolename_key256; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key256 UNIQUE (rolename);


--
-- TOC entry 3265 (class 2606 OID 16857)
-- Name: role role_rolename_key257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key257 UNIQUE (rolename);


--
-- TOC entry 3267 (class 2606 OID 16859)
-- Name: role role_rolename_key258; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key258 UNIQUE (rolename);


--
-- TOC entry 3269 (class 2606 OID 16861)
-- Name: role role_rolename_key259; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key259 UNIQUE (rolename);


--
-- TOC entry 3271 (class 2606 OID 16863)
-- Name: role role_rolename_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key26 UNIQUE (rolename);


--
-- TOC entry 3273 (class 2606 OID 16865)
-- Name: role role_rolename_key260; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key260 UNIQUE (rolename);


--
-- TOC entry 3275 (class 2606 OID 16867)
-- Name: role role_rolename_key261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key261 UNIQUE (rolename);


--
-- TOC entry 3277 (class 2606 OID 16869)
-- Name: role role_rolename_key262; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key262 UNIQUE (rolename);


--
-- TOC entry 3279 (class 2606 OID 16871)
-- Name: role role_rolename_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key27 UNIQUE (rolename);


--
-- TOC entry 3281 (class 2606 OID 16873)
-- Name: role role_rolename_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key28 UNIQUE (rolename);


--
-- TOC entry 3283 (class 2606 OID 16875)
-- Name: role role_rolename_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key29 UNIQUE (rolename);


--
-- TOC entry 3285 (class 2606 OID 16877)
-- Name: role role_rolename_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key3 UNIQUE (rolename);


--
-- TOC entry 3287 (class 2606 OID 16879)
-- Name: role role_rolename_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key30 UNIQUE (rolename);


--
-- TOC entry 3289 (class 2606 OID 16881)
-- Name: role role_rolename_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key31 UNIQUE (rolename);


--
-- TOC entry 3291 (class 2606 OID 16883)
-- Name: role role_rolename_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key32 UNIQUE (rolename);


--
-- TOC entry 3293 (class 2606 OID 16885)
-- Name: role role_rolename_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key33 UNIQUE (rolename);


--
-- TOC entry 3295 (class 2606 OID 16887)
-- Name: role role_rolename_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key34 UNIQUE (rolename);


--
-- TOC entry 3297 (class 2606 OID 16889)
-- Name: role role_rolename_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key35 UNIQUE (rolename);


--
-- TOC entry 3299 (class 2606 OID 16891)
-- Name: role role_rolename_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key36 UNIQUE (rolename);


--
-- TOC entry 3301 (class 2606 OID 16893)
-- Name: role role_rolename_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key37 UNIQUE (rolename);


--
-- TOC entry 3303 (class 2606 OID 16895)
-- Name: role role_rolename_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key38 UNIQUE (rolename);


--
-- TOC entry 3305 (class 2606 OID 16897)
-- Name: role role_rolename_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key39 UNIQUE (rolename);


--
-- TOC entry 3307 (class 2606 OID 16899)
-- Name: role role_rolename_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key4 UNIQUE (rolename);


--
-- TOC entry 3309 (class 2606 OID 16901)
-- Name: role role_rolename_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key40 UNIQUE (rolename);


--
-- TOC entry 3311 (class 2606 OID 16903)
-- Name: role role_rolename_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key41 UNIQUE (rolename);


--
-- TOC entry 3313 (class 2606 OID 16905)
-- Name: role role_rolename_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key42 UNIQUE (rolename);


--
-- TOC entry 3315 (class 2606 OID 16907)
-- Name: role role_rolename_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key43 UNIQUE (rolename);


--
-- TOC entry 3317 (class 2606 OID 16909)
-- Name: role role_rolename_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key44 UNIQUE (rolename);


--
-- TOC entry 3319 (class 2606 OID 16911)
-- Name: role role_rolename_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key45 UNIQUE (rolename);


--
-- TOC entry 3321 (class 2606 OID 16913)
-- Name: role role_rolename_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key46 UNIQUE (rolename);


--
-- TOC entry 3323 (class 2606 OID 16915)
-- Name: role role_rolename_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key47 UNIQUE (rolename);


--
-- TOC entry 3325 (class 2606 OID 16917)
-- Name: role role_rolename_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key48 UNIQUE (rolename);


--
-- TOC entry 3327 (class 2606 OID 16919)
-- Name: role role_rolename_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key49 UNIQUE (rolename);


--
-- TOC entry 3329 (class 2606 OID 16921)
-- Name: role role_rolename_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key5 UNIQUE (rolename);


--
-- TOC entry 3331 (class 2606 OID 16923)
-- Name: role role_rolename_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key50 UNIQUE (rolename);


--
-- TOC entry 3333 (class 2606 OID 16925)
-- Name: role role_rolename_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key51 UNIQUE (rolename);


--
-- TOC entry 3335 (class 2606 OID 16927)
-- Name: role role_rolename_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key52 UNIQUE (rolename);


--
-- TOC entry 3337 (class 2606 OID 16929)
-- Name: role role_rolename_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key53 UNIQUE (rolename);


--
-- TOC entry 3339 (class 2606 OID 16931)
-- Name: role role_rolename_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key54 UNIQUE (rolename);


--
-- TOC entry 3341 (class 2606 OID 16933)
-- Name: role role_rolename_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key55 UNIQUE (rolename);


--
-- TOC entry 3343 (class 2606 OID 16935)
-- Name: role role_rolename_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key56 UNIQUE (rolename);


--
-- TOC entry 3345 (class 2606 OID 16937)
-- Name: role role_rolename_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key57 UNIQUE (rolename);


--
-- TOC entry 3347 (class 2606 OID 16939)
-- Name: role role_rolename_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key58 UNIQUE (rolename);


--
-- TOC entry 3349 (class 2606 OID 16941)
-- Name: role role_rolename_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key59 UNIQUE (rolename);


--
-- TOC entry 3351 (class 2606 OID 16943)
-- Name: role role_rolename_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key6 UNIQUE (rolename);


--
-- TOC entry 3353 (class 2606 OID 16945)
-- Name: role role_rolename_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key60 UNIQUE (rolename);


--
-- TOC entry 3355 (class 2606 OID 16947)
-- Name: role role_rolename_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key61 UNIQUE (rolename);


--
-- TOC entry 3357 (class 2606 OID 16949)
-- Name: role role_rolename_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key62 UNIQUE (rolename);


--
-- TOC entry 3359 (class 2606 OID 16951)
-- Name: role role_rolename_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key63 UNIQUE (rolename);


--
-- TOC entry 3361 (class 2606 OID 16953)
-- Name: role role_rolename_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key64 UNIQUE (rolename);


--
-- TOC entry 3363 (class 2606 OID 16955)
-- Name: role role_rolename_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key65 UNIQUE (rolename);


--
-- TOC entry 3365 (class 2606 OID 16957)
-- Name: role role_rolename_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key66 UNIQUE (rolename);


--
-- TOC entry 3367 (class 2606 OID 16959)
-- Name: role role_rolename_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key67 UNIQUE (rolename);


--
-- TOC entry 3369 (class 2606 OID 16961)
-- Name: role role_rolename_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key68 UNIQUE (rolename);


--
-- TOC entry 3371 (class 2606 OID 16963)
-- Name: role role_rolename_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key69 UNIQUE (rolename);


--
-- TOC entry 3373 (class 2606 OID 16965)
-- Name: role role_rolename_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key7 UNIQUE (rolename);


--
-- TOC entry 3375 (class 2606 OID 16967)
-- Name: role role_rolename_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key70 UNIQUE (rolename);


--
-- TOC entry 3377 (class 2606 OID 16969)
-- Name: role role_rolename_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key71 UNIQUE (rolename);


--
-- TOC entry 3379 (class 2606 OID 16971)
-- Name: role role_rolename_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key72 UNIQUE (rolename);


--
-- TOC entry 3381 (class 2606 OID 16973)
-- Name: role role_rolename_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key73 UNIQUE (rolename);


--
-- TOC entry 3383 (class 2606 OID 16975)
-- Name: role role_rolename_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key74 UNIQUE (rolename);


--
-- TOC entry 3385 (class 2606 OID 16977)
-- Name: role role_rolename_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key75 UNIQUE (rolename);


--
-- TOC entry 3387 (class 2606 OID 16979)
-- Name: role role_rolename_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key76 UNIQUE (rolename);


--
-- TOC entry 3389 (class 2606 OID 16981)
-- Name: role role_rolename_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key77 UNIQUE (rolename);


--
-- TOC entry 3391 (class 2606 OID 16983)
-- Name: role role_rolename_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key78 UNIQUE (rolename);


--
-- TOC entry 3393 (class 2606 OID 16985)
-- Name: role role_rolename_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key79 UNIQUE (rolename);


--
-- TOC entry 3395 (class 2606 OID 16987)
-- Name: role role_rolename_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key8 UNIQUE (rolename);


--
-- TOC entry 3397 (class 2606 OID 16989)
-- Name: role role_rolename_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key80 UNIQUE (rolename);


--
-- TOC entry 3399 (class 2606 OID 16991)
-- Name: role role_rolename_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key81 UNIQUE (rolename);


--
-- TOC entry 3401 (class 2606 OID 16993)
-- Name: role role_rolename_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key82 UNIQUE (rolename);


--
-- TOC entry 3403 (class 2606 OID 16995)
-- Name: role role_rolename_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key83 UNIQUE (rolename);


--
-- TOC entry 3405 (class 2606 OID 16997)
-- Name: role role_rolename_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key84 UNIQUE (rolename);


--
-- TOC entry 3407 (class 2606 OID 16999)
-- Name: role role_rolename_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key85 UNIQUE (rolename);


--
-- TOC entry 3409 (class 2606 OID 17001)
-- Name: role role_rolename_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key86 UNIQUE (rolename);


--
-- TOC entry 3411 (class 2606 OID 17003)
-- Name: role role_rolename_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key87 UNIQUE (rolename);


--
-- TOC entry 3413 (class 2606 OID 17005)
-- Name: role role_rolename_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key88 UNIQUE (rolename);


--
-- TOC entry 3415 (class 2606 OID 17007)
-- Name: role role_rolename_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key89 UNIQUE (rolename);


--
-- TOC entry 3417 (class 2606 OID 17010)
-- Name: role role_rolename_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key9 UNIQUE (rolename);


--
-- TOC entry 3419 (class 2606 OID 17012)
-- Name: role role_rolename_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key90 UNIQUE (rolename);


--
-- TOC entry 3421 (class 2606 OID 17014)
-- Name: role role_rolename_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key91 UNIQUE (rolename);


--
-- TOC entry 3423 (class 2606 OID 17016)
-- Name: role role_rolename_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key92 UNIQUE (rolename);


--
-- TOC entry 3425 (class 2606 OID 17018)
-- Name: role role_rolename_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key93 UNIQUE (rolename);


--
-- TOC entry 3427 (class 2606 OID 17020)
-- Name: role role_rolename_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key94 UNIQUE (rolename);


--
-- TOC entry 3429 (class 2606 OID 17022)
-- Name: role role_rolename_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key95 UNIQUE (rolename);


--
-- TOC entry 3431 (class 2606 OID 17024)
-- Name: role role_rolename_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key96 UNIQUE (rolename);


--
-- TOC entry 3433 (class 2606 OID 17026)
-- Name: role role_rolename_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key97 UNIQUE (rolename);


--
-- TOC entry 3435 (class 2606 OID 17028)
-- Name: role role_rolename_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key98 UNIQUE (rolename);


--
-- TOC entry 3437 (class 2606 OID 17030)
-- Name: role role_rolename_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_rolename_key99 UNIQUE (rolename);


--
-- TOC entry 3439 (class 2606 OID 17032)
-- Name: userrolemapping userrolemapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userrolemapping
    ADD CONSTRAINT userrolemapping_pkey PRIMARY KEY (userrolemappingid);


-- Completed on 2022-07-19 02:59:53

--
-- PostgreSQL database dump complete
--


--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5
-- Dumped by pg_dump version 13.2

-- Started on 2021-05-17 20:10:26

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

--
-- TOC entry 3834 (class 0 OID 16423)
-- Dependencies: 203
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, "NumFacture", "Date", "Description", "IdJob", "Tasker", "Jobber") FROM stdin;
1	fact1	2021-05-20	Facture montage meuble IKEA	1	1	2
\.


--
-- TOC entry 3836 (class 0 OID 16445)
-- Dependencies: 205
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, "Name", "Description", "Categories", "Date", "Remuneration", "State", "Long", "Lat", "Tasker", "Jobber") FROM stdin;
1	montage meuble	Besoin aide montage meuble IKEA	Aide meuble	2020-05-20	10 euros	Disponible	2.3488	48.8534	1	2
\.


--
-- TOC entry 3838 (class 0 OID 16456)
-- Dependencies: 207
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, lastname, firstname, email, password, phone, adress, "stripeID") FROM stdin;
1	Doe	John	johndoe@gmail.com	johndoe	0123456789	55 rue joyeux	id123
7	Doe	Janette	janedoe@gmail.com	janedoe	0234567891	54 rue joyeux	\N
10	Testeur	Toto	toto@mail.fr	testeur	\N	\N	\N
9	Dieye	\N	\N	test	\N	\N	\N
11	Testeur	Titi	titi@mail.fr	testeuse	\N	\N	\N
\.


--
-- TOC entry 3848 (class 0 OID 0)
-- Dependencies: 202
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, true);


--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 204
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, true);


--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 206
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


-- Completed on 2021-05-17 20:10:26

--
-- PostgreSQL database dump complete
--


--
-- TOC entry 3411 (class 0 OID 16386)
-- Dependencies: 216
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: gendocsuser
--
INSERT INTO
  public.users (
    "created_at",
    "updated_at",
    "first_name",
    "second_name",
    "first_last_name",
    "second_last_name",
    "outlook_email",
    "google_email",
    "password",
    "roles",
    "is_active"
  )
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'Daniela',
    'Daniela',
    'Montenegro',
    'Suarez',
    'ddlm.montenegro@uta.edu.ec',
    'gendocsv2@gmail.com',
    '$2a$12$NMywRUK4Ontc9.4Y1YYyyeTU2aUfHdv42wH6c3dls8cveUdpGo1n2',
    'ADMIN',
    true
  );

--
-- TOC entry 3417 (class 0 OID 24592)
-- Dependencies: 222
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: gendocsuser
--
INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'FACU',
    'CONSEJO DIRECTIVO'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'SUDE',
    'CONSEJO ACADÉMICO'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'COMM', 'COMUNES');

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'SIST',
    'SISTEMAS (UNI-TITU)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'INPA',
    'INDUSTRIAL EN PROCESOS (UNI-TITU)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'ELEC',
    'ELECTRÓNICA Y COMUNICACIONES (UNI-TITU)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'SOFT',
    'SOFTWARE (UNI-IC)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'TECI',
    'TECNOLOGÍA DE INFORMACIÓN (UNI-IC)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'TELE',
    'TELECOMUNICACIONES (UNI-IC)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'INDS',
    'INDUSTRIAL (UNI-IC)'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'ESTU',
    'ESTUDIANTES'
  );

INSERT INTO
  public.modules ("created_at", "updated_at", "code", "name")
VALUES
  (
    '2023-06-05',
    '2023-06-05',
    'ADMIN',
    'ADMINISTRADOR'
  );

--
-- TOC entry 3419 (class 0 OID 40963)
-- Dependencies: 224
-- Data for Name: submodules; Type: TABLE DATA; Schema: public; Owner: gendocsuser
--
INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Buscar');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Consejos');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Procesos');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Documentos');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Estudiantes');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Funcionarios');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Carreras');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Usuarios');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Actas de grado');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Historial');

INSERT INTO
  public.submodules ("created_at", "updated_at", "name")
VALUES
  ('2023-06-05', '2023-06-05', 'Cargos');

--  
-- TOC entry 3420 (class 0 OID 40989)
-- Dependencies: 225
-- Data for Name: submodules_modules; Type: TABLE DATA; Schema: public; Owner: gendocsuser
--
INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 1);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 1);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 1);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 1);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 2);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 2);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 2);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 2);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 4);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 4);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 4);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 4);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 5);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 5);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 5);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 5);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 6);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 6);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 6);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 6);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 7);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 7);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 7);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 7);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 8);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 8);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 8);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 8);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 9);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 9);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 9);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 9);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (1, 10);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (2, 10);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (3, 10);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (4, 10);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (5, 12);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (6, 12);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (7, 12);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (8, 12);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (11, 12);

INSERT INTO
  public.submodules_modules ("submodule_id", "module_id")
VALUES
  (9, 3);

--
-- TOC entry 3421 (class 0 OID 40994)
-- Dependencies: 226
-- Data for Name: users_access_modules; Type: TABLE DATA; Schema: public; Owner: gendocsuser
--
INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 1);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 2);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 3);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 4);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 5);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 6);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 7);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 8);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 9);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 10);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 11);

INSERT INTO
  public.users_access_modules ("user_id", "module_id")
VALUES
  (1, 12);
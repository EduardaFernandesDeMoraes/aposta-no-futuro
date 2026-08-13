CREATE TABLE public.lista_espera (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  origem text NOT NULL DEFAULT 'comunidade' CHECK (origem IN ('comunidade','mentor')),
  criado_em timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX lista_espera_email_key ON public.lista_espera (lower(email));

GRANT INSERT ON public.lista_espera TO anon, authenticated;
GRANT ALL ON public.lista_espera TO service_role;

ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode entrar na lista"
ON public.lista_espera
FOR INSERT
TO anon, authenticated
WITH CHECK (char_length(email) > 3 AND char_length(email) < 255);
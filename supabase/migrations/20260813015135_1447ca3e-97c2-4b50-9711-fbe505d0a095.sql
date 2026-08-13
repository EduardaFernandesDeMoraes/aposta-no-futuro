CREATE TABLE public.community_waitlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  wants_to_mentor boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.community_waitlist TO anon;
GRANT INSERT ON public.community_waitlist TO authenticated;
GRANT ALL ON public.community_waitlist TO service_role;
ALTER TABLE public.community_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.community_waitlist FOR INSERT TO anon, authenticated WITH CHECK (char_length(email) > 3 AND char_length(email) < 255);
-- Create game saves table for cloud persistence
CREATE TABLE public.game_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  save_name TEXT NOT NULL DEFAULT 'Sauvegarde',
  company_data JSONB NOT NULL,
  game_state JSONB NOT NULL,
  game_settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  play_time INTEGER NOT NULL DEFAULT 0, -- in seconds
  is_auto_save BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own saves
CREATE POLICY "Users can view their own saves" 
ON public.game_saves 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saves" 
ON public.game_saves 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saves" 
ON public.game_saves 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves" 
ON public.game_saves 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow anonymous saves (for localStorage-only users who later sign up)
CREATE POLICY "Allow anonymous saves with null user_id" 
ON public.game_saves 
FOR ALL 
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_game_save_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_game_saves_updated_at
BEFORE UPDATE ON public.game_saves
FOR EACH ROW
EXECUTE FUNCTION public.update_game_save_updated_at();
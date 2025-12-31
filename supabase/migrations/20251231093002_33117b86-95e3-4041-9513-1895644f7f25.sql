-- Remove the insecure anonymous saves policy
DROP POLICY IF EXISTS "Allow anonymous saves with null user_id" ON public.game_saves;

-- Add database check constraints for JSONB size limits to prevent storage abuse
ALTER TABLE public.game_saves ADD CONSTRAINT check_company_data_size 
CHECK (pg_column_size(company_data) < 5242880);

ALTER TABLE public.game_saves ADD CONSTRAINT check_game_state_size 
CHECK (pg_column_size(game_state) < 1048576);

ALTER TABLE public.game_saves ADD CONSTRAINT check_game_settings_size 
CHECK (pg_column_size(game_settings) < 1048576);
-- 1. Cria uma função segura (SECURITY DEFINER) para buscar o convite,
-- passando por cima do bloqueio RLS da tabela 'casas'
CREATE OR REPLACE FUNCTION validar_codigo_convite(termo text)
RETURNS json AS $$
DECLARE
  casa_encontrada record;
BEGIN
  SELECT id, nome, codigo_convite, token_convite 
  INTO casa_encontrada
  FROM casas
  WHERE codigo_convite = upper(termo) OR token_convite = termo
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN row_to_json(casa_encontrada);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Garante que qualquer pessoa logada consiga se vincular como membro da casa
DROP POLICY IF EXISTS "Usuários podem se inserir em membros_casa" ON membros_casa;
CREATE POLICY "Usuários podem se inserir em membros_casa"
  ON membros_casa FOR INSERT
  WITH CHECK (auth.uid() = user_id);

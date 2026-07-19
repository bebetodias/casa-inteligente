import { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../components/primitives/Modal';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { Avatar } from '../../components/primitives/Avatar';
import { CATEGORIAS, getUnidadesComExtras, buscarNoCatalogo } from '../../services/mock/catalog';
import { useAuthStore } from '../../stores/authStore';
import { SearchIcon } from './ShoppingIcons';
import './AddItemModal.css';

export function AddItemModal({ open, onClose, onAdd, initialQuery = '' }) {
  const { user } = useAuthStore();

  const [nome, setNome] = useState(initialQuery);
  const [categoria, setCategoria] = useState('outros');
  const [quantidade, setQuantidade] = useState('1');
  const [unidade, setUnidade] = useState('un');
  const [observacao, setObservacao] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Sugestões do autocomplete (catalogo global)
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  // ====== LISTAS DERIVADAS (FUNCIONAM COM .map) ======
  const categoriaOptions = useMemo(
    () => Object.entries(CATEGORIAS).map(([key, c]) => ({
      value: key,
      label: `${c.icon}  ${c.nome}`,
    })),
    []
  );

  // >>> AQUI ESTÁ A CORREÇÃO PRINCIPAL <<<
  const unidadeOptions = useMemo(() => getUnidadesComExtras(), []);
  // =================================================

  // Quando o modal abre, reset
  useEffect(() => {
    if (open) {
      setNome(initialQuery || '');
      setCategoria('outros');
      setQuantidade('1');
      setUnidade('un');
      setObservacao('');
      setError(null);
      setSugestoes([]);
      setMostrarSugestoes(false);
    }
  }, [open, initialQuery]);

  // Atualiza sugestões conforme o usuário digita
  useEffect(() => {
    if (nome.length >= 1) {
      setSugestoes(buscarNoCatalogo(nome, 6));
    } else {
      setSugestoes([]);
    }
  }, [nome]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nome.trim()) {
      setError('Informe o nome do item.');
      return;
    }

    const qtdNum = parseFloat(String(quantidade).replace(',', '.'));
    if (!quantidade || isNaN(qtdNum) || qtdNum <= 0) {
      setError('Quantidade inválida.');
      return;
    }

    setSubmitting(true);
    try {
      if (onAdd) {
        await onAdd({
          nome: nome.trim(),
          categoria,                              
          produtoId: null,                        
          quantidade: qtdNum,
          unidade,
          observacao: observacao.trim() || null,
          membroId: user?.id,                     
        });
      }

      onClose();
    } catch (err) {
      console.error('Erro ao adicionar:', err);
      setError(err.message || 'Erro ao adicionar item.');
    } finally {
      setSubmitting(false);
    }
  };

  const aplicarSugestao = (s) => {
    setNome(s.nome);
    setCategoria(s.categoria);
    setUnidade(s.unidadePadrao);
    setMostrarSugestoes(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adicionar à lista"
      size="medium"
      footer={
        <>
          <Button variant="subtle" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
            Adicionar à lista
          </Button>
        </>
      }
    >
      <form className="add-form" onSubmit={handleSubmit}>
        {error && <div className="add-form__error">{error}</div>}

        <div className="add-form__field-wrapper">
          <Input
            label="Nome do item"
            placeholder="Ex.: Arroz, Leite, Tomate..."
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setMostrarSugestoes(true);
            }}
            onFocus={() => setMostrarSugestoes(true)}
            onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
            isRequired
            autoComplete="off"
            iconBefore={<SearchIcon />}
          />

          {mostrarSugestoes && sugestoes.length > 0 && (
            <ul className="add-form__suggestions" role="listbox">
              {sugestoes.map((s) => {
                const cat = CATEGORIAS[s.categoria] || CATEGORIAS.outros;
                return (
                  <li
                    key={s.nome}
                    role="option"
                    aria-selected="false"
                    onMouseDown={() => aplicarSugestao(s)}
                  >
                    <span className="add-form__suggestion-icon" aria-hidden="true">
                      {cat.icon}
                    </span>
                    <span>{s.nome}</span>
                    <Badge variant="neutral">{cat.nome}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Select
          label="Categoria"
          options={categoriaOptions}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          isRequired
        />

        <div className="add-form__row">
          <Input
            label="Quantidade"
            type="text"
            inputMode="decimal"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            isRequired
          />
          <Select
            label="Unidade"
            options={unidadeOptions}
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
            isRequired
          />
        </div>

        <div className="add-form__field-wrapper">
          <Input
            label="Observação"
            placeholder="Ex.: marca preferida, sem lactose..."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            hint="Opcional"
          />
        </div>

        <div className="add-form__author">
          <Avatar name={user?.nome || 'Você'} size="small" />
          <span>
            Será adicionado por <strong>{user?.nome || 'você'}</strong>
          </span>
        </div>
      </form>
    </Modal>
  );
}
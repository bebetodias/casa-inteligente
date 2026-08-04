import { useState } from 'react';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { useShoppingList } from '../../hooks/useShoppingList';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../hooks/useToast';
import './RecipeDetailModal.css';

export function RecipeDetailModal({ receita, onClose, onToggleFavorito, isFavorito }) {
  const { casa, user } = useAuthStore();
  const { adicionar: adicionarAoCarrinho } = useShoppingList(casa?.id, user?.id);
  const { showToast } = useToastStore();

  const [passosConcluidos, setPassosConcluidos] = useState([]);
  const [adicionandoItens, setAdicionandoItens] = useState(false);
  const [itensAdicionados, setItensAdicionados] = useState([]);

  if (!receita) return null;

  const { match } = receita;

  const handleTogglePasso = (index) => {
    setPassosConcluidos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAdicionarItemFaltante = async (ingrediente) => {
    try {
      await adicionarAoCarrinho({
        nome: ingrediente.nome,
        categoria: ingrediente.categoria || 'outros',
        quantidade: 1,
        unidade: 'un',
      });
      setItensAdicionados((prev) => [...prev, ingrediente.nome]);
      showToast(`'${ingrediente.nome}' adicionado à lista de compras!`, 'success');
    } catch (err) {
      showToast('Erro ao adicionar item à lista de compras.', 'error');
    }
  };

  const handleAdicionarTodosFaltantes = async () => {
    if (!match?.faltantes?.length) return;
    setAdicionandoItens(true);
    try {
      let cont = 0;
      for (const ing of match.faltantes) {
        if (!itensAdicionados.includes(ing.nome)) {
          await adicionarAoCarrinho({
            nome: ing.nome,
            categoria: ing.categoria || 'outros',
            quantidade: 1,
            unidade: 'un',
          });
          setItensAdicionados((prev) => [...prev, ing.nome]);
          cont++;
        }
      }
      if (cont > 0) {
        showToast(`${cont} ingrediente(s) adicionados à Lista de Compras!`, 'success');
      } else {
        showToast('Todos os faltantes já foram adicionados.', 'info');
      }
    } catch (err) {
      showToast('Erro ao adicionar ingredientes faltantes.', 'error');
    } finally {
      setAdicionandoItens(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="">
      <div className="recipe-modal">
        {/* Banner de cabeçalho */}
        <div className="recipe-modal__header">
          <div className="recipe-modal__icon">{receita.imagemEmoji || '🍲'}</div>
          <div className="recipe-modal__header-info">
            <div className="recipe-modal__tags">
              <Badge variant="info">{receita.categoria}</Badge>
              {receita.dietas?.map((dieta) => (
                <Badge key={dieta} variant="neutral">
                  {dieta === 'vegetariano' ? '🥗 Vegetariano' :
                   dieta === 'sem-gluten' ? '🌾 Sem Glúten' :
                   dieta === 'low-carb' ? '🥑 Low Carb' :
                   dieta === 'rapida' ? '⚡ Rápida' : dieta}
                </Badge>
              ))}
            </div>
            <h2 className="recipe-modal__title">{receita.titulo}</h2>
            <p className="recipe-modal__description">{receita.descricao}</p>
          </div>

          <button
            className={`recipe-modal__fav-btn ${isFavorito ? 'recipe-modal__fav-btn--active' : ''}`}
            onClick={() => onToggleFavorito(receita.id)}
            title={isFavorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          >
            {isFavorito ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Metadados da Receita */}
        <div className="recipe-modal__meta">
          <div className="recipe-modal__meta-item">
            <span className="recipe-modal__meta-icon">⏱️</span>
            <div>
              <span className="recipe-modal__meta-label">Tempo</span>
              <span className="recipe-modal__meta-val">{receita.tempoPreparo} min</span>
            </div>
          </div>
          <div className="recipe-modal__meta-item">
            <span className="recipe-modal__meta-icon">👥</span>
            <div>
              <span className="recipe-modal__meta-label">Porções</span>
              <span className="recipe-modal__meta-val">{receita.porcoes} {receita.porcoes === 1 ? 'pessoa' : 'pessoas'}</span>
            </div>
          </div>
          <div className="recipe-modal__meta-item">
            <span className="recipe-modal__meta-icon">📊</span>
            <div>
              <span className="recipe-modal__meta-label">Dificuldade</span>
              <span className="recipe-modal__meta-val">{receita.dificuldade}</span>
            </div>
          </div>
        </div>

        {/* Status de Match da Despensa */}
        <div className={`recipe-modal__match-bar recipe-modal__match-bar--${match?.prontoAgora ? 'full' : match?.quasePronto ? 'partial' : 'low'}`}>
          <div className="recipe-modal__match-info">
            <span className="recipe-modal__match-badge">
              {match?.prontoAgora ? '🎯 Pronta para Fazer' : match?.quasePronto ? '🛒 Falta Pouco' : '📖 Receita Completa'}
            </span>
            <span className="recipe-modal__match-text">
              {match?.presentes.length} de {match?.total} ingredientes na sua despensa ({match?.percentual}%)
            </span>
          </div>
          <div className="recipe-modal__progress-bg">
            <div
              className="recipe-modal__progress-fill"
              style={{ width: `${match?.percentual}%` }}
            />
          </div>
        </div>

        {/* Seção de Ingredientes */}
        <div className="recipe-modal__section">
          <div className="recipe-modal__section-header">
            <h3 className="recipe-modal__section-title">Ingredientes ({receita.ingredientes.length})</h3>
            {match?.faltantes?.length > 0 && (
              <button
                className="recipe-modal__btn-add-all"
                onClick={handleAdicionarTodosFaltantes}
                disabled={adicionandoItens}
              >
                🛒 Adicionar faltantes à Lista ({match.faltantes.length})
              </button>
            )}
          </div>

          <div className="recipe-modal__ingredients-list">
            {receita.ingredientes.map((ing, idx) => {
              const temEmCasa = match?.presentes?.some((p) => p.nome === ing.nome);
              const jaAdicionado = itensAdicionados.includes(ing.nome);

              return (
                <div
                  key={idx}
                  className={`ingredient-item ${temEmCasa ? 'ingredient-item--available' : 'ingredient-item--missing'}`}
                >
                  <span className="ingredient-item__status">
                    {temEmCasa ? '✅' : '⚠️'}
                  </span>
                  <span className="ingredient-item__name">
                    <strong>{ing.nome}</strong> &bull; <span className="ingredient-item__qty">{ing.quantidade}</span>
                  </span>

                  {!temEmCasa && (
                    <button
                      className={`ingredient-item__btn-add ${jaAdicionado ? 'ingredient-item__btn-add--added' : ''}`}
                      onClick={() => handleAdicionarItemFaltante(ing)}
                      disabled={jaAdicionado}
                    >
                      {jaAdicionado ? '✓ Na Lista' : '+ Add à Lista'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Seção do Modo de Preparo */}
        <div className="recipe-modal__section">
          <h3 className="recipe-modal__section-title">Modo de Preparo ({receita.passos.length} passos)</h3>
          <div className="recipe-modal__steps-list">
            {receita.passos.map((passo, index) => {
              const concluido = passosConcluidos.includes(index);
              return (
                <label
                  key={index}
                  className={`step-item ${concluido ? 'step-item--completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={concluido}
                    onChange={() => handleTogglePasso(index)}
                  />
                  <span className="step-item__number">{index + 1}</span>
                  <span className="step-item__text">{passo}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Dica do Chef */}
        {receita.dicaChef && (
          <div className="recipe-modal__chef-tip">
            <span className="recipe-modal__chef-icon">👨‍🍳</span>
            <div>
              <strong>Dica do Chef:</strong>
              <p>{receita.dicaChef}</p>
            </div>
          </div>
        )}

        {/* Rodapé de ações */}
        <div className="recipe-modal__footer">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              showToast('Bom apetite! Receita marcada como feita.', 'success');
              onClose();
            }}
          >
            🧑‍🍳 Fazer Receita
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useRecipes } from '../../hooks/useRecipes';
import { buscarSugestoesIngredientes } from '../../services/mock/recipesMock';
import { DonutChart } from '../../components/primitives/DonutChart';
import { EmptyState } from '../../components/primitives/EmptyState';
import { Button } from '../../components/primitives/Button';
import { RecipeDetailModal } from './RecipeDetailModal';
import { AddRecipeModal } from './AddRecipeModal';
import { useShoppingList } from '../../hooks/useShoppingList';
import { useToastStore } from '../../hooks/useToast';
import './SuperCook.css';
import { PlusIcon, TrashIcon, SearchIcon } from '../../utils/Icons';

export function SuperCook() {
  const { casa } = useAuthStore();
  const { adicionar: adicionarAoCarrinho } = useShoppingList(casa?.id);
  const { showToast } = useToastStore();

  const {
    despensa,
    favoritos,
    receitas,
    loadingOnline,
    buscaOnlineAtiva,
    adicionarIngrediente,
    removerIngrediente,
    limparDespensa,
    selecionarBasicos,
    toggleFavorito,
    adicionarReceitaCustom,
    buscarNaWeb,
    limparBuscaWeb,
  } = useRecipes();

  // Estados de filtros
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroDieta, setFiltroDieta] = useState('todas');

  // Autocomplete da Despensa
  const [inputIngrediente, setInputIngrediente] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const autocompleteRef = useRef(null);

  // Modais
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fechar dropdown de sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputIngrediente(val);
    if (val.trim().length >= 1) {
      const novassugestoes = buscarSugestoesIngredientes(val);
      setSugestoes(novassugestoes);
      setMostrarSugestoes(true);
    } else {
      setSugestoes([]);
      setMostrarSugestoes(false);
    }
  };

  const handleSelecionarIngrediente = (nome) => {
    adicionarIngrediente(nome);
    setInputIngrediente('');
    setSugestoes([]);
    setMostrarSugestoes(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputIngrediente.trim()) {
      handleSelecionarIngrediente(inputIngrediente.trim());
    }
  };

  // Adicionar ingredientes faltantes diretamente à Lista de Compras do App
  const handleAdicionarFaltantesALista = async (e, receta) => {
    e.stopPropagation();
    if (!receta.match?.faltantes?.length) return;
    try {
      let cont = 0;
      for (const ing of receta.match.faltantes) {
        await adicionarAoCarrinho({
          nome: ing.nome,
          categoria: ing.categoria || 'outros',
          quantidade: 1,
          unidade: 'un',
        });
        cont++;
      }
      showToast(`${cont} ingrediente(s) adicionados à Lista de Compras!`, 'success');
    } catch (err) {
      showToast('Erro ao adicionar à lista de compras.', 'error');
    }
  };

  // Filtrar receitas baseadas nas buscas e seleções
  const receitasFiltradas = useMemo(() => {
    if (despensa.length === 0) return [];
    return receitas.filter((receita) => {
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const matchTitulo = receita.titulo.toLowerCase().includes(termo);
        const matchIngrediente = receita.ingredientes.some((i) =>
          i.nome.toLowerCase().includes(termo)
        );
        if (!matchTitulo && !matchIngrediente) return false;
      }

      if (filtroCategoria !== 'todas' && receita.categoria !== filtroCategoria) {
        return false;
      }

      if (filtroDieta !== 'todas') {
        if (filtroDieta === 'rapida' && receita.tempoPreparo > 20) return false;
        if (filtroDieta !== 'rapida' && (!receita.dietas || !receita.dietas.includes(filtroDieta))) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.match.percentual - a.match.percentual);
  }, [receitas, despensa, busca, filtroCategoria, filtroDieta]);

  // Regra 1: O Bloco 1 ("Pronto para cozinhar") só deve aparecer se a receita tiver 100% dos ingredientes
  const receitaHero = useMemo(() => {
    if (despensa.length === 0) return null;
    return receitasFiltradas.find((r) => r.match.prontoAgora) || null;
  }, [receitasFiltradas, despensa]);

  // Regra 2: "Vai faltar pouco" só se tiver pelo menos 1 ingrediente
  const receitasVaiFaltarPouco = useMemo(() => {
    if (despensa.length === 0) return [];
    return receitasFiltradas.filter(
      (r) => r.match.quasePronto && r.id !== receitaHero?.id
    ).slice(0, 4);
  }, [receitasFiltradas, receitaHero, despensa]);

  return (
    <div className="supercook-page">
      {/* Cabeçalho */}
      <header className="supercook__header">
        <div className="supercook__title-area">
          <p className="supercook__eyebrow">{casa?.nome || 'Minha Casa'}</p>
          <h1 className="supercook__title">SuperCook</h1>
          <p className="supercook__subtitle">
            {despensa.length} ingrediente(s) na despensa
          </p>
        </div>

        <div className="supercook__actions">
          <Button
            variant="primary"
            size="medium"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Nova Receita
          </Button>
          <Button
            variant="link"
            size="medium"
            iconBefore={<PlusIcon size={16} />}
            onClick={selecionarBasicos}
          >
            Básicos
          </Button>
          {despensa.length > 0 && (
            <Button
              variant="link"
              size="medium"
              iconBefore={<TrashIcon size={16} />}
              onClick={limparDespensa}
            >
              Limpar
            </Button>
          )}
        </div>
      </header>

      {/* Painel da Despensa Limpo e Minimalista */}
      <section className="supercook__pantry-clean">
        <div className="supercook__pantry-header">
          <h2>Sua despensa</h2>
          <span>{despensa.length} ITENS</span>
        </div>

        {/* Campo de Busca com Autocomplete */}
        <div className="supercook__autocomplete-container" ref={autocompleteRef}>
          <form onSubmit={handleFormSubmit} className="supercook__autocomplete-form">
            <span className="supercook__search-icon-pantry"><SearchIcon size={16} /></span>
            <input
              type="text"
              className="supercook__autocomplete-input"
              placeholder="Digite um ingrediente (ex: Ovo, Tomate, Frango...) e pressione Enter..."
              value={inputIngrediente}
              onChange={handleInputChange}
              onFocus={() => inputIngrediente.trim() && setMostrarSugestoes(true)}
            />
            <Button
              type="submit"
              variant="primary"
              size="medium"
              iconBefore={<PlusIcon size={16} />}
            >
              Adicionar
            </Button>
          </form>

          {mostrarSugestoes && sugestoes.length > 0 && (
            <ul className="supercook__suggestions-dropdown">
              {sugestoes.map((item, idx) => (
                <li
                  key={idx}
                  className="supercook__suggestion-item"
                  onClick={() => handleSelecionarIngrediente(item)}
                >
                  <span className="supercook__suggestion-plus">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tags de Ingredientes Selecionados */}
        <div className="supercook__tags-wrapper">
          {despensa.length === 0 ? (
            <p className="supercook__empty-pantry-text">
              Nenhum ingrediente adicionado. Digite acima para ver as sugestões!
            </p>
          ) : (
            despensa.map((ingrediente) => (
              <span key={ingrediente} className="supercook__ingredient-tag">
                <span className="supercook__ingredient-tag-name">{ingrediente}</span>
                <button
                  className="supercook__ingredient-tag-remove"
                  onClick={() => removerIngrediente(ingrediente)}
                  title={`Remover ${ingrediente}`}
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>

        {/* Barra de Filtros e Pesquisa Web */}
        <div className="supercook__filter-bar">
          <div className="supercook__search-box">
            <span className="supercook__search-icon"><SearchIcon size={16} /></span>
            <input
              type="text"
              className="supercook__search-input"
              placeholder="Filtrar receitas por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            {busca && (
              <button className="supercook__clear-search" onClick={() => setBusca('')}>
                ✕
              </button>
            )}
          </div>

          <div className="supercook__filter-actions">
            <button
              className={`supercook__web-btn ${buscaOnlineAtiva ? 'supercook__web-btn--active' : ''}`}
              onClick={() => {
                if (buscaOnlineAtiva) {
                  limparBuscaWeb();
                } else {
                  buscarNaWeb(busca || 'chicken');
                }
              }}
              disabled={loadingOnline}
            >
              {loadingOnline
                ? 'Buscando na Web...'
                : buscaOnlineAtiva
                ? '✕ Busca Web'
                : 'Buscar na Web'}
            </button>

            <select
              className="supercook__select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="todas">Refeições</option>
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Almoço/Jantar">Almoço / Jantar</option>
              <option value="Lanche">Lanche</option>
              <option value="Sobremesa">Sobremesa</option>
            </select>

            <select
              className="supercook__select"
              value={filtroDieta}
              onChange={(e) => setFiltroDieta(e.target.value)}
            >
              <option value="todas">Dietas</option>
              <option value="vegetariano">Vegetariano</option>
              <option value="sem-gluten">Sem Glúten</option>
              <option value="low-carb">Low Carb</option>
              <option value="rapida">Rápidas</option>
            </select>
          </div>
        </div>
      </section>

      {buscaOnlineAtiva && (
        <div className="supercook__web-notice">
          🌐 <strong>Busca Online Ativa:</strong> Exibindo receitas encontradas na API da web formatadas com cálculo de match para a sua despensa.
        </div>
      )}

      {/* REGRA 3: Se a despensa está vazia ou nenhuma receita foi encontrada, mostra o EmptyState */}
      {despensa.length === 0 ? (
        <EmptyState
          icon="🧺"
          title="Sua despensa está vazia"
          description="Adicione os ingredientes que você tem em casa no campo acima para receber sugestões de receitas personalizadas!"
          action={
            <Button variant="primary" onClick={selecionarBasicos}>
              ✨ Carregar Ingredientes Básicos
            </Button>
          }
        />
      ) : receitasFiltradas.length === 0 ? (
        <EmptyState
          icon="🍳"
          title="Nenhuma receita encontrada"
          description="Nenhuma receita corresponde aos ingredientes ou filtros informados."
          action={
            <Button variant="primary" onClick={() => buscarNaWeb(busca || 'chicken')}>
              🌐 Buscar Receitas na Web (API)
            </Button>
          }
        />
      ) : (
        <>
          {/* REGRA 1: BLOCO 1 ("Pronto para cozinhar") só aparece se tivermos 100% dos ingredientes de uma receita */}
          {receitaHero && receitaHero.match.prontoAgora && (
            <section className="supercook__block">
              <article
                className="hero-card"
                onClick={() => setReceitaSelecionada(receitaHero)}
              >
                <div className="hero-card__badge-top">
                  <span className="hero-card__badge">Pronto para cozinhar</span>
                </div>

                <div className="hero-card__content">
                  <h2 className="hero-card__title">{receitaHero.titulo}</h2>
                  <div className="hero-card__meta">
                    <span>{receitaHero.tempoPreparo} min</span> &bull;{' '}
                    <span>{receitaHero.porcoes} porções</span> &bull;{' '}
                    <span>{receitaHero.dificuldade}</span>
                  </div>

                  <div className="hero-card__ingredients">
                    {receitaHero.ingredientes.map((ing, idx) => (
                      <span key={idx} className="hero-card__ing-chip">
                        {ing.nome}
                      </span>
                    ))}
                  </div>

                  <button
                    className="hero-card__cta-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReceitaSelecionada(receitaHero);
                    }}
                  >
                    Ver receita completa
                  </button>
                </div>
              </article>
            </section>
          )}

          {/* REGRA 2: BLOCO 2 ("Vai faltar pouco") só aparece se tiver pelo menos 1 ingrediente na despensa */}
          {receitasVaiFaltarPouco.length > 0 && (
            <section className="supercook__block">
              <div className="supercook__block-header">
                <h2 className="supercook__block-title">Vai faltar pouco</h2>
                <span className="supercook__block-subtitle">1 ITEM OU MENOS</span>
              </div>

              <div className="supercook__grid-2">
                {receitasVaiFaltarPouco.map((receta) => (
                  <article
                    key={receta.id}
                    className="small-recipe-card"
                    onClick={() => setReceitaSelecionada(receta)}
                  >
                    <div className="small-recipe-card__thumb-bg">
                      {receta.imagemUrl ? (
                        <img src={receta.imagemUrl} alt={receta.titulo} />
                      ) : (
                        <span>{receta.imagemEmoji || '🍳'}</span>
                      )}
                    </div>

                    <div className="small-recipe-card__body">
                      <h3 className="small-recipe-card__title">{receta.titulo}</h3>
                      <div className="small-recipe-card__meta">
                        <span>{receta.tempoPreparo} min</span> &bull;{' '}
                        <span>{receta.dificuldade}</span>
                      </div>

                      <div className="small-recipe-card__status">
                        {receta.match.prontoAgora ? (
                          <span className="status-text status-text--success">Você tem tudo</span>
                        ) : (
                          <span className="status-text status-text--warning">
                            Falta {receta.match.faltantes.length} item
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* REGRA 2: BLOCO 3 ("Todas as sugestões") só aparece se tiver pelo menos 1 ingrediente na despensa */}
          <section className="supercook__block">
            <div className="supercook__block-header">
              <h2 className="supercook__block-title">Todas as sugestões</h2>
              <span className="supercook__block-subtitle">
                {receitasFiltradas.length} RECEITAS
              </span>
            </div>

            <div className="supercook__list-vertical">
              {receitasFiltradas.map((receta) => {
                const { match } = receta;
                return (
                  <article
                    key={receta.id}
                    className="list-recipe-card"
                    onClick={() => setReceitaSelecionada(receta)}
                  >
                    <div className="list-recipe-card__top">
                      <div className="list-recipe-card__head">
                        {/* Gráfico de Rosca */}
                        <div className="list-recipe-card__donut">
                          <DonutChart percentual={match.percentual} size={48} strokeWidth={4} />
                        </div>

                        <div className="list-recipe-card__info">
                          <h3 className="list-recipe-card__title">{receta.titulo}</h3>
                          <div className="list-recipe-card__meta">
                            <span>{receta.tempoPreparo} min</span> &bull;{' '}
                            <span>{receta.porcoes} porções</span>
                          </div>
                        </div>
                      </div>

                      <div className="list-recipe-card__ingredients">
                        {/* Pílulas de Ingredientes (Verde = presente, Vermelho Pontilhado = faltante) */}
                        <div className="list-recipe-card__ingredients">
                          {receta.ingredientes.map((ing, idx) => {
                            const temEmCasa = match.presentes.some((p) => p.nome === ing.nome);
                            return (
                              <span
                                key={idx}
                                className={`ing-pill ${
                                  temEmCasa ? 'ing-pill--available' : 'ing-pill--missing'
                                }`}
                              >
                                {ing.nome}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Linha Divisória de Rodapé do Card */}
                    <div className="list-recipe-card__footer">
                      {match.prontoAgora ? (
                        <span className="list-recipe-card__status-msg list-recipe-card__status-msg--success">
                          Você tem tudo
                        </span>
                      ) : (
                        <button
                          className="list-recipe-card__action-link"
                          onClick={(e) => handleAdicionarFaltantesALista(e, receta)}
                        >
                          Falta {match.faltantes.length} {match.faltantes.length === 1 ? 'item' : 'itens'} &bull; <span className="action-underline">adicionar à lista</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* BLOCO 4: MÉTRICAS DE RODAPÉ */}
          <section className="supercook__metrics-grid">
            <div className="metric-card">
              <span className="metric-card__dot metric-card__dot--peach" />
              <div className="metric-card__number">{favoritos.length}</div>
              <div className="metric-card__label">Receitas favoritas</div>
            </div>

            <div className="metric-card">
              <span className="metric-card__dot metric-card__dot--blue" />
              <div className="metric-card__number">{receitasFiltradas.length}</div>
              <div className="metric-card__label">Sugestões hoje</div>
            </div>
          </section>
        </>
      )}

      {/* Modais */}
      {receitaSelecionada && (
        <RecipeDetailModal
          receita={receitaSelecionada}
          isFavorito={favoritos.includes(receitaSelecionada.id)}
          onToggleFavorito={toggleFavorito}
          onClose={() => setReceitaSelecionada(null)}
        />
      )}

      {isAddModalOpen && (
        <AddRecipeModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={adicionarReceitaCustom}
        />
      )}
    </div>
  );
}

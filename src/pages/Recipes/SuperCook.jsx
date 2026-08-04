import { useState, useMemo, useRef, useEffect } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { buscarSugestoesIngredientes } from '../../services/mock/recipesMock';
import { EmptyState } from '../../components/primitives/EmptyState';
import { Button } from '../../components/primitives/Button';
import { RecipeDetailModal } from './RecipeDetailModal';
import { AddRecipeModal } from './AddRecipeModal';
import './SuperCook.css';

export function SuperCook() {
  const {
    despensa,
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

  // Estados de abas e filtros
  const [activeTab, setActiveTab] = useState('prontas'); // 'prontas' | 'quase' | 'todas' | 'favoritas'
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroDieta, setFiltroDieta] = useState('todas');

  // Estados do Autocomplete da Despensa
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

  // Atualizar sugestões conforme o usuário digita
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

  // Selecionar sugestão ou adicionar item digitado
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

  // Contadores de match
  const contadores = useMemo(() => {
    let prontas = 0;
    let quase = 0;
    let favoritas = 0;

    receitas.forEach((r) => {
      if (r.match.prontoAgora) prontas++;
      if (r.match.quasePronto) quase++;
      if (r.isFavorito) favoritas++;
    });

    return {
      prontas,
      quase,
      todas: receitas.length,
      favoritas,
    };
  }, [receitas]);

  // Filtrar receitas exibidas
  const receitasExibidas = useMemo(() => {
    return receitas.filter((receita) => {
      // Filtro por Aba
      if (activeTab === 'prontas' && !receita.match.prontoAgora) return false;
      if (activeTab === 'quase' && !receita.match.quasePronto) return false;
      if (activeTab === 'favoritas' && !receita.isFavorito) return false;

      // Filtro por Busca de nome ou ingrediente
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const matchTitulo = receita.titulo.toLowerCase().includes(termo);
        const matchIngrediente = receita.ingredientes.some((i) =>
          i.nome.toLowerCase().includes(termo)
        );
        if (!matchTitulo && !matchIngrediente) return false;
      }

      // Filtro por Categoria da Receita
      if (filtroCategoria !== 'todas' && receita.categoria !== filtroCategoria) {
        return false;
      }

      // Filtro por Dieta
      if (filtroDieta !== 'todas') {
        if (filtroDieta === 'rapida' && receita.tempoPreparo > 20) return false;
        if (filtroDieta !== 'rapida' && (!receita.dietas || !receita.dietas.includes(filtroDieta))) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.match.percentual - a.match.percentual);
  }, [receitas, activeTab, busca, filtroCategoria, filtroDieta]);

  return (
    <div className="supercook-page">
      {/* Cabeçalho */}
      <header className="supercook__header">
        <div className="supercook__header-text">
          <div className="supercook__badge-row">
            <span className="supercook__badge">🍳 SuperCook</span>
            <span className="supercook__pantry-count">
              {despensa.length} ingrediente(s) na despensa
            </span>
          </div>
          <h1 className="supercook__title">O que temos para hoje?</h1>
          <p className="supercook__subtitle">
            Informe os ingredientes da sua casa e receba sugestões completas de receitas!
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="supercook__add-btn"
        >
          + Nova Receita
        </Button>
      </header>

      {/* Painel da Despensa Limpo e Minimalista */}
      <section className="supercook__pantry-clean">
        <div className="supercook__pantry-top">
          <label className="supercook__pantry-label">
            🧺 O que você tem em casa?
          </label>
          <div className="supercook__pantry-quick-actions">
            <button
              className="supercook__link-btn"
              onClick={selecionarBasicos}
              title="Marcar ovos, temperos, leite e arroz básico"
            >
              ✨ Carregar Básicos
            </button>
            {despensa.length > 0 && (
              <button
                className="supercook__link-btn supercook__link-btn--danger"
                onClick={limparDespensa}
              >
                🗑️ Limpar tudo
              </button>
            )}
          </div>
        </div>

        {/* Campo de Busca com Autocomplete */}
        <div className="supercook__autocomplete-container" ref={autocompleteRef}>
          <form onSubmit={handleFormSubmit} className="supercook__autocomplete-form">
            <span className="supercook__search-icon-pantry">🔍</span>
            <input
              type="text"
              className="supercook__autocomplete-input"
              placeholder="Digite um ingrediente (ex: Ovo, Tomate, Frango...) e pressione Enter..."
              value={inputIngrediente}
              onChange={handleInputChange}
              onFocus={() => inputIngrediente.trim() && setMostrarSugestoes(true)}
            />
            <button type="submit" className="supercook__autocomplete-add-btn">
              + Adicionar
            </button>
          </form>

          {/* Menu Suspenso de Sugestões */}
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

        {/* Tags de Ingredientes Selecionados na Despensa */}
        <div className="supercook__tags-wrapper">
          {despensa.length === 0 ? (
            <p className="supercook__empty-pantry-text">
              Nenhum ingrediente adicionado. Digite acima para começar a buscar receitas!
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
      </section>

      {/* Abas de Nível de Match */}
      <section className="supercook__tabs-container">
        <div className="supercook__tabs">
          <button
            className={`supercook-tab ${activeTab === 'prontas' ? 'supercook-tab--active' : ''}`}
            onClick={() => setActiveTab('prontas')}
          >
            🎯 Dá pra fazer agora
            <span className="supercook-tab__badge supercook-tab__badge--success">
              {contadores.prontas}
            </span>
          </button>

          <button
            className={`supercook-tab ${activeTab === 'quase' ? 'supercook-tab--active' : ''}`}
            onClick={() => setActiveTab('quase')}
          >
            🛒 Falta pouco (1-2 itens)
            <span className="supercook-tab__badge supercook-tab__badge--warning">
              {contadores.quase}
            </span>
          </button>

          <button
            className={`supercook-tab ${activeTab === 'todas' ? 'supercook-tab--active' : ''}`}
            onClick={() => setActiveTab('todas')}
          >
            📖 Todas as Receitas
            <span className="supercook-tab__badge">{contadores.todas}</span>
          </button>

          <button
            className={`supercook-tab ${activeTab === 'favoritas' ? 'supercook-tab--active' : ''}`}
            onClick={() => setActiveTab('favoritas')}
          >
            ⭐ Favoritas
            <span className="supercook-tab__badge">{contadores.favoritas}</span>
          </button>
        </div>
      </section>

      {/* Barra de Filtros e Busca Externa */}
      <div className="supercook__filter-bar">
        <div className="supercook__search-box">
          <span className="supercook__search-icon">🔍</span>
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
              ? '⏳ Buscando na Web...'
              : buscaOnlineAtiva
              ? '✕ Fechar Busca Web'
              : '🌐 Buscar Receitas na Web (API)'}
          </button>

          <select
            className="supercook__select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todas as Refeições</option>
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
            <option value="todas">Todas as Dietas</option>
            <option value="vegetariano">🥗 Vegetariano</option>
            <option value="sem-gluten">🌾 Sem Glúten</option>
            <option value="low-carb">🥑 Low Carb</option>
            <option value="rapida">⚡ Rápidas (≤20min)</option>
          </select>
        </div>
      </div>

      {buscaOnlineAtiva && (
        <div className="supercook__web-notice">
          🌐 <strong>Busca Online Ativa:</strong> Exibindo receitas encontradas na API da web formatadas com cálculo de match para a sua despensa.
        </div>
      )}

      {/* Grid de Cards de Receita */}
      {receitasExibidas.length === 0 ? (
        <EmptyState
          icon="🍳"
          title="Nenhuma receita encontrada"
          description={
            activeTab === 'prontas'
              ? 'Adicione mais ingredientes no campo acima ou clique em "Buscar Receitas na Web (API)" para explorar mais pratos!'
              : 'Tente ajustar sua busca ou pesquisar receitas adicionais na web.'
          }
          action={
            <div style={{ display: 'flex', gap: '10px' }}>
              {activeTab === 'prontas' && (
                <Button variant="secondary" onClick={() => setActiveTab('todas')}>
                  Ver todas as receitas
                </Button>
              )}
              <Button variant="primary" onClick={() => buscarNaWeb(busca || 'chicken')}>
                🌐 Buscar Receitas na Web
              </Button>
            </div>
          }
        />
      ) : (
        <div className="supercook__recipes-grid">
          {receitasExibidas.map((receita) => {
            const { match, isFavorito } = receita;

            return (
              <article key={receita.id} className="recipe-card">
                <div className="recipe-card__header">
                  {receita.imagemUrl ? (
                    <img
                      src={receita.imagemUrl}
                      alt={receita.titulo}
                      className="recipe-card__thumb"
                    />
                  ) : (
                    <div className="recipe-card__icon">{receita.imagemEmoji || '🍲'}</div>
                  )}

                  <button
                    className={`recipe-card__fav ${isFavorito ? 'recipe-card__fav--active' : ''}`}
                    onClick={() => toggleFavorito(receita.id)}
                    title={isFavorito ? 'Remover dos favoritos' : 'Favoritar'}
                  >
                    {isFavorito ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="recipe-card__body">
                  <div className="recipe-card__category">
                    {receita.categoria} {receita.isOnline && '• 🌐 Web'}
                  </div>
                  <h3 className="recipe-card__title">{receita.titulo}</h3>
                  <p className="recipe-card__desc">{receita.descricao}</p>

                  <div className="recipe-card__meta">
                    <span>⏱️ {receita.tempoPreparo} min</span>
                    <span>👥 {receita.porcoes} pss</span>
                    <span>📊 {receita.dificuldade}</span>
                  </div>

                  <div className="recipe-card__match">
                    <div className="recipe-card__match-header">
                      <span
                        className={`recipe-card__match-pill recipe-card__match-pill--${
                          match.prontoAgora ? 'full' : match.quasePronto ? 'partial' : 'low'
                        }`}
                      >
                        {match.prontoAgora
                          ? '🎯 100% Pronta'
                          : match.quasePronto
                          ? `🛒 Falta ${match.faltantes.length}`
                          : `${match.percentual}%`}
                      </span>
                      <span className="recipe-card__match-text">
                        {match.matchCount}/{match.total} ingrediente(s)
                      </span>
                    </div>

                    <div className="recipe-card__progress-bar">
                      <div
                        className="recipe-card__progress-fill"
                        style={{ width: `${match.percentual}%` }}
                      />
                    </div>
                  </div>

                  {match.faltantes.length > 0 && (
                    <div className="recipe-card__missing-box">
                      <span className="recipe-card__missing-label">Falta:</span>
                      <div className="recipe-card__missing-list">
                        {match.faltantes.slice(0, 3).map((ing, idx) => (
                          <span key={idx} className="recipe-card__missing-tag">
                            {ing.nome}
                          </span>
                        ))}
                        {match.faltantes.length > 3 && (
                          <span className="recipe-card__missing-tag">
                            +{match.faltantes.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="recipe-card__footer">
                  <button
                    className="recipe-card__btn-view"
                    onClick={() => setReceitaSelecionada(receita)}
                  >
                    Ver Receita Completa →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modais */}
      {receitaSelecionada && (
        <RecipeDetailModal
          receita={receitaSelecionada}
          isFavorito={receitaSelecionada.isFavorito}
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

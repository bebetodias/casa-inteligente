import { useEffect, useMemo, useRef, useState } from 'react';
import { useShoppingList } from '../../hooks/useShoppingList';
import { useShoppingShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../hooks/useToast';
import { getSugestoes, getEstatisticasGerais } from '../../services/mock/shoppingService';
import { CATEGORIAS } from '../../services/mock/catalog';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { EmptyState } from '../../components/primitives/EmptyState';
import { ConfirmDialog } from '../../components/primitives/ConfirmDialog';
import { ShoppingItem } from './ShoppingItem';
import { AddItemModal } from './AddItemModal';
import { BuyItemModal } from './BuyItemModal';
import { SuggestionsPanel } from './SuggestionsPanel';
import { ProductDrawer } from './ProductDrawer';
import { History } from './History';
import { CartIcon, PlusIcon, TrashIcon, SparkleIcon } from './ShoppingIcons';
import './Shopping.css';

export function Shopping() {
  const { user, casa } = useAuthStore();
  const { showToast } = useToast();
  const { itens, loading, error, recarregar, adicionar, remover, comprar, limpar, readicionar } =
    useShoppingList(casa?.id, user?.id);

  const searchInputRef = useRef(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [stats, setStats] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'history'
  const [showAdd, setShowAdd] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [buyTarget, setBuyTarget] = useState(null);
  const [buyResolver, setBuyResolver] = useState(null);
  const [drawerProdutoId, setDrawerProdutoId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getSugestoes(), getEstatisticasGerais()])
      .then(([s, st]) => {
        if (mounted) {
          setSugestoes(s);
          setStats(st);
        }
      });
    return () => { mounted = false; };
  }, [itens]);

  useShoppingShortcuts({
    onNew: () => setShowAdd(true),
    onSearch: () => {
      // Se já na lista, não tem busca no header, então pode-se ativar
      document.querySelector('.item__check')?.focus();
    },
    onHistory: () => setView(view === 'list' ? 'history' : 'list'),
  });

  const itensPendentes = itens.filter((i) => i.status === 'pendente');

  const grupos = useMemo(() => {
    const acc = {};
    for (const item of itensPendentes) {
      const cat = item.produto.categoria;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
    }
    return Object.entries(acc)
      .map(([cat, items]) => ({
        categoria: cat,
        meta: CATEGORIAS[cat] || CATEGORIAS.outros,
        items,
      }))
      .sort((a, b) => a.meta.ordem - b.meta.ordem);
  }, [itensPendentes]);

  const gastoEstimado = useMemo(() => {
    return itensPendentes.reduce((acc, item) => acc + (item.precoSugerido || 0), 0);
  }, [itensPendentes]);

  if (view === 'history') {
    return (
      <>
        <History />
        <ViewSwitcher view={view} setView={setView} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="shopping shopping--loading">
        <div className="shopping__loader">
          <CartIcon size={48} />
          <p>Carregando lista...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shopping">
        <EmptyState
          icon="⚠️"
          title="Erro ao carregar"
          description={error}
          action={<Button onClick={() => window.location.reload()}>Tentar novamente</Button>}
        />
      </div>
    );
  }

  return (
    <div className="shopping">
      <header className="shopping__header">
        <div className="shopping__title-area">
          <div className="shopping__title-icon">
            <CartIcon size={24} />
          </div>
          <div>
            <h1 className="shopping__title">Lista de Compras</h1>
            <p className="shopping__subtitle">
              {casa?.nome} · {itensPendentes.length}{' '}
              {itensPendentes.length === 1 ? 'item pendente' : 'itens pendentes'}
            </p>
          </div>
        </div>
        <div className="shopping__actions">
          <ViewSwitcher view={view} setView={setView} compact />
          {itensPendentes.length > 0 && (
            <Button
              variant="subtle"
              size="medium"
              iconBefore={<TrashIcon size={16} />}
              onClick={() => setConfirmClear(true)}
            >
              Limpar
            </Button>
          )}
          <Button
            variant="primary"
            size="medium"
            iconBefore={<PlusIcon size={16} />}
            onClick={() => setShowAdd(true)}
          >
            Adicionar
            <kbd className="shopping__kbd">N</kbd>
          </Button>
        </div>
      </header>

      {sugestoes.length > 0 && (
        <SuggestionsPanel
          sugestoes={sugestoes}
          onAdd={async (s) => {
            await adicionar({
              nome: s.produto.nome,
              produtoId: s.produto.id,
              quantidade: 1,
              unidade: s.produto.unidadePadrao,
              membroId: user.id,
            });
          }}
          expanded={showSuggestions}
          onToggleExpand={() => setShowSuggestions(!showSuggestions)}
        />
      )}

      {stats && itensPendentes.length > 0 && (
        <div className="shopping__metrics">
          <div className="shopping__metric">
            <span className="shopping__metric-label">Gasto estimado</span>
            <span className="shopping__metric-value">
              {gastoEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="shopping__metric">
            <span className="shopping__metric-label">Itens</span>
            <span className="shopping__metric-value">{itensPendentes.length}</span>
          </div>
          <div className="shopping__metric">
            <span className="shopping__metric-label">No mês</span>
            <span className="shopping__metric-value">{stats.comprasNoMes} compras</span>
          </div>
        </div>
      )}

      {itensPendentes.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Sua lista está vazia"
          description="Adicione produtos ou veja as sugestões do app para os itens que costumam acabar."
          action={
            <Button
              variant="primary"
              iconBefore={<PlusIcon size={16} />}
              onClick={() => setShowAdd(true)}
            >
              Adicionar primeiro item
            </Button>
          }
        />
      ) : (
        <div className="shopping__list">
          {grupos.map((grupo) => (
            <section key={grupo.categoria} className="shopping__group">
              <header className="shopping__group-header">
                <span className="shopping__group-icon" aria-hidden="true">
                  {grupo.meta.icon}
                </span>
                <h2 className="shopping__group-title">{grupo.meta.nome}</h2>
                <Badge variant="neutral">{grupo.items.length}</Badge>
              </header>
              <ul className="shopping__items">
                {grupo.items.map((item, index) => (
                  <ShoppingItemWrapper
                    key={item.id}
                    item={item}
                    index={index}
                    onBuy={() => {
                      return new Promise((resolve) => {
                        setBuyTarget(item);
                        setBuyResolver(() => resolve);
                      });
                    }}
                    onDetails={() => setDrawerProdutoId(item.produto.id)}
                    onEdit={() => showToast({ tipo: 'info', descricao: 'A edição será implementada em breve.' })}
                    onRemove={() => setPendingRemove(item)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {showAdd && (
        <AddItemModal
          open={!!showAdd}
          onClose={() => setShowAdd(false)}
          onAdded={async (novoItem) => {
            await recarregar();   // >>> garante atualização visual <<<
            showToast({
              tipo: 'success',
              titulo: 'Item adicionado!',
              descricao: `${novoItem.nome} foi incluído na lista.`,
            });
          }}
        />
      )}

      {buyTarget && (
        <BuyItemModal
          item={buyTarget}
          onClose={() => {
            if (buyResolver) buyResolver(false);
            setBuyTarget(null);
            setBuyResolver(null);
          }}
          onConfirm={async (dados) => {
            await comprar({
              itemId: buyTarget.id,
              ...dados,
              membroId: user.id,
            });
            if (buyResolver) buyResolver(true);
            setBuyTarget(null);
            setBuyResolver(null);
          }}
        />
      )}

      {drawerProdutoId && (
        <ProductDrawer
          produtoId={drawerProdutoId}
          onClose={() => setDrawerProdutoId(null)}
          onReadd={async (produtoId) => {
            await readicionar(produtoId);
            setDrawerProdutoId(null);
          }}
        />
      )}

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={async () => {
          await limpar();
          setConfirmClear(false);
        }}
        title="Limpar lista?"
        description={`Isso removerá todos os ${itensPendentes.length} itens pendentes. O histórico de compras não será afetado.`}
        confirmText="Sim, limpar tudo"
        variant="danger"
        icon={<TrashIcon size={20} />}
      />

      <ConfirmDialog
        open={!!pendingRemove}
        onClose={() => setPendingRemove(null)}
        onConfirm={async () => {
          await remover(pendingRemove.id);
          setPendingRemove(null);
        }}
        title="Remover item?"
        description={`Deseja remover "${pendingRemove?.produto.nome}" da lista? Você pode adicioná-lo novamente depois.`}
        confirmText="Remover"
        cancelText="Manter"
        variant="danger"
      />
    </div>
  );
}

/**
 * Wrapper com animação ao marcar como comprado
 */
function ShoppingItemWrapper({ item, index, onBuy, onDetails, onEdit, onRemove }) {
  const [leaving, setLeaving] = useState(false);

  const handleBuy = async () => {
    setLeaving(true);
    // Espera a animação terminar antes de abrir o modal
    await new Promise((r) => setTimeout(r, 200));
    const confirmed = await onBuy();
    
    // Se o modal foi cancelado, reverte o estado
    if (!confirmed) {
      setLeaving(false);
    }
  };

  return (
    <div
      className={`shopping-item-wrapper ${leaving ? 'shopping-item-wrapper--leaving' : ''}`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <ShoppingItem
        item={item}
        onBuy={handleBuy}
        onDetails={onDetails}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </div>
  );
}

function ViewSwitcher({ view, setView, compact = false }) {
  return (
    <div className={`view-switcher ${compact ? 'view-switcher--compact' : ''}`}>
      <button
        className={`view-switcher__btn ${view === 'list' ? 'view-switcher__btn--active' : ''}`}
        onClick={() => setView('list')}
      >
        <CartIcon size={16} />
        {!compact && 'Lista'}
      </button>
      <button
        className={`view-switcher__btn ${view === 'history' ? 'view-switcher__btn--active' : ''}`}
        onClick={() => setView('history')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 6 V12 L16 14" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" />
        </svg>
        {!compact && 'Histórico'}
      </button>
    </div>
  );
}
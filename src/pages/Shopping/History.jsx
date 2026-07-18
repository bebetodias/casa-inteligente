import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Badge } from '../../components/primitives/Badge';
import { EmptyState } from '../../components/primitives/EmptyState';
import {
  getHistorico,
  getEstatisticasGerais,
} from '../../services/mock/shoppingService';
import { CATEGORIAS } from '../../services/mock/catalog';
import { CartIcon, SearchIcon, PriceIcon, LocationIcon } from './ShoppingIcons';
import './History.css';

const PERIODOS = [
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
  { value: '365', label: 'Último ano' },
  { value: 'all', label: 'Todo o período' },
];

export function History() {
  const [historico, setHistorico] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30');
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    setLoading(true);
    const filtros = {};
    if (periodo !== 'all') filtros.periodo = Number(periodo);

    Promise.all([getHistorico({ ...filtros, limite: 200 }), getEstatisticasGerais()])
      .then(([h, s]) => {
        setHistorico(h);
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, [periodo]);

  const filtrado = useMemo(() => {
    return historico.filter((item) => {
      if (categoriaFiltro && item.produto.categoria !== categoriaFiltro) return false;
      if (busca && !item.produto.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [historico, busca, categoriaFiltro]);

  // Agrupa por data
  const gruposPorData = useMemo(() => {
    const grupos = {};
    for (const item of filtrado) {
      const dataKey = new Date(item.data).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      if (!grupos[dataKey]) grupos[dataKey] = [];
      grupos[dataKey].push(item);
    }
    return Object.entries(grupos);
  }, [filtrado]);

  const categoriaOptions = [
    { value: '', label: 'Todas as categorias' },
    ...Object.entries(CATEGORIAS).map(([k, v]) => ({
      value: k,
      label: `${v.icon} ${v.nome}`,
    })),
  ];

  return (
    <div className="history">
      <header className="history__header">
        <div className="history__title-area">
          <div className="history__title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6 V12 L16 14" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="history__title">Histórico de Compras</h1>
            <p className="history__subtitle">
              {filtrado.length} {filtrado.length === 1 ? 'compra registrada' : 'compras registradas'}
              {stats && ` · Total ${stats.gastoTotalMes.toLocaleString('pt-BR', {
                style: 'currency', currency: 'BRL',
              })} no mês`}
            </p>
          </div>
        </div>
      </header>

      <div className="history__filters">
        <div className="history__search">
          <Input
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            iconBefore={<SearchIcon size={16} />}
          />
        </div>
        <div className="history__filter-group">
          <Select
            options={categoriaOptions}
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          />
          <div className="history__period-buttons">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                className={`history__period-btn ${periodo === p.value ? 'history__period-btn--active' : ''}`}
                onClick={() => setPeriodo(p.value)}
              >
                {p.value === '7' || p.value === '30' || p.value === '90'
                  ? `${p.value}d`
                  : p.value === '365'
                  ? '1a'
                  : 'Tudo'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="history__loading">
          <div className="splash__loader">
            <span></span><span></span><span></span>
          </div>
          <p>Carregando histórico...</p>
        </div>
      ) : filtrado.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Nenhuma compra encontrada"
          description={
            busca || categoriaFiltro
              ? 'Tente ajustar os filtros para ver mais resultados.'
              : 'Marque itens como comprados na lista para começar.'
          }
        />
      ) : (
        <div className="history__list">
          {gruposPorData.map(([data, items]) => {
            const totalDia = items.reduce((acc, i) => acc + i.precoTotal, 0);
            return (
              <section key={data} className="history__group">
                <header className="history__group-header">
                  <h2 className="history__group-title">{data}</h2>
                  <Badge variant="brand">
                    {totalDia.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Badge>
                </header>
                <ul className="history__items">
                  {items.map((item) => (
                    <li key={item.id} className="history__item">
                      <div className="history__item-icon">
                        {CATEGORIAS[item.produto.categoria]?.icon || '📦'}
                      </div>
                      <div className="history__item-content">
                        <h3 className="history__item-name">{item.produto.nome}</h3>
                        <div className="history__item-meta">
                          <span>{item.quantidade} {item.unidade}</span>
                          {item.local && (
                            <>
                              <span className="history__item-dot">·</span>
                              <span className="history__item-local">
                                <LocationIcon size={12} /> {item.local}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="history__item-price">
                        <strong>
                          {item.precoTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </strong>
                        {item.precoUnitario && (
                          <span>
                            {(item.precoTotal / item.quantidade).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}/{item.unidade}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
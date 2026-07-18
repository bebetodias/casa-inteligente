import { useEffect, useState } from 'react';
import { Drawer } from '../../components/primitives/Drawer';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Avatar } from '../../components/primitives/Avatar';
import { CATEGORIAS } from '../../services/mock/catalog';
import {
  getEstatisticasProduto,
  getHistorico,
} from '../../services/mock/shoppingService';
import { PriceChart } from './PriceChart';
import './ProductDrawer.css';

export function ProductDrawer({ produtoId, onClose, onReadd }) {
  const [stats, setStats] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!produtoId) return;
    Promise.all([
      getEstatisticasProduto(produtoId),
      getHistorico({ produtoId, limite: 30 }),
    ]).then(([s, h]) => {
      setStats(s);
      setHistorico(h);
      setLoading(false);
    });
  }, [produtoId]);

  if (!stats && loading) {
    return (
      <Drawer open onClose={onClose} title="Carregando..." width="medium">
        <div className="drawer-loading">
          <div className="splash__loader">
            <span></span><span></span><span></span>
          </div>
        </div>
      </Drawer>
    );
  }

  if (!stats) return null;

  const { produto } = stats;
  const cat = CATEGORIAS[produto.categoria] || CATEGORIAS.outros;

  return (
    <Drawer
      open
      onClose={onClose}
      title={produto.nome}
      width="medium"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Fechar</Button>
          <Button variant="primary" onClick={() => onReadd(produto.id)}>
            Adicionar à lista
          </Button>
        </>
      }
    >
      <div className="product-drawer">
        <div className="product-drawer__header">
          <span className="product-drawer__cat">
            <span aria-hidden="true">{cat.icon}</span> {cat.nome}
          </span>
          {stats.previsaoProximaCompra && (
            <Badge variant={alertaPrevisao(stats) ? 'warning' : 'neutral'}>
              {textoPrevisao(stats)}
            </Badge>
          )}
        </div>

        {stats.totalCompras === 0 ? (
          <div className="product-drawer__empty">
            <p>Ainda não há histórico de compras deste produto.</p>
          </div>
        ) : (
          <>
            <div className="product-drawer__stats-grid">
              <StatCard
                label="Compras no histórico"
                value={stats.totalCompras}
                hint={`Última há ${stats.diasDesdeUltimaCompra}d`}
              />
              <StatCard
                label="Preço médio"
                value={formatMoney(stats.precoMedio)}
                hint={`Mín ${formatMoney(stats.precoMinimo)} · Máx ${formatMoney(stats.precoMaximo)}`}
              />
              <StatCard
                label="Último preço"
                value={formatMoney(stats.ultimoPreco)}
                hint={`${formatMoney(stats.precoUnitario || 0)} por ${produto.unidadePadrao}`}
              />
              <StatCard
                label="Frequência"
                value={stats.frequenciaMedia ? `${stats.frequenciaMedia}d` : '—'}
                hint={stats.frequenciaMedia ? 'em média entre compras' : 'Dados insuficientes'}
              />
            </div>

            <section className="product-drawer__section">
              <h3 className="product-drawer__section-title">Evolução de preço</h3>
              <PriceChart historico={stats.historico} />
            </section>

            <section className="product-drawer__section">
              <h3 className="product-drawer__section-title">Histórico de compras</h3>
              <ul className="product-drawer__history">
                {historico.map((c) => (
                  <li key={c.id} className="product-drawer__history-item">
                    <div className="product-drawer__history-date">
                      <strong>{formatDate(c.data)}</strong>
                      {c.local && <span>{c.local}</span>}
                    </div>
                    <div className="product-drawer__history-info">
                      <strong>{formatMoney(c.precoTotal)}</strong>
                      <span>{c.quantidade} {c.unidade}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </Drawer>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {hint && <div className="stat-card__hint">{hint}</div>}
    </div>
  );
}

function formatMoney(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
}

function alertaPrevisao(stats) {
  if (!stats.previsaoProximaCompra) return false;
  return new Date() >= stats.previsaoProximaCompra;
}

function textoPrevisao(stats) {
  if (!stats.previsaoProximaCompra) return 'Sem previsão';
  const dias = Math.ceil((stats.previsaoProximaCompra - new Date()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return `Atrasado ${Math.abs(dias)}d`;
  if (dias === 0) return 'Acabando hoje';
  if (dias === 1) return 'Acabando amanhã';
  return `Próxima compra em ${dias}d`;
}
import { useEffect, useState } from 'react';
import { Drawer } from '../../components/primitives/Drawer';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { CATEGORIAS } from '../../services/mock/catalog';
import { CloseIcon, PlusIcon, ChartIcon } from './ShoppingIcons';
import { PriceChart } from './PriceChart';
import './ProductDrawer.css';

export function ProductDrawer({ produtoId, onClose, onReadd, itens = [] }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const history = itens.filter(i => i.produto.id === produtoId && i.status === 'comprado').sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
    
    if (history.length === 0) {
      const pending = itens.find(i => i.produto.id === produtoId);
      if (pending) {
        setStats({
          produto: pending.produto,
          totalCompras: 0,
          historico: []
        });
      }
      return;
    }

    const precos = history.map(h => (h.precoSugerido || 0) * (h.quantidade || 1));
    const precoMedio = precos.reduce((a, b) => a + b, 0) / precos.length;
    const precoMinimo = Math.min(...precos);
    const precoMaximo = Math.max(...precos);
    const ultimo = history[history.length - 1];
    
    let freqMedia = null;
    if (history.length >= 2) {
      const primeiro = history[0];
      const diff = (new Date(ultimo.criado_em) - new Date(primeiro.criado_em)) / (1000 * 60 * 60 * 24);
      freqMedia = Math.round(diff / (history.length - 1));
    }
    
    let previsao = null;
    if (freqMedia && ultimo) {
      const data = new Date(ultimo.criado_em);
      data.setDate(data.getDate() + freqMedia);
      previsao = data;
    }
    
    const diasDesde = Math.floor((new Date() - new Date(ultimo.criado_em)) / (1000 * 60 * 60 * 24));

    setStats({
      produto: history[0].produto,
      totalCompras: history.length,
      precoMedio,
      precoMinimo,
      precoMaximo,
      ultimoPreco: (ultimo.precoSugerido || 0) * (ultimo.quantidade || 1),
      frequenciaMedia: freqMedia,
      previsaoProximaCompra: previsao,
      diasDesdeUltimaCompra: diasDesde,
      historico: history.slice(-12).map(h => ({
        data: h.criado_em,
        precoUnitario: h.precoSugerido || 0
      })),
      historicoObj: history
    });
  }, [produtoId, itens]);

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
                {stats.historicoObj.map((c) => (
                  <li key={c.id} className="product-drawer__history-item">
                    <div className="product-drawer__history-date">
                      <strong>{formatDate(c.criado_em)}</strong>
                    </div>
                    <div className="product-drawer__history-info">
                      <strong>{formatMoney((c.precoSugerido || 0) * (c.quantidade || 1))}</strong>
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
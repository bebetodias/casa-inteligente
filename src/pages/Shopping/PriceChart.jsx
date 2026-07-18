import './PriceChart.css';

export function PriceChart({ historico }) {
  if (!historico || historico.length < 2) {
    return (
      <div className="price-chart price-chart--empty">
        <p>Poucos dados para gerar um gráfico. Continue comprando para ver a evolução.</p>
      </div>
    );
  }

  // Ordena por data ascendente
  const dados = [...historico].sort((a, b) => new Date(a.data) - new Date(b.data));
  const valores = dados.map((d) => d.precoTotal);
  const minVal = Math.min(...valores);
  const maxVal = Math.max(...valores);
  const range = maxVal - minVal || 1;

  const W = 480;
  const H = 140;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const pontos = dados.map((d, i) => {
    const x = padding.left + (i / (dados.length - 1)) * innerW;
    const y = padding.top + (1 - (d.precoTotal - minVal) / range) * innerH;
    return { x, y, ...d };
  });

  const pathLine = pontos.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  ).join(' ');

  const pathArea = `${pathLine} L ${pontos[pontos.length - 1].x} ${padding.top + innerH} L ${pontos[0].x} ${padding.top + innerH} Z`;

  return (
    <div className="price-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="price-chart__svg">
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathArea} fill="url(#priceGradient)" />
        <path d={pathLine} fill="none" stroke="var(--color-brand)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pontos.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--color-brand)" />
            {i === pontos.length - 1 && (
              <circle cx={p.x} cy={p.y} r="6" fill="var(--color-brand-subtle)" />
            )}
          </g>
        ))}
      </svg>
      <div className="price-chart__labels">
        <span>{formatDate(dados[0].data)}</span>
        <span>{formatDate(dados[dados.length - 1].data)}</span>
      </div>
      <div className="price-chart__legend">
        <span>Mín: {formatMoney(minVal)}</span>
        <span>Máx: {formatMoney(maxVal)}</span>
      </div>
    </div>
  );
}

function formatMoney(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}
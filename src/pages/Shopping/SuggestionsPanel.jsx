import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { SparkleIcon, PlusIcon } from './ShoppingIcons';
import './SuggestionsPanel.css';

export function SuggestionsPanel({ sugestoes, onAdd, onToggleExpand, expanded }) {
  if (sugestoes.length === 0) return null;

  return (
    <section className="suggestions">
      <button className="suggestions__toggle" onClick={onToggleExpand}>
        <div className="suggestions__title-area">
          <span className="suggestions__icon">
            <SparkleIcon size={18} />
          </span>
          <div className="suggestions__title-text">
            <h3 className="suggestions__title">
              {sugestoes.length} {sugestoes.length === 1 ? 'produto pode estar' : 'produtos podem estar'} acabando
            </h3>
            <p className="suggestions__subtitle">
              Baseado na frequência das suas últimas compras
            </p>
          </div>
        </div>
        <div className="suggestions__toggle-right">
          <Badge variant="warning">{sugestoes.length}</Badge>
          <span className={`suggestions__chevron ${expanded ? 'suggestions__chevron--open' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9 L12 15 L18 9" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>

      {expanded && (
        <ul className="suggestions__list">
          {sugestoes.slice(0, 5).map((s) => (
            <li key={s.produto.id} className="suggestions__item">
              <div className="suggestions__item-info">
                <strong>{s.produto.nome}</strong>
                <span>
                  {s.diasPassados}d desde a última · ciclo ~{s.intervaloMedio}d
                </span>
              </div>
              <Button
                variant="secondary"
                size="small"
                iconBefore={<PlusIcon size={14} />}
                onClick={() => onAdd(s)}
              >
                Adicionar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
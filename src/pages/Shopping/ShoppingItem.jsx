import { useState } from 'react';
import { Badge } from '../../components/primitives/Badge';
import './ShoppingItem.css';

export function ShoppingItem({ item, onBuy, onDetails, onEdit, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const { produto, ultimaCompra, diasDesdeUltima, precoSugerido, observacao } = item;

  const alerta = diasDesdeUltima !== null && diasDesdeUltima > 7;

  return (
    <li className={`item ${expanded ? 'item--expanded' : ''}`}>
      <div className="item__main">
        <button
          className="item__check"
          onClick={onBuy}
          aria-label={`Marcar ${produto.nome} como comprado`}
        >
          <span className="item__check-circle" />
        </button>

        <button className="item__content" onClick={onDetails}>
          <div className="item__title-row">
            <h3 className="item__name">{produto.nome}</h3>
            {alerta && (
              <Badge variant="warning">
                {diasDesdeUltima}d sem comprar
              </Badge>
            )}
          </div>
          <div className="item__meta">
            {item.quantidade && (
              <span className="item__quantity">
                {item.quantidade} {item.unidade}
              </span>
            )}
            {observacao && (
              <span className="item__note">"{observacao}"</span>
            )}
          </div>
        </button>

        <div className="item__trailing">
          {precoSugerido && (
            <span className="item__price" title="Último preço unitário">
              {precoSugerido.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          )}
          <div className="item__actions">
            <button className="item__action" onClick={onEdit} aria-label="Editar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 20 H8 L19 9 L15 5 L4 16 V20 Z"
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 6 L18 10" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="item__action item__action--danger"
              onClick={onRemove} aria-label="Remover">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6 L18 18 M18 6 L6 18"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
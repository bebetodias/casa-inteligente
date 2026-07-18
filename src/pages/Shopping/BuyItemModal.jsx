import { useState, useEffect } from 'react';
import { Modal } from '../../components/primitives/Modal';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Button } from '../../components/primitives/Button';
import { getHistorico } from '../../services/mock/shoppingService';
import { UNIDADES } from '../../services/mock/catalog';
import './BuyItemModal.css';

const LOCAIS_SUGERIDOS = [
  'Mercado Central',
  'Supermercado Bairro',
  'Atacadão',
  'Feira Livre',
  'Hortifruti do Zé',
];

export function BuyItemModal({ item, onClose, onConfirm }) {
  const { produto, ultimaCompra } = item;

  const [precoTotal, setPrecoTotal] = useState(
    ultimaCompra?.precoTotal?.toString() || ''
  );
  const [quantidade, setQuantidade] = useState(item.quantidade || 1);
  const [unidade, setUnidade] = useState(item.unidade || produto.unidadePadrao);
  const [local, setLocal] = useState(ultimaCompra?.local || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const precoUnitario = Number(precoTotal) / Number(quantidade || 1);

  const handleSubmit = async () => {
    setError(null);
    if (!precoTotal || Number(precoTotal) <= 0) {
      setError('Informe o preço pago.');
      return;
    }
    if (!quantidade || Number(quantidade) <= 0) {
      setError('Informe a quantidade comprada.');
      return;
    }
    setLoading(true);
    try {
      await onConfirm({
        precoTotal: Number(precoTotal),
        quantidade: Number(quantidade),
        unidade,
        local: local.trim() || null,
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const unidadeOptions = Object.values(UNIDADES).map((u) => ({
    value: u.sigla,
    label: u.nome,
  }));

  return (
    <Modal
      open
      onClose={onClose}
      title="Marcar como comprado"
      size="medium"
      footer={
        <>
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={loading}>
            Confirmar compra
          </Button>
        </>
      }
    >
      <div className="buy-item">
        <div className="buy-item__product">
          <span className="buy-item__product-icon" aria-hidden="true">
            ✓
          </span>
          <div>
            <h3 className="buy-item__product-name">{produto.nome}</h3>
            {ultimaCompra && (
              <p className="buy-item__product-prev">
                Última: {ultimaCompra.precoTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })} há {Math.floor((Date.now() - new Date(ultimaCompra.data)) / (1000 * 60 * 60 * 24))}d
              </p>
            )}
          </div>
        </div>

        {error && <div className="buy-item__error" role="alert">{error}</div>}

        <div className="buy-item__price-area">
          <Input
            label="Preço total pago (R$)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={precoTotal}
            onChange={(e) => setPrecoTotal(e.target.value)}
            autoFocus
            isRequired
          />
          {precoTotal && quantidade && (
            <div className="buy-item__unit-price">
              <span>Preço por unidade:</span>
              <strong>
                {precoUnitario.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                <span className="buy-item__unit-suffix">
                  {' '}/ {quantidade} {unidade}
                </span>
              </strong>
            </div>
          )}
        </div>

        <div className="buy-item__row">
          <Input
            label="Quantidade"
            type="number"
            min="0"
            step="0.1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
          <Select
            label="Unidade"
            options={unidadeOptions}
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          />
        </div>

        <div className="buy-item__field">
          <Input
            label="Onde comprou?"
            placeholder="Nome do mercado ou local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            list="locais-sugeridos"
          />
          <datalist id="locais-sugeridos">
            {LOCAIS_SUGERIDOS.map((l) => <option key={l} value={l} />)}
          </datalist>
        </div>
      </div>
    </Modal>
  );
}
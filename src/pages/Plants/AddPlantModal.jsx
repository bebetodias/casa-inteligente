import { useState } from 'react';
import { Modal } from '../../components/primitives/Modal';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Button } from '../../components/primitives/Button';
import './AddPlantModal.css';

const LOCAIS = [
  'Sala de Estar',
  'Cozinha',
  'Quarto',
  'Varanda',
  'Jardim Externo',
  'Banheiro',
  'Escritório'
];

export function AddPlantModal({ onClose, onAdd }) {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [local, setLocal] = useState('Sala de Estar');
  const [frequencia, setFrequencia] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        nome: nome.trim(),
        especie: especie.trim() || null,
        local,
        frequencia_rega: Number(frequencia)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Nova Planta" onClose={onClose}>
      <form className="add-plant-form" onSubmit={handleSubmit}>
        <Input 
          label="Nome (Apelido)"
          placeholder="Ex: Samambaia da Sala"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoFocus
        />

        <Input 
          label="Espécie (Opcional)"
          placeholder="Ex: Nephrolepis exaltata"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
        />

        <div className="add-plant-form__row">
          <Select 
            label="Local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          >
            {LOCAIS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </Select>

          <Input 
            label="Regar a cada (dias)"
            type="number"
            min="1"
            max="365"
            value={frequencia}
            onChange={(e) => setFrequencia(e.target.value)}
            required
          />
        </div>

        <div className="add-plant-form__actions">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || !nome.trim()}>
            {isSubmitting ? 'Salvando...' : 'Adicionar Planta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

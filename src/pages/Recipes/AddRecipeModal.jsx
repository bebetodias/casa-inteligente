import { useState } from 'react';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { useToastStore } from '../../hooks/useToast';
import './AddRecipeModal.css';

export function AddRecipeModal({ onClose, onAdd }) {
  const { showToast } = useToastStore();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Almoço/Jantar');
  const [tempoPreparo, setTempoPreparo] = useState('20');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [porcoes, setPorcoes] = useState('2');
  const [emoji, setEmoji] = useState('🍲');

  const [ingredientes, setIngredientes] = useState([
    { nome: '', quantidade: '', categoria: 'mercearia' },
    { nome: '', quantidade: '', categoria: 'laticinios' },
  ]);

  const [passos, setPassos] = useState(['', '']);
  const [dicaChef, setDicaChef] = useState('');

  const handleIngredienteChange = (index, field, value) => {
    const novos = [...ingredientes];
    novos[index][field] = value;
    setIngredientes(novos);
  };

  const handleAddIngredienteCampo = () => {
    setIngredientes([...ingredientes, { nome: '', quantidade: '', categoria: 'mercearia' }]);
  };

  const handleRemoveIngredienteCampo = (index) => {
    if (ingredientes.length <= 1) return;
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const handlePassoChange = (index, value) => {
    const novos = [...passos];
    novos[index] = value;
    setPassos(novos);
  };

  const handleAddPassoCampo = () => {
    setPassos([...passos, '']);
  };

  const handleRemovePassoCampo = (index) => {
    if (passos.length <= 1) return;
    setPassos(passos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      showToast('Por favor, informe o título da receita.', 'warning');
      return;
    }

    const ingredientesValidos = ingredientes.filter((ing) => ing.nome.trim() !== '');
    if (ingredientesValidos.length === 0) {
      showToast('Adicione pelo menos um ingrediente.', 'warning');
      return;
    }

    const passosValidos = passos.filter((p) => p.trim() !== '');
    if (passosValidos.length === 0) {
      showToast('Adicione pelo menos um passo de preparo.', 'warning');
      return;
    }

    onAdd({
      titulo: titulo.trim(),
      descricao: descricao.trim() || 'Receita personalizada da casa',
      categoria,
      tempoPreparo: Number(tempoPreparo) || 15,
      dificuldade,
      porcoes: Number(porcoes) || 2,
      imagemEmoji: emoji || '🍲',
      dietas: ['rapida'],
      ingredientes: ingredientesValidos,
      passos: passosValidos,
      dicaChef: dicaChef.trim(),
    });

    showToast('Receita adicionada com sucesso!', 'success');
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Adicionar Nova Receita">
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <div className="add-recipe-form__grid-2">
          <Input
            label="Título da Receita *"
            placeholder="Ex: Torta de Frango de Frigideira"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Input
            label="Emoji / Ícone"
            placeholder="Ex: 🥧, 🍲, 🥗"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </div>

        <Input
          label="Descrição Curta"
          placeholder="Ex: Uma torta leve e prática perfeita para a janta."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <div className="add-recipe-form__grid-3">
          <Select
            label="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            options={[
              { value: 'Café da Manhã', label: 'Café da Manhã' },
              { value: 'Almoço/Jantar', label: 'Almoço / Jantar' },
              { value: 'Lanche', label: 'Lanche' },
              { value: 'Sobremesa', label: 'Sobremesa' },
            ]}
          />

          <Input
            label="Tempo (Minutos)"
            type="number"
            value={tempoPreparo}
            onChange={(e) => setTempoPreparo(e.target.value)}
            min="1"
          />

          <Select
            label="Dificuldade"
            value={dificuldade}
            onChange={(e) => setDificuldade(e.target.value)}
            options={[
              { value: 'Fácil', label: 'Fácil' },
              { value: 'Médio', label: 'Médio' },
              { value: 'Difícil', label: 'Difícil' },
            ]}
          />
        </div>

        {/* Ingredientes */}
        <div className="add-recipe-form__section">
          <div className="add-recipe-form__section-header">
            <h4>Ingredientes *</h4>
            <button
              type="button"
              className="add-recipe-form__btn-link"
              onClick={handleAddIngredienteCampo}
            >
              + Adicionar Ingrediente
            </button>
          </div>

          <div className="add-recipe-form__list">
            {ingredientes.map((ing, idx) => (
              <div key={idx} className="add-recipe-form__row">
                <Input
                  placeholder="Ingrediente (ex: Ovo)"
                  value={ing.nome}
                  onChange={(e) => handleIngredienteChange(idx, 'nome', e.target.value)}
                />
                <Input
                  placeholder="Qtd (ex: 2 unidades)"
                  value={ing.quantidade}
                  onChange={(e) => handleIngredienteChange(idx, 'quantidade', e.target.value)}
                />
                <button
                  type="button"
                  className="add-recipe-form__btn-remove"
                  onClick={() => handleRemoveIngredienteCampo(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Passos */}
        <div className="add-recipe-form__section">
          <div className="add-recipe-form__section-header">
            <h4>Modo de Preparo (Passo a passo) *</h4>
            <button
              type="button"
              className="add-recipe-form__btn-link"
              onClick={handleAddPassoCampo}
            >
              + Adicionar Passo
            </button>
          </div>

          <div className="add-recipe-form__list">
            {passos.map((passo, idx) => (
              <div key={idx} className="add-recipe-form__row">
                <span className="add-recipe-form__step-num">{idx + 1}</span>
                <Input
                  placeholder={`Descreva a etapa ${idx + 1}...`}
                  value={passo}
                  onChange={(e) => handlePassoChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="add-recipe-form__btn-remove"
                  onClick={() => handleRemovePassoCampo(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dica */}
        <Input
          label="Dica do Chef (Opcional)"
          placeholder="Ex: Sirva acompanhado de uma salada verde."
          value={dicaChef}
          onChange={(e) => setDicaChef(e.target.value)}
        />

        <div className="add-recipe-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar Receita
          </Button>
        </div>
      </form>
    </Modal>
  );
}

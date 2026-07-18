export const CATEGORIAS = {
  hortifruti: { nome: 'Hortifruti', icon: '🥬', ordem: 1 },
  acougue: { nome: 'Açougue', icon: '🥩', ordem: 2 },
  laticinios: { nome: 'Laticínios', icon: '🥛', ordem: 3 },
  paes: { nome: 'Pães e Bolos', icon: '🍞', ordem: 4 },
  mercearia: { nome: 'Mercearia', icon: '🛒', ordem: 5 },
  bebidas: { nome: 'Bebidas', icon: '🥤', ordem: 6 },
  limpeza: { nome: 'Limpeza', icon: '🧴', ordem: 7 },
  higiene: { nome: 'Higiene', icon: '🧼', ordem: 8 },
  outros: { nome: 'Outros', icon: '📦', ordem: 9 },
};

export const UNIDADES = {
  un: { sigla: 'un', nome: 'Unidade' },
  kg: { sigla: 'kg', nome: 'Quilograma' },
  g: { sigla: 'g', nome: 'Grama' },
  l: { sigla: 'L', nome: 'Litro' },
  ml: { sigla: 'ml', nome: 'Mililitro' },
  pct: { sigla: 'pct', nome: 'Pacote' },
  cx: { sigla: 'cx', nome: 'Caixa' },
  dz: { sigla: 'dz', nome: 'Dúzia' },
};

export const CATALOGO_BASE = [
  // Hortifruti
  { nome: 'Banana', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Maçã', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Tomate', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Cebola', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Batata', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Cenoura', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Alface', categoria: 'hortifruti', unidadePadrao: 'un' },
  { nome: 'Brócolis', categoria: 'hortifruti', unidadePadrao: 'un' },
  { nome: 'Limão', categoria: 'hortifruti', unidadePadrao: 'kg' },
  { nome: 'Laranja', categoria: 'hortifruti', unidadePadrao: 'kg' },

  // Açougue
  { nome: 'Frango inteiro', categoria: 'acougue', unidadePadrao: 'kg' },
  { nome: 'Peito de frango', categoria: 'acougue', unidadePadrao: 'kg' },
  { nome: 'Carne moída', categoria: 'acougue', unidadePadrao: 'kg' },
  { nome: 'Picanha', categoria: 'acougue', unidadePadrao: 'kg' },
  { nome: 'Costela', categoria: 'acougue', unidadePadrao: 'kg' },
  { nome: 'Linguiça', categoria: 'acougue', unidadePadrao: 'kg' },
  { nome: 'Ovos', categoria: 'acougue', unidadePadrao: 'dz' },

  // Laticínios
  { nome: 'Leite integral', categoria: 'laticinios', unidadePadrao: 'L' },
  { nome: 'Leite desnatado', categoria: 'laticinios', unidadePadrao: 'L' },
  { nome: 'Queijo mussarela', categoria: 'laticinios', unidadePadrao: 'kg' },
  { nome: 'Queijo minas', categoria: 'laticinios', unidadePadrao: 'kg' },
  { nome: 'Iogurte natural', categoria: 'laticinios', unidadePadrao: 'un' },
  { nome: 'Iogurte grego', categoria: 'laticinios', unidadePadrao: 'un' },
  { nome: 'Manteiga', categoria: 'laticinios', unidadePadrao: 'pct' },
  { nome: 'Requeijão', categoria: 'laticinios', unidadePadrao: 'un' },

  // Pães
  { nome: 'Pão francês', categoria: 'paes', unidadePadrao: 'un' },
  { nome: 'Pão de forma', categoria: 'paes', unidadePadrao: 'pct' },
  { nome: 'Pão integral', categoria: 'paes', unidadePadrao: 'pct' },
  { nome: 'Pão de queijo', categoria: 'paes', unidadePadrao: 'pct' },

  // Mercearia
  { nome: 'Arroz', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Feijão', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Macarrão', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Açúcar', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Café', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Óleo de soja', categoria: 'mercearia', unidadePadrao: 'L' },
  { nome: 'Sal', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Farinha de trigo', categoria: 'mercearia', unidadePadrao: 'pct' },
  { nome: 'Molho de tomate', categoria: 'mercearia', unidadePadrao: 'un' },
  { nome: 'Atum em lata', categoria: 'mercearia', unidadePadrao: 'un' },

  // Bebidas
  { nome: 'Água mineral', categoria: 'bebidas', unidadePadrao: 'L' },
  { nome: 'Refrigerante', categoria: 'bebidas', unidadePadrao: 'L' },
  { nome: 'Suco de laranja', categoria: 'bebidas', unidadePadrao: 'L' },
  { nome: 'Cerveja', categoria: 'bebidas', unidadePadrao: 'cx' },
  { nome: 'Vinho', categoria: 'bebidas', unidadePadrao: 'un' },

  // Limpeza
  { nome: 'Detergente', categoria: 'limpeza', unidadePadrao: 'un' },
  { nome: 'Sabão em pó', categoria: 'limpeza', unidadePadrao: 'pct' },
  { nome: 'Amaciante', categoria: 'limpeza', unidadePadrao: 'L' },
  { nome: 'Desinfetante', categoria: 'limpeza', unidadePadrao: 'L' },
  { nome: 'Esponja de cozinha', categoria: 'limpeza', unidadePadrao: 'un' },
  { nome: 'Papel toalha', categoria: 'limpeza', unidadePadrao: 'pct' },

  // Higiene
  { nome: 'Papel higiênico', categoria: 'higiene', unidadePadrao: 'pct' },
  { nome: 'Sabonete', categoria: 'higiene', unidadePadrao: 'un' },
  { nome: 'Shampoo', categoria: 'higiene', unidadePadrao: 'un' },
  { nome: 'Condicionador', categoria: 'higiene', unidadePadrao: 'un' },
  { nome: 'Pasta de dente', categoria: 'higiene', unidadePadrao: 'un' },
  { nome: 'Desodorante', categoria: 'higiene', unidadePadrao: 'un' },
];

// Busca fuzzy simples para autocomplete
export function buscarNoCatalogo(termo, limite = 8) {
  if (!termo || termo.length < 1) return [];
  const t = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CATALOGO_BASE
    .filter((p) => p.nome.toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').includes(t))
    .slice(0, limite);
}

export function getUnidadesArray() {
  return Object.entries(UNIDADES).map(([key, value]) => ({
    value: key,
    label: value.nome,
    sigla: value.sigla,
  }));
}

export function getUnidadesComExtras() {
  const base = getUnidadesArray();
  return [
    ...base,
    { value: 'outro', label: 'Outro', sigla: '' },
  ];
}
import { CATALOGO_BASE, UNIDADES } from './catalog';

// Gera ID único simples
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

// Helpers de data
const diasAtras = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const horaAleatoria = () => Math.floor(Math.random() * 12) + 8; // 8h-20h

// Locais mockados
const LOCAIS = [
  'Mercado Central',
  'Supermercado Bairro',
  'Atacadão',
  'Feira Livre',
  'Hortifruti do Zé',
];

const MEMBROS = [
  { id: 'm-1', nome: 'Maria Silva', email: 'maria@email.com' },
  { id: 'm-2', nome: 'João Silva', email: 'joao@email.com' },
];

// Preços-base por produto (com leve variação)
const PRECOS_BASE = {
  'Banana': 5.49, 'Maçã': 8.90, 'Tomate': 7.20, 'Cebola': 4.50,
  'Batata': 5.80, 'Cenoura': 6.30, 'Alface': 3.50, 'Brócolis': 6.90,
  'Limão': 4.20, 'Laranja': 5.50,
  'Frango inteiro': 14.90, 'Peito de frango': 22.90, 'Carne moída': 32.90,
  'Picanha': 69.90, 'Costela': 28.90, 'Linguiça': 18.90, 'Ovos': 14.50,
  'Leite integral': 5.49, 'Leite desnatado': 6.20,
  'Queijo mussarela': 42.90, 'Queijo minas': 28.90,
  'Iogurte natural': 7.90, 'Iogurte grego': 12.90,
  'Manteiga': 14.90, 'Requeijão': 9.90,
  'Pão francês': 14.00, 'Pão de forma': 9.50, 'Pão integral': 11.50, 'Pão de queijo': 12.90,
  'Arroz': 24.90, 'Feijão': 8.90, 'Macarrão': 4.50, 'Açúcar': 5.90,
  'Café': 18.90, 'Óleo de soja': 7.90, 'Sal': 2.50, 'Farinha de trigo': 6.50,
  'Molho de tomate': 4.90, 'Atum em lata': 7.90,
  'Água mineral': 2.50, 'Refrigerante': 9.90, 'Suco de laranja': 12.90,
  'Cerveja': 89.90, 'Vinho': 49.90,
  'Detergente': 2.90, 'Sabão em pó': 16.90, 'Amaciante': 12.90,
  'Desinfetante': 8.90, 'Esponja de cozinha': 3.50, 'Papel toalha': 14.90,
  'Papel higiênico': 18.90, 'Sabonete': 3.90, 'Shampoo': 18.90,
  'Condicionador': 19.90, 'Pasta de dente': 8.90, 'Desodorante': 14.90,
};

// Produtos mais comprados (entrarão na lista ativa)
const FREQUENTES = [
  { nome: 'Banana', freqDias: 7, qtd: 1, unidade: 'kg' },
  { nome: 'Leite integral', freqDias: 4, qtd: 2, unidade: 'L' },
  { nome: 'Pão francês', freqDias: 2, qtd: 1, unidade: 'un' },
  { nome: 'Tomate', freqDias: 7, qtd: 1, unidade: 'kg' },
  { nome: 'Ovos', freqDias: 10, qtd: 1, unidade: 'dz' },
  { nome: 'Café', freqDias: 14, qtd: 1, unidade: 'pct' },
  { nome: 'Arroz', freqDias: 20, qtd: 1, unidade: 'pct' },
  { nome: 'Feijão', freqDias: 20, qtd: 1, unidade: 'pct' },
  { nome: 'Detergente', freqDias: 15, qtd: 1, unidade: 'un' },
  { nome: 'Papel higiênico', freqDias: 14, qtd: 1, unidade: 'pct' },
];

function variacaoPreco(base) {
  // Variação de ±15%
  const variacao = (Math.random() - 0.5) * 0.3;
  return Math.round(base * (1 + variacao) * 100) / 100;
}

function escolherMembroAleatorio() {
  return MEMBROS[Math.floor(Math.random() * MEMBROS.length)];
}

/**
 * Gera o seed completo: produtos do catálogo + histórico de compras + lista ativa
 */
export function gerarSeed() {
  const produtos = [];
  const compras = [];

  // 1. Cria produtos a partir do catálogo base
  for (const item of CATALOGO_BASE) {
    produtos.push({
      id: uid('p'),
      nome: item.nome,
      categoria: item.categoria,
      unidadePadrao: item.unidadePadrao,
      ativo: true,
      criadoEm: diasAtras(90),
    });
  }

  // 2. Gera histórico de compras dos últimos 90 dias
  for (const freq of FREQUENTES) {
    const produto = produtos.find((p) => p.nome === freq.nome);
    const precoBase = PRECOS_BASE[freq.nome] || 10;

    let diaCompra = 90;
    while (diaCompra > 0) {
      // Variação na frequência de ±2 dias
      const intervalo = freq.freqDias + Math.floor(Math.random() * 5) - 2;
      diaCompra -= Math.max(intervalo, 1);

      if (diaCompra <= 0) break;

      const data = diasAtras(diaCompra);
      data.setHours(horaAleatoria());

      compras.push({
        id: uid('c'),
        produtoId: produto.id,
        quantidade: freq.qtd,
        unidade: freq.unidade,
        precoTotal: variacaoPreco(precoBase * freq.qtd),
        precoUnitario: 0, // calculado depois
        local: LOCAIS[Math.floor(Math.random() * LOCAIS.length)],
        compradoPorId: escolherMembroAleatorio().id,
        data,
      });
    }
  }

  // 3. Calcula preço unitário
  for (const compra of compras) {
    compra.precoUnitario = Math.round((compra.precoTotal / compra.quantidade) * 100) / 100;
  }

  // 4. Gera lista ativa (itens pendentes que estão "acabando")
  const listaAtiva = gerarListaAtiva(produtos, compras);

  return { produtos, compras, listaAtiva, membros: MEMBROS };
}

/**
 * Gera itens pendentes baseado em produtos cuja última compra sugere que estão acabando
 */
function gerarListaAtiva(produtos, compras) {
  const itens = [];
  const agora = new Date();

  for (const produto of produtos) {
    const comprasDoProduto = compras
      .filter((c) => c.produtoId === produto.id)
      .sort((a, b) => b.data - a.data);

    if (comprasDoProduto.length < 2) continue;

    const ultima = comprasDoProduto[0];
    const penultima = comprasDoProduto[1];

    // Intervalo médio entre compras
    const intervaloMedio = (ultima.data - penultima.data) / (1000 * 60 * 60 * 24);
    const diasPassados = (agora - ultima.data) / (1000 * 60 * 24);

    // Se passou mais de 75% do intervalo, sugere adicionar
    if (diasPassados >= intervaloMedio * 0.75 && itens.length < 7) {
      itens.push({
        id: uid('i'),
        produtoId: produto.id,
        adicionadoPorId: ultima.compradoPorId,
        adicionadoEm: agora,
        status: 'pendente',
        observacao: null,
      });
    }
  }

  return itens;
}
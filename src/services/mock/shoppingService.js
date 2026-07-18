import { gerarSeed } from './seed';
import { buscarNoCatalogo, CATALOGO_BASE, UNIDADES } from './catalog';

// Singleton — seed carregado uma vez por sessão
let STATE = null;
const STORAGE_KEY = 'casa-inteligente-shopping';

function carregarEstado() {
  if (!STATE) {
    const seed = gerarSeed();
    STATE = {
      produtos: seed.produtos,
      compras: seed.compras,
      listaAtiva: seed.listaAtiva,
    };
  }
  return STATE;
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

// ============================================================
// LISTA ATIVA
// ============================================================

/**
 * Retorna a lista ativa agrupada por categoria
 */
export async function listarItens(casaId = 'casa-1') {
  await delay(200);
  const state = carregarEstado();
  const { listaAtiva, produtos, compras } = state;

  const agora = new Date();
  const itens = listaAtiva.map((item) => {
    const produto = produtos.find((p) => p.id === item.produtoId);
    const comprasDoProduto = compras
      .filter((c) => c.produtoId === produto.id)
      .sort((a, b) => b.data - a.data);

    const ultimaCompra = comprasDoProduto[0];
    const diasDesdeUltima = ultimaCompra
      ? Math.floor((agora - ultimaCompra.data) / (1000 * 60 * 60 * 24))
      : null;

    return {
      ...item,
      produto,
      ultimaCompra,
      diasDesdeUltima,
      // Pré-visualização de preço para o item
      precoSugerido: ultimaCompra?.precoUnitario || null,
    };
  });

  // Ordena: pendentes primeiro, depois por categoria, depois alfabético
  itens.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1;
    if (a.produto.categoria !== b.produto.categoria) {
      return a.produto.categoria.localeCompare(b.produto.categoria);
    }
    return a.produto.nome.localeCompare(b.produto.nome);
  });

  return itens;
}

/**
 * Agrupa itens por categoria para renderização
 */
export function agruparPorCategoria(itens) {
  const grupos = {};
  for (const item of itens) {
    const cat = item.produto.categoria;
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(item);
  }
  return grupos;
}

/**
 * Adiciona um produto à lista ativa
 */
export async function adicionarItem({ nome, produtoId, quantidade, unidade, observacao, membroId }) {
  await delay(250);
  const state = carregarEstado();

  let produto;

  if (produtoId) {
    produto = state.produtos.find((p) => p.id === produtoId);
  }

  // Se não existe no catálogo da casa, cria um novo
  if (!produto) {
    const cat = inferirCategoria(nome);
    const unidadePadrao = unidade || 'un';
    produto = {
      id: uid('p'),
      nome,
      categoria: cat,
      unidadePadrao,
      ativo: true,
      criadoEm: new Date(),
    };
    state.produtos.push(produto);
  }

  const novoItem = {
    id: uid('i'),
    produtoId: produto.id,
    adicionadoPorId: membroId,
    adicionadoEm: new Date(),
    quantidade: quantidade || 1,
    unidade: unidade || produto.unidadePadrao,
    status: 'pendente',
    observacao: observacao || null,
  };

  state.listaAtiva.push(novoItem);
  return novoItem;
}

function inferirCategoria(nome) {
  const n = nome.toLowerCase();
  const mapa = {
    hortifruti: ['banana', 'maçã', 'maca', 'tomate', 'cebola', 'batata', 'cenoura', 'alface', 'brócolis', 'brocolis', 'limão', 'limao', 'laranja'],
    acougue: ['frango', 'carne', 'picanha', 'costela', 'linguiça', 'linguiça', 'ovos', 'ovo', 'peito'],
    laticinios: ['leite', 'queijo', 'iogurte', 'manteiga', 'requeijão', 'requeijao'],
    paes: ['pão', 'pao'],
    mercearia: ['arroz', 'feijão', 'feijao', 'macarrão', 'macarrao', 'açúcar', 'acucar', 'café', 'cafe', 'óleo', 'oleo', 'sal', 'farinha', 'molho', 'atum'],
    bebidas: ['água', 'agua', 'refrigerante', 'suco', 'cerveja', 'vinho'],
    limpeza: ['detergente', 'sabão', 'sabao', 'amaciante', 'desinfetante', 'esponja', 'papel toalha'],
    higiene: ['sabonete', 'shampoo', 'condicionador', 'pasta', 'desodorante'],
  };

  for (const [cat, termos] of Object.entries(mapa)) {
    if (termos.some((t) => n.includes(t))) return cat;
  }
  return 'outros';
}

/**
 * Atualiza um item (quantidade, observação, etc.)
 */
export async function atualizarItem(itemId, patch) {
  await delay(200);
  const state = carregarEstado();
  const idx = state.listaAtiva.findIndex((i) => i.id === itemId);
  if (idx === -1) throw new Error('Item não encontrado');
  state.listaAtiva[idx] = { ...state.listaAtiva[idx], ...patch };
  return state.listaAtiva[idx];
}

/**
 * Marca um item como comprado e registra no histórico
 */
export async function marcarComoComprado({ itemId, precoTotal, quantidade, unidade, local, membroId }) {
  await delay(350);
  const state = carregarEstado();
  const item = state.listaAtiva.find((i) => i.id === itemId);
  if (!item) throw new Error('Item não encontrado');

  const precoUnitario = precoTotal / quantidade;
  const agora = new Date();

  // Registra no histórico
  const compra = {
    id: uid('c'),
    produtoId: item.produtoId,
    quantidade,
    unidade,
    precoTotal,
    precoUnitario: Math.round(precoUnitario * 100) / 100,
    local: local || null,
    compradoPorId: membroId,
    data: agora,
  };
  state.compras.push(compra);

  // Remove da lista ativa
  state.listaAtiva = state.listaAtiva.filter((i) => i.id !== itemId);

  return compra;
}

/**
 * Remove um item da lista ativa (sem registrar compra)
 */
export async function removerItem(itemId) {
  await delay(200);
  const state = carregarEstado();
  state.listaAtiva = state.listaAtiva.filter((i) => i.id !== itemId);
  return { ok: true };
}

/**
 * Limpa todos os itens comprados/pendentes (sem registrar compra)
 */
export async function limparLista(membroId) {
  await delay(250);
  const state = carregarEstado();
  const qtd = state.listaAtiva.length;
  state.listaAtiva = [];
  return { removidos: qtd };
}

/**
 * Re-adiciona um produto à lista (usado no histórico)
 */
export async function readicionarProduto(produtoId, membroId) {
  await delay(150);
  const state = carregarEstado();
  const produto = state.produtos.find((p) => p.id === produtoId);
  if (!produto) throw new Error('Produto não encontrado');

  const novoItem = {
    id: uid('i'),
    produtoId,
    adicionadoPorId: membroId,
    adicionadoEm: new Date(),
    quantidade: 1,
    unidade: produto.unidadePadrao,
    status: 'pendente',
    observacao: null,
  };
  state.listaAtiva.push(novoItem);
  return novoItem;
}

// ============================================================
// AUTOCOMPLETE & BUSCA
// ============================================================

export async function buscarProdutos(termo) {
  await delay(80);
  const state = carregarEstado();
  const t = (termo || '').trim();

  if (!t) return [];

  // Combina: catálogo base (global) + produtos já conhecidos da casa
  const doCatalogoBase = buscarNoCatalogo(t, 5).map((p) => ({
    ...p,
    origem: 'catalogo',
  }));

  const daCasa = state.produtos
    .filter((p) =>
      p.nome.toLowerCase().includes(t.toLowerCase()) &&
      !doCatalogoBase.find((c) => c.nome.toLowerCase() === p.nome.toLowerCase())
    )
    .slice(0, 3)
    .map((p) => ({ ...p, origem: 'casa' }));

  return [...daCasa, ...doCatalogoBase].slice(0, 8);
}

// ============================================================
// HISTÓRICO & ESTATÍSTICAS
// ============================================================

export async function getHistorico({ limite = 50, produtoId, periodo } = {}) {
  await delay(250);
  const state = carregarEstado();
  let { compras } = state;

  if (produtoId) {
    compras = compras.filter((c) => c.produtoId === produtoId);
  }
  if (periodo) {
    const desde = new Date();
    desde.setDate(desde.getDate() - periodo);
    compras = compras.filter((c) => c.data >= desde);
  }

  return compras
    .sort((a, b) => b.data - a.data)
    .slice(0, limite)
    .map((c) => ({
      ...c,
      produto: state.produtos.find((p) => p.id === c.produtoId),
    }));
}

export async function getEstatisticasGerais(casaId = 'casa-1') {
  await delay(250);
  const state = carregarEstado();
  const { compras, listaAtiva } = state;

  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const comprasMes = compras.filter((c) => c.data >= inicioMes);

  const gastoTotalMes = comprasMes.reduce((acc, c) => acc + c.precoTotal, 0);

  // Agrupa gastos por categoria
  const gastosPorCategoria = {};
  for (const compra of comprasMes) {
    const produto = state.produtos.find((p) => p.id === compra.produtoId);
    const cat = produto?.categoria || 'outros';
    gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + compra.precoTotal;
  }

  // Top 5 produtos mais comprados
  const contador = {};
  for (const c of compras) {
    contador[c.produtoId] = (contador[c.produtoId] || 0) + 1;
  }
  const topProdutos = Object.entries(contador)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([prodId, qtd]) => ({
      produto: state.produtos.find((p) => p.id === prodId),
      vezesComprado: qtd,
    }));

  return {
    itensNaLista: listaAtiva.length,
    comprasNoMes: comprasMes.length,
    gastoTotalMes: Math.round(gastoTotalMes * 100) / 100,
    gastosPorCategoria,
    topProdutos,
  };
}

export async function getEstatisticasProduto(produtoId) {
  await delay(200);
  const state = carregarEstado();
  const produto = state.produtos.find((p) => p.id === produtoId);
  if (!produto) throw new Error('Produto não encontrado');

  const compras = state.compras
    .filter((c) => c.produtoId === produtoId)
    .sort((a, b) => a.data - b.data);

  if (compras.length === 0) {
    return {
      produto,
      totalCompras: 0,
      precoMedio: null,
      precoMinimo: null,
      precoMaximo: null,
      ultimoPreco: null,
      frequenciaMedia: null, // dias entre compras
      previsaoProximaCompra: null,
      diasDesdeUltimaCompra: null,
      historico: [],
    };
  }

  const precos = compras.map((c) => c.precoTotal);
  const ultimo = compras[compras.length - 1];

  // Frequência média: diferença média entre compras consecutivas
  let freqMedia = null;
  if (compras.length >= 2) {
    const primeiro = compras[0];
    const diff = (ultimo.data - primeiro.data) / (1000 * 60 * 60 * 24);
    freqMedia = Math.round(diff / (compras.length - 1));
  }

  // Previsão: última compra + frequência média
  let previsao = null;
  if (freqMedia && ultimo) {
    const data = new Date(ultimo.data);
    data.setDate(data.getDate() + freqMedia);
    previsao = data;
  }

  const diasDesde = Math.floor((new Date() - ultimo.data) / (1000 * 60 * 60 * 24));

  return {
    produto,
    totalCompras: compras.length,
    precoMedio: Math.round((precos.reduce((a, b) => a + b, 0) / precos.length) * 100) / 100,
    precoMinimo: Math.min(...precos),
    precoMaximo: Math.max(...precos),
    ultimoPreco: ultimo.precoTotal,
    frequenciaMedia: freqMedia,
    previsaoProximaCompra: previsao,
    diasDesdeUltimaCompra: diasDesde,
    historico: compras.slice(-12), // últimos 12 registros
  };
}

/**
 * Produtos que podem estar acabando (baseado em frequência)
 */
export async function getSugestoes() {
  await delay(200);
  const state = carregarEstado();
  const agora = new Date();
  const sugestoes = [];

  for (const produto of state.produtos) {
    if (!produto.ativo) continue;

    const comprasDoProduto = state.compras
      .filter((c) => c.produtoId === produto.id)
      .sort((a, b) => a.data - b.data);

    if (comprasDoProduto.length < 2) continue;

    const ultima = comprasDoProduto[comprasDoProduto.length - 1];
    const penultima = comprasDoProduto[comprasDoProduto.length - 2];

    const intervaloMedio = (ultima.data - penultima.data) / (1000 * 60 * 60 * 24);
    const diasPassados = (agora - ultima.data) / (1000 * 60 * 60 * 24);

    // Sugere quando passou de 80% do intervalo médio
    if (diasPassados >= intervaloMedio * 0.8) {
      // Verifica se já não está na lista ativa
      const jaNaLista = state.listaAtiva.some((i) => i.produtoId === produto.id);
      if (!jaNaLista) {
        sugestoes.push({
          produto,
          diasPassados: Math.floor(diasPassados),
          intervaloMedio: Math.round(intervaloMedio),
          urgencia: diasPassados >= intervaloMedio ? 'alta' : 'media',
          ultimaCompra: ultima,
        });
      }
    }
  }

  return sugestoes.sort((a, b) => b.diasPassados / b.intervaloMedio - a.diasPassados / a.intervaloMedio);
}

// ============================================================
// UTILITÁRIOS
// ============================================================

export async function getCategorias() {
  await delay(50);
  const { CATEGORIAS } = await import('./catalog');
  return Object.entries(CATEGORIAS).map(([key, val]) => ({ key, ...val }));
}

export async function getUnidades() {
  await delay(50);
  return UNIDADES;
}

/**
 * Reseta o estado (útil para testes)
 */
export function resetarMock() {
  STATE = null;
  carregarEstado();
}
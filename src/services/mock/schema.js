/**
 * === Modelo de Dados — Lista de Compras ===
 *
 * Produto
 * - id: string (uuid)
 * - casaId: string
 * - nome: string
 * - categoria: string (chave de CATEGORIAS)
 * - unidadePadrao: string (chave de UNIDADES)
 * - ativo: boolean (false se removido da lista)
 * - criadoEm: Date
 *
 * ItemLista (estado atual da lista)
 * - id: string
 * - casaId: string
 * - produtoId: string
 * - adicionadoPorId: string (membro)
 * - adicionadoEm: Date
 * - status: 'pendente' | 'comprado' | 'cancelado'
 * - concluidoPorId?: string
 * - concluidoEm?: Date
 * - observacao?: string
 *
 * Compra (histórico)
 * - id: string
 * - casaId: string
 * - produtoId: string
 * - quantidade: number
 * - unidade: string
 * - precoTotal: number (em reais)
 * - precoUnitario: number (calculado)
 * - local?: string (mercado)
 * - compradoPorId: string
 * - data: Date
 *
 * Membro (já existe no authStore)
 * - id, nome, email, avatar
 */
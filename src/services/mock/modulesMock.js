import { CATEGORIAS } from './catalog';

const MODULOS = [
  {
    id: 'compras',
    nome: 'Lista de Compras',
    descricao: 'Aprende com suas compras e sugere o que está acabando.',
    icon: 'cart',
    cor: 'shopping',
    rota: '/compras',
    badge: null,
  },
  {
    id: 'receitas',
    nome: 'SuperCook',
    descricao: 'Receitas com base no que você já tem em casa.',
    icon: 'chef',
    cor: 'recipes',
    rota: '/receitas',
    badge: { texto: 'Beta', variant: 'warning' },
  },
  {
    id: 'plantas',
    nome: 'Plantas & Jardim',
    descricao: 'Lembretes de rega, adubo e poda no tempo certo.',
    icon: 'plant',
    cor: 'plants',
    rota: '/plantas',
    badge: null,
  },
  {
    id: 'manutencao',
    nome: 'Manutenção da Casa',
    descricao: 'Tarefas e lembretes para evitar surpresas.',
    icon: 'tools',
    cor: 'maintenance',
    rota: '/manutencao',
    badge: null,
  },
];

export async function getModulos() {
  await new Promise((r) => setTimeout(r, 200));
  return MODULOS;
}
import { calcularMatchReceita } from './mock/recipesMock';

// Dicionário de tradução básica para ingredientes populares da API (Inglês -> Português)
const TRANSLACAO_INGREDIENTES = {
  'egg': 'Ovo',
  'eggs': 'Ovos',
  'butter': 'Manteiga',
  'milk': 'Leite',
  'flour': 'Farinha de trigo',
  'sugar': 'Açúcar',
  'salt': 'Sal',
  'pepper': 'Pimenta do reino',
  'black pepper': 'Pimenta do reino',
  'garlic': 'Alho',
  'onion': 'Cebola',
  'onions': 'Cebolas',
  'tomato': 'Tomate',
  'tomatoes': 'Tomates',
  'chicken': 'Frango',
  'chicken breast': 'Peito de frango',
  'beef': 'Carne bovina',
  'minced beef': 'Carne moída',
  'ground beef': 'Carne moída',
  'bacon': 'Bacon',
  'cheese': 'Queijo',
  'mozzarella': 'Queijo mussarela',
  'parmesan': 'Queijo parmesão',
  'cheddar': 'Queijo cheddar',
  'rice': 'Arroz',
  'pasta': 'Macarrão',
  'spaghetti': 'Espaguete',
  'olive oil': 'Azeite de oliva',
  'oil': 'Óleo',
  'vegetable oil': 'Óleo vegetal',
  'lemon': 'Limão',
  'lime': 'Limão',
  'potato': 'Batata',
  'potatoes': 'Batatas',
  'carrot': 'Cenoura',
  'carrots': 'Cenouras',
  'banana': 'Banana',
  'bananas': 'Bananas',
  'heavy cream': 'Creme de leite',
  'cream': 'Creme de leite',
  'tomato paste': 'Extrato de tomate',
  'tomato sauce': 'Molho de tomate',
  'basil': 'Manjericão',
  'oregano': 'Orégano',
  'parsley': 'Salsa / Cheiro verde',
  'bread': 'Pão',
  'water': 'Água',
  'honey': 'Mel',
  'vanilla': 'Baunilha',
};

// Dicionário para categorias
const TRANSLACAO_CATEGORIAS = {
  'Breakfast': 'Café da Manhã',
  'Starter': 'Entrada',
  'Side': 'Acompanhamento',
  'Dessert': 'Sobremesa',
  'Beef': 'Almoço/Jantar',
  'Chicken': 'Almoço/Jantar',
  'Pork': 'Almoço/Jantar',
  'Seafood': 'Almoço/Jantar',
  'Pasta': 'Almoço/Jantar',
  'Vegetarian': 'Almoço/Jantar',
  'Vegan': 'Almoço/Jantar',
  'Miscellaneous': 'Lanche',
};

// Traduz nome do ingrediente se existir no dicionário
export function traduzirIngrediente(nomeIngles) {
  if (!nomeIngles) return '';
  const key = nomeIngles.toLowerCase().trim();
  return TRANSLACAO_INGREDIENTES[key] || nomeIngles;
}

// Converter objeto retornado da TheMealDB para a estrutura interna do SuperCook
export function formatarReceitaMealDB(meal) {
  const ingredientes = [];

  // A API TheMealDB retorna ingredientes de strIngredient1 até strIngredient20
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ing && ing.trim()) {
      ingredientes.push({
        nome: traduzirIngrediente(ing.trim()),
        quantidade: measure ? measure.trim() : 'a gosto',
        categoria: 'outros',
      });
    }
  }

  // Quebrar instruções em passos
  const passosBrutos = meal.strInstructions
    ? meal.strInstructions.split(/\r\n|\n|\./).filter((p) => p.trim().length > 5)
    : ['Siga as instruções tradicionais da receita.'];

  return {
    id: `mealdb-${meal.idMeal}`,
    titulo: meal.strMeal || 'Receita da Web',
    descricao: `Receita internacional de ${meal.strArea || 'Culinária'} (${meal.strCategory || 'Geral'}).`,
    categoria: TRANSLACAO_CATEGORIAS[meal.strCategory] || 'Almoço/Jantar',
    tempoPreparo: 30, // Estimativa padrão
    dificuldade: 'Médio',
    porcoes: 4,
    dietas: meal.strCategory === 'Vegetarian' ? ['vegetariano'] : [],
    imagemEmoji: '🌐',
    imagemUrl: meal.strMealThumb,
    ingredientes,
    passos: passosBrutos.slice(0, 8),
    dicaChef: `Receita original da culinária ${meal.strArea || 'Internacional'}.`,
    isOnline: true,
  };
}

// Buscar receitas por termo na API TheMealDB
export async function buscarReceitasOnline(termo = 'chicken') {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termo)}`);
    if (!res.ok) throw new Error('Falha ao comunicar com a API de receitas.');
    const data = await res.json();

    if (!data.meals) return [];

    return data.meals.map(formatarReceitaMealDB);
  } catch (err) {
    console.error('Erro na busca de receitas online:', err);
    return [];
  }
}

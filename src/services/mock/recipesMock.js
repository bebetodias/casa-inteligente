export const CATEGORIAS_DESPENSA = {
  hortifruti: { nome: 'Hortifruti & Verduras', icon: '🥬' },
  proteinas: { nome: 'Carnes & Proteínas', icon: '🥩' },
  laticinios: { nome: 'Laticínios & Ovos', icon: '🥛' },
  mercearia: { nome: 'Grãos & Mercearia', icon: '🌾' },
  temperos: { nome: 'Temperos & Condimentos', icon: '🧂' },
  outros: { nome: 'Outros Ingredientes', icon: '🛒' },
};

export const INGREDIENTES_SUGESTOES = [
  'Ovo',
  'Tomate',
  'Cebola',
  'Alho',
  'Batata',
  'Cenoura',
  'Limão',
  'Banana',
  'Manjericão',
  'Peito de frango',
  'Carne moída',
  'Bacon',
  'Linguiça',
  'Atum em lata',
  'Queijo mussarela',
  'Queijo parmesão',
  'Queijo minas',
  'Leite',
  'Manteiga',
  'Creme de leite',
  'Requeijão',
  'Iogurte natural',
  'Arroz',
  'Feijão',
  'Macarrão',
  'Farinha de trigo',
  'Farinha de mandioca',
  'Aveia',
  'Pão de forma',
  'Pão francês',
  'Molho de tomate',
  'Extrato de tomate',
  'Açúcar',
  'Azeite de oliva',
  'Sal',
  'Pimenta do reino',
  'Óleo de soja',
  'Orégano',
  'Cheiro verde',
  'Salsinha',
  'Cebolinha',
  'Milho verde',
  'Ervilha',
  'Presunto',
  'Calabresa',
  'Maçã',
  'Laranja',
  'Abobrinha',
  'Brócolis',
  'Alface',
  'Couve',
  'Abóbora',
];

export function buscarSugestoesIngredientes(termo, limite = 6) {
  if (!termo || !termo.trim()) return [];
  const t = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return INGREDIENTES_SUGESTOES
    .filter((item) =>
      item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(t)
    )
    .slice(0, limite);
}

export const RECEITAS_BASE = [
  {
    id: 'rec-1',
    titulo: 'Omelete Cremoso com Queijo e Tomate',
    descricao: 'Um omelete rápido, super macio e recheado com queijo derretido e ervas.',
    categoria: 'Café da Manhã',
    tempoPreparo: 10,
    dificuldade: 'Fácil',
    porcoes: 2,
    dietas: ['vegetariano', 'low-carb', 'rapida'],
    imagemEmoji: '🍳',
    ingredientes: [
      { nome: 'Ovo', quantidade: '3 unidades', categoria: 'laticinios' },
      { nome: 'Queijo mussarela', quantidade: '50g', categoria: 'laticinios' },
      { nome: 'Tomate', quantidade: '1 unidade picada', categoria: 'hortifruti' },
      { nome: 'Manteiga', quantidade: '1 colher de sopa', categoria: 'laticinios' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
      { nome: 'Orégano', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Em uma tigela, bata bem os ovos com uma pitada de sal e orégano.',
      'Derreta a manteiga em uma frigideira antiaderente em fogo médio.',
      'Despeje os ovos batidos e deixe cozinhar por cerca de 2 minutos até as bordas firmarem.',
      'Adicione o queijo mussarela e os tomates picados em uma das metades.',
      'Dobre a omelete ao meio, desligue o fogo e sirva quentinho.'
    ],
    dicaChef: 'Adicione uma colher de creme de leite nos ovos batidos para deixar o omelete ainda mais alto e cremoso!'
  },
  {
    id: 'rec-2',
    titulo: 'Macarrão ao Molho de Tomate e Manjericão',
    descricao: 'Clássico italiano rápido, prático e repleto de sabor com ingredientes simples.',
    categoria: 'Almoço/Jantar',
    tempoPreparo: 20,
    dificuldade: 'Fácil',
    porcoes: 3,
    dietas: ['vegetariano', 'rapida'],
    imagemEmoji: '🍝',
    ingredientes: [
      { nome: 'Macarrão', quantidade: '300g', categoria: 'mercearia' },
      { nome: 'Molho de tomate', quantidade: '1 sachê (340g)', categoria: 'mercearia' },
      { nome: 'Alho', quantidade: '2 dentes picados', categoria: 'temperos' },
      { nome: 'Cebola', quantidade: '1/2 unidade picada', categoria: 'hortifruti' },
      { nome: 'Azeite de oliva', quantidade: '2 colheres de sopa', categoria: 'temperos' },
      { nome: 'Queijo parmesão', quantidade: 'a gosto', categoria: 'laticinios' },
      { nome: 'Manjericão', quantidade: 'folhas frescas a gosto', categoria: 'temperos' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Cozinhe o macarrão em bastante água fervente com sal até ficar ao dente.',
      'Em uma panela, aqueça o azeite e doure a cebola e o alho.',
      'Adicione o molho de tomate, acerte o sal e deixe apurar em fogo baixo por 5 minutos.',
      'Misture o macarrão escorrido ao molho e finalize com folhas de manjericão e queijo parmesão.'
    ],
    dicaChef: 'Reserve meia xícara da água do cozimento da massa para encorpar o molho de tomate!'
  },
  {
    id: 'rec-3',
    titulo: 'Strogonoff de Frango Rápido',
    descricao: 'Favorito das famílias brasileiras, cremoso e super suculento.',
    categoria: 'Almoço/Jantar',
    tempoPreparo: 30,
    dificuldade: 'Fácil',
    porcoes: 4,
    dietas: ['sem-gluten'],
    imagemEmoji: '🥘',
    ingredientes: [
      { nome: 'Peito de frango', quantidade: '500g cortado em cubos', categoria: 'proteinas' },
      { nome: 'Creme de leite', quantidade: '1 caixa (200g)', categoria: 'laticinios' },
      { nome: 'Molho de tomate', quantidade: '3 colheres de sopa', categoria: 'mercearia' },
      { nome: 'Alho', quantidade: '2 dentes picados', categoria: 'temperos' },
      { nome: 'Cebola', quantidade: '1 unidade picada', categoria: 'hortifruti' },
      { nome: 'Manteiga', quantidade: '1 colher de sopa', categoria: 'laticinios' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
      { nome: 'Pimenta do reino', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Tempere o frango com sal e pimenta do reino.',
      'Na panela, derreta a manteiga e doure a cebola e o alho.',
      'Acrescente o frango e refogue até dourar bem e secar a água.',
      'Adicione o molho de tomate, misture bem e em seguida desligue o fogo.',
      'Misture o creme de leite com o fogo desligado para não talhar e sirva com arroz.'
    ],
    dicaChef: 'Sirva acompanhado de batata palha ou batatas rústicas douradas na frigideira.'
  },
  {
    id: 'rec-4',
    titulo: 'Panqueca Doce de Banana com Aveia',
    descricao: 'Saudável, naturalmente doce, sem açúcar refinado e perfeita para o café.',
    categoria: 'Café da Manhã',
    tempoPreparo: 15,
    dificuldade: 'Fácil',
    porcoes: 1,
    dietas: ['vegetariano', 'sem-gluten', 'rapida'],
    imagemEmoji: '🥞',
    ingredientes: [
      { nome: 'Banana', quantidade: '1 unidade bem madura', categoria: 'hortifruti' },
      { nome: 'Ovo', quantidade: '1 unidade', categoria: 'laticinios' },
      { nome: 'Aveia', quantidade: '2 colheres de sopa', categoria: 'mercearia' },
      { nome: 'Manteiga', quantidade: '1 colher de chá para untar', categoria: 'laticinios' },
    ],
    passos: [
      'Em um prato fundo, amasse a banana com um garfo até virar um purê.',
      'Adicione o ovo e a aveia, misturando muito bem com o garfo.',
      'Unte uma frigideira pequena com manteiga e leve ao fogo baixo.',
      'Despeje a massa e cozinhe por cerca de 2 a 3 minutos de cada lado até dourar.',
      'Sirva com fatias extras de banana ou mel se desejar.'
    ],
    dicaChef: 'Adicione uma pitada de canela em pó na massa para dar um aroma irresistível.'
  },
  {
    id: 'rec-5',
    titulo: 'Arroz de Forno Cremoso e Recheado',
    descricao: 'A melhor forma de aproveitar o arroz de ontem transformando em um prato incrível.',
    categoria: 'Almoço/Jantar',
    tempoPreparo: 25,
    dificuldade: 'Fácil',
    porcoes: 4,
    dietas: ['sem-gluten'],
    imagemEmoji: '🍲',
    ingredientes: [
      { nome: 'Arroz', quantidade: '3 xícaras cozido', categoria: 'mercearia' },
      { nome: 'Creme de leite', quantidade: '1 caixa', categoria: 'laticinios' },
      { nome: 'Requeijão', quantidade: '2 colheres de sopa', categoria: 'laticinios' },
      { nome: 'Queijo mussarela', quantidade: '150g picado ou ralado', categoria: 'laticinios' },
      { nome: 'Tomate', quantidade: '1 unidade picada', categoria: 'hortifruti' },
      { nome: 'Cheiro verde', quantidade: 'a gosto', categoria: 'temperos' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Em uma tigela, misture o creme de leite, o requeijão e o cheiro verde.',
      'Junte o arroz cozido, o tomate picado e metade do queijo mussarela.',
      'Transfira tudo para um refratário e cubra com o restante da mussarela.',
      'Leve ao forno pré-aquecido a 200°C por 15 minutos até o queijo derretar e gratinar.'
    ],
    dicaChef: 'Você pode adicionar sobras de frango desfiado, presunto ou cenoura ralada ao recheio.'
  },
  {
    id: 'rec-6',
    titulo: 'Escondidinho de Carne Moída com Batata',
    descricao: 'Purê de batata super macio cobrindo uma carne moída bem temperada.',
    categoria: 'Almoço/Jantar',
    tempoPreparo: 40,
    dificuldade: 'Médio',
    porcoes: 4,
    dietas: ['sem-gluten'],
    imagemEmoji: '🥘',
    ingredientes: [
      { nome: 'Carne moída', quantidade: '400g', categoria: 'proteinas' },
      { nome: 'Batata', quantidade: '4 unidades grandes', categoria: 'hortifruti' },
      { nome: 'Leite', quantidade: '1/2 xícara', categoria: 'laticinios' },
      { nome: 'Manteiga', quantidade: '1 colher de sopa', categoria: 'laticinios' },
      { nome: 'Cebola', quantidade: '1 unidade picada', categoria: 'hortifruti' },
      { nome: 'Alho', quantidade: '2 dentes picados', categoria: 'temperos' },
      { nome: 'Molho de tomate', quantidade: '2 colheres de sopa', categoria: 'mercearia' },
      { nome: 'Queijo mussarela', quantidade: '100g para gratinar', categoria: 'laticinios' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Cozinhe as batatas sem casca até ficarem bem macias. Amasse-as e misture com o leite, a manteiga e o sal para fazer o purê.',
      'Em outra panela, doure o alho e a cebola, adicione a carne moída e refogue bem.',
      'Adicione o molho de tomate, acerte o sal e deixe a carne moída bem suculenta.',
      'Em um refratário, faça uma camada de carne moída, cubra com o purê de batata e finalize com mussarela.',
      'Leve ao forno por 15 minutos para gratinar.'
    ],
    dicaChef: 'Para um purê ainda mais aveludado, passe as batatas cozidas por uma peneira fina ou espremedor.'
  },
  {
    id: 'rec-7',
    titulo: 'Sopa Rápida de Legumes com Macarrão',
    descricao: 'Nutritiva, reconfortante e aquecedora, pronta em menos de meia hora.',
    categoria: 'Almoço/Jantar',
    tempoPreparo: 25,
    dificuldade: 'Fácil',
    porcoes: 3,
    dietas: ['vegetariano', 'rapida'],
    imagemEmoji: '🥣',
    ingredientes: [
      { nome: 'Batata', quantidade: '2 unidades em cubos', categoria: 'hortifruti' },
      { nome: 'Cenoura', quantidade: '1 unidade em rodelas', categoria: 'hortifruti' },
      { nome: 'Macarrão', quantidade: '1 xícara (tipo conchinha ou padre nosso)', categoria: 'mercearia' },
      { nome: 'Cebola', quantidade: '1/2 unidade', categoria: 'hortifruti' },
      { nome: 'Alho', quantidade: '2 dentes', categoria: 'temperos' },
      { nome: 'Azeite de oliva', quantidade: '1 colher de sopa', categoria: 'temperos' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
      { nome: 'Cheiro verde', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Refogue o alho e a cebola no azeite em uma panela funda.',
      'Junte a batata e a cenoura, cubra com 1 litro de água quente e sal.',
      'Cozinhe em fogo médio por 12 minutos.',
      'Adicione o macarrão e cozinhe por mais 8 minutos até tudo ficar macio.',
      'Finalize com bastante cheiro verde e sirva quente.'
    ],
    dicaChef: 'Se tiver sobrou de frango desfiado ou carne moída em casa, junte à sopa no final!'
  },
  {
    id: 'rec-8',
    titulo: 'Tapioca Crocante Recheada com Queijo e Bacon',
    descricao: 'Lanche prático com recheio cremoso e casquinha crocante.',
    categoria: 'Lanche',
    tempoPreparo: 12,
    dificuldade: 'Fácil',
    porcoes: 1,
    dietas: ['sem-gluten', 'rapida'],
    imagemEmoji: '🌮',
    ingredientes: [
      { nome: 'Farinha de trigo', quantidade: '3 colheres de sopa (ou goma de tapioca)', categoria: 'mercearia' },
      { nome: 'Ovo', quantidade: '1 unidade', categoria: 'laticinios' },
      { nome: 'Queijo mussarela', quantidade: '2 fatias', categoria: 'laticinios' },
      { nome: 'Bacon', quantidade: '2 colheres de sopa bem dourado', categoria: 'proteinas' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Bata o ovo com uma pitada de sal e misture com a farinha/goma até ficar homogêneo.',
      'Aqueça uma frigideira antiaderente sem óleo.',
      'Despeje a mistura e deixe assar até soltar do fundo.',
      'Vire a massa, coloque o queijo e o bacon dourado e dobre ao meio.',
      'Deixe o queijo derreter e sirva imediatamente.'
    ],
    dicaChef: 'Fria ou quente, fica perfeita acompanhada de um café fresquinho.'
  },
  {
    id: 'rec-9',
    titulo: 'Pãezinhos de Alho e Queijo de Frigideira',
    descricao: 'Pãezinhos macios recheados feitos direto na frigideira sem precisar de forno.',
    categoria: 'Lanche',
    tempoPreparo: 15,
    dificuldade: 'Fácil',
    porcoes: 2,
    dietas: ['vegetariano', 'rapida'],
    imagemEmoji: '🥖',
    ingredientes: [
      { nome: 'Pão de forma', quantidade: '4 fatias', categoria: 'mercearia' },
      { nome: 'Queijo mussarela', quantidade: '4 fatias', categoria: 'laticinios' },
      { nome: 'Manteiga', quantidade: '2 colheres de sopa', categoria: 'laticinios' },
      { nome: 'Alho', quantidade: '1 dente bem amassado', categoria: 'temperos' },
      { nome: 'Orégano', quantidade: '1 colher de chá', categoria: 'temperos' },
    ],
    passos: [
      'Em um potinho, misture a manteiga amolecida, o alho amassado e o orégano.',
      'Passe a manteiga de alho nas partes externas do pão de forma.',
      'Recheie o interior com o queijo mussarela.',
      'Doure na frigideira em fogo baixo dos dois lados até o pão ficar bem crocante e o queijo derreter.'
    ],
    dicaChef: 'Pressione levemente o pão com uma espátula durante o preparo para criar uma casquinha bem uniforme.'
  },
  {
    id: 'rec-10',
    titulo: 'Patezinho Cremoso de Atum com Torradas',
    descricao: 'Entrada ou lanche rápido pronto em 5 minutos com atum de lata.',
    categoria: 'Lanche',
    tempoPreparo: 5,
    dificuldade: 'Fácil',
    porcoes: 2,
    dietas: ['sem-gluten', 'rapida', 'low-carb'],
    imagemEmoji: '🥪',
    ingredientes: [
      { nome: 'Atum em lata', quantidade: '1 lata escorrida', categoria: 'proteinas' },
      { nome: 'Requeijão', quantidade: '2 colheres de sopa (ou creme de leite)', categoria: 'laticinios' },
      { nome: 'Cebola', quantidade: '2 colheres de sopa bem picada', categoria: 'hortifruti' },
      { nome: 'Limão', quantidade: 'algumas gotas', categoria: 'hortifruti' },
      { nome: 'Azeite de oliva', quantidade: '1 colher de chá', categoria: 'temperos' },
      { nome: 'Sal', quantidade: 'a gosto', categoria: 'temperos' },
    ],
    passos: [
      'Em uma tigela, amasse o atum escorrido com um garfo.',
      'Adicione o requeijão, a cebola picada, o azeite e gotas de limão.',
      'Misture bem até virar uma pasta homogênea e ajuste o sal.',
      'Sirva com torradas, pão de forma ou tiras de cenoura.'
    ],
    dicaChef: 'Fica ainda mais saboroso se deixado 10 minutos na geladeira antes de servir.'
  }
];

export function normalizarNome(nome) {
  if (!nome) return '';
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function calcularMatchReceita(receita, ingredientesDespensa = []) {
  const despensaSet = new Set(ingredientesDespensa.map(normalizarNome));

  const presentes = [];
  const faltantes = [];

  receita.ingredientes.forEach((ing) => {
    const nomeNorm = normalizarNome(ing.nome);
    const possui = Array.from(despensaSet).some(
      (itemDespensa) => itemDespensa.includes(nomeNorm) || nomeNorm.includes(itemDespensa)
    );

    if (possui) {
      presentes.push(ing);
    } else {
      faltantes.push(ing);
    }
  });

  const total = receita.ingredientes.length;
  const matchCount = presentes.length;
  const percentual = total > 0 ? Math.round((matchCount / total) * 100) : 0;
  const prontoAgora = faltantes.length === 0;
  const quasePronto = faltantes.length > 0 && faltantes.length <= 2;

  return {
    total,
    matchCount,
    percentual,
    prontoAgora,
    quasePronto,
    presentes,
    faltantes,
  };
}

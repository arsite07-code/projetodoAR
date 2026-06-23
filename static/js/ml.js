// =======================================
// IA MACHINE LEARNING SIMPLES - LOJA A/R
// Modelo usado: Naive Bayes
// =======================================

// ===============================
// BOTÕES DE SUGESTÃO
// ===============================
const sugestoesIA = [
    "Quero uma camisa preta",
    "Quero uma camisa branca",
    "Quero uma camisa azul",
    "Quero uma camisa vermelha",
    "Quero uma camisa bege",
    "Quero uma oversized",
    "Quero uma camisa social",
    "Quero uma camisa polo",
    "Quero uma manga longa",
    "Quero roupa para frio",
    "Quero roupa para calor",
    "Monta um look para mim",
    "Qual tamanho devo comprar?",
    "Quais são as medidas?",
    "Quanto custa?",
    "Tem promoção?",
    "Tem cupom?",
    "Aceita Pix?",
    "Aceita cartão?",
    "Tem entrega?",
    "Como rastrear meu pedido?",
    "Posso trocar?",
    "Como lavar a camisa?",
    "Quero falar com atendente"
];

// ===============================
// FRASES USADAS PARA TREINAR A IA
// ===============================
const dadosTreino = [

    // SAUDAÇÃO
    { frase: "oi", intencao: "saudacao" },
    { frase: "olá", intencao: "saudacao" },
    { frase: "ola", intencao: "saudacao" },
    { frase: "bom dia", intencao: "saudacao" },
    { frase: "boa tarde", intencao: "saudacao" },
    { frase: "boa noite", intencao: "saudacao" },
    { frase: "e ai", intencao: "saudacao" },
    { frase: "tudo bem", intencao: "saudacao" },

    // CAMISAS POR COR
    { frase: "quero uma camisa preta", intencao: "camisa_preta" },
    { frase: "tem camiseta preta", intencao: "camisa_preta" },
    { frase: "gosto de roupa preta", intencao: "camisa_preta" },
    { frase: "me mostra camisa preta", intencao: "camisa_preta" },
    { frase: "camisa black", intencao: "camisa_preta" },

    { frase: "quero uma camisa branca", intencao: "camisa_branca" },
    { frase: "tem camiseta branca", intencao: "camisa_branca" },
    { frase: "roupa branca combina", intencao: "camisa_branca" },
    { frase: "me mostra camisa branca", intencao: "camisa_branca" },

    { frase: "quero uma camisa azul", intencao: "camisa_azul" },
    { frase: "tem camiseta azul", intencao: "camisa_azul" },
    { frase: "camisa azul combina", intencao: "camisa_azul" },
    { frase: "me mostra camisa azul", intencao: "camisa_azul" },

    { frase: "quero uma camisa vermelha", intencao: "camisa_vermelha" },
    { frase: "tem camiseta vermelha", intencao: "camisa_vermelha" },
    { frase: "camisa vermelha combina", intencao: "camisa_vermelha" },
    { frase: "me mostra camisa vermelha", intencao: "camisa_vermelha" },

    { frase: "quero uma camisa bege", intencao: "camisa_bege" },
    { frase: "tem camiseta bege", intencao: "camisa_bege" },
    { frase: "camisa bege combina", intencao: "camisa_bege" },
    { frase: "me mostra camisa bege", intencao: "camisa_bege" },

    // ESTILOS
    { frase: "quero uma camisa social", intencao: "social" },
    { frase: "preciso de roupa elegante", intencao: "social" },
    { frase: "camisa para trabalhar", intencao: "social" },
    { frase: "roupa formal", intencao: "social" },
    { frase: "look elegante", intencao: "social" },

    { frase: "quero uma camisa casual", intencao: "casual" },
    { frase: "camisa para o dia a dia", intencao: "casual" },
    { frase: "roupa simples para sair", intencao: "casual" },
    { frase: "camiseta básica", intencao: "casual" },
    { frase: "camisa normal", intencao: "casual" },

    { frase: "quero camisa oversized", intencao: "oversized" },
    { frase: "camisa larga", intencao: "oversized" },
    { frase: "camiseta grande", intencao: "oversized" },
    { frase: "roupa estilo streetwear", intencao: "oversized" },
    { frase: "camisa folgada", intencao: "oversized" },

    { frase: "quero camisa estampada", intencao: "estampada" },
    { frase: "tem camisa com desenho", intencao: "estampada" },
    { frase: "camisa de anime", intencao: "estampada" },
    { frase: "camiseta com estampa", intencao: "estampada" },
    { frase: "camisa street", intencao: "estampada" },

    { frase: "quero uma camisa polo", intencao: "polo" },
    { frase: "tem camisa polo", intencao: "polo" },
    { frase: "camisa polo masculina", intencao: "polo" },
    { frase: "polo combina com o que", intencao: "polo" },

    { frase: "quero camisa manga longa", intencao: "manga_longa" },
    { frase: "tem manga longa", intencao: "manga_longa" },
    { frase: "camisa para frio", intencao: "manga_longa" },
    { frase: "camisa de manga comprida", intencao: "manga_longa" },

    { frase: "tem regata", intencao: "regata" },
    { frase: "quero uma regata", intencao: "regata" },
    { frase: "roupa para academia", intencao: "regata" },
    { frase: "camiseta sem manga", intencao: "regata" },

    // LOOKS
    { frase: "tem roupa para frio", intencao: "frio" },
    { frase: "quero roupa de inverno", intencao: "frio" },
    { frase: "roupa para usar no frio", intencao: "frio" },
    { frase: "camisa combina com jaqueta", intencao: "frio" },

    { frase: "tem roupa para calor", intencao: "calor" },
    { frase: "quero roupa de verão", intencao: "calor" },
    { frase: "roupa leve para calor", intencao: "calor" },
    { frase: "camisa fresca", intencao: "calor" },

    { frase: "quero roupa para festa", intencao: "festa" },
    { frase: "look para festa", intencao: "festa" },
    { frase: "roupa para sair à noite", intencao: "festa" },
    { frase: "look para balada", intencao: "festa" },

    { frase: "look para trabalhar", intencao: "trabalho" },
    { frase: "roupa para trabalho", intencao: "trabalho" },
    { frase: "camisa para reunião", intencao: "trabalho" },
    { frase: "roupa profissional", intencao: "trabalho" },

    { frase: "monta um look para mim", intencao: "look" },
    { frase: "me ajuda a montar um look", intencao: "look" },
    { frase: "qual roupa combina com essa camisa", intencao: "look" },
    { frase: "combinação de roupa", intencao: "look" },

    // OUTRAS PEÇAS
    { frase: "tem calça", intencao: "calca" },
    { frase: "vende calça jeans", intencao: "calca" },
    { frase: "tem calça cargo", intencao: "calca" },
    { frase: "quero uma calça", intencao: "calca" },

    { frase: "tem bermuda", intencao: "bermuda" },
    { frase: "vende bermuda", intencao: "bermuda" },
    { frase: "quero uma bermuda", intencao: "bermuda" },
    { frase: "bermuda combina com camiseta", intencao: "bermuda" },

    { frase: "tem moletom", intencao: "moletom" },
    { frase: "vende blusa de frio", intencao: "moletom" },
    { frase: "quero um moletom", intencao: "moletom" },
    { frase: "tem roupa de frio", intencao: "moletom" },

    { frase: "tem jaqueta", intencao: "jaqueta" },
    { frase: "vende jaqueta", intencao: "jaqueta" },
    { frase: "quero uma jaqueta", intencao: "jaqueta" },
    { frase: "jaqueta combina com camisa", intencao: "jaqueta" },

    { frase: "tem boné", intencao: "bone" },
    { frase: "vende boné", intencao: "bone" },
    { frase: "quero um boné", intencao: "bone" },
    { frase: "boné combina com oversized", intencao: "bone" },

    { frase: "tem acessórios", intencao: "acessorios" },
    { frase: "vende corrente", intencao: "acessorios" },
    { frase: "vende pulseira", intencao: "acessorios" },
    { frase: "acessórios para look", intencao: "acessorios" },

    // TAMANHO E MEDIDAS
    { frase: "qual tamanho devo comprar", intencao: "tamanho" },
    { frase: "tem tamanho p", intencao: "tamanho" },
    { frase: "tem tamanho m", intencao: "tamanho" },
    { frase: "tem tamanho g", intencao: "tamanho" },
    { frase: "tem tamanho gg", intencao: "tamanho" },
    { frase: "como saber meu tamanho", intencao: "tamanho" },
    { frase: "qual tamanho fica melhor", intencao: "tamanho" },

    { frase: "quais são as medidas", intencao: "medidas" },
    { frase: "tabela de medidas", intencao: "medidas" },
    { frase: "qual a medida da camisa", intencao: "medidas" },
    { frase: "largura e comprimento", intencao: "medidas" },

    // COMPRA E PAGAMENTO
    { frase: "qual o preço", intencao: "preco" },
    { frase: "quanto custa", intencao: "preco" },
    { frase: "qual o valor", intencao: "preco" },
    { frase: "esta caro", intencao: "preco" },

    { frase: "tem promoção", intencao: "promocao" },
    { frase: "tem desconto", intencao: "promocao" },
    { frase: "produto em promoção", intencao: "promocao" },
    { frase: "camisa mais barata", intencao: "promocao" },

    { frase: "tem cupom", intencao: "cupom" },
    { frase: "cupom de desconto", intencao: "cupom" },
    { frase: "qual cupom posso usar", intencao: "cupom" },
    { frase: "tem código de desconto", intencao: "cupom" },

    { frase: "quais formas de pagamento", intencao: "pagamento" },
    { frase: "como posso pagar", intencao: "pagamento" },
    { frase: "aceita pagamento online", intencao: "pagamento" },
    { frase: "posso pagar na entrega", intencao: "pagamento" },

    { frase: "aceita pix", intencao: "pix" },
    { frase: "tem pix", intencao: "pix" },
    { frase: "posso pagar no pix", intencao: "pix" },
    { frase: "pagamento por pix", intencao: "pix" },

    { frase: "aceita cartão", intencao: "cartao" },
    { frase: "passa cartão", intencao: "cartao" },
    { frase: "aceita cartão de crédito", intencao: "cartao" },
    { frase: "aceita cartão de débito", intencao: "cartao" },
    { frase: "parcela no cartão", intencao: "cartao" },

    { frase: "como comprar", intencao: "compra" },
    { frase: "quero finalizar compra", intencao: "compra" },
    { frase: "como colocar no carrinho", intencao: "compra" },
    { frase: "como faço o pedido", intencao: "compra" },

    // ENTREGA E TROCA
    { frase: "faz entrega", intencao: "entrega" },
    { frase: "qual o frete", intencao: "entrega" },
    { frase: "envia para minha cidade", intencao: "entrega" },
    { frase: "tem envio", intencao: "entrega" },

    { frase: "qual o prazo de entrega", intencao: "prazo" },
    { frase: "quanto tempo demora para chegar", intencao: "prazo" },
    { frase: "quantos dias demora", intencao: "prazo" },
    { frase: "quando chega", intencao: "prazo" },

    { frase: "como rastrear meu pedido", intencao: "rastreio" },
    { frase: "cadê meu pedido", intencao: "rastreio" },
    { frase: "meu pedido não chegou", intencao: "rastreio" },
    { frase: "tem código de rastreio", intencao: "rastreio" },

    { frase: "posso trocar", intencao: "troca" },
    { frase: "tem devolução", intencao: "troca" },
    { frase: "e se não servir", intencao: "troca" },
    { frase: "como funciona a troca", intencao: "troca" },
    { frase: "posso devolver", intencao: "troca" },

    // PRODUTO
    { frase: "tem em estoque", intencao: "estoque" },
    { frase: "ainda tem disponível", intencao: "estoque" },
    { frase: "tem essa camisa disponível", intencao: "estoque" },
    { frase: "acabou o produto", intencao: "estoque" },

    { frase: "qual o tecido", intencao: "tecido" },
    { frase: "a camisa é de algodão", intencao: "tecido" },
    { frase: "qual material da camisa", intencao: "tecido" },
    { frase: "o tecido é bom", intencao: "tecido" },

    { frase: "como lavar a camisa", intencao: "lavagem" },
    { frase: "pode lavar na máquina", intencao: "lavagem" },
    { frase: "como cuidar da roupa", intencao: "lavagem" },
    { frase: "a camisa encolhe", intencao: "lavagem" },

    // PÚBLICO
    { frase: "tem roupa masculina", intencao: "masculino" },
    { frase: "moda masculina", intencao: "masculino" },
    { frase: "camisa masculina", intencao: "masculino" },
    { frase: "look masculino", intencao: "masculino" },

    { frase: "tem roupa feminina", intencao: "feminino" },
    { frase: "moda feminina", intencao: "feminino" },
    { frase: "camisa feminina", intencao: "feminino" },
    { frase: "look feminino", intencao: "feminino" },

    { frase: "tem roupa infantil", intencao: "infantil" },
    { frase: "vende roupa para criança", intencao: "infantil" },
    { frase: "camisa infantil", intencao: "infantil" },
    { frase: "moda infantil", intencao: "infantil" },

    // ATENDIMENTO
    { frase: "quero falar com atendente", intencao: "atendente" },
    { frase: "quero falar com alguém", intencao: "atendente" },
    { frase: "tem whatsapp", intencao: "atendente" },
    { frase: "qual o contato da loja", intencao: "atendente" },

    { frase: "tem loja física", intencao: "loja_fisica" },
    { frase: "onde fica a loja", intencao: "loja_fisica" },
    { frase: "posso retirar na loja", intencao: "loja_fisica" },
    { frase: "tem retirada", intencao: "loja_fisica" },

    // RECOMENDAÇÃO
    { frase: "me recomenda uma camisa", intencao: "recomendacao" },
    { frase: "qual camisa combina comigo", intencao: "recomendacao" },
    { frase: "não sei qual escolher", intencao: "recomendacao" },
    { frase: "me ajuda a escolher", intencao: "recomendacao" },
    { frase: "qual roupa eu compro", intencao: "recomendacao" },

    // PRESENTE
    { frase: "quero comprar para presente", intencao: "presente" },
    { frase: "camisa para dar de presente", intencao: "presente" },
    { frase: "qual roupa dar de presente", intencao: "presente" },
    { frase: "presente para namorado", intencao: "presente" },
    // ================= NOVAS CAMISAS STREETWEAR =================

// 🌴 LOS ANGELES
{ frase: "quero camisa los angeles", intencao: "los_angeles" },
{ frase: "camisa la street", intencao: "los_angeles" },
{ frase: "estilo california", intencao: "los_angeles" },
{ frase: "west coast estilo", intencao: "los_angeles" },

// 🐉 DRAGON
{ frase: "quero camisa dragon", intencao: "dragon" },
{ frase: "camisa com dragao", intencao: "dragon" },
{ frase: "logo dragon streetwear", intencao: "dragon" },
{ frase: "camisa estilo oriental dragao", intencao: "dragon" },

// 🏛️ HERMES GREGO
{ frase: "camisa hermes grego", intencao: "hermes" },
{ frase: "estilo grecia streetwear", intencao: "hermes" },
{ frase: "camisa deus grego", intencao: "hermes" },
{ frase: "olympus style", intencao: "hermes" },

// 🎨 ERA DOURADA
{ frase: "camisa era dourada", intencao: "era_dourada" },
{ frase: "estilo renascentista", intencao: "era_dourada" },
{ frase: "camisa arte classica", intencao: "era_dourada" },
{ frase: "golden era streetwear", intencao: "era_dourada" },

// 👑 NEYMAR THE PRINCE
{ frase: "camisa neymar the prince", intencao: "neymar" },
{ frase: "camisa prince futebol", intencao: "neymar" },
{ frase: "estilo jogador neymar", intencao: "neymar" },
{ frase: "futebol arte streetwear", intencao: "neymar" },

// ⚫⚪ CORINTHIANS
{ frase: "camisa corinthians alvinegro", intencao: "corinthians" },
{ frase: "fiel army style", intencao: "corinthians" },
{ frase: "timão streetwear", intencao: "corinthians" },
{ frase: "camisa bando de loucos", intencao: "corinthians" },

// 🚗 WEST COAST / BRIAN O’CONNER
{ frase: "camisa west coast brian o conner", intencao: "west_coast" },
{ frase: "velozes e furiosos style", intencao: "west_coast" },
{ frase: "camisa street racing", intencao: "west_coast" },
{ frase: "california racing style", intencao: "west_coast" }
];

// ===============================
// RESPOSTAS DA IA
// ===============================
const respostasIA = {
    saudacao: "Olá! Seja bem-vindo à loja A/R. Você procura camisa casual, social, oversized, tamanho, preço, entrega ou quer montar um look?",

    camisa_preta: "A camisa preta é uma ótima escolha. Ela combina com calça jeans, calça cargo, tênis branco e jaqueta. Para um estilo moderno, recomendo camiseta preta oversized.",
    camisa_branca: "A camisa branca é perfeita para um visual limpo e versátil. Combina com praticamente tudo e serve tanto para looks casuais quanto elegantes.",
    camisa_azul: "A camisa azul é uma ótima opção para um visual bonito e discreto. Combina muito bem com jeans, bermuda clara, tênis branco e acessórios simples.",
    camisa_vermelha: "A camisa vermelha chama mais atenção. Para combinar melhor, use com peças neutras como calça preta, jeans escuro ou bermuda preta.",
    camisa_bege: "A camisa bege é excelente para um visual moderno e elegante. Combina com preto, branco, marrom, jeans claro e tênis casual.",

    social: "Para um estilo social, recomendo camisa de botão em cores neutras, como branca, preta, azul-marinho ou bege. Esse estilo passa uma imagem elegante e profissional.",
    casual: "Para o dia a dia, recomendo camisetas básicas ou estampadas discretas. Elas são confortáveis, fáceis de combinar e ficam boas com jeans, bermuda ou calça cargo.",
    oversized: "O estilo oversized está muito em alta. Recomendo usar com calça cargo, jeans largo, bermuda e tênis. Se quiser caimento mais solto, escolha um tamanho maior.",
    estampada: "Camisas estampadas são ótimas para um estilo streetwear. A dica é usar com calça ou bermuda mais neutra para deixar a estampa se destacar.",
    polo: "A camisa polo é ótima para quem quer ficar arrumado sem parecer formal demais. Combina com jeans, calça chino, bermuda e tênis casual.",
    manga_longa: "A camisa manga longa é boa para dias frios ou para montar um visual mais elegante. Fica ótima com jeans, calça preta ou jaqueta.",
    regata: "A regata é ideal para dias quentes, academia ou looks mais leves. Combina com bermuda, calça jogger e tênis esportivo.",

    frio: "Para o frio, recomendo camiseta básica ou oversized com moletom, jaqueta ou camisa manga longa. Um look preto com jaqueta fica bem estiloso.",
    calor: "Para o calor, recomendo camisetas leves, cores claras, regatas ou camisas de tecido mais fresco. Camisa branca, bege e azul claro funcionam muito bem.",
    festa: "Para festa ou sair à noite, recomendo camiseta preta oversized, calça jeans escura ou cargo e tênis branco. Se quiser algo mais elegante, use camisa social preta.",
    trabalho: "Para trabalho, recomendo camisa polo, camisa social ou camiseta básica sem estampa muito chamativa. Cores como branco, preto, azul-marinho e bege passam uma imagem melhor.",
    look: "Claro! Um look moderno seria camiseta oversized preta, calça cargo, tênis branco e boné. Um look casual seria camiseta branca, jeans e tênis. Um look elegante seria camisa social, calça preta e tênis casual.",

    calca: "Calças combinam muito bem com nossas camisas. Para streetwear, use calça cargo ou jeans largo. Para casual, use jeans tradicional. Para algo elegante, calça preta funciona muito bem.",
    bermuda: "Bermuda combina muito com camiseta básica, oversized ou regata. Para um visual bonito, use bermuda preta, bege ou jeans com tênis branco.",
    moletom: "Moletom é ótimo para dias frios e combina com camiseta básica ou oversized por baixo. Para um look moderno, use moletom com calça cargo ou jeans.",
    jaqueta: "Jaqueta combina muito bem com camiseta preta, branca ou oversized. Para um visual mais forte, use camiseta preta, jaqueta escura e calça jeans.",
    bone: "Boné combina bastante com looks streetwear. Fica muito bom com camiseta oversized, calça cargo, bermuda e tênis.",
    acessorios: "Acessórios deixam o look mais completo. Corrente, pulseira, relógio e boné combinam bem com camisetas básicas, oversized e streetwear.",

    tamanho: "Temos tamanhos P, M, G e GG. Se você gosta de roupa mais justa, escolha seu tamanho normal. Se gosta de roupa mais larga, escolha um tamanho acima.",
    medidas: "Para escolher melhor, compare suas medidas com a tabela da loja. Veja principalmente largura do peito, comprimento da camisa e largura dos ombros.",

    preco: "Os preços variam conforme o modelo da camisa. Camisas básicas costumam ser mais baratas, enquanto oversized, estampadas e sociais podem ter valor maior.",
    promocao: "Temos produtos que podem entrar em promoção. Recomendo olhar os destaques da loja e verificar se existe alguma camisa com desconto disponível.",
    cupom: "Os cupons podem variar conforme a campanha da loja. Se houver cupom ativo, ele aparecerá nos anúncios da loja ou na finalização da compra.",
    pagamento: "Aceitamos diferentes formas de pagamento, como Pix, cartão de crédito, cartão de débito e outras opções disponíveis na finalização da compra.",
    pix: "Sim, aceitamos Pix. É uma forma rápida e prática de pagamento. Após finalizar a compra, o cliente recebe as informações para pagar.",
    cartao: "Sim, aceitamos cartão de crédito e débito. Dependendo do valor da compra, também pode haver opção de parcelamento.",
    compra: "Para comprar, escolha o produto, selecione cor e tamanho, clique no botão de compra ou carrinho e finalize informando seus dados de entrega e pagamento.",

    entrega: "A entrega depende da sua região. Na finalização da compra, o cliente informa o endereço e o sistema calcula o frete.",
    prazo: "O prazo de entrega depende da sua cidade e da forma de envio escolhida. Normalmente o prazo aparece na finalização da compra.",
    rastreio: "Depois que o pedido for enviado, o cliente poderá receber um código de rastreio para acompanhar a entrega. Caso não receba, é bom falar com o atendimento da loja.",
    troca: "A troca pode ser feita caso o tamanho não sirva ou o produto tenha algum problema. O ideal é manter a camisa sem uso, limpa e com etiqueta.",

    estoque: "A disponibilidade depende do modelo, cor e tamanho escolhido. Se o produto aparecer disponível no site, significa que ainda temos em estoque.",
    tecido: "O tecido pode variar conforme o modelo da peça. Em geral, camisetas de algodão são confortáveis, respiráveis e boas para o dia a dia.",
    lavagem: "Para conservar melhor a camisa, lave do avesso, evite água muito quente, não use alvejante e deixe secar na sombra quando possível.",

    masculino: "Temos opções para moda masculina, como camisetas básicas, oversized, polos, camisas sociais e looks casuais para o dia a dia.",
    feminino: "Temos opções que também podem servir para moda feminina, principalmente camisetas oversized, básicas, estampadas e peças casuais.",
    infantil: "A disponibilidade de roupas infantis depende do estoque da loja. O ideal é verificar os tamanhos disponíveis no produto escolhido.",

    atendente: "Você pode falar com um atendente pelo canal de contato da loja. Se tiver WhatsApp disponível, ele normalmente aparece no site ou na área de atendimento.",
    loja_fisica: "A disponibilidade de loja física ou retirada depende da loja. Se houver essa opção, ela deve aparecer na página de contato ou na finalização da compra.",
    recomendacao: "Claro! Para eu recomendar melhor, me diga se você quer uma camisa para sair, trabalhar, usar no dia a dia ou montar um estilo streetwear.",
    presente: "Para presente, recomendo peças mais versáteis, como camiseta preta, branca, oversized ou polo. Se não souber o tamanho, escolha um modelo com caimento mais solto.",
  

    desconhecido: "Ainda não entendi muito bem. Você pode perguntar sobre camisa, tamanho, preço, entrega, troca, pagamento, cupom, estoque, look ou falar com atendente.",
    // ================= RESPOSTAS NOVAS =================

los_angeles: "A camisa Los Angeles representa o estilo urbano da Califórnia, trazendo um visual moderno e street inspirado na cidade dos sonhos.",

dragon: "A camisa Dragon traz força e atitude, inspirada na cultura oriental e no poder do dragão.",

hermes: "A camisa Hermes Grego é inspirada na mitologia grega, com estilo clássico e moderno ao mesmo tempo.",

era_dourada: "A camisa Era Dourada é inspirada na arte e no renascimento, com visual sofisticado e artístico.",

neymar: "A camisa The Prince Neymar representa o futebol arte, estilo e ousadia.",

corinthians: "A camisa Corinthians representa a força da Fiel, com estilo alvinegro e urbano.",

west_coast: "A camisa West Coast é inspirada no estilo de vida da Califórnia e no universo de velocidade de Brian O’Conner."
};

// ===============================
// MODELO DA IA
// ===============================
let modeloIA = {
    vocabulario: {},
    intencoes: {},
    totalFrases: 0
};

// ===============================
// PREPARA O TEXTO
// ===============================
function prepararTextoIA(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(palavra => palavra.length > 1);
}

// ===============================
// TREINA A IA
// ===============================
function treinarIA() {
    dadosTreino.forEach(item => {
        const palavras = prepararTextoIA(item.frase);
        const intencao = item.intencao;

        if (!modeloIA.intencoes[intencao]) {
            modeloIA.intencoes[intencao] = {
                quantidadeFrases: 0,
                palavras: {},
                totalPalavras: 0
            };
        }

        modeloIA.intencoes[intencao].quantidadeFrases++;
        modeloIA.totalFrases++;

        palavras.forEach(palavra => {
            modeloIA.vocabulario[palavra] = true;

            if (!modeloIA.intencoes[intencao].palavras[palavra]) {
                modeloIA.intencoes[intencao].palavras[palavra] = 0;
            }

            modeloIA.intencoes[intencao].palavras[palavra]++;
            modeloIA.intencoes[intencao].totalPalavras++;
        });
    });
}

// ===============================
// PREVÊ A INTENÇÃO DO CLIENTE
// ===============================
function preverIntencaoIA(fraseCliente) {
    const palavras = prepararTextoIA(fraseCliente);
    const tamanhoVocabulario = Object.keys(modeloIA.vocabulario).length;

    const palavrasConhecidas = palavras.filter(palavra => modeloIA.vocabulario[palavra]);

    if (palavrasConhecidas.length === 0) {
        return "desconhecido";
    }

    let melhorIntencao = "desconhecido";
    let melhorPontuacao = -Infinity;

    for (let intencao in modeloIA.intencoes) {
        const dadosIntencao = modeloIA.intencoes[intencao];

        let pontuacao = Math.log(dadosIntencao.quantidadeFrases / modeloIA.totalFrases);

        palavras.forEach(palavra => {
            const quantidadePalavra = dadosIntencao.palavras[palavra] || 0;

            const probabilidade =
                (quantidadePalavra + 1) /
                (dadosIntencao.totalPalavras + tamanhoVocabulario);

            pontuacao += Math.log(probabilidade);
        });

        if (pontuacao > melhorPontuacao) {
            melhorPontuacao = pontuacao;
            melhorIntencao = intencao;
        }
    }

    return melhorIntencao;
}

// ===============================
// GERA A RESPOSTA DA IA
// ===============================
function gerarRespostaIA(mensagem) {
    const intencao = preverIntencaoIA(mensagem);
    return respostasIA[intencao] || respostasIA.desconhecido;
}

// ===============================
// ABRIR E FECHAR CHAT
// ===============================
function abrirChatIA() {
    const chat = document.getElementById("arAiBox");
    const input = document.getElementById("arUserInput");

    chat.style.display = "block";

    setTimeout(() => {
        input.focus();
    }, 100);
}

function fecharChatIA() {
    const chat = document.getElementById("arAiBox");
    chat.style.display = "none";
}

// ===============================
// ENVIAR MENSAGEM
// ===============================
function enviarMensagemIA() {
    const input = document.getElementById("arUserInput");
    const mensagem = input.value.trim();

    if (mensagem === "") {
        return;
    }

    adicionarMensagemIA(mensagem, "ar-user");
    input.value = "";

    const digitando = document.getElementById("arAiDigitando");
    digitando.style.display = "block";

    setTimeout(() => {
        digitando.style.display = "none";

        const resposta = gerarRespostaIA(mensagem);
        adicionarMensagemIA(resposta, "ar-bot");
    }, 700);
}

// ===============================
// ENVIAR SUGESTÃO
// ===============================
function enviarSugestaoIA(texto) {
    const input = document.getElementById("arUserInput");

    input.value = texto;
    enviarMensagemIA();
}

// ===============================
// ADICIONAR MENSAGEM NA TELA
// ===============================
function adicionarMensagemIA(texto, tipo) {
    const area = document.getElementById("arAiMessages");

    const div = document.createElement("div");
    div.classList.add("ar-msg", tipo);
    div.innerText = texto;

    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
}

// ===============================
// CRIAR BOTÕES DE SUGESTÃO
// ===============================
function criarBotoesSugestaoIA() {
    const areaSugestoes = document.getElementById("arAiSugestoes");

    sugestoesIA.forEach(sugestao => {
        const botao = document.createElement("button");
        botao.innerText = sugestao;
        botao.addEventListener("click", () => enviarSugestaoIA(sugestao));

        areaSugestoes.appendChild(botao);
    });
}

// ===============================
// INICIAR IA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    treinarIA();
    criarBotoesSugestaoIA();

    const abrirBtn = document.getElementById("abrirIaBtn");
    const fecharBtn = document.getElementById("fecharIaBtn");
    const enviarBtn = document.getElementById("enviarIaBtn");
    const input = document.getElementById("arUserInput");

    abrirBtn.addEventListener("click", abrirChatIA);
    fecharBtn.addEventListener("click", fecharChatIA);
    enviarBtn.addEventListener("click", enviarMensagemIA);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            enviarMensagemIA();
        }
    });
});
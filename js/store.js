/* =========================================================
   STORE.JS
   ---------------------------------------------------------
   Fonte única de dados das demandas, usada por:
   index.html, demandas.html, mapa.html e nova-demanda.html.

   Hoje os dados ficam salvos no localStorage do navegador.

   FUTURO (quando o back-end em Java/Spring existir):
   basta trocar as funções abaixo por chamadas fetch()
   para a API REST, sem mudar o resto do front-end.
========================================================= */

const STORAGE_KEY = "bp_demandas";

/* Sempre que os dados de exemplo (DEMANDAS_SEED) mudarem,
   aumente este número. Isso garante que quem já tinha
   testado o site antes (e já tem dados salvos no navegador)
   também recebe as demandas novas, em vez de ficar preso
   na versão antiga que já estava no localStorage. */
const SEED_VERSION = "6";

/* Ícone exibido no mapa e nos cards, de acordo com a
   categoria escolhida no formulário. */
const ICONE_POR_CATEGORIA = {
    "Infraestrutura": "fa-road",
    "Iluminação": "fa-lightbulb",
    "Limpeza": "fa-trash",
    "Segurança": "fa-shield",
    "Transporte": "fa-bus",
    "Meio ambiente": "fa-tree",
    "Educação": "fa-school",
    "Saúde": "fa-briefcase-medical",
    "Acessibilidade": "fa-wheelchair"
};

/* Coordenadas (latitude/longitude) aproximadas do centro de
   cada Região Administrativa do DF — usadas como localização
   padrão quando o cidadão não marca um ponto exato no mapa.
   São aproximações (fictícias o suficiente para um projeto
   acadêmico), mas mantêm a distribuição real pelo território. */
const COORDENADAS_POR_REGIAO = {
    "Plano Piloto": { lat: -15.7942, lng: -47.8822 },
    "Gama": { lat: -16.0189, lng: -48.0642 },
    "Taguatinga": { lat: -15.8330, lng: -48.0559 },
    "Brazlândia": { lat: -15.6699, lng: -48.2032 },
    "Sobradinho": { lat: -15.6519, lng: -47.7869 },
    "Sobradinho II": { lat: -15.6425, lng: -47.7622 },
    "Planaltina": { lat: -15.6206, lng: -47.6547 },
    "Paranoá": { lat: -15.7742, lng: -47.7658 },
    "Núcleo Bandeirante": { lat: -15.8686, lng: -47.9679 },
    "Ceilândia": { lat: -15.8151, lng: -48.1099 },
    "Guará": { lat: -15.8258, lng: -47.9776 },
    "Cruzeiro": { lat: -15.7891, lng: -47.9436 },
    "Samambaia": { lat: -15.8752, lng: -48.0904 },
    "Santa Maria": { lat: -16.0128, lng: -48.0064 },
    "São Sebastião": { lat: -15.9046, lng: -47.7758 },
    "Recanto das Emas": { lat: -15.9060, lng: -48.0644 },
    "Lago Sul": { lat: -15.8283, lng: -47.8483 },
    "Lago Norte": { lat: -15.7391, lng: -47.8531 },
    "Riacho Fundo": { lat: -15.8825, lng: -48.0169 },
    "Riacho Fundo II": { lat: -15.9083, lng: -48.0333 },
    "Candangolândia": { lat: -15.8258, lng: -47.9308 },
    "Águas Claras": { lat: -15.8375, lng: -48.0281 },
    "Sudoeste/Octogonal": { lat: -15.8034, lng: -47.9268 },
    "Varjão": { lat: -15.7113, lng: -47.8394 },
    "Park Way": { lat: -15.8781, lng: -47.9614 },
    "SCIA/Estrutural": { lat: -15.7803, lng: -48.0089 },
    "Jardim Botânico": { lat: -15.8672, lng: -47.7783 },
    "Itapoã": { lat: -15.7364, lng: -47.7508 },
    "SIA": { lat: -15.7967, lng: -47.9564 },
    "Vicente Pires": { lat: -15.8214, lng: -48.0011 },
    "Fercal": { lat: -15.5822, lng: -47.7908 },
    "Sol Nascente/Pôr do Sol": { lat: -15.8130, lng: -48.1381 },
    "Arniqueira": { lat: -15.8481, lng: -48.0244 }
};

/* Demandas de exemplo (usadas apenas na primeira visita, ou
   quando o SEED_VERSION muda). Cada uma aponta para uma foto real
   local em imagens/<id>.jpg (fotos reais de problemas urbanos,
   escolhidas pra bater com a descrição de cada demanda). Quem não
   tem foto correspondente ainda fica com foto: null — o <img> tem
   onerror tratado no HTML, então o site funciona normalmente mesmo
   sem todas as imagens presentes. */
const DEMANDAS_SEED = [
    {
        id: "buraco-gama",
        titulo: "Buraco na Avenida Principal do Gama",
        descricao: "O asfalto está danificado próximo ao ponto de ônibus e dificulta a passagem dos veículos.",
        categoria: "Infraestrutura",
        regiao: "Gama",
        localizacao: "Avenida Principal, próximo ao ponto de ônibus",
        status: "Em análise",
        apoios: 24,
        data: "2026-09-08",
        foto: "imagens/BuracoGama.jpg",
        lat: -16.0206, lng: -48.0611
    },
    {
        id: "iluminacao-taguatinga",
        titulo: "Poste apagado na quadra 12",
        descricao: "Moradores relatam que o poste está apagado na quadra 12 e dificulta a passagem durante a noite.",
        categoria: "Iluminação",
        regiao: "Taguatinga",
        localizacao: "Quadra 12",
        status: "Resolvida",
        apoios: 38,
        data: "2026-08-30",
        foto: "imagens/iluminacao-taguatinga.png",
        lat: -15.8309, lng: -48.0512
    },
    {
        id: "coleta-ceilandia",
        titulo: "Acúmulo de lixo próximo à praça",
        descricao: "Há alguns dias o local não recebe coleta e o lixo está ocupando parte da calçada.",
        categoria: "Limpeza",
        regiao: "Ceilândia",
        localizacao: "Praça central",
        status: "Recebida",
        apoios: 17,
        data: "2026-09-11",
        foto: "imagens/coleta-ceilandia.png",
        lat: -15.8173, lng: -48.1064
    },
    {
        id: "area-verde-samambaia",
        titulo: "Árvores caídas após temporal",
        descricao: "Uma árvore caiu após as últimas fortes tempestades e está bloqueando parte da via.",
        categoria: "Meio ambiente",
        regiao: "Samambaia",
        localizacao: "Via de acesso à quadra",
        status: "Pendente",
        apoios: 31,
        data: "2026-09-05",
        foto: "imagens/area-verde-samambaia.jpg",
        lat: -15.8781, lng: -48.0862
    },
    {
        id: "policiamento-ceilandia",
        titulo: "Redução do policiamento durante a noite",
        descricao: "Falta de policiamento nas ruas da região durante o período noturno.",
        categoria: "Segurança",
        regiao: "Ceilândia",
        localizacao: "Setor central",
        status: "Em análise",
        apoios: 17,
        data: "2026-09-06",
        foto: "imagens/policiamento-ceilandia.png",
        lat: -15.8110, lng: -48.1132
    },
    {
        id: "professores-planaltina",
        titulo: "Falta de professores na escola",
        descricao: "A escola está enfrentando falta de professores em algumas disciplinas, prejudicando o aprendizado dos alunos.",
        categoria: "Educação",
        regiao: "Planaltina",
        localizacao: "Escola da região",
        status: "Pendente",
        apoios: 9,
        data: "2026-08-24",
        foto: null,
        lat: -15.6241, lng: -47.6498
    },
    {
        id: "semaforo-aguas-claras",
        titulo: "Semáforo quebrado na Avenida das Araucárias",
        descricao: "O semáforo está apagado há uma semana e o cruzamento ficou perigoso no horário de pico.",
        categoria: "Transporte",
        regiao: "Águas Claras",
        localizacao: "Avenida das Araucárias, próximo ao metrô",
        status: "Resolvida",
        apoios: 52,
        data: "2026-08-20",
        foto: "imagens/semaforo-aguas-claras.png",
        lat: -15.8355, lng: -48.0257
    },
    {
        id: "esgoto-guara",
        titulo: "Vazamento de esgoto a céu aberto",
        descricao: "Vazamento próximo à quadra comercial causando mau cheiro e risco à saúde dos moradores.",
        categoria: "Saúde",
        regiao: "Guará",
        localizacao: "QE 24, área comercial",
        status: "Resolvida",
        apoios: 67,
        data: "2026-08-15",
        foto: "imagens/esgoto-guara.png",
        lat: -15.8231, lng: -47.9739
    },
    {
        id: "calcada-santa-maria",
        titulo: "Calçada sem acessibilidade para cadeirantes",
        descricao: "Falta rampa de acesso na esquina principal, dificultando a locomoção de cadeirantes e idosos.",
        categoria: "Acessibilidade",
        regiao: "Santa Maria",
        localizacao: "Quadra 116, esquina com a via principal",
        status: "Em análise",
        apoios: 29,
        data: "2026-09-02",
        foto: "imagens/calcada-santa-maria.png",
        lat: -16.0159, lng: -48.0033
    },
    {
        id: "lixo-recanto-emas",
        titulo: "Terreno baldio usado como depósito de entulho",
        descricao: "Moradores denunciam descarte irregular de entulho e lixo em terreno baldio há meses.",
        categoria: "Limpeza",
        regiao: "Recanto das Emas",
        localizacao: "Quadra 400, próximo à quadra de esportes",
        status: "Pendente",
        apoios: 21,
        data: "2026-09-10",
        foto: "imagens/lixo-recanto-emas.png",
        lat: -15.9088, lng: -48.0610
    },
    {
        id: "buraco-sobradinho",
        titulo: "Cratera na via após obra da concessionária",
        descricao: "Após reparo no encanamento, a rua ficou com uma cratera que não foi recoberta corretamente.",
        categoria: "Infraestrutura",
        regiao: "Sobradinho",
        localizacao: "Quadra 6, via principal",
        status: "Resolvida",
        apoios: 44,
        data: "2026-08-11",
        foto: "imagens/buraco-sobradinho.png",
        lat: -15.6534, lng: -47.7825
    },
    {
        id: "onibus-sao-sebastiao",
        titulo: "Ponto de ônibus sem cobertura",
        descricao: "O ponto de ônibus principal não tem cobertura, deixando os passageiros expostos ao sol e à chuva.",
        categoria: "Transporte",
        regiao: "São Sebastião",
        localizacao: "Entrada principal, próximo ao comércio local",
        status: "Recebida",
        apoios: 13,
        data: "2026-09-12",
        foto: "imagens/onibus-sao-sebastiao.png",
        lat: -15.9011, lng: -47.7716
    },
    {
        id: "iluminacao-plano-piloto",
        titulo: "Trecho da ciclovia sem iluminação",
        descricao: "Trecho da ciclovia próximo ao lago fica completamente escuro à noite, gerando insegurança.",
        categoria: "Iluminação",
        regiao: "Plano Piloto",
        localizacao: "Ciclovia próxima à orla do lago",
        status: "Resolvida",
        apoios: 58,
        data: "2026-08-05",
        foto: "imagens/iluminacao-plano-piloto.png",
        lat: -15.7889, lng: -47.8631
    },
    {
        id: "seguranca-taguatinga",
        titulo: "Câmeras de segurança fora de funcionamento",
        descricao: "As câmeras da praça central estão desligadas há mais de um mês, segundo relatos de comerciantes.",
        categoria: "Segurança",
        regiao: "Taguatinga",
        localizacao: "Praça do Rotary",
        status: "Em análise",
        apoios: 19,
        data: "2026-09-13",
        foto: null,
        lat: -15.8365, lng: -48.0602
    },

    /* -------- 8 demandas novas -------- */

    {
        id: "estrada-brazlandia",
        titulo: "Estrada de terra esburacada dificulta escoamento rural",
        descricao: "Produtores rurais relatam dificuldade para escoar a produção devido às condições da estrada após as chuvas.",
        categoria: "Infraestrutura",
        regiao: "Brazlândia",
        localizacao: "Núcleo Rural, estrada de acesso às chácaras",
        status: "Pendente",
        apoios: 15,
        data: "2026-08-28",
        foto: "imagens/estrada-brazlandia.png",
        lat: -15.6672, lng: -48.1998
    },
    {
        id: "coleta-seletiva-paranoa",
        titulo: "Falta de coleta seletiva de recicláveis",
        descricao: "O bairro não conta com coleta seletiva regular, e os moradores precisam levar o material reciclável para outras regiões.",
        categoria: "Limpeza",
        regiao: "Paranoá",
        localizacao: "Setor de habitações coletivas",
        status: "Recebida",
        apoios: 11,
        data: "2026-09-13",
        foto: null,
        lat: -15.7768, lng: -47.7622
    },
    {
        id: "sinalizacao-nucleo-bandeirante",
        titulo: "Sinalização de trânsito apagada na via principal",
        descricao: "As faixas de pedestre e a sinalização horizontal estão praticamente apagadas, aumentando o risco de acidentes.",
        categoria: "Transporte",
        regiao: "Núcleo Bandeirante",
        localizacao: "Via principal, próximo ao comércio",
        status: "Em análise",
        apoios: 22,
        data: "2026-09-04",
        foto: "imagens/sinalizacao-nucleo-bandeirante.png",
        lat: -15.8703, lng: -47.9652
    },
    {
        id: "vazamento-lago-sul",
        titulo: "Vazamento de água na rede pública há dias",
        descricao: "Um vazamento na tubulação está desperdiçando água potável e formando um alagamento na via há mais de uma semana.",
        categoria: "Infraestrutura",
        regiao: "Lago Sul",
        localizacao: "Quadra residencial próxima à orla",
        status: "Resolvida",
        apoios: 34,
        data: "2026-08-18",
        foto: null,
        lat: -15.8309, lng: -47.8452
    },
    {
        id: "saude-riacho-fundo",
        titulo: "Unidade de saúde sem médico plantonista à noite",
        descricao: "A UBS da região não conta com plantão noturno, obrigando moradores a se deslocarem para outras cidades em emergências.",
        categoria: "Saúde",
        regiao: "Riacho Fundo",
        localizacao: "UBS local",
        status: "Pendente",
        apoios: 41,
        data: "2026-09-09",
        foto: "imagens/saude-riacho-fundo.png",
        lat: -15.8852, lng: -48.0141
    },
    {
        id: "ciclovia-vicente-pires",
        titulo: "Ciclovia interrompida por obra parada",
        descricao: "A obra de ampliação da ciclovia está parada há meses, forçando ciclistas a dividir a pista com carros.",
        categoria: "Transporte",
        regiao: "Vicente Pires",
        localizacao: "Trecho 3, próximo à via estrutural",
        status: "Em análise",
        apoios: 27,
        data: "2026-09-01",
        foto: "imagens/ciclovia-vicente-pires.png",
        lat: -15.8241, lng: -47.9986
    },
    {
        id: "esgoto-sol-nascente",
        titulo: "Falta de rede de esgoto em parte do bairro",
        descricao: "Diversas quadras ainda não têm rede de esgoto, e o descarte irregular está contaminando um córrego próximo.",
        categoria: "Saúde",
        regiao: "Sol Nascente/Pôr do Sol",
        localizacao: "Setor Sol Nascente, quadras finais",
        status: "Recebida",
        apoios: 36,
        data: "2026-09-14",
        foto: "imagens/esgoto-sol-nascente.png",
        lat: -15.8102, lng: -48.1412
    },
    {
        id: "praca-itapoa",
        titulo: "Praça pública sem manutenção e brinquedos quebrados",
        descricao: "Os brinquedos do parquinho estão quebrados há meses e o mato alto tomou conta da praça, que ficou sem uso.",
        categoria: "Meio ambiente",
        regiao: "Itapoã",
        localizacao: "Praça central do setor habitacional",
        status: "Resolvida",
        apoios: 25,
        data: "2026-08-22",
        foto: "imagens/praca-itapoa.png",
        lat: -15.7341, lng: -47.7481
    }
];

/* =========================================================
   LEITURA / ESCRITA
========================================================= */

function obterDemandas() {

    const dados = localStorage.getItem(STORAGE_KEY);
    const versaoSalva = localStorage.getItem(STORAGE_KEY + "_versao");

    /* Sem dados ainda, OU dados de uma versão de seed antiga:
       recarrega a lista de exemplo mais recente. */
    if (!dados || versaoSalva !== SEED_VERSION) {

        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMANDAS_SEED));
        localStorage.setItem(STORAGE_KEY + "_versao", SEED_VERSION);

        return [...DEMANDAS_SEED];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Não foi possível ler as demandas salvas:", erro);
        return [];
    }
}

function salvarDemandas(demandas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demandas));
}

/* Adiciona uma nova demanda no início da lista e retorna o objeto salvo.
   Se a demanda não trouxer lat/lng (o cidadão não clicou no mapa),
   caímos no centro aproximado da região administrativa escolhida. */
function adicionarDemanda(demanda) {

    const demandas = obterDemandas();

    const coordenadaPadrao =
        COORDENADAS_POR_REGIAO[demanda.regiao] || { lat: -15.7942, lng: -47.8822 };

    const nova = {
        id: `demanda-${Date.now()}`,
        status: "Recebida",
        apoios: 0,
        data: new Date().toISOString().slice(0, 10),
        foto: null,
        lat: coordenadaPadrao.lat,
        lng: coordenadaPadrao.lng,
        ...demanda
    };

    demandas.unshift(nova);

    salvarDemandas(demandas);

    return nova;
}

function obterDemandaPorId(id) {
    return obterDemandas().find(demanda => demanda.id === id);
}

function atualizarApoios(id, delta) {

    const demandas = obterDemandas();

    const demanda = demandas.find(item => item.id === id);

    if (!demanda) return null;

    demanda.apoios = Math.max(0, (demanda.apoios || 0) + delta);

    salvarDemandas(demandas);

    return demanda.apoios;
}

function iconeDaCategoria(categoria) {
    return ICONE_POR_CATEGORIA[categoria] || "fa-circle-exclamation";
}

/* Classe visual (badge) de acordo com o status. */
function classeDoStatus(status) {

    const mapa = {
        "Recebida": "badge-info",
        "Em análise": "badge-warning",
        "Pendente": "badge-danger",
        "Resolvida": "badge-success"
    };

    return mapa[status] || "badge-info";
}

/* Cor sólida equivalente a cada status — usada nos pinos do mapa,
   onde não dá pra usar a classe de badge (fundo claro/texto escuro). */
function corDoStatus(status) {

    const mapa = {
        "Recebida": "#1351b4",
        "Em análise": "#ad7000",
        "Pendente": "#e52207",
        "Resolvida": "#168821"
    };

    return mapa[status] || "#1351b4";
}

/* Texto relativo simples ("Há 2 dias") a partir da data salva (AAAA-MM-DD). */
function tempoRelativo(dataISO) {

    if (!dataISO) return "";

    const dataDemanda = new Date(dataISO + "T00:00:00");

    const diffDias = Math.floor(
        (new Date().setHours(0, 0, 0, 0) - dataDemanda.getTime()) / 86400000
    );

    if (diffDias <= 0) return "Hoje";
    if (diffDias === 1) return "Há 1 dia";

    return `Há ${diffDias} dias`;
}

/* =========================================================
   ESTATÍSTICAS (usadas na home e no dashboard)
   Calculadas em cima dos dados reais salvos, para que os
   números batam com o que está realmente cadastrado —
   qualquer demanda nova adicionada já entra na conta na
   próxima vez que a página for carregada.
========================================================= */

function calcularEstatisticas() {

    const demandas = obterDemandas();

    const total = demandas.length;

    const resolvidas = demandas.filter(d => d.status === "Resolvida").length;

    const emAndamento = demandas.filter(
        d => d.status === "Em análise" || d.status === "Pendente"
    ).length;

    const recebidas = demandas.filter(d => d.status === "Recebida").length;

    const apoiosTotais = demandas.reduce((acc, d) => acc + (d.apoios || 0), 0);

    const regioes = new Set(demandas.map(d => d.regiao)).size;

    return {
        total,
        resolvidas,
        emAndamento,
        recebidas,
        apoiosTotais,
        regioes
    };
}
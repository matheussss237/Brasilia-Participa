/* =========================================================
   Demandas de exemplo (mock — equivalente a demands.json)
   Carregadas no navegador na primeira visita (ou quando a
   versão do seed muda — ver BP.api).
   Campos: id, titulo, descricao, categoria (id), regiao (id),
   localizacao, status (id), apoios, data (AAAA-MM-DD), foto, lat, lng.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    BP.dados = BP.dados || {};

    BP.dados.versaoSeed = "3";

    BP.dados.demandas = [
        {
            id: "buraco-gama",
            titulo: "Buraco na Avenida Principal do Gama",
            descricao: "O asfalto está danificado próximo ao ponto de ônibus e dificulta a passagem dos veículos.",
            categoria: "infraestrutura", regiao: "gama",
            localizacao: "Avenida Principal, próximo ao ponto de ônibus",
            status: "em-analise", apoios: 24, data: "2026-11-05",
            foto: "imagens/BuracoGama.jpg", lat: -16.0206, lng: -48.0611
        },
        {
            id: "iluminacao-taguatinga",
            titulo: "Poste apagado na quadra 12",
            descricao: "Moradores relatam que o poste está apagado na quadra 12 e dificulta a passagem durante a noite.",
            categoria: "iluminacao", regiao: "taguatinga",
            localizacao: "Quadra 12",
            status: "resolvida", apoios: 38, data: "2026-10-27",
            foto: "imagens/iluminacao-taguatinga.png", lat: -15.8309, lng: -48.0512
        },
        {
            id: "coleta-ceilandia",
            titulo: "Acúmulo de lixo próximo à praça",
            descricao: "Há alguns dias o local não recebe coleta e o lixo está ocupando parte da calçada.",
            categoria: "limpeza", regiao: "ceilandia",
            localizacao: "Praça central",
            status: "recebida", apoios: 17, data: "2026-11-08",
            foto: "imagens/coleta-ceilandia.png", lat: -15.8173, lng: -48.1064
        },
        {
            id: "area-verde-samambaia",
            titulo: "Árvore caída após temporal",
            descricao: "Uma árvore caiu após as últimas fortes tempestades e está bloqueando parte da via.",
            categoria: "meio-ambiente", regiao: "samambaia",
            localizacao: "Via de acesso à quadra",
            status: "pendente", apoios: 31, data: "2026-11-02",
            foto: "imagens/area-verde-samambaia.jpg", lat: -15.8781, lng: -48.0862
        },
        {
            id: "policiamento-ceilandia",
            titulo: "Redução do policiamento durante a noite",
            descricao: "Falta de policiamento nas ruas da região durante o período noturno.",
            categoria: "seguranca", regiao: "ceilandia",
            localizacao: "Setor central",
            status: "em-analise", apoios: 17, data: "2026-11-03",
            foto: "imagens/policiamento-ceilandia.png", lat: -15.811, lng: -48.1132
        },
        {
            id: "professores-planaltina",
            titulo: "Falta de professores na escola",
            descricao: "A escola está enfrentando falta de professores em algumas disciplinas, prejudicando o aprendizado dos alunos.",
            categoria: "educacao", regiao: "planaltina",
            localizacao: "Escola da região",
            status: "pendente", apoios: 9, data: "2026-10-21",
            foto: "imagens/professores-planaltina.png", lat: -15.6241, lng: -47.6498
        },
        {
            id: "semaforo-aguas-claras",
            titulo: "Semáforo quebrado na Avenida das Araucárias",
            descricao: "O semáforo está apagado há uma semana e o cruzamento ficou perigoso no horário de pico.",
            categoria: "transporte", regiao: "aguas-claras",
            localizacao: "Avenida das Araucárias, próximo ao metrô",
            status: "resolvida", apoios: 52, data: "2026-10-17",
            foto: "imagens/semaforo-aguas-claras.png", lat: -15.8355, lng: -48.0257
        },
        {
            id: "esgoto-guara",
            titulo: "Vazamento de esgoto a céu aberto",
            descricao: "Vazamento próximo à quadra comercial causando mau cheiro e risco à saúde dos moradores.",
            categoria: "saude", regiao: "guara",
            localizacao: "QE 24, área comercial",
            status: "resolvida", apoios: 67, data: "2026-10-12",
            foto: "imagens/esgoto-guara.png", lat: -15.8231, lng: -47.9739
        },
        {
            id: "calcada-santa-maria",
            titulo: "Calçada sem acessibilidade para cadeirantes",
            descricao: "Falta rampa de acesso na esquina principal, dificultando a locomoção de cadeirantes e idosos.",
            categoria: "acessibilidade", regiao: "santa-maria",
            localizacao: "Quadra 116, esquina com a via principal",
            status: "em-analise", apoios: 29, data: "2026-10-30",
            foto: "imagens/calcada-santa-maria.png", lat: -16.0159, lng: -48.0033
        },
        {
            id: "lixo-recanto-emas",
            titulo: "Terreno baldio usado como depósito de entulho",
            descricao: "Moradores denunciam descarte irregular de entulho e lixo em terreno baldio há meses.",
            categoria: "limpeza", regiao: "recanto-das-emas",
            localizacao: "Quadra 400, próximo à quadra de esportes",
            status: "pendente", apoios: 21, data: "2026-11-07",
            foto: "imagens/lixo-recanto-emas.png", lat: -15.9088, lng: -48.061
        },
        {
            id: "buraco-sobradinho",
            titulo: "Cratera na via após obra da concessionária",
            descricao: "Após reparo no encanamento, a rua ficou com uma cratera que não foi recoberta corretamente.",
            categoria: "infraestrutura", regiao: "sobradinho",
            localizacao: "Quadra 6, via principal",
            status: "resolvida", apoios: 44, data: "2026-10-08",
            foto: "imagens/buraco-sobradinho.png", lat: -15.6534, lng: -47.7825
        },
        {
            id: "onibus-sao-sebastiao",
            titulo: "Ponto de ônibus sem cobertura",
            descricao: "O ponto de ônibus principal não tem cobertura, deixando os passageiros expostos ao sol e à chuva.",
            categoria: "transporte", regiao: "sao-sebastiao",
            localizacao: "Entrada principal, próximo ao comércio local",
            status: "recebida", apoios: 13, data: "2026-11-09",
            foto: "imagens/onibus-sao-sebastiao.png", lat: -15.9011, lng: -47.7716
        },
        {
            id: "iluminacao-plano-piloto",
            titulo: "Trecho da ciclovia sem iluminação",
            descricao: "Trecho da ciclovia próximo ao lago fica completamente escuro à noite, gerando insegurança.",
            categoria: "iluminacao", regiao: "plano-piloto",
            localizacao: "Ciclovia próxima à orla do lago",
            status: "resolvida", apoios: 58, data: "2026-10-02",
            foto: "imagens/iluminacao-plano-piloto.png", lat: -15.7889, lng: -47.8631
        },
        {
            id: "seguranca-taguatinga",
            titulo: "Câmeras de segurança fora de funcionamento",
            descricao: "As câmeras da praça central estão desligadas há mais de um mês, segundo relatos de comerciantes.",
            categoria: "seguranca", regiao: "taguatinga",
            localizacao: "Praça do Rotary",
            status: "em-analise", apoios: 19, data: "2026-11-10",
            foto: "imagens/seguranca-taguatinga.png", lat: -15.8365, lng: -48.0602
        },
        {
            id: "estrada-brazlandia",
            titulo: "Estrada de terra esburacada dificulta escoamento rural",
            descricao: "Produtores rurais relatam dificuldade para escoar a produção devido às condições da estrada após as chuvas.",
            categoria: "infraestrutura", regiao: "brazlandia",
            localizacao: "Núcleo Rural, estrada de acesso às chácaras",
            status: "pendente", apoios: 15, data: "2026-10-25",
            foto: "imagens/estrada-brazlandia.png", lat: -15.6672, lng: -48.1998
        },
        {
            id: "coleta-seletiva-paranoa",
            titulo: "Falta de coleta seletiva de recicláveis",
            descricao: "O bairro não conta com coleta seletiva regular, e os moradores precisam levar o material reciclável para outras regiões.",
            categoria: "limpeza", regiao: "paranoa",
            localizacao: "Setor de habitações coletivas",
            status: "recebida", apoios: 11, data: "2026-11-10",
            foto: "imagens/coleta-seletiva-paranoa.png", lat: -15.7768, lng: -47.7622
        },
        {
            id: "sinalizacao-nucleo-bandeirante",
            titulo: "Sinalização de trânsito apagada na via principal",
            descricao: "As faixas de pedestre e a sinalização horizontal estão praticamente apagadas, aumentando o risco de acidentes.",
            categoria: "transporte", regiao: "nucleo-bandeirante",
            localizacao: "Via principal, próximo ao comércio",
            status: "em-analise", apoios: 22, data: "2026-11-01",
            foto: "imagens/sinalizacao-nucleo-bandeirante.png", lat: -15.8703, lng: -47.9652
        },
        {
            id: "vazamento-lago-sul",
            titulo: "Vazamento de água na rede pública há dias",
            descricao: "Um vazamento na tubulação está desperdiçando água potável e formando um alagamento na via há mais de uma semana.",
            categoria: "infraestrutura", regiao: "lago-sul",
            localizacao: "Quadra residencial próxima à orla",
            status: "resolvida", apoios: 34, data: "2026-10-15",
            foto: "imagens/vazamento-lago-sul.png", lat: -15.8309, lng: -47.8452
        },
        {
            id: "saude-riacho-fundo",
            titulo: "Unidade de saúde sem médico plantonista à noite",
            descricao: "A UBS da região não conta com plantão noturno, obrigando moradores a se deslocarem para outras cidades em emergências.",
            categoria: "saude", regiao: "riacho-fundo",
            localizacao: "UBS local",
            status: "pendente", apoios: 41, data: "2026-11-06",
            foto: "imagens/saude-riacho-fundo.png", lat: -15.8852, lng: -48.0141
        },
        {
            id: "ciclovia-vicente-pires",
            titulo: "Ciclovia interrompida por obra parada",
            descricao: "A obra de ampliação da ciclovia está parada há meses, forçando ciclistas a dividir a pista com carros.",
            categoria: "transporte", regiao: "vicente-pires",
            localizacao: "Trecho 3, próximo à via Estrutural",
            status: "em-analise", apoios: 27, data: "2026-10-29",
            foto: "imagens/ciclovia-vicente-pires.png", lat: -15.8241, lng: -47.9986
        },
        {
            id: "esgoto-sol-nascente",
            titulo: "Falta de rede de esgoto em parte do bairro",
            descricao: "Diversas quadras ainda não têm rede de esgoto, e o descarte irregular está contaminando um córrego próximo.",
            categoria: "saude", regiao: "sol-nascente",
            localizacao: "Setor Sol Nascente, quadras finais",
            status: "recebida", apoios: 36, data: "2026-11-11",
            foto: "imagens/esgoto-sol-nascente.png", lat: -15.8102, lng: -48.1412
        },
        {
            id: "praca-itapoa",
            titulo: "Praça pública sem manutenção e brinquedos quebrados",
            descricao: "Os brinquedos do parquinho estão quebrados há meses e o mato alto tomou conta da praça, que ficou sem uso.",
            categoria: "meio-ambiente", regiao: "itapoa",
            localizacao: "Praça central do setor habitacional",
            status: "resolvida", apoios: 25, data: "2026-10-19",
            foto: "imagens/praca-itapoa.png", lat: -15.7341, lng: -47.7481
        }
    ];
})(typeof window !== "undefined" ? window : globalThis);

/* =========================================================
   DOMÍNIO — regras de negócio puras (sem DOM, sem storage).
   Tudo aqui é testável em Node (ver tests/).
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    const { normalizar } = BP.util;

    /* ---------------- Status ---------------- */

    const STATUS = [
        { id: "recebida", nome: "Recebida", icone: "fa-inbox", cor: "#1351b4", tom: "info" },
        { id: "em-analise", nome: "Em análise", icone: "fa-magnifying-glass", cor: "#ad7000", tom: "warning" },
        { id: "pendente", nome: "Pendente", icone: "fa-hourglass-half", cor: "#d83933", tom: "danger" },
        { id: "resolvida", nome: "Resolvida", icone: "fa-circle-check", cor: "#168821", tom: "success" }
    ];

    const STATUS_DESCONHECIDO = { id: "", nome: "Sem status", icone: "fa-circle-question", cor: "#636363", tom: "neutral" };
    const CATEGORIA_DESCONHECIDA = { id: "", nome: "Outros", icone: "fa-circle-exclamation", cor: "#636363" };

    function porId(lista, id, padrao) {
        return lista.find((item) => item.id === id) || { ...padrao, id: id || "", nome: padrao.nome };
    }

    const status = (id) => porId(STATUS, id, STATUS_DESCONHECIDO);
    const categoria = (id) => porId(BP.dados.categorias, id, CATEGORIA_DESCONHECIDA);
    const regiao = (id) => BP.dados.regioes.find((r) => r.id === id) || { id, nome: id || "—", lat: -15.7942, lng: -47.8822 };

    /* Ícone mais específico que o da categoria, a partir de palavras-chave
       do título/descrição (ex.: "câmera" ganha ícone de câmera). */
    const ICONES_POR_PALAVRA = [
        [/camera/, "fa-video"],
        [/policia/, "fa-shield-halved"],
        [/buraco|cratera|asfalto|estrada/, "fa-road-circle-exclamation"],
        [/poste|iluminac|lampada|escur/, "fa-lightbulb"],
        [/reciclave|reciclagem|seletiva/, "fa-recycle"],
        [/lixo|entulho|coleta/, "fa-trash"],
        [/esgoto|vazamento|tubulac|alagamento/, "fa-droplet"],
        [/arvore|praca|parquinho|brinquedo|mato alto/, "fa-tree"],
        [/escola|professor/, "fa-school"],
        [/saude|medico|plantao|ubs/, "fa-briefcase-medical"],
        [/semaforo|sinalizac|faixa de pedestre/, "fa-traffic-light"],
        [/onibus/, "fa-bus"],
        [/ciclovia|ciclista|bicicleta/, "fa-bicycle"],
        [/calcada|rampa|cadeirante/, "fa-wheelchair"]
    ];

    function iconeDaDemanda(demanda) {
        const texto = normalizar(`${demanda.titulo} ${demanda.descricao}`);
        const achado = ICONES_POR_PALAVRA.find(([regex]) => regex.test(texto));
        return achado ? achado[1] : categoria(demanda.categoria).icone;
    }

    /* ---------------- Filtros e ordenação ---------------- */

    const ORDENACOES = {
        recentes: (a, b) => b.data.localeCompare(a.data) || b.apoios - a.apoios,
        antigas: (a, b) => a.data.localeCompare(b.data),
        apoiadas: (a, b) => b.apoios - a.apoios || b.data.localeCompare(a.data)
    };

    /**
     * Filtra e ordena demandas.
     * @param {Array} demandas
     * @param {{q?:string,status?:string,categoria?:string,regiao?:string,ordem?:string}} filtros
     */
    function filtrarDemandas(demandas, filtros = {}) {
        const termo = normalizar(filtros.q);
        const resultado = demandas.filter((d) => {
            if (filtros.status && d.status !== filtros.status) return false;
            if (filtros.categoria && d.categoria !== filtros.categoria) return false;
            if (filtros.regiao && d.regiao !== filtros.regiao) return false;
            if (!termo) return true;
            const alvo = normalizar(
                [d.titulo, d.descricao, d.localizacao, regiao(d.regiao).nome, categoria(d.categoria).nome].join(" ")
            );
            return termo.split(/\s+/).every((palavra) => alvo.includes(palavra));
        });
        return resultado.sort(ORDENACOES[filtros.ordem] || ORDENACOES.recentes);
    }

    /* ---------------- Estatísticas ---------------- */

    function contarPor(demandas, campo) {
        return demandas.reduce((acc, d) => {
            acc[d[campo]] = (acc[d[campo]] || 0) + 1;
            return acc;
        }, {});
    }

    function estatisticas(demandas) {
        const porStatus = contarPor(demandas, "status");
        const total = demandas.length;
        const resolvidas = porStatus.resolvida || 0;
        return {
            total,
            resolvidas,
            recebidas: porStatus.recebida || 0,
            emAnalise: porStatus["em-analise"] || 0,
            pendentes: porStatus.pendente || 0,
            emAndamento: (porStatus["em-analise"] || 0) + (porStatus.pendente || 0),
            apoios: demandas.reduce((s, d) => s + (d.apoios || 0), 0),
            regioes: new Set(demandas.map((d) => d.regiao)).size,
            taxaResolucao: total ? resolvidas / total : 0
        };
    }

    /** [{status, quantidade, fracao}] na ordem fixa do fluxo de atendimento. */
    function distribuicaoPorStatus(demandas) {
        const contagem = contarPor(demandas, "status");
        const total = demandas.length || 1;
        return STATUS.map((s) => ({ status: s, quantidade: contagem[s.id] || 0, fracao: (contagem[s.id] || 0) / total }));
    }

    /** [{categoria, quantidade}] do maior para o menor. Categorias sem demandas ficam de fora. */
    function porCategoria(demandas) {
        const contagem = contarPor(demandas, "categoria");
        return Object.entries(contagem)
            .map(([id, quantidade]) => ({ categoria: categoria(id), quantidade }))
            .sort((a, b) => b.quantidade - a.quantidade || a.categoria.nome.localeCompare(b.categoria.nome));
    }

    /** Ranking de regiões mais ativas: relatos + apoios. */
    function rankingRegioes(demandas, limite = 8) {
        const mapa = new Map();
        demandas.forEach((d) => {
            const item = mapa.get(d.regiao) || { regiao: regiao(d.regiao), demandas: 0, apoios: 0, resolvidas: 0 };
            item.demandas += 1;
            item.apoios += d.apoios || 0;
            if (d.status === "resolvida") item.resolvidas += 1;
            mapa.set(d.regiao, item);
        });
        return [...mapa.values()]
            .sort((a, b) => b.demandas - a.demandas || b.apoios - a.apoios || a.regiao.nome.localeCompare(b.regiao.nome))
            .slice(0, limite);
    }

    /** Demandas registradas por mês nos últimos `meses` meses (inclui meses vazios). */
    function porMes(demandas, meses = 6, agora = new Date()) {
        const serie = [];
        for (let i = meses - 1; i >= 0; i--) {
            const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
            const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const rotulo = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
            serie.push({ chave, rotulo, ano: d.getFullYear(), quantidade: 0 });
        }
        demandas.forEach((d) => {
            const ponto = serie.find((p) => p.chave === String(d.data).slice(0, 7));
            if (ponto) ponto.quantidade += 1;
        });
        return serie;
    }

    /* ---------------- Gamificação ---------------- */

    /*
     * Regras simuladas de conquistas, calculadas a partir das demandas
     * registradas pelo usuário (relatos) e das demandas que ele apoiou.
     */
    const CONQUISTAS = [
        {
            id: "primeiro-relato",
            nome: "Primeiro relato",
            descricao: "Registre sua primeira demanda.",
            icone: "fa-flag",
            meta: 1,
            progresso: (ctx) => ctx.relatos
        },
        {
            id: "colaborador-bronze",
            nome: "Colaborador Bronze",
            descricao: "Apoie 3 demandas da comunidade.",
            icone: "fa-medal",
            meta: 3,
            progresso: (ctx) => ctx.apoiosDados
        },
        {
            id: "colaborador-prata",
            nome: "Colaborador Prata",
            descricao: "Registre 3 demandas e apoie outras 10.",
            icone: "fa-award",
            meta: 13,
            progresso: (ctx) => Math.min(ctx.relatos, 3) + Math.min(ctx.apoiosDados, 10)
        },
        {
            id: "guardiao-do-bairro",
            nome: "Guardião do Bairro",
            descricao: "Registre 3 demandas na mesma região administrativa.",
            icone: "fa-shield-heart",
            meta: 3,
            progresso: (ctx) => ctx.maxRelatosMesmaRegiao
        },
        {
            id: "voz-da-cidade",
            nome: "Voz da Cidade",
            descricao: "Tenha demandas que somem 25 apoios de outros cidadãos.",
            icone: "fa-bullhorn",
            meta: 25,
            progresso: (ctx) => ctx.apoiosRecebidos
        }
    ];

    /**
     * @param {Array} relatos demandas registradas pelo usuário
     * @param {number} apoiosDados quantidade de demandas que o usuário apoiou
     */
    function conquistas(relatos, apoiosDados) {
        const porRegiao = contarPor(relatos, "regiao");
        const ctx = {
            relatos: relatos.length,
            apoiosDados,
            apoiosRecebidos: relatos.reduce((s, d) => s + (d.apoios || 0), 0),
            maxRelatosMesmaRegiao: Math.max(0, ...Object.values(porRegiao))
        };
        return CONQUISTAS.map((c) => {
            const atual = Math.min(c.progresso(ctx), c.meta);
            return { ...c, atual, conquistada: atual >= c.meta, fracao: atual / c.meta };
        });
    }

    /* ---------------- Validação ---------------- */

    const LIMITES = { tituloMin: 8, tituloMax: 100, descricaoMin: 20, descricaoMax: 1000, localizacaoMin: 3 };

    /** Retorna { campo: mensagem } para cada campo inválido (objeto vazio = válido). */
    function validarDemanda(dados, campos = ["titulo", "categoria", "descricao", "regiao", "localizacao"]) {
        const erros = {};
        const titulo = String(dados.titulo || "").trim();
        const descricao = String(dados.descricao || "").trim();
        const localizacao = String(dados.localizacao || "").trim();

        const regras = {
            titulo: () =>
                titulo.length < LIMITES.tituloMin
                    ? `Use pelo menos ${LIMITES.tituloMin} caracteres.`
                    : titulo.length > LIMITES.tituloMax
                      ? `Use no máximo ${LIMITES.tituloMax} caracteres.`
                      : null,
            categoria: () => (BP.dados.categorias.some((c) => c.id === dados.categoria) ? null : "Escolha uma categoria."),
            descricao: () =>
                descricao.length < LIMITES.descricaoMin
                    ? `Descreva com pelo menos ${LIMITES.descricaoMin} caracteres.`
                    : descricao.length > LIMITES.descricaoMax
                      ? `Use no máximo ${LIMITES.descricaoMax} caracteres.`
                      : null,
            regiao: () => (BP.dados.regioes.some((r) => r.id === dados.regiao) ? null : "Escolha a região administrativa."),
            localizacao: () => (localizacao.length < LIMITES.localizacaoMin ? "Informe um endereço ou ponto de referência." : null)
        };

        campos.forEach((campo) => {
            const msg = regras[campo] && regras[campo]();
            if (msg) erros[campo] = msg;
        });
        return erros;
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
    }

    BP.dominio = {
        STATUS,
        CONQUISTAS,
        LIMITES,
        status,
        categoria,
        regiao,
        iconeDaDemanda,
        filtrarDemandas,
        estatisticas,
        distribuicaoPorStatus,
        porCategoria,
        rankingRegioes,
        porMes,
        conquistas,
        validarDemanda,
        validarEmail
    };
})(typeof window !== "undefined" ? window : globalThis);

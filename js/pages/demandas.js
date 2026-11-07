/* Lista de demandas: filtros (sincronizados com a URL), paginação e detalhes. */
(function () {
    "use strict";

    const { api, dominio, ui, util, dados } = window.BP;
    const POR_PAGINA = 12;
    const CAMPOS = ["q", "status", "categoria", "regiao", "ordem"];

    const form = document.getElementById("filtros");
    const lista = document.getElementById("listaDemandas");
    const contagem = document.getElementById("contagemResultado");
    const botaoMais = document.getElementById("carregarMais");
    const botaoLimpar = document.getElementById("limparFiltros");

    let todas = [];
    let apoiadas = new Set();
    let filtradas = [];
    let exibidas = 0;

    function preencherOpcoes() {
        const opcoes = (itens) => itens.map((i) => `<option value="${i.id}">${util.escapar(i.nome)}</option>`).join("");
        form.status.insertAdjacentHTML("beforeend", opcoes(dominio.STATUS));
        form.categoria.insertAdjacentHTML("beforeend", opcoes(dados.categorias));
        const regioes = [...dados.regioes].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        form.regiao.insertAdjacentHTML("beforeend", opcoes(regioes));
    }

    function lerFiltros() {
        return Object.fromEntries(CAMPOS.map((c) => [c, form[c].value.trim()]));
    }

    function aplicarDaUrl() {
        const params = new URLSearchParams(location.search);
        CAMPOS.forEach((c) => {
            const valor = params.get(c);
            if (valor === null) return;
            const campo = form[c];
            if (campo.tagName === "SELECT" && ![...campo.options].some((o) => o.value === valor)) return;
            campo.value = valor;
        });
    }

    function sincronizarUrl(filtros) {
        const url = new URL(location.href);
        CAMPOS.forEach((c) => {
            const padrao = c === "ordem" ? "recentes" : "";
            if (filtros[c] && filtros[c] !== padrao) url.searchParams.set(c, filtros[c]);
            else url.searchParams.delete(c);
        });
        history.replaceState(null, "", url);
    }

    function renderizarPagina() {
        const proximas = filtradas.slice(exibidas, exibidas + POR_PAGINA);
        lista.insertAdjacentHTML("beforeend", proximas.map((d) => ui.cardDemanda(d, apoiadas)).join(""));
        exibidas += proximas.length;
        botaoMais.hidden = exibidas >= filtradas.length;
    }

    function atualizar() {
        const filtros = lerFiltros();
        sincronizarUrl(filtros);
        filtradas = dominio.filtrarDemandas(todas, filtros);
        exibidas = 0;
        lista.innerHTML = "";

        const ativos = ["q", "status", "categoria", "regiao"].some((c) => filtros[c]);
        botaoLimpar.hidden = !ativos;
        contagem.textContent = ativos
            ? `${util.pluralizar(filtradas.length, "demanda encontrada", "demandas encontradas")} de ${util.formatarNumero(todas.length)}`
            : `${util.pluralizar(todas.length, "demanda registrada", "demandas registradas")}`;

        if (filtradas.length === 0) {
            botaoMais.hidden = true;
            lista.innerHTML = ui.estado({
                icone: "fa-magnifying-glass",
                titulo: "Nenhuma demanda encontrada",
                mensagem: "Tente outros termos de busca ou remova alguns filtros.",
                acao: '<button type="button" class="btn btn--secundario" data-limpar>Limpar filtros</button>'
            });
            return;
        }
        renderizarPagina();
    }

    function limpar() {
        form.reset();
        atualizar();
        form.q.focus();
    }

    window.BP.pronto.then(async () => {
        preencherOpcoes();
        aplicarDaUrl();
        lista.innerHTML = ui.cardsCarregando(6);

        try {
            [todas, apoiadas] = await Promise.all([api.demandas.listar(), api.demandas.apoiadas()]);
        } catch (erro) {
            contagem.textContent = "";
            lista.innerHTML = ui.estado({ icone: "fa-triangle-exclamation", titulo: "Não foi possível carregar as demandas", mensagem: erro.message });
            return;
        }

        atualizar();

        form.addEventListener("submit", (e) => e.preventDefault());
        /* A busca já é tratada no "input"; o "change" dela (disparado no blur)
           re-renderizaria a lista no meio de um clique. */
        form.addEventListener("change", (e) => e.target !== form.q && atualizar());
        form.q.addEventListener("input", util.debounce(atualizar, 200));
        botaoLimpar.addEventListener("click", limpar);
        lista.addEventListener("click", (e) => e.target.closest("[data-limpar]") && limpar());
        botaoMais.addEventListener("click", renderizarPagina);

        /* Mantém a lista em memória coerente com os apoios dados. */
        window.addEventListener("bp:mudanca", (e) => {
            if (e.detail.tipo !== "apoio") return;
            const d = todas.find((x) => x.id === e.detail.id);
            if (d) d.apoios = e.detail.apoios;
            if (e.detail.apoiada) apoiadas.add(e.detail.id);
            else apoiadas.delete(e.detail.id);
        });

        const idDetalhe = new URLSearchParams(location.search).get("id");
        if (idDetalhe) ui.abrirDetalhe(idDetalhe);
    });
})();

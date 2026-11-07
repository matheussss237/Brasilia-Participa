/* Dashboard: indicadores e gráficos (HTML/CSS puros) calculados dos dados. */
(function () {
    "use strict";

    const BP = window.BP;
    const { api, dominio, ui, util, dados } = BP;
    const { escapar, formatarNumero, formatarPercentual } = util;

    const seletor = document.getElementById("filtroRegiaoDash");
    const dica = document.getElementById("dicaGrafico");

    function tabela(cabecalhos, linhas) {
        return `
            <details class="tabela-dados">
                <summary>Ver dados em tabela</summary>
                <table>
                    <thead><tr>${cabecalhos.map((c) => `<th scope="col">${c}</th>`).join("")}</tr></thead>
                    <tbody>${linhas.map((l) => `<tr>${l.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</tbody>
                </table>
            </details>`;
    }

    function vazio() {
        return ui.estado({ icone: "fa-chart-simple", titulo: "Sem dados para esta seleção" });
    }

    /* ---------- Situação: barra segmentada 100% + legenda ---------- */
    function graficoStatus(demandas) {
        const el = document.getElementById("graficoStatus");
        if (!demandas.length) return (el.innerHTML = vazio());
        const dist = dominio.distribuicaoPorStatus(demandas);
        const segmentos = dist
            .filter((i) => i.quantidade > 0)
            .map(
                (i) => `<span class="segmento" tabindex="0" style="flex-grow:${i.quantidade};--cor-serie:${i.status.cor}"
                    data-dica="${escapar(i.status.nome)}: ${formatarNumero(i.quantidade)} (${formatarPercentual(i.fracao)})"
                    aria-label="${escapar(i.status.nome)}: ${i.quantidade}"></span>`
            )
            .join("");
        const legenda = dist
            .map(
                (i) => `
                <li class="legenda__item">
                    <span class="legenda__marca" style="--cor-serie:${i.status.cor}" aria-hidden="true"><i class="fa-solid ${i.status.icone}"></i></span>
                    <span class="legenda__nome">${escapar(i.status.nome)}</span>
                    <span class="legenda__valor">${formatarNumero(i.quantidade)}</span>
                    <span class="legenda__pct">${formatarPercentual(i.fracao)}</span>
                </li>`
            )
            .join("");
        el.innerHTML = `
            <div class="barra-segmentada" role="img" aria-label="${dist.map((i) => `${i.status.nome}: ${i.quantidade}`).join(", ")}">${segmentos}</div>
            <ul class="legenda">${legenda}</ul>
            ${tabela(["Status", "Demandas", "%"], dist.map((i) => [escapar(i.status.nome), formatarNumero(i.quantidade), formatarPercentual(i.fracao)]))}`;
    }

    /* ---------- Barras horizontais (uma série) ---------- */
    function barrasHorizontais(itens, { destaque } = {}) {
        const max = Math.max(1, ...itens.map((i) => i.valor));
        return `
            <ul class="barras">
                ${itens
                    .map(
                        (i) => `
                    <li class="barras__linha${destaque && destaque === i.id ? " barras__linha--destaque" : ""}">
                        <span class="barras__rotulo">${i.rotulo}</span>
                        <span class="barras__trilho"><span class="barras__barra" tabindex="0" style="--valor:${(i.valor / max) * 100}%" data-dica="${escapar(i.dica)}"></span></span>
                        <span class="barras__valor">${formatarNumero(i.valor)}</span>
                    </li>`
                    )
                    .join("")}
            </ul>`;
    }

    function graficoCategorias(demandas) {
        const el = document.getElementById("graficoCategorias");
        if (!demandas.length) return (el.innerHTML = vazio());
        const itens = dominio.porCategoria(demandas);
        el.innerHTML =
            barrasHorizontais(
                itens.map((i) => ({
                    id: i.categoria.id,
                    valor: i.quantidade,
                    rotulo: `<i class="fa-solid ${i.categoria.icone}" aria-hidden="true"></i>${escapar(i.categoria.nome)}`,
                    dica: `${i.categoria.nome}: ${util.pluralizar(i.quantidade, "demanda", "demandas")}`
                }))
            ) + tabela(["Categoria", "Demandas"], itens.map((i) => [escapar(i.categoria.nome), formatarNumero(i.quantidade)]));
    }

    function rankingRegioes(todas, regiaoSelecionada) {
        const el = document.getElementById("rankingRegioes");
        const ranking = dominio.rankingRegioes(todas, 8);
        if (!ranking.length) return (el.innerHTML = vazio());
        el.innerHTML =
            barrasHorizontais(
                ranking.map((r, i) => ({
                    id: r.regiao.id,
                    valor: r.demandas,
                    rotulo: `<span class="posicao">${i + 1}º</span>${escapar(r.regiao.nome)}`,
                    dica: `${r.regiao.nome}: ${util.pluralizar(r.demandas, "demanda", "demandas")}, ${util.pluralizar(r.apoios, "apoio", "apoios")}, ${r.resolvidas} resolvida(s)`
                })),
                { destaque: regiaoSelecionada }
            ) +
            tabela(
                ["Região", "Demandas", "Apoios", "Resolvidas"],
                ranking.map((r) => [escapar(r.regiao.nome), r.demandas, formatarNumero(r.apoios), r.resolvidas])
            );
    }

    /* ---------- Colunas por mês ---------- */
    function graficoMeses(demandas) {
        const el = document.getElementById("graficoMeses");
        const serie = dominio.porMes(demandas, 6);
        /* Escala com topo par, para a linha do meio cair num inteiro exato. */
        const maiorValor = Math.max(1, ...serie.map((p) => p.quantidade));
        const max = maiorValor <= 2 ? 2 : Math.ceil(maiorValor / 2) * 2;
        const maior = serie.reduce((a, b) => (b.quantidade > a.quantidade ? b : a), serie[0]);
        el.innerHTML = `
            <div class="colunas" role="img" aria-label="${serie.map((p) => `${p.rotulo}: ${p.quantidade}`).join(", ")}">
                <div class="colunas__grade" aria-hidden="true"><span>${formatarNumero(max)}</span><span>${formatarNumero(max / 2)}</span><span>0</span></div>
                ${serie
                    .map(
                        (p) => `
                    <div class="colunas__item">
                        <div class="colunas__area">
                            ${p === maior && p.quantidade ? `<span class="colunas__valor">${p.quantidade}</span>` : ""}
                            <span class="colunas__coluna" tabindex="0" style="--valor:${(p.quantidade / max) * 100}%"
                                  data-dica="${escapar(p.rotulo)}/${p.ano}: ${util.pluralizar(p.quantidade, "demanda", "demandas")}"></span>
                        </div>
                        <span class="colunas__rotulo">${escapar(p.rotulo)}</span>
                    </div>`
                    )
                    .join("")}
            </div>
            ${tabela(["Mês", "Demandas"], serie.map((p) => [`${escapar(p.rotulo)}/${p.ano}`, p.quantidade]))}`;
    }

    function maisApoiadas(demandas) {
        const el = document.getElementById("maisApoiadas");
        const top = dominio.filtrarDemandas(demandas, { ordem: "apoiadas" }).slice(0, 5);
        el.innerHTML = top.length
            ? top
                  .map(
                      (d) => `
                <li>
                    <button type="button" class="lista-top__item" data-detalhe="${escapar(d.id)}">
                        <span class="lista-top__titulo">${escapar(d.titulo)}</span>
                        <span class="lista-top__meta">${escapar(dominio.regiao(d.regiao).nome)} · ${ui.badgeStatus(d.status)}</span>
                    </button>
                    <span class="lista-top__apoios"><i class="fa-solid fa-thumbs-up" aria-hidden="true"></i>${formatarNumero(d.apoios)}</span>
                </li>`
                  )
                  .join("")
            : `<li>${vazio()}</li>`;
    }

    function kpis(demandas) {
        const s = dominio.estatisticas(demandas);
        document.querySelectorAll("#kpis [data-kpi]").forEach((el) => (el.dataset.contador = s[el.dataset.kpi]));
        document.querySelector('[data-kpi-extra="taxa"]').textContent = `${formatarPercentual(s.taxaResolucao)} de taxa de resolução`;
        ui.animarContadores(document.getElementById("kpis"));
    }

    /* ---------- Dica (tooltip) dos gráficos ---------- */
    function ligarDicas() {
        const mostrar = (alvo, x, y) => {
            dica.textContent = alvo.dataset.dica;
            dica.hidden = false;
            const r = dica.getBoundingClientRect();
            const left = Math.min(window.innerWidth - r.width - 8, Math.max(8, x - r.width / 2));
            dica.style.left = `${left}px`;
            dica.style.top = `${Math.max(8, y - r.height - 12)}px`;
        };
        document.addEventListener("pointermove", (e) => {
            const alvo = e.target.closest("[data-dica]");
            if (alvo) mostrar(alvo, e.clientX, e.clientY);
            else dica.hidden = true;
        });
        document.addEventListener("focusin", (e) => {
            const alvo = e.target.closest("[data-dica]");
            if (!alvo) return;
            const r = alvo.getBoundingClientRect();
            mostrar(alvo, r.left + r.width / 2, r.top);
        });
        document.addEventListener("focusout", () => (dica.hidden = true));
        window.addEventListener("scroll", () => (dica.hidden = true), { passive: true });
    }

    BP.pronto.then(async () => {
        const regioes = [...dados.regioes].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        seletor.insertAdjacentHTML("beforeend", regioes.map((r) => `<option value="${r.id}">${escapar(r.nome)}</option>`).join(""));

        let todas;
        try {
            todas = await api.demandas.listar();
        } catch (erro) {
            ui.erroGenerico(erro);
            return;
        }

        const renderizar = () => {
            const regiao = seletor.value;
            const filtradas = regiao ? todas.filter((d) => d.regiao === regiao) : todas;
            kpis(filtradas);
            graficoStatus(filtradas);
            graficoCategorias(filtradas);
            rankingRegioes(todas, regiao);
            graficoMeses(filtradas);
            maisApoiadas(filtradas);
        };

        seletor.addEventListener("change", renderizar);
        ligarDicas();
        renderizar();
    });
})();

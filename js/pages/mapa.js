/* Mapa interativo: pinos por status/categoria, filtros e painel de detalhes. */
(function () {
    "use strict";

    const BP = window.BP;
    const { api, dominio, ui, util, dados } = BP;

    const painel = document.getElementById("painelMapa");
    const contagem = document.getElementById("contagemPinos");
    const chips = document.getElementById("chipsStatus");
    const seletorCategoria = document.getElementById("mapaCategoria");

    const statusVisiveis = new Set(dominio.STATUS.map((s) => s.id));
    const marcadores = new Map(); // id -> { marcador, demanda }
    let selecionada = null;
    let apoiadas = new Set();

    function montarFiltros() {
        chips.innerHTML = dominio.STATUS.map(
            (s) => `
            <button type="button" class="chip chip--status" aria-pressed="true" data-status="${s.id}" style="--cor-chip:${s.cor}">
                <span class="chip__ponto" aria-hidden="true"></span>${util.escapar(s.nome)}
            </button>`
        ).join("");
        seletorCategoria.insertAdjacentHTML(
            "beforeend",
            dados.categorias.map((c) => `<option value="${c.id}">${util.escapar(c.nome)}</option>`).join("")
        );
    }

    function mostrarPainel(d) {
        const regiao = dominio.regiao(d.regiao).nome;
        painel.innerHTML = `
            ${ui.capa(d)}
            <div class="painel-mapa__corpo">
                <div class="card-demanda__topo">${ui.chipCategoria(d.categoria)}${ui.badgeStatus(d.status)}</div>
                <h2 class="painel-mapa__titulo">${util.escapar(d.titulo)}</h2>
                <p>${util.escapar(d.descricao)}</p>
                <p class="meta"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${util.escapar(d.localizacao || "")} · ${util.escapar(regiao)}</p>
                <p class="meta"><i class="fa-regular fa-calendar" aria-hidden="true"></i>${util.formatarData(d.data)}</p>
                <div class="painel-mapa__acoes">
                    ${ui.botaoApoio(d, apoiadas.has(d.id))}
                    <button type="button" class="btn btn--secundario btn--sm" data-detalhe="${util.escapar(d.id)}">Ver detalhes</button>
                </div>
            </div>`;
    }

    function selecionar(id, { centralizar = false } = {}) {
        const item = marcadores.get(id);
        if (!item) return;
        if (selecionada) marcadores.get(selecionada)?.marcador.getElement()?.classList.remove("pino--ativo");
        selecionada = id;
        item.marcador.getElement()?.classList.add("pino--ativo");
        if (centralizar) item.marcador._map.setView(item.marcador.getLatLng(), 15);
        mostrarPainel(item.demanda);
    }

    function aplicarFiltros(mapa) {
        const categoria = seletorCategoria.value;
        let visiveis = 0;
        marcadores.forEach(({ marcador, demanda }) => {
            const mostrar = statusVisiveis.has(demanda.status) && (!categoria || demanda.categoria === categoria);
            if (mostrar) {
                visiveis += 1;
                if (!mapa.hasLayer(marcador)) marcador.addTo(mapa);
            } else if (mapa.hasLayer(marcador)) {
                marcador.remove();
            }
        });
        contagem.textContent = util.formatarNumero(visiveis);
    }

    BP.pronto.then(async () => {
        montarFiltros();
        const mapa = BP.mapa.criar(document.getElementById("mapaDemandas"));
        if (!mapa) return;

        let demandas;
        try {
            [demandas, apoiadas] = await Promise.all([api.demandas.listar(), api.demandas.apoiadas()]);
        } catch (erro) {
            ui.erroGenerico(erro);
            return;
        }

        demandas
            .filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng))
            .forEach((d) => {
                const marcador = window.L.marker([d.lat, d.lng], {
                    icon: BP.mapa.iconeDemanda(d),
                    title: d.titulo,
                    alt: `${d.titulo} (${dominio.status(d.status).nome})`,
                    keyboard: true
                }).addTo(mapa);
                marcador.bindTooltip(util.escapar(d.titulo), { direction: "top" });
                marcador.on("click", () => selecionar(d.id));
                marcadores.set(d.id, { marcador, demanda: d });
            });

        if (marcadores.size) {
            const grupo = window.L.featureGroup([...marcadores.values()].map((m) => m.marcador));
            mapa.fitBounds(grupo.getBounds().pad(0.15));
        }
        contagem.textContent = util.formatarNumero(marcadores.size);

        chips.addEventListener("click", (e) => {
            const chip = e.target.closest("[data-status]");
            if (!chip) return;
            const ativo = chip.getAttribute("aria-pressed") !== "true";
            chip.setAttribute("aria-pressed", String(ativo));
            if (ativo) statusVisiveis.add(chip.dataset.status);
            else statusVisiveis.delete(chip.dataset.status);
            aplicarFiltros(mapa);
        });
        seletorCategoria.addEventListener("change", () => aplicarFiltros(mapa));

        window.addEventListener("bp:mudanca", (e) => {
            if (e.detail.tipo !== "apoio") return;
            const item = marcadores.get(e.detail.id);
            if (item) item.demanda.apoios = e.detail.apoios;
            if (e.detail.apoiada) apoiadas.add(e.detail.id);
            else apoiadas.delete(e.detail.id);
        });

        const idUrl = new URLSearchParams(location.search).get("id");
        if (idUrl && marcadores.has(idUrl)) selecionar(idUrl, { centralizar: true });
    });
})();

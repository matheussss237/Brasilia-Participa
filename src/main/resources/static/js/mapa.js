/* =========================================================
   MAPA.JS
   ---------------------------------------------------------
   Um marcador por demanda (dados da API). A cor indica o
   status e o ícone indica o tipo de problema. A legenda
   funciona como filtro: clique num status para esconder
   ou mostrar os pinos dele.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const mapEl = document.getElementById("leafletMap");
    const detalhe = document.getElementById("mapDetailCard");
    const contador = document.getElementById("mapPinCount");

    if (!mapEl || typeof L === "undefined") return;

    const mapa = L.map("leafletMap").setView([-15.7942, -47.8822], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
    }).addTo(mapa);

    setTimeout(() => mapa.invalidateSize(), 200);
    ativarBotoesDeApoio(detalhe);

    let demandas = [];
    try {
        demandas = (await api.listarDemandas({ tamanho: 500 })).itens;
    } catch (erro) {
        mostrarErro(erro, "Não foi possível carregar o mapa");
        return;
    }

    const camadasPorStatus = {};
    const marcadores = [];

    demandas.forEach(demanda => {
        const icone = L.divIcon({
            className: "",
            html: `<div class="leaflet-pin" style="background:${corDoStatus(demanda.status)}"><i class="fa-solid ${iconeDaDemanda(demanda)}"></i></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 32]
        });

        const marcador = L.marker([demanda.latitude, demanda.longitude], {
            icon: icone,
            title: demanda.titulo,
            keyboard: true
        });
        marcador.bindTooltip(escaparHtml(demanda.titulo), { direction: "top", offset: [0, -30] });

        marcador.on("click", () => {
            marcadores.forEach(m => m.getElement()?.classList.remove("leaflet-pin-active"));
            marcador.getElement()?.classList.add("leaflet-pin-active");
            mostrarDetalhe(demanda);
        });

        camadasPorStatus[demanda.status] ??= L.layerGroup().addTo(mapa);
        camadasPorStatus[demanda.status].addLayer(marcador);
        marcadores.push(marcador);
    });

    if (marcadores.length) {
        mapa.fitBounds(L.featureGroup(marcadores).getBounds().pad(0.2));
    }

    /* Legenda clicável = filtro por status */
    const statusVisiveis = new Set(Object.keys(STATUS_VISUAL));

    function atualizarContador() {
        if (!contador) return;
        contador.textContent = demandas.filter(d => statusVisiveis.has(d.status)).length;
    }

    document.querySelectorAll("[data-status-legenda]").forEach(item => {
        const status = item.dataset.statusLegenda;
        const quantidade = demandas.filter(d => d.status === status).length;
        item.querySelector(".legend-count").textContent = quantidade;

        item.addEventListener("click", () => {
            const ativo = statusVisiveis.has(status);
            if (ativo) {
                statusVisiveis.delete(status);
                camadasPorStatus[status] && mapa.removeLayer(camadasPorStatus[status]);
            } else {
                statusVisiveis.add(status);
                camadasPorStatus[status] && mapa.addLayer(camadasPorStatus[status]);
            }
            item.classList.toggle("off", ativo);
            item.setAttribute("aria-pressed", String(!ativo));
            atualizarContador();
        });
    });

    atualizarContador();

    function mostrarDetalhe(demanda) {
        if (!detalhe) return;
        detalhe.innerHTML = `
            ${fotoDemandaHtml(demanda)}
            <div class="demand-header">
                <i class="fa-solid ${iconeDaDemanda(demanda)}"></i>
                ${badgeStatus(demanda)}
            </div>
            <h3>${escaparHtml(demanda.titulo)}</h3>
            <p>${escaparHtml(demanda.descricao)}</p>
            <p class="detail-address"><i class="fa-solid fa-location-dot"></i> ${escaparHtml(demanda.endereco)} — ${escaparHtml(demanda.regiao)}</p>
            <div class="demand-footer">
                <span>${tempoRelativo(demanda.criadaEm)}</span>
                ${botaoApoioHtml(demanda)}
            </div>
            <a href="${linkDemanda(demanda)}" class="btn btn-primary btn-block">
                Ver detalhes e andamento <i class="fa-solid fa-arrow-right"></i>
            </a>
        `;
    }
});

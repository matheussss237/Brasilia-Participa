/* =========================================================
   MAPA.JS
   ---------------------------------------------------------
   Desenha no Leaflet um marcador para cada demanda salva
   (js/store.js). A cor do pino indica o status e o ícone
   indica a categoria — dá pra "escanear" o mapa visualmente
   e ver onde estão os problemas parados (vermelho) e onde
   já foi resolvido (verde), por exemplo.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const mapEl = document.getElementById("leafletMap");
    const detailCard = document.getElementById("mapDetailCard");
    const pinCountEl = document.getElementById("mapPinCount");

    if (!mapEl || typeof L === "undefined") return;

    const CENTRO_BRASILIA = [-15.7942, -47.8822];

    const map = L.map("leafletMap").setView(CENTRO_BRASILIA, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
    }).addTo(map);

    const demandas = obterDemandas().filter(d => typeof d.lat === "number" && typeof d.lng === "number");

    if (pinCountEl) pinCountEl.textContent = demandas.length;

    function criarIcone(demanda) {

        return L.divIcon({
            className: "",
            html: `
                <div class="leaflet-pin" style="background:${corDoStatus(demanda.status)}">
                    <i class="fa-solid ${iconeDaDemanda(demanda)}"></i>
                </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 32],
            popupAnchor: [0, -30]
        });
    }

    const marcadores = [];

    demandas.forEach(demanda => {

        const marcador = L.marker([demanda.lat, demanda.lng], { icon: criarIcone(demanda) }).addTo(map);

        marcador.bindTooltip(demanda.titulo, { direction: "top", offset: [0, -30] });

        marcador.on("click", () => {
            marcadores.forEach(m => m.getElement() && m.getElement().classList.remove("leaflet-pin-active"));
            marcador.getElement() && marcador.getElement().classList.add("leaflet-pin-active");
            mostrarDetalhe(demanda);
        });

        marcadores.push(marcador);
    });

    if (marcadores.length > 0) {
        const grupo = L.featureGroup(marcadores);
        map.fitBounds(grupo.getBounds().pad(0.25));
    }

    /* Se o mapa nasce dentro de um layout ainda sendo montado
       (grid/flex), ele às vezes calcula o tamanho errado. */
    setTimeout(() => map.invalidateSize(), 200);

    function mostrarDetalhe(demanda) {

        if (!detailCard) return;

        detailCard.innerHTML = `
            ${fotoDemandaHtml(demanda)}
            <div class="demand-header">
                <i class="fa-solid ${iconeDaDemanda(demanda)}"></i>
                <span class="badge ${classeDoStatus(demanda.status)}">${demanda.status}</span>
            </div>

            <h3>${demanda.titulo}</h3>

            <p>${demanda.descricao}</p>

            ${demanda.localizacao ? `<p style="color: var(--text-light); font-size: 0.85rem; margin-bottom: 10px;"><i class="fa-solid fa-location-dot"></i> ${demanda.localizacao}</p>` : ""}

            <div class="demand-footer" style="margin-top: 16px;">
                <span><i class="fa-solid fa-map-pin"></i> ${demanda.regiao}</span>
                <span><i class="fa-solid fa-thumbs-up"></i> ${demanda.apoios}</span>
            </div>
        `;
    }

});

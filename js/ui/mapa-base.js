/* =========================================================
   MAPA BASE — configuração comum do Leaflet (mapa de
   demandas e seletor de local da nova demanda).
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    const CENTRO_DF = [-15.7942, -47.8822];

    function disponivel() {
        return typeof root.L !== "undefined";
    }

    /** Cria um mapa Leaflet ou mostra um aviso se a biblioteca não carregou (sem internet). */
    function criar(elemento, opcoes = {}) {
        if (!disponivel()) {
            elemento.innerHTML = BP.ui.estado({
                icone: "fa-map",
                titulo: "Não foi possível carregar o mapa",
                mensagem: "Verifique sua conexão com a internet e recarregue a página."
            });
            elemento.classList.add("mapa--indisponivel");
            return null;
        }

        const mapa = root.L.map(elemento, { zoomControl: true, scrollWheelZoom: opcoes.rolagem ?? true }).setView(
            opcoes.centro || CENTRO_DF,
            opcoes.zoom || 11
        );

        root.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(mapa);

        /* O Leaflet calcula o tamanho errado se o contêiner ainda está sendo montado. */
        if ("ResizeObserver" in root) new ResizeObserver(() => mapa.invalidateSize()).observe(elemento);
        else setTimeout(() => mapa.invalidateSize(), 200);

        return mapa;
    }

    function iconeDemanda(demanda) {
        const s = BP.dominio.status(demanda.status);
        return root.L.divIcon({
            className: "pino",
            html: `<span class="pino__corpo" style="--cor-pino:${s.cor}"><i class="fa-solid ${BP.dominio.iconeDaDemanda(demanda)}" aria-hidden="true"></i></span>`,
            iconSize: [36, 36],
            iconAnchor: [18, 34],
            tooltipAnchor: [0, -32]
        });
    }

    function iconeSelecao() {
        return root.L.divIcon({
            className: "pino pino--selecao",
            html: '<span class="pino__corpo"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span>',
            iconSize: [36, 36],
            iconAnchor: [18, 34]
        });
    }

    BP.mapa = { CENTRO_DF, disponivel, criar, iconeDemanda, iconeSelecao };
})(window);

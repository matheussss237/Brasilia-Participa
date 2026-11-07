/* =========================================================
   Regiões Administrativas do DF (mock — equivalente a regions.json)
   lat/lng aproximados do centro de cada RA. São usados para
   centralizar o mapa e como posição padrão de uma demanda
   quando o cidadão não marca um ponto exato.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    BP.dados = BP.dados || {};

    BP.dados.regioes = [
        { id: "plano-piloto", nome: "Plano Piloto", lat: -15.7942, lng: -47.8822 },
        { id: "gama", nome: "Gama", lat: -16.0189, lng: -48.0642 },
        { id: "taguatinga", nome: "Taguatinga", lat: -15.833, lng: -48.0559 },
        { id: "brazlandia", nome: "Brazlândia", lat: -15.6699, lng: -48.2032 },
        { id: "sobradinho", nome: "Sobradinho", lat: -15.6519, lng: -47.7869 },
        { id: "sobradinho-ii", nome: "Sobradinho II", lat: -15.6425, lng: -47.7622 },
        { id: "planaltina", nome: "Planaltina", lat: -15.6206, lng: -47.6547 },
        { id: "paranoa", nome: "Paranoá", lat: -15.7742, lng: -47.7658 },
        { id: "nucleo-bandeirante", nome: "Núcleo Bandeirante", lat: -15.8686, lng: -47.9679 },
        { id: "ceilandia", nome: "Ceilândia", lat: -15.8151, lng: -48.1099 },
        { id: "guara", nome: "Guará", lat: -15.8258, lng: -47.9776 },
        { id: "cruzeiro", nome: "Cruzeiro", lat: -15.7891, lng: -47.9436 },
        { id: "samambaia", nome: "Samambaia", lat: -15.8752, lng: -48.0904 },
        { id: "santa-maria", nome: "Santa Maria", lat: -16.0128, lng: -48.0064 },
        { id: "sao-sebastiao", nome: "São Sebastião", lat: -15.9046, lng: -47.7758 },
        { id: "recanto-das-emas", nome: "Recanto das Emas", lat: -15.906, lng: -48.0644 },
        { id: "lago-sul", nome: "Lago Sul", lat: -15.8283, lng: -47.8483 },
        { id: "lago-norte", nome: "Lago Norte", lat: -15.7391, lng: -47.8531 },
        { id: "riacho-fundo", nome: "Riacho Fundo", lat: -15.8825, lng: -48.0169 },
        { id: "riacho-fundo-ii", nome: "Riacho Fundo II", lat: -15.9083, lng: -48.0333 },
        { id: "candangolandia", nome: "Candangolândia", lat: -15.8258, lng: -47.9308 },
        { id: "aguas-claras", nome: "Águas Claras", lat: -15.8375, lng: -48.0281 },
        { id: "sudoeste-octogonal", nome: "Sudoeste/Octogonal", lat: -15.8034, lng: -47.9268 },
        { id: "varjao", nome: "Varjão", lat: -15.7113, lng: -47.8394 },
        { id: "park-way", nome: "Park Way", lat: -15.8781, lng: -47.9614 },
        { id: "scia-estrutural", nome: "SCIA/Estrutural", lat: -15.7803, lng: -48.0089 },
        { id: "jardim-botanico", nome: "Jardim Botânico", lat: -15.8672, lng: -47.7783 },
        { id: "itapoa", nome: "Itapoã", lat: -15.7364, lng: -47.7508 },
        { id: "sia", nome: "SIA", lat: -15.7967, lng: -47.9564 },
        { id: "vicente-pires", nome: "Vicente Pires", lat: -15.8214, lng: -48.0011 },
        { id: "fercal", nome: "Fercal", lat: -15.5822, lng: -47.7908 },
        { id: "sol-nascente", nome: "Sol Nascente/Pôr do Sol", lat: -15.813, lng: -48.1381 },
        { id: "arniqueira", nome: "Arniqueira", lat: -15.8481, lng: -48.0244 }
    ];
})(typeof window !== "undefined" ? window : globalThis);

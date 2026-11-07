/* =========================================================
   Categorias de demandas (mock — equivalente a categories.json)
   Cada categoria tem um ícone (Font Awesome) e uma cor de destaque.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    BP.dados = BP.dados || {};

    BP.dados.categorias = [
        { id: "infraestrutura", nome: "Infraestrutura", icone: "fa-road", cor: "#8a5a2b" },
        { id: "iluminacao", nome: "Iluminação", icone: "fa-lightbulb", cor: "#9a7400" },
        { id: "limpeza", nome: "Limpeza", icone: "fa-trash", cor: "#2f7d4f" },
        { id: "seguranca", nome: "Segurança", icone: "fa-shield-halved", cor: "#1351b4" },
        { id: "transporte", nome: "Transporte", icone: "fa-bus", cor: "#6b46c1" },
        { id: "meio-ambiente", nome: "Meio ambiente", icone: "fa-tree", cor: "#15803d" },
        { id: "educacao", nome: "Educação", icone: "fa-school", cor: "#b45309" },
        { id: "saude", nome: "Saúde", icone: "fa-briefcase-medical", cor: "#c81e1e" },
        { id: "acessibilidade", nome: "Acessibilidade", icone: "fa-wheelchair", cor: "#0e7490" }
    ];
})(typeof window !== "undefined" ? window : globalThis);

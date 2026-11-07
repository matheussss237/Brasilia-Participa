/* Carrega os scripts do navegador (que se registram em globalThis.BP) no Node. */
"use strict";

const path = require("node:path");

const ARQUIVOS = [
    "js/data/categorias.js",
    "js/data/regioes.js",
    "js/data/demandas-seed.js",
    "js/core/util.js",
    "js/core/storage.js",
    "js/core/dominio.js",
    "js/core/api.js"
];

module.exports = function carregar() {
    delete globalThis.BP;
    for (const arquivo of ARQUIVOS) {
        const caminho = path.join(__dirname, "..", arquivo);
        delete require.cache[require.resolve(caminho)];
        require(caminho);
    }
    return globalThis.BP;
};

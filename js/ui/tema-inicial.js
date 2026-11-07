/* Carregado no <head>, antes do CSS ser aplicado, para evitar o
   "piscar" de tema claro ao abrir a página no modo escuro. */
(function () {
    "use strict";
    var tema = null;
    try {
        tema = JSON.parse(localStorage.getItem("bp:v2:tema"));
    } catch (_) {
        /* sem localStorage */
    }
    if (tema !== "claro" && tema !== "escuro") {
        tema = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
    }
    document.documentElement.setAttribute("data-theme", tema === "escuro" ? "dark" : "light");
})();

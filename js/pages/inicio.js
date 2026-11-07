/* Página inicial: números gerais, demandas recentes e categorias. */
(function () {
    "use strict";

    const { api, dominio, ui, util } = window.BP;

    window.BP.pronto.then(async () => {
        const recentes = document.getElementById("demandasRecentes");
        recentes.innerHTML = ui.cardsCarregando(6);

        try {
            const [demandas, apoiadas] = await Promise.all([api.demandas.listar(), api.demandas.apoiadas()]);
            const stats = dominio.estatisticas(demandas);

            document.querySelectorAll("#numerosInicio [data-kpi]").forEach((el) => {
                el.dataset.contador = stats[el.dataset.kpi];
            });
            ui.animarContadores(document.getElementById("numerosInicio"));

            const ultimas = dominio.filtrarDemandas(demandas, { ordem: "recentes" }).slice(0, 6);
            recentes.innerHTML = ultimas.length
                ? ultimas.map((d) => ui.cardDemanda(d, apoiadas)).join("")
                : ui.estado({
                      icone: "fa-inbox",
                      titulo: "Ainda não há demandas",
                      mensagem: "Seja a primeira pessoa a registrar um problema.",
                      acao: '<a class="btn btn--primario" href="nova-demanda.html">Registrar demanda</a>'
                  });

            const contagem = Object.fromEntries(dominio.porCategoria(demandas).map((i) => [i.categoria.id, i.quantidade]));
            document.getElementById("categoriasInicio").innerHTML = window.BP.dados.categorias
                .map(
                    (c) => `
                    <a class="cartao-categoria" href="demandas.html?categoria=${c.id}" style="--cor-categoria:${c.cor}">
                        <span class="cartao-categoria__icone" aria-hidden="true"><i class="fa-solid ${c.icone}"></i></span>
                        <span class="cartao-categoria__nome">${util.escapar(c.nome)}</span>
                        <span class="cartao-categoria__qtd">${util.pluralizar(contagem[c.id] || 0, "demanda", "demandas")}</span>
                    </a>`
                )
                .join("");
        } catch (erro) {
            recentes.innerHTML = ui.estado({ icone: "fa-triangle-exclamation", titulo: "Não foi possível carregar as demandas", mensagem: erro.message });
        }
    });
})();

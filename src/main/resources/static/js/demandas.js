/* =========================================================
   DEMANDAS.JS
   Página de listagem: busca, filtros (status, categoria,
   região), ordenação, "carregar mais" e botão de apoiar.
   Os filtros são aplicados no servidor (MongoDB).
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("demandsContainer");
    if (!container) return;

    const busca = document.getElementById("searchDemand");
    const filtroStatus = document.getElementById("statusFilter");
    const filtroCategoria = document.getElementById("categoryFilter");
    const filtroRegiao = document.getElementById("regionFilter");
    const ordenar = document.getElementById("sortFilter");
    const contador = document.getElementById("demandsCount");
    const botaoMais = document.getElementById("loadMoreButton");

    const TAMANHO_PAGINA = 9;
    let paginaAtual = 0;
    let requisicaoAtual = 0; // descarta respostas antigas se o usuário digitar rápido

    ativarBotoesDeApoio(container);

    /* Preenche os selects com as listas do back-end */
    try {
        const ref = await api.referencias();
        preencherSelect(filtroStatus, ref.status.map(s => ({ valor: s.codigo, texto: s.texto })));
        preencherSelect(filtroCategoria, ref.categorias.map(c => ({ valor: c, texto: c })));
        preencherSelect(filtroRegiao, ref.regioes.map(r => ({ valor: r.nome, texto: r.nome })));
    } catch (erro) {
        mostrarErro(erro, "Não foi possível carregar os filtros");
    }

    /* Filtros vindos da URL (ex.: busca do cabeçalho ?q=buraco) */
    const parametros = new URLSearchParams(location.search);
    if (busca && parametros.get("q")) busca.value = parametros.get("q");
    if (filtroStatus && parametros.get("status")) filtroStatus.value = parametros.get("status");
    if (filtroRegiao && parametros.get("regiao")) filtroRegiao.value = parametros.get("regiao");
    if (filtroCategoria && parametros.get("categoria")) filtroCategoria.value = parametros.get("categoria");

    function filtrosAtuais() {
        return {
            q: busca?.value.trim(),
            status: filtroStatus?.value,
            categoria: filtroCategoria?.value,
            regiao: filtroRegiao?.value,
            ordenar: ordenar?.value
        };
    }

    async function carregar({ acumular = false } = {}) {
        const numero = ++requisicaoAtual;
        paginaAtual = acumular ? paginaAtual + 1 : 0;

        if (!acumular) container.innerHTML = esqueletoCards(3);
        if (botaoMais) botaoMais.hidden = true;

        try {
            const pagina = await api.listarDemandas({ ...filtrosAtuais(), pagina: paginaAtual, tamanho: TAMANHO_PAGINA });
            if (numero !== requisicaoAtual) return;

            const html = pagina.itens.map(d => cardDemandaHtml(d)).join("");

            if (acumular) {
                container.insertAdjacentHTML("beforeend", html);
            } else if (pagina.total === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>Nenhuma demanda encontrada.</h3>
                        <p>Tente ajustar a busca ou os filtros.</p>
                    </div>`;
            } else {
                container.innerHTML = html;
            }

            if (contador) {
                contador.textContent = pagina.total === 1 ? "1 demanda encontrada" : `${pagina.total} demandas encontradas`;
            }
            if (botaoMais) botaoMais.hidden = !pagina.temMais;

            observarAnimacoes(container);
            atualizarUrl();
        } catch (erro) {
            if (numero !== requisicaoAtual) return;
            container.innerHTML = `<div class="empty-state"><h3>Não foi possível carregar as demandas.</h3><p>${escaparHtml(erro.message)}</p></div>`;
        }
    }

    /* Guarda os filtros na URL: dá para compartilhar o link já filtrado */
    function atualizarUrl() {
        const filtros = filtrosAtuais();
        const nova = new URLSearchParams();
        ["q", "status", "categoria", "regiao"].forEach(chave => {
            if (filtros[chave]) nova.set(chave, filtros[chave]);
        });
        const texto = nova.toString();
        history.replaceState(null, "", texto ? `?${texto}` : location.pathname);
    }

    let espera;
    busca?.addEventListener("input", () => {
        clearTimeout(espera);
        espera = setTimeout(() => carregar(), 300); // espera parar de digitar
    });
    [filtroStatus, filtroCategoria, filtroRegiao, ordenar].forEach(campo =>
        campo?.addEventListener("change", () => carregar()));

    botaoMais?.addEventListener("click", () => carregar({ acumular: true }));

    document.getElementById("clearFilters")?.addEventListener("click", () => {
        [busca, filtroStatus, filtroCategoria, filtroRegiao].forEach(campo => { if (campo) campo.value = ""; });
        if (ordenar) ordenar.value = "recentes";
        carregar();
    });

    carregar();
});

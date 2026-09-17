/* =========================================================
   DEMANDAS.JS
   Funcionalidades da página de demandas: renderiza os
   cards a partir do store.js, filtra e permite apoiar.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("demandsContainer");

    const searchInput = document.getElementById("searchDemand");
    const statusFilter = document.getElementById("statusFilter");

    /* ==========================================
       CRIAR UM CARD
    ========================================== */

    function criarCard(demanda) {

        const card = document.createElement("article");

        card.className = "card demand-card slide-up";
        card.dataset.status = demanda.status;
        card.dataset.demandId = demanda.id;

        const fotoHtml = demanda.foto
            ? `<div class="demand-photo"><img src="${demanda.foto}" alt="Foto enviada: ${demanda.titulo}" loading="lazy" onerror="this.closest('.demand-photo').style.display='none'"></div>`
            : "";

        card.innerHTML = `
            ${fotoHtml}
            <div class="demand-header">
                <i class="fa-solid ${iconeDaCategoria(demanda.categoria)}"></i>
                <span class="badge ${classeDoStatus(demanda.status)}">${demanda.status}</span>
            </div>

            <h3>${demanda.titulo}</h3>

            <p>${demanda.descricao}</p>

            <div class="demand-footer">
                <span><i class="fa-solid fa-location-dot"></i> ${demanda.regiao}</span>

                <button class="icon-btn vote-button" type="button" title="Apoiar demanda">
                    <i class="fa-solid fa-thumbs-up"></i>
                    <span class="vote-count">${demanda.apoios}</span>
                </button>
            </div>
        `;

        const botaoApoiar = card.querySelector(".vote-button");

        const votosSalvos = JSON.parse(localStorage.getItem("bp_votos") || "{}");

        if (votosSalvos[demanda.id]) {
            botaoApoiar.classList.add("voted");
            botaoApoiar.title = "Remover apoio";
        }

        botaoApoiar.addEventListener("click", () => {

            const jaApoiou = botaoApoiar.classList.contains("voted");

            const novoTotal = atualizarApoios(demanda.id, jaApoiou ? -1 : 1);

            if (novoTotal === null) return;

            botaoApoiar.querySelector(".vote-count").textContent = novoTotal;

            botaoApoiar.classList.toggle("voted");
            botaoApoiar.title = jaApoiou ? "Apoiar demanda" : "Remover apoio";

            const votos = JSON.parse(localStorage.getItem("bp_votos") || "{}");

            if (jaApoiou) {
                delete votos[demanda.id];
            } else {
                votos[demanda.id] = true;
            }

            localStorage.setItem("bp_votos", JSON.stringify(votos));
        });

        return card;
    }

    /* ==========================================
       RENDERIZAR LISTA
    ========================================== */

    function renderizar(lista) {

        if (!container) return;

        container.innerHTML = "";

        if (lista.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhuma demanda encontrada.</h3>
                    <p>Tente ajustar a busca ou o filtro de status.</p>
                </div>
            `;

            return;
        }

        lista.forEach(demanda => container.appendChild(criarCard(demanda)));
    }

    const STATUS_POR_FILTRO = {
        recebida: "Recebida",
        analise: "Em análise",
        resolvida: "Resolvida"
    };

    function aplicarFiltros() {

        const termo = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const status = statusFilter ? statusFilter.value : "all";

        const filtradas = obterDemandas().filter(demanda => {

            const statusOk = status === "all" || demanda.status === STATUS_POR_FILTRO[status];

            const textoOk = !termo || (
                demanda.titulo.toLowerCase().includes(termo) ||
                demanda.descricao.toLowerCase().includes(termo) ||
                demanda.regiao.toLowerCase().includes(termo)
            );

            return statusOk && textoOk;
        });

        renderizar(filtradas);
    }

    if (container) {

        renderizar(obterDemandas());

        if (searchInput) searchInput.addEventListener("input", aplicarFiltros);
        if (statusFilter) statusFilter.addEventListener("change", aplicarFiltros);
    }

    /* ==========================================
       FORMULÁRIO DE NOVA DEMANDA (fallback)
       A versão completa, com foto e pino no mapa,
       é tratada dentro de nova-demanda.html.
    ========================================== */

    const demandForm = document.getElementById("demandForm");

    if (demandForm && !demandForm.dataset.customSubmit) {

        demandForm.addEventListener("submit", event => {

            event.preventDefault();

            alert("Demanda cadastrada com sucesso!");

            demandForm.reset();
        });
    }

});

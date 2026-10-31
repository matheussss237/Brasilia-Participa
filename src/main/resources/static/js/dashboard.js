/* =========================================================
   DASHBOARD.JS
   ---------------------------------------------------------
   Gráficos (Chart.js) com os números calculados pelo
   back-end em /api/estatisticas (agregações do MongoDB).
   Os cards de número são preenchidos pelo main.js.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("graficoStatus")) return;

    let dados = null;
    const graficos = [];

    document.addEventListener("estatisticasCarregadas", evento => {
        dados = evento.detail;
        preencherIndicadores();
        desenharGraficos();
        preencherRanking();
    });

    /* Ao trocar o tema, redesenha com as cores certas */
    document.addEventListener("temaAlterado", () => dados && desenharGraficos());

    function preencherIndicadores() {
        animarNumero(document.getElementById("taxaResolucao"), dados.taxaResolucao, { casas: 1, sufixo: "%" });
        const tempo = document.getElementById("tempoMedio");
        if (dados.tempoMedioResolucaoDias == null) {
            tempo.textContent = "—";
        } else {
            animarNumero(tempo, dados.tempoMedioResolucaoDias, { casas: 1, sufixo: " dias" });
        }
    }

    function cor(variavel) {
        return getComputedStyle(document.body).getPropertyValue(variavel).trim();
    }

    function desenharGraficos() {
        if (typeof Chart === "undefined") return;

        graficos.forEach(g => g.destroy());
        graficos.length = 0;

        Chart.defaults.color = cor("--text-light");
        Chart.defaults.borderColor = cor("--border");
        Chart.defaults.font.family = "Inter, system-ui, sans-serif";

        const animacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? false : undefined;

        /* 1) Rosca: situação das demandas */
        const coresStatus = ["RECEBIDA", "EM_ANALISE", "PENDENTE", "RESOLVIDA"].map(corDoStatus);
        graficos.push(new Chart(document.getElementById("graficoStatus"), {
            type: "doughnut",
            data: {
                labels: dados.porStatus.map(s => s.nome),
                datasets: [{
                    data: dados.porStatus.map(s => s.total),
                    backgroundColor: coresStatus,
                    borderColor: cor("--surface"),
                    borderWidth: 3
                }]
            },
            options: {
                animation: animacao,
                maintainAspectRatio: false,
                cutout: "62%",
                plugins: { legend: { position: "bottom" } }
            }
        }));

        /* 2) Barras horizontais: categorias */
        graficos.push(new Chart(document.getElementById("graficoCategoria"), {
            type: "bar",
            data: {
                labels: dados.porCategoria.map(c => c.nome),
                datasets: [{
                    label: "Demandas",
                    data: dados.porCategoria.map(c => c.total),
                    backgroundColor: dados.porCategoria.map(c => corDaCategoria(c.nome)),
                    borderRadius: 4,
                    maxBarThickness: 22
                }]
            },
            options: {
                animation: animacao,
                indexAxis: "y",
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { precision: 0 } }, y: { grid: { display: false } } }
            }
        }));

        /* 3) Linha: novas demandas por mês */
        const azul = cor("--primary");
        graficos.push(new Chart(document.getElementById("graficoMes"), {
            type: "line",
            data: {
                labels: dados.porMes.map(m => m.nome),
                datasets: [{
                    label: "Novas demandas",
                    data: dados.porMes.map(m => m.total),
                    borderColor: azul,
                    backgroundColor: azul + "22",
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4,
                    pointBackgroundColor: azul
                }]
            },
            options: {
                animation: animacao,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }
            }
        }));
    }

    function preencherRanking() {
        const corpo = document.getElementById("rankingRegioes");
        if (!corpo) return;
        const medalhas = ["🥇", "🥈", "🥉"];
        corpo.innerHTML = dados.porRegiao.slice(0, 10).map((r, i) => {
            const taxa = r.total ? Math.round(r.resolvidas / r.total * 100) : 0;
            return `
                <tr>
                    <td>${medalhas[i] || i + 1}</td>
                    <td><a href="demandas.html?regiao=${encodeURIComponent(r.regiao)}">${escaparHtml(r.regiao)}</a></td>
                    <td>${r.total}</td>
                    <td>${r.apoios}</td>
                    <td>
                        <div class="mini-progress" title="${taxa}% resolvidas">
                            <span style="width:${taxa}%"></span>
                        </div>
                        <small>${r.resolvidas} (${taxa}%)</small>
                    </td>
                </tr>`;
        }).join("") || `<tr><td colspan="5" class="table-empty">Ainda não há demandas.</td></tr>`;
    }
});

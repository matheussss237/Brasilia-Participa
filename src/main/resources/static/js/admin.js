/* =========================================================
   ADMIN.JS
   ---------------------------------------------------------
   Painel do administrador (servidor público):
   - resumo por status (clique para filtrar);
   - tabela com as demandas, ordenadas por prioridade;
   - troca rápida de status direto na tabela.
   A API também confere se o usuário é ADMIN: esconder a
   página é só conforto visual, a segurança está no back-end.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const sessao = await api.sessao();
    if (!sessao.logado || sessao.usuario.perfil !== "ADMIN") {
        document.getElementById("adminBloqueado").hidden = false;
        return;
    }
    document.getElementById("adminConteudo").hidden = false;

    const tabela = document.getElementById("adminTabela");
    const busca = document.getElementById("adminBusca");
    const filtroStatus = document.getElementById("adminStatus");
    const filtroRegiao = document.getElementById("adminRegiao");
    const ordenar = document.getElementById("adminOrdenar");
    const botaoMais = document.getElementById("adminMais");

    let statusDisponiveis = [];
    let pagina = 0;

    try {
        const ref = await api.referencias();
        statusDisponiveis = ref.status;
        preencherSelect(filtroStatus, ref.status.map(s => ({ valor: s.codigo, texto: s.texto })));
        preencherSelect(filtroRegiao, ref.regioes.map(r => ({ valor: r.nome, texto: r.nome })));
    } catch (erro) {
        mostrarErro(erro);
    }

    async function atualizarResumo() {
        try {
            const numeros = await api.estatisticas();
            const porTexto = Object.fromEntries(numeros.porStatus.map(s => [s.nome, s.total]));
            statusDisponiveis.forEach(s => {
                const el = document.querySelector(`[data-resumo="${s.codigo}"]`);
                if (el) el.textContent = porTexto[s.texto] ?? 0;
            });
        } catch (erro) {
            console.error(erro);
        }
    }

    function linhaHtml(d) {
        const opcoes = statusDisponiveis.map(s =>
            `<option value="${s.codigo}" ${s.codigo === d.status ? "selected" : ""}>${escaparHtml(s.texto)}</option>`).join("");
        return `
            <tr data-id="${escaparHtml(d.id)}">
                <td data-label="Demanda">
                    <a href="${linkDemanda(d)}" class="admin-titulo">${escaparHtml(d.titulo)}</a>
                    <small>${escaparHtml(d.categoria)} · ${escaparHtml(d.autorNome)}</small>
                </td>
                <td data-label="Região">${escaparHtml(d.regiao)}</td>
                <td data-label="Apoios"><i class="fa-solid fa-thumbs-up"></i> ${d.totalApoios}</td>
                <td data-label="Aberta">${tempoRelativo(d.criadaEm)}</td>
                <td data-label="Status">
                    <select class="form-control status-select" aria-label="Status de ${escaparHtml(d.titulo)}"
                            style="--cor-status:${corDoStatus(d.status)}">${opcoes}</select>
                </td>
            </tr>`;
    }

    async function carregar({ acumular = false } = {}) {
        pagina = acumular ? pagina + 1 : 0;
        if (!acumular) tabela.innerHTML = `<tr><td colspan="5" class="table-empty"><i class="fa-solid fa-spinner fa-spin"></i> Carregando...</td></tr>`;

        try {
            const resultado = await api.listarDemandas({
                q: busca.value.trim(),
                status: filtroStatus.value,
                regiao: filtroRegiao.value,
                ordenar: ordenar.value,
                pagina,
                tamanho: 20
            });
            const html = resultado.itens.map(linhaHtml).join("");
            if (acumular) tabela.insertAdjacentHTML("beforeend", html);
            else tabela.innerHTML = html || `<tr><td colspan="5" class="table-empty">Nenhuma demanda com esses filtros.</td></tr>`;
            botaoMais.hidden = !resultado.temMais;
        } catch (erro) {
            mostrarErro(erro);
        }
    }

    /* Troca rápida de status direto na tabela */
    tabela.addEventListener("change", async evento => {
        const select = evento.target.closest(".status-select");
        if (!select) return;
        const linha = select.closest("tr");
        const anterior = [...select.options].find(o => o.defaultSelected)?.value;

        select.disabled = true;
        try {
            await api.alterarStatus(linha.dataset.id, select.value, "");
            [...select.options].forEach(o => o.defaultSelected = o.value === select.value);
            select.style.setProperty("--cor-status", corDoStatus(select.value));
            mostrarNotificacao({
                titulo: "Status atualizado",
                mensagem: "Para explicar a mudança ao cidadão, abra a demanda e deixe uma observação.",
                tipo: "sucesso",
                duracao: 3500
            });
            atualizarResumo();
        } catch (erro) {
            select.value = anterior;
            mostrarErro(erro, "Não foi possível atualizar");
        } finally {
            select.disabled = false;
        }
    });

    document.querySelectorAll("[data-filtro-status]").forEach(botao => {
        botao.addEventListener("click", () => {
            filtroStatus.value = filtroStatus.value === botao.dataset.filtroStatus ? "" : botao.dataset.filtroStatus;
            document.querySelectorAll("[data-filtro-status]").forEach(b =>
                b.classList.toggle("active", b.dataset.filtroStatus === filtroStatus.value));
            carregar();
        });
    });

    let espera;
    busca.addEventListener("input", () => {
        clearTimeout(espera);
        espera = setTimeout(carregar, 300);
    });
    [filtroStatus, filtroRegiao, ordenar].forEach(campo => campo.addEventListener("change", () => carregar()));
    botaoMais.addEventListener("click", () => carregar({ acumular: true }));

    atualizarResumo();
    carregar();
});

/* =========================================================
   PERFIL.JS
   Dados do usuário, números de participação, conquistas
   (gamificação) e a lista de demandas que ele registrou.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const sessao = await api.sessao();
    if (!sessao.logado) {
        document.getElementById("perfilBloqueado").hidden = false;
        return;
    }
    document.getElementById("perfilConteudo").hidden = false;

    const minhas = document.getElementById("minhasDemandas");
    minhas.innerHTML = esqueletoCards(3);

    try {
        const [perfil, demandas] = await Promise.all([
            api.perfil(),
            api.listarDemandas({ minhas: true, tamanho: 50 })
        ]);

        const u = perfil.usuario;
        document.getElementById("perfilIniciais").textContent =
            u.nome.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
        document.getElementById("perfilNome").textContent = u.nome;
        document.getElementById("perfilEmail").textContent = u.email;
        document.getElementById("perfilTipo").textContent = u.perfil === "ADMIN" ? "Administrador" : "Cidadão";
        document.getElementById("perfilDesde").textContent =
            `Participando desde ${new Date(u.criadoEm).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;

        document.querySelectorAll("[data-perfil]").forEach(el => animarNumero(el, perfil[el.dataset.perfil] || 0));

        document.getElementById("perfilConquistas").innerHTML = perfil.conquistas.map(c => `
            <div class="card badge-card ${c.conquistada ? "conquistada" : ""}">
                <div class="badge-icon"><i class="fa-solid ${escaparHtml(c.icone)}"></i></div>
                <div>
                    <strong>${escaparHtml(c.nome)}</strong>
                    <p>${escaparHtml(c.descricao)}</p>
                    <div class="badge-progress" role="progressbar" aria-valuemin="0"
                         aria-valuemax="${c.meta}" aria-valuenow="${c.progresso}"
                         aria-label="Progresso: ${c.progresso} de ${c.meta}">
                        <span style="width:${Math.round(c.progresso / c.meta * 100)}%"></span>
                    </div>
                    <small>${c.conquistada ? "Conquistada!" : `${c.progresso} de ${c.meta}`}</small>
                </div>
            </div>
        `).join("");

        minhas.innerHTML = demandas.itens.length
            ? demandas.itens.map(d => cardDemandaHtml(d, { comApoio: false })).join("")
            : `<div class="empty-state">
                   <h3>Você ainda não registrou nenhuma demanda.</h3>
                   <p><a href="nova-demanda.html" class="btn btn-primary">Registrar minha primeira demanda</a></p>
               </div>`;
        observarAnimacoes(minhas);
    } catch (erro) {
        mostrarErro(erro, "Não foi possível carregar o perfil");
    }
});

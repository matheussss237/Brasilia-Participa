/* =========================================================
   DEMANDA.JS
   ---------------------------------------------------------
   Página de detalhe (demanda.html?id=...):
   - dados completos, foto e mini mapa;
   - botão de apoiar e de copiar o link;
   - LINHA DO TEMPO com cada mudança de status;
   - comentários (resposta do governo aparece destacada);
   - painel do administrador para mudar o status.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const raiz = document.getElementById("detalheDemanda");
    const id = parametroUrl("id");

    if (!id) {
        mostrarNaoEncontrada();
        return;
    }

    ativarBotoesDeApoio(raiz);

    const [sessao, referencias] = await Promise.all([api.sessao(), api.referencias().catch(() => null)]);
    const usuario = sessao.usuario;
    const ehAdmin = usuario && usuario.perfil === "ADMIN";

    await carregar();

    async function carregar() {
        try {
            const detalhe = await api.buscarDemanda(id);
            desenhar(detalhe);
        } catch (erro) {
            if (erro.status === 404) mostrarNaoEncontrada();
            else raiz.innerHTML = `<div class="card empty-state"><h3>Não foi possível carregar.</h3><p>${escaparHtml(erro.message)}</p></div>`;
        }
    }

    function mostrarNaoEncontrada() {
        raiz.innerHTML = `
            <div class="card empty-state">
                <h3>Demanda não encontrada.</h3>
                <p>Ela pode ter sido removida. <a href="demandas.html">Ver todas as demandas</a>.</p>
            </div>`;
    }

    function desenhar({ demanda, historico, comentarios }) {
        document.title = `${demanda.titulo} | Brasília Participa`;

        raiz.innerHTML = `
            <div class="detail-layout">

                <article class="card detail-main">
                    ${fotoDemandaHtml(demanda)}

                    <div class="detail-body">
                        <div class="detail-tags">
                            ${badgeStatus(demanda)}
                            <span class="chip" style="--cor-categoria:${corDaCategoria(demanda.categoria)}">
                                <i class="fa-solid ${iconeDaCategoria(demanda.categoria)}"></i> ${escaparHtml(demanda.categoria)}
                            </span>
                        </div>

                        <h1 class="detail-title">${escaparHtml(demanda.titulo)}</h1>

                        <ul class="detail-meta">
                            <li><i class="fa-solid fa-map-pin"></i> ${escaparHtml(demanda.regiao)}</li>
                            <li><i class="fa-solid fa-location-dot"></i> ${escaparHtml(demanda.endereco)}</li>
                            <li><i class="fa-solid fa-user"></i> ${escaparHtml(demanda.autorNome)}</li>
                            <li><i class="fa-regular fa-calendar"></i> ${dataHora(demanda.criadaEm)}</li>
                        </ul>

                        <p class="detail-description">${escaparHtml(demanda.descricao)}</p>

                        <div class="detail-actions">
                            ${botaoApoioHtml(demanda).replace("icon-btn vote-button", "btn btn-secondary vote-button vote-button-lg")}
                            <span class="detail-support-text">pessoas apoiam esta demanda</span>
                            <button type="button" class="btn btn-secondary" id="copiarLink">
                                <i class="fa-solid fa-link"></i> Copiar link
                            </button>
                        </div>

                        <div id="miniMapa" class="mini-map" aria-label="Localização no mapa"></div>
                    </div>
                </article>

                <aside class="detail-side">

                    ${ehAdmin ? painelAdminHtml(demanda) : ""}

                    <section class="card side-card">
                        <h2><i class="fa-solid fa-timeline"></i> Andamento</h2>
                        <ol class="timeline">
                            ${historico.slice().reverse().map(h => `
                                <li class="timeline-item" style="--cor-status:${corDoStatus(h.status)}">
                                    <span class="timeline-dot"><i class="fa-solid ${iconeDoStatus(h.status)}"></i></span>
                                    <div>
                                        <strong>${escaparHtml(h.statusTexto)}</strong>
                                        <p>${escaparHtml(h.observacao)}</p>
                                        <small>${escaparHtml(h.responsavel)} · ${dataHora(h.data)}</small>
                                    </div>
                                </li>
                            `).join("")}
                        </ol>
                    </section>

                </aside>

            </div>

            <section class="card comments-card">
                <h2><i class="fa-regular fa-comments"></i> Comentários (${comentarios.length})</h2>

                <ul class="comments-list">
                    ${comentarios.length ? comentarios.map(comentarioHtml).join("") :
                        `<li class="comments-empty">Ninguém comentou ainda. Conte se o problema continua ou se algo mudou.</li>`}
                </ul>

                ${usuario ? `
                    <form id="comentarioForm" class="comment-form">
                        <div class="form-group">
                            <label for="texto">${ehAdmin ? "Responder como Governo de Brasília" : "Deixe seu comentário"}</label>
                            <textarea id="texto" class="form-control" rows="3" maxlength="1000" required
                                      placeholder="${ehAdmin ? "Ex.: Equipe agendada para quinta-feira." : "Ex.: O problema continua, passei lá hoje."}"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Comentar</button>
                    </form>
                ` : `
                    <p class="comments-login"><a href="login.html?voltar=${encodeURIComponent("demanda.html?id=" + demanda.id)}">Entre</a> para comentar.</p>
                `}
            </section>
        `;

        montarMiniMapa(demanda);
        ligarEventos(demanda);
    }

    function comentarioHtml(c) {
        return `
            <li class="comment ${c.oficial ? "comment-oficial" : ""}">
                <div class="comment-avatar">${c.oficial ? `<i class="fa-solid fa-landmark"></i>` : escaparHtml(c.autorNome.charAt(0).toUpperCase())}</div>
                <div>
                    <div class="comment-head">
                        <strong>${escaparHtml(c.autorNome)}</strong>
                        ${c.oficial ? `<span class="badge badge-info">Resposta oficial</span>` : ""}
                        <small>${dataHora(c.data)}</small>
                    </div>
                    <p>${escaparHtml(c.texto)}</p>
                </div>
            </li>`;
    }

    function painelAdminHtml(demanda) {
        const opcoes = (referencias ? referencias.status : [])
            .map(s => `<option value="${s.codigo}" ${s.codigo === demanda.status ? "selected" : ""}>${escaparHtml(s.texto)}</option>`)
            .join("");
        return `
            <section class="card side-card admin-card">
                <h2><i class="fa-solid fa-user-shield"></i> Gestão da demanda</h2>
                <form id="statusForm">
                    <div class="form-group">
                        <label for="novoStatus">Novo status</label>
                        <select id="novoStatus" class="form-control">${opcoes}</select>
                    </div>
                    <div class="form-group">
                        <label for="observacao">Observação para o cidadão</label>
                        <textarea id="observacao" class="form-control" rows="3" maxlength="500"
                                  placeholder="Ex.: Equipe de manutenção enviada ao local."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block"><i class="fa-solid fa-floppy-disk"></i> Atualizar status</button>
                </form>
                <button type="button" id="excluirDemanda" class="btn btn-danger-outline btn-block">
                    <i class="fa-solid fa-trash"></i> Excluir demanda
                </button>
            </section>`;
    }

    function montarMiniMapa(demanda) {
        if (typeof L === "undefined") return;
        const mini = L.map("miniMapa", { scrollWheelZoom: false }).setView([demanda.latitude, demanda.longitude], 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
        }).addTo(mini);
        L.marker([demanda.latitude, demanda.longitude], {
            icon: L.divIcon({
                className: "",
                html: `<div class="leaflet-pin" style="background:${corDoStatus(demanda.status)}"><i class="fa-solid ${iconeDaDemanda(demanda)}"></i></div>`,
                iconSize: [34, 34], iconAnchor: [17, 32]
            })
        }).addTo(mini);
        setTimeout(() => mini.invalidateSize(), 200);
    }

    function ligarEventos(demanda) {

        document.getElementById("copiarLink")?.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(location.href);
                mostrarNotificacao({ titulo: "Link copiado!", mensagem: "Compartilhe com seus vizinhos para ganhar mais apoio.", tipo: "sucesso", duracao: 3000 });
            } catch {
                mostrarNotificacao({ titulo: "Copie o link da barra de endereço", tipo: "info", duracao: 3000 });
            }
        });

        const comentarioForm = document.getElementById("comentarioForm");
        comentarioForm?.addEventListener("submit", async evento => {
            evento.preventDefault();
            const texto = document.getElementById("texto").value.trim();
            if (!texto) return;
            try {
                await comCarregamento(comentarioForm.querySelector("button"), api.comentar(demanda.id, texto));
                await carregar();
                document.querySelector(".comments-list .comment:last-child")?.scrollIntoView({ behavior: "smooth", block: "center" });
            } catch (erro) {
                mostrarErro(erro, "Não foi possível comentar");
            }
        });

        const statusForm = document.getElementById("statusForm");
        statusForm?.addEventListener("submit", async evento => {
            evento.preventDefault();
            const status = document.getElementById("novoStatus").value;
            const observacao = document.getElementById("observacao").value.trim();
            try {
                await comCarregamento(statusForm.querySelector("button"), api.alterarStatus(demanda.id, status, observacao));
                mostrarNotificacao({ titulo: "Status atualizado", mensagem: "A mudança já aparece na linha do tempo.", tipo: "sucesso", duracao: 4000 });
                await carregar();
            } catch (erro) {
                mostrarErro(erro, "Não foi possível atualizar");
            }
        });

        document.getElementById("excluirDemanda")?.addEventListener("click", () => {
            mostrarNotificacao({
                titulo: "Excluir esta demanda?",
                mensagem: "Essa ação não pode ser desfeita. Use apenas para spam ou registros duplicados.",
                tipo: "erro",
                duracao: 0,
                acoes: [
                    {
                        label: "Sim, excluir", primario: true, onClick: async () => {
                            try {
                                await api.excluirDemanda(demanda.id);
                                location.href = "admin.html";
                            } catch (erro) {
                                mostrarErro(erro, "Não foi possível excluir");
                            }
                        }
                    },
                    { label: "Cancelar" }
                ]
            });
        });
    }
});

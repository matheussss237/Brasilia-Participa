/* =========================================================
   COMPONENTES — peças de interface reutilizadas pelas páginas:
   badges, card de demanda, botão de apoio, modal de detalhes,
   notificações (toast), estados vazios e contadores animados.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    const { escapar, formatarNumero, formatarData, tempoRelativo } = BP.util;
    const D = BP.dominio;

    const reduzirMovimento = () => root.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------------- Peças pequenas ---------------- */

    function badgeStatus(idStatus) {
        const s = D.status(idStatus);
        return `<span class="badge badge--${s.tom}"><i class="fa-solid ${s.icone}" aria-hidden="true"></i>${escapar(s.nome)}</span>`;
    }

    function chipCategoria(idCategoria) {
        const c = D.categoria(idCategoria);
        return `<span class="chip-categoria" style="--cor-categoria:${c.cor}"><i class="fa-solid ${c.icone}" aria-hidden="true"></i>${escapar(c.nome)}</span>`;
    }

    /* Capa: placeholder colorido com o ícone da demanda; se houver foto,
       ela fica por cima (e é removida se falhar ao carregar). */
    function capa(demanda, classe = "") {
        const cor = D.categoria(demanda.categoria).cor;
        const foto = demanda.foto
            ? `<img src="${escapar(demanda.foto)}" alt="Foto enviada: ${escapar(demanda.titulo)}" loading="lazy" data-foto-demanda>`
            : "";
        return `
            <div class="capa ${classe}" style="--cor-categoria:${cor}">
                <i class="fa-solid ${D.iconeDaDemanda(demanda)} capa__icone" aria-hidden="true"></i>
                ${foto}
            </div>`;
    }

    document.addEventListener(
        "error",
        (e) => {
            if (e.target instanceof HTMLImageElement && e.target.hasAttribute("data-foto-demanda")) e.target.remove();
        },
        true
    );

    function botaoApoio(demanda, apoiada, classe = "") {
        return `
            <button type="button" class="apoio ${classe}${apoiada ? " apoio--ativo" : ""}" data-apoiar="${escapar(demanda.id)}"
                    aria-pressed="${apoiada}" title="${apoiada ? "Retirar apoio" : "Apoiar esta causa"}">
                <i class="fa-solid fa-thumbs-up" aria-hidden="true"></i>
                <span class="apoio__qtd">${formatarNumero(demanda.apoios)}</span>
                <span class="sr-only"> apoios. ${apoiada ? "Você apoia esta causa." : "Apoiar esta causa."}</span>
            </button>`;
    }

    /* ---------------- Card de demanda ---------------- */

    function cardDemanda(demanda, apoiadas = new Set()) {
        const regiao = D.regiao(demanda.regiao).nome;
        return `
            <article class="card card-demanda" data-id="${escapar(demanda.id)}">
                ${capa(demanda)}
                <div class="card-demanda__corpo">
                    <div class="card-demanda__topo">
                        ${chipCategoria(demanda.categoria)}
                        ${badgeStatus(demanda.status)}
                    </div>
                    <h3 class="card-demanda__titulo">
                        <button type="button" class="link-esticado" data-detalhe="${escapar(demanda.id)}">${escapar(demanda.titulo)}</button>
                    </h3>
                    <p class="card-demanda__descricao">${escapar(demanda.descricao)}</p>
                    <div class="card-demanda__rodape">
                        <span class="meta"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapar(regiao)}</span>
                        <span class="meta"><time datetime="${escapar(demanda.data)}">${tempoRelativo(demanda.data)}</time></span>
                        ${botaoApoio(demanda, apoiadas.has(demanda.id))}
                    </div>
                </div>
            </article>`;
    }

    function cardsCarregando(qtd = 6) {
        return Array.from(
            { length: qtd },
            () => `
            <div class="card card-demanda card-demanda--carregando" aria-hidden="true">
                <div class="capa esqueleto"></div>
                <div class="card-demanda__corpo">
                    <div class="esqueleto esqueleto--linha" style="width:40%"></div>
                    <div class="esqueleto esqueleto--linha" style="width:85%"></div>
                    <div class="esqueleto esqueleto--linha" style="width:70%"></div>
                </div>
            </div>`
        ).join("");
    }

    function estado({ icone = "fa-circle-info", titulo, mensagem = "", acao = "" }) {
        return `
            <div class="estado" role="status">
                <span class="estado__icone" aria-hidden="true"><i class="fa-solid ${icone}"></i></span>
                <h3>${escapar(titulo)}</h3>
                ${mensagem ? `<p>${escapar(mensagem)}</p>` : ""}
                ${acao}
            </div>`;
    }

    /* ---------------- Notificações (toast) ---------------- */

    function toast({ titulo, mensagem = "", tipo = "sucesso", acoes = [], duracao = 7000 }) {
        let area = document.getElementById("areaToasts");
        if (!area) {
            area = document.createElement("div");
            area.id = "areaToasts";
            area.className = "toasts";
            area.setAttribute("aria-live", "polite");
            document.body.appendChild(area);
        }

        const icones = { sucesso: "fa-circle-check", erro: "fa-circle-exclamation", info: "fa-circle-info" };
        const el = document.createElement("div");
        el.className = `toast toast--${tipo}`;
        el.setAttribute("role", tipo === "erro" ? "alert" : "status");
        el.innerHTML = `
            <i class="fa-solid ${icones[tipo] || icones.info} toast__icone" aria-hidden="true"></i>
            <div class="toast__texto">
                <strong>${escapar(titulo)}</strong>
                ${mensagem ? `<p>${escapar(mensagem)}</p>` : ""}
                ${acoes.length ? `<div class="toast__acoes">${acoes.map((a, i) => `<button type="button" class="btn btn--sm ${a.primario ? "btn--primario" : "btn--secundario"}" data-acao="${i}">${escapar(a.rotulo)}</button>`).join("")}</div>` : ""}
            </div>
            <button type="button" class="icone-btn icone-btn--sm toast__fechar" aria-label="Fechar notificação"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;

        const fechar = () => {
            el.classList.add("toast--saindo");
            setTimeout(() => el.remove(), 200);
        };
        el.querySelector(".toast__fechar").addEventListener("click", fechar);
        el.querySelectorAll("[data-acao]").forEach((b) =>
            b.addEventListener("click", () => {
                fechar();
                const acao = acoes[Number(b.dataset.acao)];
                if (acao && acao.aoClicar) acao.aoClicar();
            })
        );
        area.appendChild(el);
        if (duracao) setTimeout(fechar, duracao);
        return { fechar };
    }

    function erroGenerico(erro) {
        const cota = erro && erro.name === "ErroCota";
        toast({
            tipo: "erro",
            titulo: cota ? "Sem espaço no navegador" : "Algo deu errado",
            mensagem: cota ? "Tente usar uma foto menor ou limpar os dados do site." : (erro && erro.message) || "Tente novamente."
        });
    }

    /* ---------------- Apoio (upvote) ---------------- */

    /* Atualiza todos os botões de apoio da mesma demanda na página
       (card, modal, painel do mapa...) quando um deles é clicado. */
    root.addEventListener("bp:mudanca", (e) => {
        if (e.detail.tipo !== "apoio") return;
        document.querySelectorAll(`[data-apoiar="${CSS.escape(e.detail.id)}"]`).forEach((b) => {
            b.classList.toggle("apoio--ativo", e.detail.apoiada);
            b.setAttribute("aria-pressed", String(e.detail.apoiada));
            b.title = e.detail.apoiada ? "Retirar apoio" : "Apoiar esta causa";
            b.querySelector(".apoio__qtd").textContent = formatarNumero(e.detail.apoios);
            b.querySelector(".sr-only").textContent = ` apoios. ${e.detail.apoiada ? "Você apoia esta causa." : "Apoiar esta causa."}`;
        });
    });

    document.addEventListener("click", async (e) => {
        const botao = e.target.closest("[data-apoiar]");
        if (!botao || botao.disabled) return;
        botao.disabled = true;
        try {
            const { apoiada } = await BP.api.demandas.alternarApoio(botao.dataset.apoiar);
            if (apoiada && !reduzirMovimento()) {
                botao.classList.remove("apoio--pulsar");
                void botao.offsetWidth;
                botao.classList.add("apoio--pulsar");
            }
        } catch (erro) {
            erroGenerico(erro);
        } finally {
            botao.disabled = false;
        }
    });

    /* ---------------- Modal de detalhes ---------------- */

    let dialogo;

    function garantirDialogo() {
        if (dialogo) return dialogo;
        dialogo = document.createElement("dialog");
        dialogo.className = "modal";
        dialogo.setAttribute("aria-labelledby", "modalTitulo");
        document.body.appendChild(dialogo);
        dialogo.addEventListener("click", (e) => {
            if (e.target === dialogo || e.target.closest("[data-fechar-modal]")) dialogo.close();
        });
        dialogo.addEventListener("close", () => {
            const url = new URL(location.href);
            if (url.searchParams.has("id") && document.body.dataset.pagina === "demandas") {
                url.searchParams.delete("id");
                history.replaceState(null, "", url);
            }
        });
        return dialogo;
    }

    function htmlDetalhe(d, apoiada) {
        const regiao = D.regiao(d.regiao).nome;
        return `
            <div class="modal__caixa">
                <button type="button" class="icone-btn modal__fechar" data-fechar-modal aria-label="Fechar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
                ${capa(d, "capa--grande")}
                <div class="modal__corpo">
                    <div class="card-demanda__topo">${chipCategoria(d.categoria)}${badgeStatus(d.status)}</div>
                    <h2 id="modalTitulo">${escapar(d.titulo)}</h2>
                    <p class="modal__descricao">${escapar(d.descricao)}</p>
                    <dl class="detalhes">
                        <div><dt><i class="fa-solid fa-map-pin" aria-hidden="true"></i>Região</dt><dd>${escapar(regiao)}</dd></div>
                        <div><dt><i class="fa-solid fa-location-dot" aria-hidden="true"></i>Local</dt><dd>${escapar(d.localizacao || "—")}</dd></div>
                        <div><dt><i class="fa-regular fa-calendar" aria-hidden="true"></i>Registrada em</dt><dd>${formatarData(d.data)} (${tempoRelativo(d.data).toLowerCase()})</dd></div>
                    </dl>
                    ${linhaDoTempo(d.status)}
                    <div class="modal__acoes">
                        ${botaoApoio(d, apoiada, "apoio--grande")}
                        <a class="btn btn--secundario" href="mapa.html?id=${encodeURIComponent(d.id)}"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>Ver no mapa</a>
                    </div>
                </div>
            </div>`;
    }

    /* Andamento: Recebida → Em análise → Resolvida ("Pendente" aparece
       como um alerta sobre a etapa de análise). */
    function linhaDoTempo(idStatus) {
        const etapas = ["recebida", "em-analise", "resolvida"];
        const posicao = idStatus === "pendente" ? 1 : Math.max(0, etapas.indexOf(idStatus));
        const itens = etapas
            .map((id, i) => {
                const s = D.status(id);
                const estadoEtapa = i < posicao ? "feita" : i === posicao ? "atual" : "futura";
                const nome = i === 1 && idStatus === "pendente" ? "Pendente" : s.nome;
                return `<li class="etapa etapa--${estadoEtapa}${i === 1 && idStatus === "pendente" ? " etapa--alerta" : ""}"><span class="etapa__ponto" aria-hidden="true"></span>${nome}</li>`;
            })
            .join("");
        return `<div class="andamento"><h3 class="andamento__titulo">Andamento</h3><ol class="etapas">${itens}</ol></div>`;
    }

    async function abrirDetalhe(id) {
        const caixa = garantirDialogo();
        try {
            const [demanda, apoiadas] = await Promise.all([BP.api.demandas.obter(id), BP.api.demandas.apoiadas()]);
            if (!demanda) {
                toast({ tipo: "erro", titulo: "Demanda não encontrada", mensagem: "Ela pode ter sido removida." });
                return;
            }
            caixa.innerHTML = htmlDetalhe(demanda, apoiadas.has(id));
            if (!caixa.open) caixa.showModal();
            caixa.querySelector(".modal__fechar").focus();
        } catch (erro) {
            erroGenerico(erro);
        }
    }

    document.addEventListener("click", (e) => {
        const gatilho = e.target.closest("[data-detalhe]");
        if (gatilho) abrirDetalhe(gatilho.dataset.detalhe);
    });

    /* ---------------- Contadores animados ---------------- */

    function animarContadores(escopo = document) {
        escopo.querySelectorAll("[data-contador]").forEach((el) => {
            const alvo = Number(el.dataset.contador) || 0;
            const sufixo = el.dataset.sufixo || "";
            if (reduzirMovimento() || alvo === 0) {
                el.textContent = formatarNumero(alvo) + sufixo;
                return;
            }
            const inicio = performance.now();
            const duracao = 900;
            const passo = (agora) => {
                const t = Math.min(1, (agora - inicio) / duracao);
                const suave = 1 - Math.pow(1 - t, 3);
                el.textContent = formatarNumero(Math.round(alvo * suave)) + sufixo;
                if (t < 1) requestAnimationFrame(passo);
            };
            requestAnimationFrame(passo);
        });
    }

    BP.ui = {
        badgeStatus,
        chipCategoria,
        capa,
        botaoApoio,
        cardDemanda,
        cardsCarregando,
        estado,
        toast,
        erroGenerico,
        abrirDetalhe,
        animarContadores,
        reduzirMovimento
    };
})(window);

/* =========================================================
   TOAST.JS
   ---------------------------------------------------------
   Notificação própria do sistema, para substituir os
   alert()/confirm() nativos do navegador (que fogem
   completamente da identidade visual do site).

   Uso:

   mostrarNotificacao({
       titulo: "Demanda registrada!",
       mensagem: "Ela já aparece na lista e no mapa.",
       tipo: "sucesso",              // "sucesso" | "erro" | "info"
       acoes: [
           { label: "Ver no mapa", primario: true, onClick: () => {...} },
           { label: "Ver na lista", onClick: () => {...} }
       ]
   });
========================================================= */

function mostrarNotificacao(opcoes) {

    let wrap = document.getElementById("toastWrap");

    if (!wrap) {
        wrap = document.createElement("div");
        wrap.id = "toastWrap";
        wrap.className = "toast-wrap";
        document.body.appendChild(wrap);
    }

    const icones = {
        sucesso: "fa-check",
        erro: "fa-circle-exclamation",
        info: "fa-circle-info"
    };

    const cores = {
        sucesso: "var(--success)",
        erro: "var(--danger)",
        info: "var(--primary)"
    };

    const tipo = opcoes.tipo || "sucesso";

    const toast = document.createElement("div");
    toast.className = "toast";

    const acoesHtml = (opcoes.acoes || []).map((acao, indice) => `
        <button type="button" class="btn ${acao.primario ? "btn-primary" : "btn-secondary"}" data-toast-acao="${indice}">
            ${acao.label}
        </button>
    `).join("");

    toast.innerHTML = `
        <div class="toast-header">
            <span class="toast-icon" style="background:${cores[tipo]}">
                <i class="fa-solid ${icones[tipo]}"></i>
            </span>
            <span class="toast-title">${opcoes.titulo || ""}</span>
            <button type="button" class="toast-close" aria-label="Fechar notificação">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        ${opcoes.mensagem ? `<p class="toast-message">${opcoes.mensagem}</p>` : ""}
        ${acoesHtml ? `<div class="toast-actions">${acoesHtml}</div>` : ""}
    `;

    wrap.appendChild(toast);

    function remover() {
        toast.classList.add("closing");
        setTimeout(() => toast.remove(), 200);
    }

    toast.querySelector(".toast-close").addEventListener("click", remover);

    (opcoes.acoes || []).forEach((acao, indice) => {
        const botao = toast.querySelector(`[data-toast-acao="${indice}"]`);
        botao.addEventListener("click", () => {
            remover();
            if (typeof acao.onClick === "function") acao.onClick();
        });
    });

    if (opcoes.duracao !== 0) {
        setTimeout(remover, opcoes.duracao || 7000);
    }

    return { remover };
}

/* =========================================================
   UI.JS
   ---------------------------------------------------------
   Funções de apresentação usadas por várias páginas:
   ícones, cores, badges de status, datas, cards e
   proteção contra HTML malicioso (escaparHtml).
========================================================= */

/* IMPORTANTE: todo texto digitado por usuários (título,
   descrição, comentário, nome...) passa por aqui antes de
   ir para o innerHTML. Sem isso, alguém poderia cadastrar
   uma demanda com <script> no título (ataque XSS). */
function escaparHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const ICONE_POR_CATEGORIA = {
    "Infraestrutura": "fa-road",
    "Iluminação": "fa-lightbulb",
    "Limpeza": "fa-trash",
    "Segurança": "fa-shield",
    "Transporte": "fa-bus",
    "Meio ambiente": "fa-tree",
    "Educação": "fa-school",
    "Saúde": "fa-briefcase-medical",
    "Acessibilidade": "fa-wheelchair"
};

const COR_POR_CATEGORIA = {
    "Infraestrutura": "#8a5a2b",
    "Iluminação": "#b58900",
    "Limpeza": "#2f7d4f",
    "Segurança": "#1351b4",
    "Transporte": "#6b46c1",
    "Meio ambiente": "#15803d",
    "Educação": "#b45309",
    "Saúde": "#dc2626",
    "Acessibilidade": "#0891b2"
};

/* Ícone mais específico que a categoria, por palavra-chave do texto. */
const ICONES_ESPECIFICOS = [
    { termos: /camera/, icone: "fa-video" },
    { termos: /policia/, icone: "fa-shield-halved" },
    { termos: /buraco|cratera|asfalto/, icone: "fa-road-circle-exclamation" },
    { termos: /poste|iluminac|lampada|escur/, icone: "fa-lightbulb" },
    { termos: /reciclave|reciclagem|seletiva/, icone: "fa-recycle" },
    { termos: /lixo|entulho|coleta/, icone: "fa-trash" },
    { termos: /esgoto|vazamento|tubulac|alagamento/, icone: "fa-droplet" },
    { termos: /arvore|praca|parquinho|brinquedo|mato alto/, icone: "fa-tree" },
    { termos: /escola|professor/, icone: "fa-school" },
    { termos: /saude|medico|plantao|ubs/, icone: "fa-briefcase-medical" },
    { termos: /semaforo|sinalizac|faixa de pedestre/, icone: "fa-traffic-light" },
    { termos: /onibus/, icone: "fa-bus" },
    { termos: /ciclovia|ciclista|bicicleta/, icone: "fa-bicycle" },
    { termos: /calcada|rampa|cadeirante|acessibilidade/, icone: "fa-wheelchair" }
];

/* Status vem da API como código (RECEBIDA, EM_ANALISE...). */
const STATUS_VISUAL = {
    RECEBIDA:   { classe: "badge-info",    cor: "#1351b4", icone: "fa-inbox" },
    EM_ANALISE: { classe: "badge-warning", cor: "#ad7000", icone: "fa-magnifying-glass" },
    PENDENTE:   { classe: "badge-danger",  cor: "#e52207", icone: "fa-hourglass-half" },
    RESOLVIDA:  { classe: "badge-success", cor: "#168821", icone: "fa-circle-check" }
};

function iconeDaCategoria(categoria) {
    return ICONE_POR_CATEGORIA[categoria] || "fa-circle-exclamation";
}

function corDaCategoria(categoria) {
    return COR_POR_CATEGORIA[categoria] || "#5d5d5d";
}

function iconeDaDemanda(demanda) {
    const texto = `${demanda.titulo || ""} ${demanda.descricao || ""}`
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
    const encontrado = ICONES_ESPECIFICOS.find(item => item.termos.test(texto));
    return encontrado ? encontrado.icone : iconeDaCategoria(demanda.categoria);
}

function classeDoStatus(status) {
    return (STATUS_VISUAL[status] || STATUS_VISUAL.RECEBIDA).classe;
}

function corDoStatus(status) {
    return (STATUS_VISUAL[status] || STATUS_VISUAL.RECEBIDA).cor;
}

function iconeDoStatus(status) {
    return (STATUS_VISUAL[status] || STATUS_VISUAL.RECEBIDA).icone;
}

function badgeStatus(demanda) {
    return `<span class="badge ${classeDoStatus(demanda.status)}">${escaparHtml(demanda.statusTexto)}</span>`;
}

/* "Hoje", "Há 1 dia", "Há 12 dias"... a partir de uma data ISO. */
function tempoRelativo(dataIso) {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const inicioHoje = new Date().setHours(0, 0, 0, 0);
    const inicioData = new Date(data).setHours(0, 0, 0, 0);
    const dias = Math.round((inicioHoje - inicioData) / 86400000);
    if (dias <= 0) return "Hoje";
    if (dias === 1) return "Ontem";
    if (dias < 30) return `Há ${dias} dias`;
    const meses = Math.floor(dias / 30);
    return meses === 1 ? "Há 1 mês" : `Há ${meses} meses`;
}

function dataHora(dataIso) {
    if (!dataIso) return "";
    return new Date(dataIso).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
}

/* Capa do card: foto real ou um "placeholder" colorido com o ícone. */
function fotoDemandaHtml(demanda) {
    if (demanda.fotoUrl) {
        return `<div class="demand-photo"><img src="${escaparHtml(demanda.fotoUrl)}" alt="Foto: ${escaparHtml(demanda.titulo)}" loading="lazy" onerror="this.closest('.demand-photo').classList.add('demand-photo-erro')"></div>`;
    }
    return `
        <div class="demand-photo demand-photo-placeholder" style="--cor-categoria: ${corDaCategoria(demanda.categoria)};" aria-hidden="true">
            <i class="fa-solid ${iconeDaDemanda(demanda)}"></i>
        </div>
    `;
}

function linkDemanda(demanda) {
    return `demanda.html?id=${encodeURIComponent(demanda.id)}`;
}

/* Card padrão de demanda (home, lista e perfil). */
function cardDemandaHtml(demanda, { comApoio = true } = {}) {
    return `
        <article class="card demand-card slide-up" data-demand-id="${escaparHtml(demanda.id)}">
            <a href="${linkDemanda(demanda)}" class="demand-link" aria-label="Ver detalhes: ${escaparHtml(demanda.titulo)}"></a>
            ${fotoDemandaHtml(demanda)}
            <div class="demand-header">
                <i class="fa-solid ${iconeDaDemanda(demanda)}"></i>
                ${badgeStatus(demanda)}
            </div>
            <h3>${escaparHtml(demanda.titulo)}</h3>
            <p>${escaparHtml(demanda.descricao)}</p>
            <div class="demand-footer">
                <span><i class="fa-solid fa-location-dot"></i> ${escaparHtml(demanda.regiao)}</span>
                <span class="demand-footer-right">
                    <span class="demand-meta" title="Comentários"><i class="fa-regular fa-comment"></i> ${demanda.totalComentarios}</span>
                    ${comApoio ? botaoApoioHtml(demanda) : `<span class="demand-meta">${tempoRelativo(demanda.criadaEm)}</span>`}
                </span>
            </div>
        </article>
    `;
}

function botaoApoioHtml(demanda) {
    const apoiou = demanda.apoiadaPorMim;
    return `
        <button class="icon-btn vote-button ${apoiou ? "voted" : ""}" type="button"
                data-apoiar="${escaparHtml(demanda.id)}" aria-pressed="${apoiou}"
                title="${apoiou ? "Remover apoio" : "Apoiar demanda"}">
            <i class="fa-solid fa-thumbs-up"></i>
            <span class="vote-count">${demanda.totalApoios}</span>
        </button>
    `;
}

/* Liga todos os botões [data-apoiar] dentro de um container.
   Usa "delegação de eventos": um único listener no container. */
function ativarBotoesDeApoio(container) {
    if (!container || container.dataset.apoioAtivo) return;
    container.dataset.apoioAtivo = "true";

    container.addEventListener("click", async evento => {
        const botao = evento.target.closest("[data-apoiar]");
        if (!botao) return;
        evento.preventDefault();
        evento.stopPropagation();

        const sessao = await api.sessao();
        if (!sessao.logado) {
            pedirLogin("Entre na sua conta para apoiar demandas.");
            return;
        }

        botao.disabled = true;
        try {
            const resultado = await api.apoiar(botao.dataset.apoiar);
            botao.classList.toggle("voted", resultado.apoiada);
            botao.setAttribute("aria-pressed", resultado.apoiada);
            botao.title = resultado.apoiada ? "Remover apoio" : "Apoiar demanda";
            botao.querySelector(".vote-count").textContent = resultado.totalApoios;
        } catch (erro) {
            mostrarErro(erro);
        } finally {
            botao.disabled = false;
        }
    });
}

function pedirLogin(mensagem) {
    const voltar = encodeURIComponent(location.pathname.replace(/^\//, "") + location.search);
    mostrarNotificacao({
        titulo: "Faça login para continuar",
        mensagem,
        tipo: "info",
        acoes: [
            { label: "Entrar", primario: true, onClick: () => location.href = `login.html?voltar=${voltar}` },
            { label: "Criar conta", onClick: () => location.href = `cadastro.html?voltar=${voltar}` }
        ]
    });
}

function mostrarErro(erro, titulo = "Algo deu errado") {
    console.error(erro);
    if (erro && erro.status === 401) {
        pedirLogin(erro.message);
        return;
    }
    mostrarNotificacao({ titulo, mensagem: erro.message, tipo: "erro" });
}

/* Mostra as mensagens de validação da API embaixo de cada campo.
   mapaCampos: { nomeDoCampoNaApi: "idDoInputNoHtml" } */
function mostrarErrosDeCampo(formulario, campos, mapaCampos = {}) {
    limparErrosDeCampo(formulario);
    Object.entries(campos || {}).forEach(([campo, mensagem]) => {
        const input = formulario.querySelector(`#${mapaCampos[campo] || campo}`);
        if (!input) return;
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        const aviso = document.createElement("small");
        aviso.className = "field-error";
        aviso.textContent = mensagem;
        input.closest(".form-group")?.appendChild(aviso);
    });
    formulario.querySelector(".is-invalid")?.focus();
}

function limparErrosDeCampo(formulario) {
    formulario.querySelectorAll(".field-error").forEach(e => e.remove());
    formulario.querySelectorAll(".is-invalid").forEach(e => {
        e.classList.remove("is-invalid");
        e.removeAttribute("aria-invalid");
    });
}

/* Preenche um <select> mantendo a primeira opção ("Selecione"/"Todas"). */
function preencherSelect(select, opcoes) {
    if (!select) return;
    const primeira = select.querySelector("option");
    select.innerHTML = "";
    if (primeira) select.appendChild(primeira);
    opcoes.forEach(({ valor, texto }) => {
        const opcao = document.createElement("option");
        opcao.value = valor;
        opcao.textContent = texto;
        select.appendChild(opcao);
    });
}

/* Botão com estado "carregando" enquanto espera a API. */
function comCarregamento(botao, promessa) {
    const original = botao.innerHTML;
    botao.disabled = true;
    botao.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Aguarde...`;
    return promessa.finally(() => {
        botao.disabled = false;
        botao.innerHTML = original;
    });
}

/* Esqueleto de carregamento para grids de cards. */
function esqueletoCards(quantidade = 3) {
    return Array.from({ length: quantidade }, () => `
        <div class="card demand-card skeleton-card" aria-hidden="true">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line curta"></div>
        </div>
    `).join("");
}

/* Contador animado de 0 até o valor (respeita quem desativa animações). */
function animarNumero(elemento, valorFinal, { casas = 0, sufixo = "" } = {}) {
    if (!elemento) return;
    const formatar = v => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + sufixo;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elemento.textContent = formatar(valorFinal);
        return;
    }
    const duracao = 900;
    const inicio = performance.now();
    function passo(agora) {
        const progresso = Math.min(1, (agora - inicio) / duracao);
        const suavizado = 1 - Math.pow(1 - progresso, 3);
        elemento.textContent = formatar(valorFinal * suavizado);
        if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
}

/* Lê um parâmetro da URL: ?id=123 → parametroUrl("id") === "123" */
function parametroUrl(nome) {
    return new URLSearchParams(location.search).get(nome);
}

/* Destino seguro depois do login: só aceita páginas deste site. */
function destinoAposLogin(padrao = "index.html") {
    const voltar = parametroUrl("voltar");
    return voltar && /^[a-z-]+\.html(\?[\w=&%.-]*)?$/i.test(voltar) ? voltar : padrao;
}

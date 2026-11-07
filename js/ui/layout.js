/* =========================================================
   LAYOUT — cabeçalho, rodapé, tema e menu mobile.
   O cabeçalho e o rodapé são gerados aqui para não repetir
   o mesmo HTML em todas as páginas. Cada página informa em
   <body data-pagina="..."> qual item do menu fica ativo.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    const { escapar, iniciais, primeiroNome } = BP.util;

    const MENU = [
        { id: "inicio", rotulo: "Início", href: "index.html", icone: "fa-house" },
        { id: "demandas", rotulo: "Demandas", href: "demandas.html", icone: "fa-list-ul" },
        { id: "mapa", rotulo: "Mapa", href: "mapa.html", icone: "fa-map-location-dot" },
        { id: "dashboard", rotulo: "Dashboard", href: "dashboard.html", icone: "fa-chart-column" }
    ];

    function htmlCabecalho(pagina, usuario) {
        const links = MENU.map(
            (item) => `
            <a href="${item.href}" class="nav__link"${item.id === pagina ? ' aria-current="page"' : ""}>
                <i class="fa-solid ${item.icone}" aria-hidden="true"></i>${item.rotulo}
            </a>`
        ).join("");

        const conta = usuario
            ? `<a href="perfil.html" class="conta" title="Meu perfil"${pagina === "perfil" ? ' aria-current="page"' : ""}>
                   <span class="avatar avatar--sm" aria-hidden="true">${escapar(iniciais(usuario.nome))}</span>
                   <span class="conta__nome">${escapar(primeiroNome(usuario.nome))}</span>
               </a>`
            : `<a href="login.html" class="btn btn--ghost btn--sm">
                   <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>Entrar
               </a>`;

        return `
        <a class="pular-link" href="#conteudo">Pular para o conteúdo</a>
        <div class="gov-barra">
            <div class="container gov-barra__conteudo">
                <span><i class="fa-solid fa-landmark" aria-hidden="true"></i> Governo do Distrito Federal</span>
                <span class="gov-barra__extra">Portal de Participação Cidadã</span>
            </div>
        </div>
        <header class="cabecalho">
            <div class="container cabecalho__conteudo">
                <a href="index.html" class="marca" aria-label="Brasília Participa — página inicial">
                    <span class="marca__icone" aria-hidden="true"><i class="fa-solid fa-city"></i></span>
                    <span class="marca__nome">Brasília <strong>Participa</strong></span>
                </a>

                <button class="icone-btn menu-btn" type="button" aria-expanded="false" aria-controls="menuPrincipal" aria-label="Abrir menu">
                    <i class="fa-solid fa-bars" aria-hidden="true"></i>
                </button>

                <div class="menu" id="menuPrincipal">
                    <nav class="nav" aria-label="Navegação principal">${links}</nav>

                    <form class="busca-rapida" role="search" action="demandas.html" method="get">
                        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        <input type="search" name="q" placeholder="Pesquisar demandas" aria-label="Pesquisar demandas">
                    </form>

                    <div class="cabecalho__acoes">
                        <a href="nova-demanda.html" class="btn btn--primario btn--sm">
                            <i class="fa-solid fa-plus" aria-hidden="true"></i>Registrar
                        </a>
                        ${conta}
                        <button class="icone-btn" type="button" data-alternar-tema>
                            <i class="fa-solid fa-moon" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>`;
    }

    function htmlRodape() {
        return `
        <footer class="rodape">
            <div class="container rodape__conteudo">
                <div>
                    <a href="index.html" class="marca marca--rodape">
                        <span class="marca__icone" aria-hidden="true"><i class="fa-solid fa-city"></i></span>
                        <span class="marca__nome">Brasília <strong>Participa</strong></span>
                    </a>
                    <p>Participação cidadã para uma cidade melhor.</p>
                </div>
                <nav class="rodape__links" aria-label="Links do rodapé">
                    ${MENU.map((i) => `<a href="${i.href}">${i.rotulo}</a>`).join("")}
                    <a href="nova-demanda.html">Registrar demanda</a>
                </nav>
            </div>
            <div class="container rodape__base">
                <span>© ${new Date().getFullYear()} Brasília Participa · Projeto acadêmico UniCEPLAC</span>
                <span>Dados de demonstração armazenados apenas no seu navegador.</span>
            </div>
        </footer>`;
    }

    /* ---------------- Tema ---------------- */

    function temaAtual() {
        return document.documentElement.getAttribute("data-theme") === "dark" ? "escuro" : "claro";
    }

    function aplicarTema(tema) {
        document.documentElement.setAttribute("data-theme", tema === "escuro" ? "dark" : "light");
        document.querySelectorAll("[data-alternar-tema]").forEach((botao) => {
            const escuro = tema === "escuro";
            botao.querySelector("i").className = `fa-solid ${escuro ? "fa-sun" : "fa-moon"}`;
            botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
            botao.title = botao.getAttribute("aria-label");
        });
        root.dispatchEvent(new CustomEvent("bp:tema", { detail: { tema } }));
    }

    function ligarTema() {
        aplicarTema(temaAtual());
        document.addEventListener("click", (e) => {
            if (!e.target.closest("[data-alternar-tema]")) return;
            const novo = temaAtual() === "escuro" ? "claro" : "escuro";
            try {
                BP.storage.gravar("tema", novo);
            } catch (_) {
                /* ignora */
            }
            aplicarTema(novo);
        });
    }

    /* ---------------- Menu mobile ---------------- */

    function ligarMenu() {
        const botao = document.querySelector(".menu-btn");
        const menu = document.getElementById("menuPrincipal");
        if (!botao || !menu) return;

        const definir = (aberto) => {
            menu.classList.toggle("menu--aberto", aberto);
            botao.setAttribute("aria-expanded", String(aberto));
            botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
            botao.querySelector("i").className = `fa-solid ${aberto ? "fa-xmark" : "fa-bars"}`;
        };

        botao.addEventListener("click", () => definir(!menu.classList.contains("menu--aberto")));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("menu--aberto")) {
                definir(false);
                botao.focus();
            }
        });
        root.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && definir(false));
    }

    /* ---------------- Montagem ---------------- */

    async function montar() {
        const pagina = document.body.dataset.pagina || "";
        const usuario = await BP.api.auth.atual();

        document.body.insertAdjacentHTML("afterbegin", htmlCabecalho(pagina, usuario));
        if (document.body.dataset.rodape !== "nao") {
            document.body.insertAdjacentHTML("beforeend", htmlRodape());
        }

        const campoBusca = document.querySelector(".busca-rapida input");
        const termo = new URLSearchParams(location.search).get("q");
        if (campoBusca && termo && pagina === "demandas") campoBusca.value = termo;

        ligarTema();
        ligarMenu();
        return usuario;
    }

    /* Ao voltar pelo histórico (bfcache) os dados podem estar desatualizados. */
    root.addEventListener("pageshow", (e) => {
        if (e.persisted) location.reload();
    });

    /** Promise resolvida com o usuário logado (ou null) quando o layout estiver montado. */
    BP.pronto = new Promise((resolver) => {
        const iniciar = () => montar().then(resolver, () => resolver(null));
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
        else iniciar();
    });

    BP.layout = { temaAtual };
})(window);

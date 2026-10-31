/* =========================================================
   MAIN.JS
   Funcionalidades gerais, presentes em todas as páginas:
   tema, cabeçalho (login/perfil/admin), animações, menu
   mobile, home, login e cadastro.
========================================================= */

/* Faz os elementos .slide-up aparecerem ao entrar na tela.
   Fica fora do DOMContentLoaded para as outras páginas
   chamarem depois de desenhar os cards vindos da API. */
const observadorAnimacao = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observadorAnimacao.unobserve(entrada.target);
        }
    });
}, { threshold: 0.1 });

function observarAnimacoes(raiz = document) {
    raiz.querySelectorAll(".slide-up:not(.visivel)").forEach(el => observadorAnimacao.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {

    /* Se o navegador restaura a página pelo botão "voltar"
       (bfcache), recarrega para os dados não ficarem velhos. */
    window.addEventListener("pageshow", evento => {
        if (evento.persisted) window.location.reload();
    });

    /* ==========================================
       MODO ESCURO / CLARO
    ========================================== */

    const themeButton = document.getElementById("themeButton");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    function atualizarIconeTema() {
        const icone = themeButton && themeButton.querySelector("i");
        if (!icone) return;
        const escuro = document.body.classList.contains("dark-mode");
        icone.className = escuro ? "fa-solid fa-sun" : "fa-solid fa-moon";
        themeButton.setAttribute("aria-label", escuro ? "Usar tema claro" : "Usar tema escuro");
    }

    if (themeButton) {
        atualizarIconeTema();
        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const escuro = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", escuro ? "dark" : "light");
            atualizarIconeTema();
            document.dispatchEvent(new CustomEvent("temaAlterado"));
        });
    }

    observarAnimacoes();

    /* ==========================================
       CABEÇALHO: ENTRAR / PERFIL / ADMIN / SAIR
    ========================================== */

    montarCabecalho();

    async function montarCabecalho() {
        const acoes = document.querySelector(".header-actions");
        const nav = document.querySelector(".nav");
        if (!acoes) return;

        const sessao = await api.sessao();
        acoes.querySelector("#loginButton")?.remove();

        if (!sessao.logado) {
            const entrar = document.createElement("a");
            entrar.href = "login.html";
            entrar.className = "btn btn-primary";
            entrar.id = "loginButton";
            entrar.textContent = "Entrar";
            acoes.prepend(entrar);
            return;
        }

        const usuario = sessao.usuario;
        const iniciais = usuario.nome.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();

        const menu = document.createElement("div");
        menu.className = "user-menu";
        menu.innerHTML = `
            <a href="perfil.html" class="user-chip" title="Meu perfil">
                <span class="user-avatar">${escaparHtml(iniciais)}</span>
                <span class="user-name">${escaparHtml(usuario.nome.split(" ")[0])}</span>
            </a>
            <button type="button" class="icon-btn" id="logoutButton" title="Sair" aria-label="Sair">
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        `;
        acoes.prepend(menu);

        if (usuario.perfil === "ADMIN" && nav && !nav.querySelector("[href='admin.html']")) {
            const linkAdmin = document.createElement("a");
            linkAdmin.href = "admin.html";
            linkAdmin.innerHTML = `<i class="fa-solid fa-user-shield"></i> Gestão`;
            if (location.pathname.endsWith("admin.html")) linkAdmin.classList.add("active");
            nav.appendChild(linkAdmin);
        }

        menu.querySelector("#logoutButton").addEventListener("click", async () => {
            try {
                await api.logout();
            } finally {
                location.href = "index.html";
            }
        });
    }

    /* ==========================================
       HOME: NÚMEROS E DEMANDAS RECENTES
    ========================================== */

    const recentes = document.getElementById("recentDemandsContainer");

    if (recentes) {
        recentes.innerHTML = esqueletoCards(3);
        ativarBotoesDeApoio(recentes);

        api.listarDemandas({ tamanho: 6 })
            .then(pagina => {
                recentes.innerHTML = pagina.itens.map(d => cardDemandaHtml(d)).join("")
                    || `<div class="empty-state"><h3>Nenhuma demanda ainda.</h3><p>Seja o primeiro a registrar!</p></div>`;
                observarAnimacoes(recentes);
            })
            .catch(erro => {
                recentes.innerHTML = `<div class="empty-state"><h3>Não foi possível carregar as demandas.</h3><p>${escaparHtml(erro.message)}</p></div>`;
            });
    }

    /* Elementos com data-estatistica="total", "resolvidas"... (home e dashboard) */
    const camposEstatistica = document.querySelectorAll("[data-estatistica]");

    if (camposEstatistica.length) {
        api.estatisticas()
            .then(numeros => {
                camposEstatistica.forEach(el => animarNumero(el, numeros[el.dataset.estatistica] || 0));
                document.dispatchEvent(new CustomEvent("estatisticasCarregadas", { detail: numeros }));
            })
            .catch(erro => mostrarErro(erro, "Não foi possível carregar os números"));
    }

    /* ==========================================
       LOGIN
    ========================================== */

    const loginForm = document.querySelector(".auth-form[data-form='login']");

    if (loginForm) {
        loginForm.addEventListener("submit", async evento => {
            evento.preventDefault();
            limparErrosDeCampo(loginForm);

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("password").value;
            const botao = loginForm.querySelector("button[type='submit']");

            try {
                await comCarregamento(botao, api.login(email, senha));
                location.href = destinoAposLogin();
            } catch (erro) {
                if (Object.keys(erro.campos).length) {
                    mostrarErrosDeCampo(loginForm, erro.campos, { senha: "password" });
                } else {
                    mostrarNotificacao({ titulo: "Não foi possível entrar", mensagem: erro.message, tipo: "erro" });
                }
            }
        });

        /* Facilita a apresentação: preenche as contas de teste */
        document.querySelectorAll("[data-conta-teste]").forEach(botao => {
            botao.addEventListener("click", () => {
                const [email, senha] = botao.dataset.contaTeste.split("|");
                document.getElementById("email").value = email;
                document.getElementById("password").value = senha;
            });
        });
    }

    /* ==========================================
       CADASTRO
    ========================================== */

    const cadastroForm = document.querySelector(".auth-form[data-form='cadastro']");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async evento => {
            evento.preventDefault();
            limparErrosDeCampo(cadastroForm);

            const nome = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("password").value;
            const confirmacao = document.getElementById("confirmPassword").value;

            if (senha !== confirmacao) {
                mostrarErrosDeCampo(cadastroForm, { confirmPassword: "As senhas não são iguais." });
                return;
            }

            const botao = cadastroForm.querySelector("button[type='submit']");

            try {
                const usuario = await comCarregamento(botao, api.cadastrar(nome, email, senha));
                mostrarNotificacao({
                    titulo: "Conta criada!",
                    mensagem: `Bem-vindo(a), ${usuario.nome.split(" ")[0]}! Você já está conectado(a).`,
                    tipo: "sucesso"
                });
                setTimeout(() => location.href = destinoAposLogin(), 1200);
            } catch (erro) {
                if (Object.keys(erro.campos).length) {
                    mostrarErrosDeCampo(cadastroForm, erro.campos, { nome: "name", senha: "password" });
                } else {
                    mostrarNotificacao({ titulo: "Não foi possível criar a conta", mensagem: erro.message, tipo: "erro" });
                }
            }
        });
    }

    /* Mantém o "voltar" quando a pessoa troca entre login e cadastro */
    const voltar = parametroUrl("voltar");
    if (voltar) {
        document.querySelectorAll(".auth-footer a").forEach(link => {
            link.href = `${link.getAttribute("href")}?voltar=${encodeURIComponent(voltar)}`;
        });
    }

    /* ==========================================
       ANO AUTOMÁTICO NO RODAPÉ
    ========================================== */

    const ano = document.getElementById("currentYear");
    if (ano) ano.textContent = new Date().getFullYear();

    /* ==========================================
       MENU MOBILE (botão ☰ que abre o menu)
    ========================================== */

    const nav = document.querySelector(".header .nav");
    const acoesCabecalho = document.querySelector(".header-actions");

    if (nav && acoesCabecalho) {
        nav.id = "menuPrincipal";
        const botaoMenu = document.createElement("button");
        botaoMenu.type = "button";
        botaoMenu.className = "icon-btn mobile-menu-button";
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        botaoMenu.setAttribute("aria-controls", "menuPrincipal");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        acoesCabecalho.appendChild(botaoMenu);

        botaoMenu.addEventListener("click", () => {
            const aberto = nav.classList.toggle("open");
            botaoMenu.setAttribute("aria-expanded", String(aberto));
            botaoMenu.querySelector("i").className = aberto ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
    }
});

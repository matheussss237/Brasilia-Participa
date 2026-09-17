/* =========================================================
   MAIN.JS
   Funcionalidades gerais do sistema
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       GARANTE DADOS SEMPRE ATUALIZADOS
       Se o navegador restaura a página pelo botão
       "voltar" (bfcache), o JS não roda de novo e os
       números ficam desatualizados. Isso força um
       recarregamento nesse caso específico.
    ========================================== */

    window.addEventListener("pageshow", evento => {
        if (evento.persisted) {
            window.location.reload();
        }
    });

    /* ==========================================
       MODO ESCURO / CLARO
    ========================================== */

    const themeButton = document.getElementById("themeButton");

    // Recupera o tema salvo no navegador
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    if (themeButton) {

        updateThemeIcon();

        themeButton.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const darkMode =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "theme",
                darkMode ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }

    function updateThemeIcon() {

        if (!themeButton) return;

        const icon =
            themeButton.querySelector("i");

        if (!icon) return;

        if (document.body.classList.contains("dark-mode")) {

            icon.className = "fa-solid fa-sun";

        } else {

            icon.className = "fa-solid fa-moon";
        }
    }

    /* ==========================================
       ANIMAÇÃO AO ENTRAR NA TELA
    ========================================== */

    const animatedElements =
        document.querySelectorAll(".slide-up");

    const observer =
        new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    observer.unobserve(
                        entry.target
                    );
                }
            });

        }, {
            threshold: 0.1
        });

    animatedElements.forEach(element => {

        element.style.opacity = "0";

        observer.observe(element);
    });

    /* ==========================================
       ÁREA DE LOGIN NO CABEÇALHO
    ========================================== */

    const headerAuthArea = document.getElementById("headerAuthArea");
    const loginButton = document.getElementById("loginButton");

    if (loginButton && localStorage.getItem("bp_logado") === "true") {

        const nome = localStorage.getItem("bp_usuario_nome") || "Cidadão";
        const iniciais = nome.trim().split(" ").map(parte => parte[0]).slice(0, 2).join("").toUpperCase();

        loginButton.outerHTML = `
            <a href="perfil.html" class="icon-btn" title="${nome}" style="width:auto; padding:0 12px; gap:8px; display:flex; align-items:center; font-weight:700;">
                <span style="width:26px; height:26px; border-radius:50%; background:var(--primary); color:#fff; display:grid; place-items:center; font-size:0.7rem;">${iniciais}</span>
                Perfil
            </a>
        `;
    }

    /* ==========================================
       DEMANDAS RECENTES (HOME)
       Sem termo de busca: mostra as 6 mais recentes.
       Com termo: filtra em todas as demandas, para a
       busca do cabeçalho poder mostrar o resultado
       direto nesta mesma seção.
    ========================================== */

    const recentContainer = document.getElementById("recentDemandsContainer");

    function renderizarDemandasRecentes(termo) {

        if (!recentContainer || typeof obterDemandas !== "function") return;

        const termoLimpo = (termo || "").toLowerCase().trim();

        const todas = obterDemandas();

        const lista = termoLimpo
            ? todas.filter(demanda =>
                demanda.titulo.toLowerCase().includes(termoLimpo) ||
                demanda.descricao.toLowerCase().includes(termoLimpo) ||
                demanda.regiao.toLowerCase().includes(termoLimpo)
              )
            : todas.slice(0, 6);

        if (lista.length === 0) {

            recentContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhuma demanda encontrada.</h3>
                    <p>Tente outro termo de busca ou <a href="demandas.html">veja todas as demandas</a>.</p>
                </div>
            `;

            return;
        }

        recentContainer.innerHTML = lista.map(demanda => `
            <article class="card demand-card slide-up">
                ${demanda.foto ? `<div class="demand-photo"><img src="${demanda.foto}" alt="Foto: ${demanda.titulo}" loading="lazy" onerror="this.closest('.demand-photo').style.display='none'"></div>` : ""}
                <div class="demand-header">
                    <i class="fa-solid ${iconeDaCategoria(demanda.categoria)}"></i>
                    <span class="badge ${classeDoStatus(demanda.status)}">${demanda.status}</span>
                </div>
                <h3>${demanda.titulo}</h3>
                <p>${demanda.descricao}</p>
                <div class="demand-footer">
                    <span><i class="fa-solid fa-location-dot"></i> ${demanda.regiao}</span>
                    <span>${tempoRelativo(demanda.data)}</span>
                </div>
            </article>
        `).join("");
    }

    renderizarDemandasRecentes();

    /* ==========================================
       BUSCA DO CABEÇALHO
       Sempre que a página atual já tem uma lista de
       demandas (home ou demandas.html), filtra ali
       mesmo em vez de navegar. Nas outras páginas,
       cai no comportamento padrão do formulário
       (segue para demandas.html?q=...).
    ========================================== */

    const headerSearchForm = document.querySelector(".header-search");

    if (headerSearchForm) {

        const headerSearchInput = headerSearchForm.querySelector("input[name='q']");
        const demandsSearchInput = document.getElementById("searchDemand");

        if (demandsSearchInput) {

            headerSearchForm.addEventListener("submit", event => {

                event.preventDefault();

                demandsSearchInput.value = headerSearchInput.value;
                demandsSearchInput.dispatchEvent(new Event("input"));
                demandsSearchInput.scrollIntoView({ behavior: "smooth", block: "start" });
            });

        } else if (recentContainer) {

            headerSearchForm.addEventListener("submit", event => {

                event.preventDefault();

                renderizarDemandasRecentes(headerSearchInput.value);
                recentContainer.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }

    /* ==========================================
       ESTATÍSTICAS DINÂMICAS (home e dashboard)
       Lê os cards com [data-counter] e preenche o valor
       de acordo com o nome do rótulo, usando os dados
       reais salvos em store.js — em vez de números fixos
       que não batem com o que está cadastrado.
    ========================================== */

    if (typeof calcularEstatisticas === "function") {

        const estatisticas = calcularEstatisticas();

        const valorPorRotulo = {
            "Demandas registradas": estatisticas.total,
            "Total de demandas": estatisticas.total,
            "Demandas resolvidas": estatisticas.resolvidas,
            "Resolvidas": estatisticas.resolvidas,
            "Em andamento": estatisticas.emAndamento,
            "Cidadãos participantes": estatisticas.apoiosTotais,
            "Usuários": estatisticas.apoiosTotais,
            "Regiões atendidas": estatisticas.regioes
        };

        document.querySelectorAll(".stat-card").forEach(card => {

            const rotulo = card.querySelector(".stat-label");
            const numero = card.querySelector("[data-counter]");

            if (!rotulo || !numero) return;

            const texto = rotulo.textContent.trim();

            if (texto in valorPorRotulo) {
                numero.dataset.counter = valorPorRotulo[texto];
            }
        });
    }

    /* ==========================================
       ANO AUTOMÁTICO
    ========================================== */

    const year =
        document.getElementById("currentYear");

    if (year) {

        year.textContent =
            new Date().getFullYear();
    }

    /* ==========================================
       LOGIN E CADASTRO (simulados no navegador)
    ========================================== */

    const loginForm = document.querySelector(".auth-form[data-form='login']");

    if (loginForm) {

        loginForm.addEventListener("submit", event => {

            event.preventDefault();

            const email = document.getElementById("email").value.trim();

            const nomeCadastrado = localStorage.getItem("bp_cadastro_nome");
            const emailCadastrado = localStorage.getItem("bp_cadastro_email");

            const nome = (emailCadastrado === email && nomeCadastrado)
                ? nomeCadastrado
                : email.split("@")[0];

            localStorage.setItem("bp_logado", "true");
            localStorage.setItem("bp_usuario_nome", nome);
            localStorage.setItem("bp_usuario_email", email);

            window.location.href = "index.html";
        });
    }

    const cadastroForm = document.querySelector(".auth-form[data-form='cadastro']");

    if (cadastroForm) {

        cadastroForm.addEventListener("submit", event => {

            event.preventDefault();

            const nome = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();

            localStorage.setItem("bp_cadastro_nome", nome);
            localStorage.setItem("bp_cadastro_email", email);

            mostrarNotificacao({
                titulo: "Cadastro realizado com sucesso!",
                mensagem: `Bem-vindo(a), ${nome.split(" ")[0]}! Agora é só entrar com seu e-mail e senha.`,
                tipo: "sucesso",
                acoes: [
                    { label: "Ir para o login", primario: true, onClick: () => window.location.href = "login.html" }
                ]
            });
        });
    }

    /* ==========================================
       MENU MOBILE
    ========================================== */

    const mobileButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (mobileButton && mobileMenu) {

        mobileButton.addEventListener(
            "click",
            () => {

                mobileMenu.classList.toggle(
                    "show"
                );
            }
        );
    }

});
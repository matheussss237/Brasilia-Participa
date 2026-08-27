/* =========================================================
   APP.JS
   ---------------------------------------------------------
   Funções gerais utilizadas pelo sistema inteiro.
========================================================= */


/* =========================================================
   BANCO LOCAL TEMPORÁRIO
========================================================= */

function carregarDemandas() {

    const dados =
        localStorage.getItem("demandas");


    /* Caso ainda não exista nenhum dado,
       carregamos os dados iniciais. */

    if (!dados) {

        localStorage.setItem(
            "demandas",
            JSON.stringify(
                demandasIniciais
            )
        );

        return demandasIniciais;

    }


    return JSON.parse(dados);
}


/* =========================================================
   SALVAR DEMANDAS
========================================================= */

function salvarDemandas(demandas) {

    localStorage.setItem(
        "demandas",
        JSON.stringify(demandas)
    );

}


/* =========================================================
   TEMA ESCURO / CLARO
========================================================= */

function iniciarTema() {

    const tema =
        localStorage.getItem("tema");


    if (tema === "dark") {

        document.body.classList.add("dark");

    }


    atualizarBotaoTema();
}


function atualizarBotaoTema() {

    const botoes =
        document.querySelectorAll(
            ".theme-button"
        );


    botoes.forEach(botao => {

        const icone =
            botao.querySelector("i");


        const texto =
            botao.querySelector("span");


        const escuro =
            document.body.classList.contains(
                "dark"
            );


        if (escuro) {

            if (icone) {

                icone.className =
                    "fa-solid fa-sun";

            }


            if (texto) {

                texto.textContent =
                    "Modo claro";

            }

        } else {

            if (icone) {

                icone.className =
                    "fa-solid fa-moon";

            }


            if (texto) {

                texto.textContent =
                    "Modo escuro";

            }

        }

    });

}


function configurarTema() {

    const botoes =
        document.querySelectorAll(
            ".theme-button"
        );


    botoes.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark"
                );


                const escuro =
                    document.body.classList.contains(
                        "dark"
                    );


                localStorage.setItem(
                    "tema",
                    escuro
                        ? "dark"
                        : "light"
                );


                atualizarBotaoTema();

            }
        );

    });

}


/* =========================================================
   MENU MOBILE
========================================================= */

function configurarMenuMobile() {

    const botao =
        document.getElementById(
            "mobileMenu"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!botao || !sidebar) {

        return;

    }


    botao.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================================
   ESTATÍSTICAS
========================================================= */

function calcularEstatisticas() {

    const demandas =
        carregarDemandas();


    return {

        total:
            demandas.length,

        pendentes:
            demandas.filter(
                demanda =>
                    demanda.status ===
                    "Pendente"
            ).length,

        andamento:
            demandas.filter(
                demanda =>
                    demanda.status ===
                    "Em andamento"
            ).length,

        concluidas:
            demandas.filter(
                demanda =>
                    demanda.status ===
                    "Concluída"
            ).length

    };

}


/* =========================================================
   ATUALIZAR ESTATÍSTICAS
========================================================= */

function atualizarEstatisticas() {

    const dados =
        calcularEstatisticas();


    const total =
        document.querySelectorAll(
            "#totalDemandas"
        );


    const pendentes =
        document.querySelectorAll(
            "#totalPendentes"
        );


    const andamento =
        document.querySelectorAll(
            "#totalAndamento"
        );


    const concluidas =
        document.querySelectorAll(
            "#totalConcluidas"
        );


    total.forEach(
        elemento =>
            elemento.textContent =
                dados.total
    );


    pendentes.forEach(
        elemento =>
            elemento.textContent =
                dados.pendentes
    );


    andamento.forEach(
        elemento =>
            elemento.textContent =
                dados.andamento
    );


    concluidas.forEach(
        elemento =>
            elemento.textContent =
                dados.concluidas
    );


    /* Status da página inicial */

    atualizarProgresso(
        dados
    );

}


/* =========================================================
   BARRAS DE PROGRESSO
========================================================= */

function atualizarProgresso(dados) {

    const total =
        dados.total || 1;


    const pending =
        document.getElementById(
            "progressPending"
        );


    const progress =
        document.getElementById(
            "progressProgress"
        );


    const completed =
        document.getElementById(
            "progressCompleted"
        );


    if (pending) {

        pending.style.width =
            `${dados.pendentes / total * 100}%`;

    }


    if (progress) {

        progress.style.width =
            `${dados.andamento / total * 100}%`;

    }


    if (completed) {

        completed.style.width =
            `${dados.concluidas / total * 100}%`;

    }


    const statusPending =
        document.getElementById(
            "statusPending"
        );


    const statusProgress =
        document.getElementById(
            "statusProgress"
        );


    const statusCompleted =
        document.getElementById(
            "statusCompleted"
        );


    if (statusPending) {

        statusPending.textContent =
            dados.pendentes;

    }


    if (statusProgress) {

        statusProgress.textContent =
            dados.andamento;

    }


    if (statusCompleted) {

        statusCompleted.textContent =
            dados.concluidas;

    }

}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(mensagem) {

    const toast =
        document.getElementById(
            "toast"
        );


    const texto =
        document.getElementById(
            "toastMessage"
        );


    if (!toast || !texto) {

        return;

    }


    texto.textContent =
        mensagem;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   LOGIN
========================================================= */

function configurarLogin() {

    const formulario =
        document.getElementById(
            "loginForm"
        );


    if (!formulario) {

        return;

    }


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const senha =
                document.getElementById(
                    "password"
                ).value.trim();


            const erro =
                document.getElementById(
                    "loginError"
                );


            if (!email || !senha) {

                erro.textContent =
                    "Preencha todos os campos.";

                return;

            }


            /*
             * LOGIN TEMPORÁRIO.
             *
             * Posteriormente:
             *
             * fetch("/api/auth/login")
             *
             * Spring Security + JWT.
             */

            if (
                email ===
                "admin@demandas.com"
                &&
                senha ===
                "123456"
            ) {

                localStorage.setItem(
                    "usuarioLogado",
                    "true"
                );


                window.location.href =
                    "index.html";

            } else {

                erro.textContent =
                    "E-mail ou senha incorretos.";

            }

        }
    );

}


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

function configurarSenha() {

    const botao =
        document.getElementById(
            "passwordToggle"
        );


    const senha =
        document.getElementById(
            "password"
        );


    if (!botao || !senha) {

        return;

    }


    botao.addEventListener(
        "click",
        () => {

            if (
                senha.type ===
                "password"
            ) {

                senha.type =
                    "text";


                botao.innerHTML =
                    '<i class="fa-regular fa-eye-slash"></i>';

            } else {

                senha.type =
                    "password";


                botao.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

            }

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO GERAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarTema();

        configurarTema();

        configurarMenuMobile();

        atualizarEstatisticas();

        configurarLogin();

        configurarSenha();

    }
);
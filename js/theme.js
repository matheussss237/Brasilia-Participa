/*
============================================================
THEME.JS

Responsável exclusivamente pelo:

🌙 Modo escuro
☀️ Modo claro

Não colocamos outras funcionalidades aqui.
============================================================
*/


// ==========================================================
// 1. PEGAR O BOTÃO DO TEMA
// ==========================================================

const themeToggle =
    document.getElementById("themeToggle");


// ==========================================================
// 2. VERIFICAR SE O USUÁRIO JÁ ESCOLHEU UM TEMA
// ==========================================================

/*
    localStorage permite guardar pequenas informações
    no navegador.

    Exemplo:

    localStorage.setItem("theme", "dark");

    Depois podemos recuperar:

    localStorage.getItem("theme");
*/

const savedTheme =
    localStorage.getItem("theme");


// ==========================================================
// 3. APLICAR TEMA SALVO
// ==========================================================

if (savedTheme === "dark") {

    /*
        Adicionamos a classe dark-mode ao body.

        O CSS possui:

        body.dark-mode { ... }

        Portanto o CSS muda automaticamente
        as cores do sistema.
    */

    document.body.classList.add("dark-mode");


    // Alteramos o ícone.

    themeToggle.textContent = "☀️";

}


// ==========================================================
// 4. ESCUTAR O CLIQUE
// ==========================================================

themeToggle.addEventListener(
    "click",
    () => {


        /*
            toggle() adiciona a classe se ela não existir.

            Se ela já existir, remove.

            Portanto:

            claro → escuro
            escuro → claro
        */

        document.body.classList.toggle(
            "dark-mode"
        );


        // Descobrimos qual tema está ativo.

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        // ==================================================
        // 5. SALVAR A ESCOLHA
        // ==================================================

        if (isDark) {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);
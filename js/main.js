/* =========================================================
   MAIN.JS
   Funcionalidades gerais do sistema
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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
       ANO AUTOMÁTICO
    ========================================== */

    const year =
        document.getElementById("currentYear");

    if (year) {

        year.textContent =
            new Date().getFullYear();
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
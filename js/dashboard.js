/* =========================================================
   DASHBOARD.JS
   Interações e dados do dashboard
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       CONTADORES ANIMADOS
    ========================================== */

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    counters.forEach(counter => {

        const target =
            parseInt(
                counter.dataset.counter
            );

        let current = 0;

        const increment =
            Math.max(
                1,
                Math.ceil(target / 60)
            );

        const interval =
            setInterval(() => {

                current += increment;

                if (current >= target) {

                    current = target;

                    clearInterval(
                        interval
                    );
                }

                counter.textContent =
                    current.toLocaleString(
                        "pt-BR"
                    );

            }, 25);
    });

    /* ==========================================
       SIMULAÇÃO DE GRÁFICO
    ========================================== */

    const bars =
        document.querySelectorAll(
            ".chart-bar"
        );

    bars.forEach((bar, index) => {

        setTimeout(() => {

            bar.style.height =
                bar.dataset.height + "%";

        }, index * 100);
    });

});
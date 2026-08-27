/* =========================================================
   DEMANDAS.JS
   Funcionalidades da página de demandas
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("searchDemand");

    const statusFilter =
        document.getElementById("statusFilter");

    const cards =
        document.querySelectorAll(".demand-card");

    /* ==========================================
       FILTRO DE DEMANDAS
    ========================================== */

    function filterDemands() {

        const search =
            searchInput
                ? searchInput.value.toLowerCase()
                : "";

        const status =
            statusFilter
                ? statusFilter.value
                : "all";

        cards.forEach(card => {

            const text =
                card.textContent.toLowerCase();

            const cardStatus =
                card.dataset.status;

            const matchesSearch =
                text.includes(search);

            const matchesStatus =
                status === "all" ||
                cardStatus === status;

            if (
                matchesSearch &&
                matchesStatus
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";
            }
        });
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterDemands
        );
    }

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterDemands
        );
    }

    /* ==========================================
       FORMULÁRIO DE NOVA DEMANDA
    ========================================== */

    const demandForm =
        document.getElementById("demandForm");

    if (demandForm) {

        demandForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                alert(
                    "Demanda cadastrada com sucesso!"
                );

                demandForm.reset();
            }
        );
    }

    /* ==========================================
       BOTÕES DE VOTAÇÃO
    ========================================== */

    const voteButtons =
        document.querySelectorAll(".vote-button");

    voteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const count =
                    button.querySelector(
                        ".vote-count"
                    );

                if (!count) return;

                let votes =
                    parseInt(
                        count.textContent
                    );

                if (
                    button.classList.contains(
                        "voted"
                    )
                ) {

                    votes--;

                    button.classList.remove(
                        "voted"
                    );

                } else {

                    votes++;

                    button.classList.add(
                        "voted"
                    );
                }

                count.textContent =
                    votes;
            }
        );
    });

});
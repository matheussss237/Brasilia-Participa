```javascript
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
       APOIAR DEMANDA
    ========================================== */

    const voteButtons =
        document.querySelectorAll(".vote-button");


    voteButtons.forEach(button => {

        const card =
            button.closest(".demand-card");

        if (!card) return;


        const demandId =
            card.dataset.demandId;

        if (!demandId) return;


        const count =
            button.querySelector(".vote-count");

        if (!count) return;


        /*
         * Recupera os apoios salvos.
         */

        let savedVotes =
            JSON.parse(
                localStorage.getItem(
                    "brasiliaParticipaVotes"
                )
            ) || {};


        /*
         * Verifica se o usuário
         * já apoiou esta demanda.
         */

        if (savedVotes[demandId]) {

            button.classList.add("voted");

            button.title =
                "Remover apoio";

        }


        button.addEventListener(
            "click",
            () => {

                let votes =
                    parseInt(
                        count.textContent
                    );


                /*
                 * Remove apoio
                 */

                if (
                    button.classList.contains(
                        "voted"
                    )
                ) {

                    votes--;

                    button.classList.remove(
                        "voted"
                    );

                    button.title =
                        "Apoiar demanda";

                    delete savedVotes[demandId];

                }


                /*
                 * Adiciona apoio
                 */

                else {

                    votes++;

                    button.classList.add(
                        "voted"
                    );

                    button.title =
                        "Remover apoio";

                    savedVotes[demandId] =
                        true;

                }


                /*
                 * Atualiza o número
                 */

                count.textContent =
                    votes;


                /*
                 * Salva no navegador
                 */

                localStorage.setItem(
                    "brasiliaParticipaVotes",
                    JSON.stringify(
                        savedVotes
                    )
                );

            }
        );

    });

});
```

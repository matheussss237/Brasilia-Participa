/*
============================================================
HOME.JS

Tudo que pertence especificamente à página inicial
fica aqui.

Neste momento:

JSON
 ↓
JavaScript
 ↓
Cards

No futuro:

MongoDB
 ↓
Java/Spring Boot
 ↓
API
 ↓
JavaScript
 ↓
Cards
============================================================
*/


// ==========================================================
// ELEMENTOS DA PÁGINA
// ==========================================================

const demandsContainer =
    document.getElementById(
        "demandsContainer"
    );


const regionFilter =
    document.getElementById(
        "regionFilter"
    );


const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );


// ==========================================================
// VARIÁVEL QUE GUARDARÁ AS DEMANDAS
// ==========================================================

let demands = [];


// ==========================================================
// CARREGAR JSON
// ==========================================================

async function loadDemands() {


    try {


        /*
            fetch() faz uma requisição para buscar
            o arquivo JSON.

            Futuramente podemos trocar:

            "data/demandas.json"

            por algo como:

            "http://localhost:8080/api/v1/demandas"
        */

        const response =
            await fetch(
                "data/demandas.json"
            );


        /*
            Verificamos se a resposta foi bem sucedida.
        */

        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar as demandas."
            );

        }


        /*
            Transformamos a resposta em JavaScript.

            JSON → objeto/array JavaScript
        */

        demands =
            await response.json();


        /*
            Depois que os dados chegam,
            mostramos os cards.
        */

        renderDemands(
            demands
        );


    } catch (error) {


        /*
            Caso aconteça algum problema,
            mostramos uma mensagem no console.

            Isso ajuda muito durante o desenvolvimento.
        */

        console.error(
            "Erro ao carregar demandas:",
            error
        );


        demandsContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    Não foi possível carregar as demandas.
                </h3>

                <p>
                    Tente novamente mais tarde.
                </p>

            </div>

        `;

    }

}


// ==========================================================
// CRIAR CARDS
// ==========================================================

function renderDemands(list) {


    /*
        Primeiro limpamos o container.

        Isso é importante porque podemos
        renderizar novamente depois dos filtros.
    */

    demandsContainer.innerHTML = "";


    // ======================================================
    // CASO NÃO TENHA RESULTADOS
    // ======================================================

    if (list.length === 0) {


        demandsContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    Nenhuma demanda encontrada.
                </h3>

                <p>
                    Tente alterar os filtros.
                </p>

            </div>

        `;

        return;

    }


    // ======================================================
    // CRIAR CADA CARD
    // ======================================================

    list.forEach(
        (demand) => {


            /*
                createElement cria um elemento HTML
                através do JavaScript.

                Aqui estamos criando:

                <article>
            */

            const card =
                document.createElement(
                    "article"
                );


            // Adicionamos a classe CSS.

            card.className =
                "demand-card";


            // =================================================
            // DEFINIR CLASSE DO STATUS
            // =================================================

            let statusClass = "";


            if (
                demand.status === "Pendente"
            ) {

                statusClass =
                    "status-pendente";

            }


            if (
                demand.status === "Em análise"
            ) {

                statusClass =
                    "status-analise";

            }


            if (
                demand.status === "Resolvido"
            ) {

                statusClass =
                    "status-resolvido";

            }


            // =================================================
            // HTML DO CARD
            // =================================================

            card.innerHTML = `

                <div class="demand-image">

                    <img
                        src="${demand.imagem}"
                        alt="${demand.titulo}"
                    >

                    <span class="category">

                        ${demand.categoria}

                    </span>

                </div>


                <div class="demand-content">


                    <span class="status ${statusClass}">

                        ${demand.status}

                    </span>


                    <h3>

                        ${demand.titulo}

                    </h3>


                    <p>

                        ${demand.descricao}

                    </p>


                    <div class="demand-info">

                        <span>

                            📍 ${demand.regiao}

                        </span>


                        <span>

                            👍 ${demand.apoios}

                        </span>

                    </div>

                </div>

            `;


            // =================================================
            // CLIQUE NO CARD
            // =================================================

            card.addEventListener(
                "click",
                () => {

                    openDemandModal(
                        demand
                    );

                }
            );


            // =================================================
            // ADICIONAR CARD À PÁGINA
            // =================================================

            demandsContainer.appendChild(
                card
            );

        }
    );

}


// ==========================================================
// FILTROS
// ==========================================================

function applyFilters() {


    const region =
        regionFilter.value;


    const category =
        categoryFilter.value;


    const status =
        statusFilter.value;


    /*
        filter() cria uma nova lista
        contendo somente os elementos
        que atendem à condição.
    */

    const filtered =
        demands.filter(
            (demand) => {


                /*
                    Se "all" estiver selecionado,
                    qualquer região será aceita.

                    Caso contrário,
                    comparamos com a demanda.
                */

                const regionMatch =
                    region === "all" ||
                    demand.regiao === region;


                const categoryMatch =
                    category === "all" ||
                    demand.categoria === category;


                const statusMatch =
                    status === "all" ||
                    demand.status === status;


                /*
                    A demanda precisa passar
                    pelos três filtros.
                */

                return (
                    regionMatch &&
                    categoryMatch &&
                    statusMatch
                );

            }
        );


    // Mostramos somente os resultados.

    renderDemands(
        filtered
    );

}


// ==========================================================
// ESCUTAR ALTERAÇÕES DOS FILTROS
// ==========================================================

regionFilter.addEventListener(
    "change",
    applyFilters
);


categoryFilter.addEventListener(
    "change",
    applyFilters
);


statusFilter.addEventListener(
    "change",
    applyFilters
);


// ==========================================================
// MODAL
// ==========================================================

const modal =
    document.getElementById(
        "demandModal"
    );


const modalBody =
    document.getElementById(
        "modalBody"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


function openDemandModal(demand) {


    /*
        Criamos dinamicamente o conteúdo
        do modal utilizando os dados da demanda.
    */

    modalBody.innerHTML = `

        <span class="section-tag">

            ${demand.categoria}

        </span>


        <h2 style="margin-top: 10px">

            ${demand.titulo}

        </h2>


        <p style="margin-top: 15px">

            ${demand.descricao}

        </p>


        <p style="margin-top: 15px">

            📍 ${demand.regiao}

        </p>


        <p style="margin-top: 8px">

            Status:

            <strong>
                ${demand.status}
            </strong>

        </p>


        <p style="margin-top: 8px">

            👍

            <span id="modalVotes">

                ${demand.apoios}

            </span>

            pessoas apoiam esta demanda.

        </p>


        <button
            type="button"
            class="btn btn-primary"
            id="supportButton"
            style="margin-top: 25px"
        >

            👍 Apoiar esta demanda

        </button>

    `;


    /*
        Adicionamos a classe active.

        O CSS entende:

        .modal.active

        e mostra o modal.
    */

    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    // ======================================================
    // BOTÃO APOIAR
    // ======================================================

    const supportButton =
        document.getElementById(
            "supportButton"
        );


    supportButton.addEventListener(
        "click",
        () => {


            /*
                Por enquanto estamos alterando
                apenas o dado local.

                Futuramente:

                JavaScript
                    ↓
                POST /api/v1/demandas/{id}/apoio
                    ↓
                Spring Boot
                    ↓
                MongoDB
            */

            demand.apoios++;


            document.getElementById(
                "modalVotes"
            ).textContent =
                demand.apoios;


            showToast();

        }
    );

}


// ==========================================================
// FECHAR MODAL
// ==========================================================

function closeModal() {


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


modalClose.addEventListener(
    "click",
    closeModal
);


// Fechar clicando fora do conteúdo.

modal.addEventListener(
    "click",
    (event) => {


        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// ==========================================================
// TOAST
// ==========================================================

const toast =
    document.getElementById(
        "toast"
    );


function showToast() {


    toast.classList.add(
        "show"
    );


    /*
        Depois de 2,5 segundos,
        removemos a classe novamente.
    */

    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// ==========================================================
// MAPA TEMPORÁRIO
// ==========================================================

const mapPins =
    document.querySelectorAll(
        ".map-pin"
    );


mapPins.forEach(
    (pin) => {


        pin.addEventListener(
            "click",
            () => {


                const demand =
                    pin.dataset.demand;


                /*
                    Por enquanto mostramos
                    uma informação simples.

                    Depois teremos um mapa real.
                */

                modalBody.innerHTML = `

                    <span class="section-tag">
                        MAPA
                    </span>

                    <h2 style="margin-top: 10px">

                        ${demand}

                    </h2>

                    <p style="margin-top: 15px">

                        Existe uma demanda registrada
                        nesta região.

                    </p>

                `;


                modal.classList.add(
                    "active"
                );


                modal.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }
        );

    }
);


// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

/*
    Assim que o arquivo JavaScript for carregado,
    buscamos as demandas.
*/

loadDemands();

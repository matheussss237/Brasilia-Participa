/* Perfil: dados do usuário, conquistas (gamificação) e demandas. */
(function () {
    "use strict";

    const BP = window.BP;
    const { api, dominio, ui, util } = BP;
    const { escapar } = util;

    function conquistasHtml(lista) {
        return lista
            .map(
                (c) => `
            <li class="conquista${c.conquistada ? " conquista--obtida" : ""}">
                <span class="conquista__icone" aria-hidden="true"><i class="fa-solid ${c.conquistada ? c.icone : "fa-lock"}"></i></span>
                <div class="conquista__texto">
                    <strong>${escapar(c.nome)}</strong>
                    <span>${escapar(c.descricao)}</span>
                    <span class="progresso-barra" role="progressbar" aria-label="Progresso: ${escapar(c.nome)}"
                          aria-valuemin="0" aria-valuemax="${c.meta}" aria-valuenow="${c.atual}">
                        <span style="width:${c.fracao * 100}%"></span>
                    </span>
                    <span class="conquista__status">${c.conquistada ? "Conquistada!" : `${c.atual} de ${c.meta}`}</span>
                </div>
            </li>`
            )
            .join("");
    }

    BP.pronto.then(async (usuario) => {
        if (!usuario) {
            location.replace("login.html?proximo=perfil.html");
            return;
        }

        document.getElementById("avatarUsuario").textContent = util.iniciais(usuario.nome);
        document.getElementById("nomeUsuario").textContent = usuario.nome;
        document.getElementById("emailUsuario").textContent = usuario.email;
        document.getElementById("desdeUsuario").textContent = `Participando desde ${new Date(usuario.criadoEm).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;

        document.getElementById("sair").addEventListener("click", async () => {
            await api.auth.sair();
            location.href = "index.html";
        });

        const [todas, apoiadas] = await Promise.all([api.demandas.listar(), api.demandas.apoiadas()]);
        const minhas = dominio.filtrarDemandas(
            todas.filter((d) => d.autorId === usuario.id),
            { ordem: "recentes" }
        );
        const apoiadasLista = dominio.filtrarDemandas(
            todas.filter((d) => apoiadas.has(d.id)),
            { ordem: "apoiadas" }
        );

        const numeros = {
            relatos: minhas.length,
            apoiosDados: apoiadas.size,
            resolvidas: minhas.filter((d) => d.status === "resolvida").length
        };
        document.querySelectorAll("#kpisPerfil [data-kpi]").forEach((el) => (el.dataset.contador = numeros[el.dataset.kpi]));
        ui.animarContadores(document.getElementById("kpisPerfil"));

        document.getElementById("conquistas").innerHTML = conquistasHtml(dominio.conquistas(minhas, apoiadas.size));

        document.getElementById("minhasDemandas").innerHTML = minhas.length
            ? minhas.map((d) => ui.cardDemanda(d, apoiadas)).join("")
            : ui.estado({
                  icone: "fa-flag",
                  titulo: "Você ainda não registrou demandas",
                  mensagem: "Viu um problema na sua região? Conte para a gente.",
                  acao: '<a class="btn btn--primario" href="nova-demanda.html">Registrar demanda</a>'
              });

        document.getElementById("demandasApoiadas").innerHTML = apoiadasLista.length
            ? apoiadasLista.map((d) => ui.cardDemanda(d, apoiadas)).join("")
            : ui.estado({
                  icone: "fa-thumbs-up",
                  titulo: "Você ainda não apoiou nenhuma causa",
                  acao: '<a class="btn btn--secundario" href="demandas.html">Explorar demandas</a>'
              });
    });
})();

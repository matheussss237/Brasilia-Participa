/* =========================================================
   NOVA-DEMANDA.JS
   ---------------------------------------------------------
   1) Exige login (sem login, mostra um aviso).
   2) Foto: pré-visualização e envio junto com o formulário.
   3) Mapa (Leaflet): clique para marcar o ponto exato.
   4) Anti-duplicadas: ao marcar o ponto, procura demandas
      parecidas a até 300 m e sugere APOIAR em vez de criar.
   5) Envio para a API (multipart: dados + foto).
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const form = document.getElementById("demandForm");
    if (!form) return;

    /* ==========================================
       LOGIN OBRIGATÓRIO
    ========================================== */

    const sessao = await api.sessao();
    if (!sessao.logado) {
        document.getElementById("loginRequired").hidden = false;
        form.closest(".form-card").hidden = true;
        return;
    }

    /* ==========================================
       SELECTS (categorias e regiões vêm da API)
    ========================================== */

    const selectCategoria = document.getElementById("category");
    const selectRegiao = document.getElementById("region");
    let centroPorRegiao = {};

    try {
        const ref = await api.referencias();
        preencherSelect(selectCategoria, ref.categorias.map(c => ({ valor: c, texto: c })));
        preencherSelect(selectRegiao, ref.regioes.map(r => ({ valor: r.nome, texto: r.nome })));
        ref.regioes.forEach(r => centroPorRegiao[r.nome] = [r.latitude, r.longitude]);
    } catch (erro) {
        mostrarErro(erro, "Não foi possível carregar as listas do formulário");
    }

    /* ==========================================
       FOTO
    ========================================== */

    const photoInput = document.getElementById("photo");
    const photoPreview = document.getElementById("photoPreview");
    const photoPreviewImg = document.getElementById("photoPreviewImg");
    const photoRemove = document.getElementById("photoRemove");
    const TAMANHO_MAXIMO = 5 * 1024 * 1024;

    let fotoSelecionada = null;

    photoInput?.addEventListener("change", () => {
        const arquivo = photoInput.files[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            mostrarNotificacao({ titulo: "Arquivo inválido", mensagem: "Escolha uma imagem (JPG, PNG, WEBP ou GIF).", tipo: "erro" });
            photoInput.value = "";
            return;
        }
        if (arquivo.size > TAMANHO_MAXIMO) {
            mostrarNotificacao({ titulo: "Foto muito grande", mensagem: "O limite é 5 MB. Tente uma foto menor.", tipo: "erro" });
            photoInput.value = "";
            return;
        }

        fotoSelecionada = arquivo;
        photoPreviewImg.src = URL.createObjectURL(arquivo);
        photoPreview.classList.add("show");
    });

    photoRemove?.addEventListener("click", () => {
        fotoSelecionada = null;
        photoInput.value = "";
        photoPreview.classList.remove("show");
    });

    /* ==========================================
       MAPA (Leaflet)
    ========================================== */

    const CENTRO_BRASILIA = [-15.7942, -47.8822];
    let mapa = null;
    let marcador = null;
    let pontoSelecionado = null;

    if (document.getElementById("pickerMap") && typeof L !== "undefined") {
        mapa = L.map("pickerMap").setView(CENTRO_BRASILIA, 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19
        }).addTo(mapa);

        const iconeSelecao = L.divIcon({
            className: "",
            html: `<div class="leaflet-pin leaflet-pin-select"><i class="fa-solid fa-location-dot"></i></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 32]
        });

        selectRegiao.addEventListener("change", () => {
            const centro = centroPorRegiao[selectRegiao.value];
            if (centro) mapa.setView(centro, 14);
        });

        mapa.on("click", evento => {
            pontoSelecionado = { lat: evento.latlng.lat, lng: evento.latlng.lng };
            if (marcador) {
                marcador.setLatLng(evento.latlng);
            } else {
                marcador = L.marker(evento.latlng, { icon: iconeSelecao }).addTo(mapa);
            }
            document.getElementById("pickerMapHint").textContent =
                "Ponto marcado! Clique em outro lugar do mapa se quiser ajustar.";
            procurarParecidas();
        });

        /* Botão "usar minha localização" (GPS do celular) */
        document.getElementById("useMyLocation")?.addEventListener("click", () => {
            if (!navigator.geolocation) {
                mostrarNotificacao({ titulo: "Localização indisponível", mensagem: "Seu navegador não permite pegar a localização.", tipo: "erro" });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                posicao => {
                    const latlng = L.latLng(posicao.coords.latitude, posicao.coords.longitude);
                    mapa.setView(latlng, 17);
                    mapa.fire("click", { latlng });
                },
                () => mostrarNotificacao({ titulo: "Não foi possível pegar sua localização", mensagem: "Autorize o acesso à localização ou marque o ponto no mapa.", tipo: "erro" }),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });

        setTimeout(() => mapa.invalidateSize(), 200);
    }

    /* ==========================================
       DEMANDAS PARECIDAS POR PERTO
    ========================================== */

    const painel = document.getElementById("nearbyPanel");
    selectCategoria.addEventListener("change", procurarParecidas);

    async function procurarParecidas() {
        if (!painel || !pontoSelecionado || !selectCategoria.value) {
            if (painel) painel.hidden = true;
            return;
        }
        try {
            const parecidas = await api.demandasProximas(pontoSelecionado.lat, pontoSelecionado.lng, selectCategoria.value);
            if (!parecidas.length) {
                painel.hidden = true;
                return;
            }
            painel.innerHTML = `
                <div class="nearby-header">
                    <i class="fa-solid fa-lightbulb"></i>
                    <div>
                        <strong>Já existe${parecidas.length > 1 ? "m" : ""} ${parecidas.length} demanda${parecidas.length > 1 ? "s" : ""} parecida${parecidas.length > 1 ? "s" : ""} aqui perto.</strong>
                        <p>Se for o mesmo problema, apoie a demanda existente: ela ganha prioridade e evitamos registros repetidos.</p>
                    </div>
                </div>
                <ul class="nearby-list">
                    ${parecidas.map(({ demanda, distanciaMetros }) => `
                        <li>
                            <a href="${linkDemanda(demanda)}" target="_blank" rel="noopener">${escaparHtml(demanda.titulo)}</a>
                            <span class="nearby-meta">${distanciaMetros} m daqui · ${badgeStatus(demanda)}</span>
                            ${botaoApoioHtml(demanda)}
                        </li>
                    `).join("")}
                </ul>
            `;
            painel.hidden = false;
        } catch (erro) {
            painel.hidden = true; // a sugestão é só uma ajuda: se falhar, não atrapalha o envio
        }
    }

    ativarBotoesDeApoio(painel);

    /* ==========================================
       ENVIO
    ========================================== */

    form.addEventListener("submit", async evento => {
        evento.preventDefault();
        limparErrosDeCampo(form);

        const dados = {
            titulo: document.getElementById("title").value.trim(),
            categoria: selectCategoria.value,
            regiao: selectRegiao.value,
            endereco: document.getElementById("location").value.trim(),
            descricao: document.getElementById("description").value.trim(),
            latitude: pontoSelecionado ? pontoSelecionado.lat : null,
            longitude: pontoSelecionado ? pontoSelecionado.lng : null
        };

        const botao = form.querySelector("button[type='submit']");

        try {
            const demanda = await comCarregamento(botao, api.criarDemanda(dados, fotoSelecionada));
            mostrarNotificacao({
                titulo: "Demanda registrada com sucesso!",
                mensagem: `"${demanda.titulo}" foi enviada. Você pode acompanhar o andamento pela página da demanda.`,
                tipo: "sucesso",
                duracao: 0,
                acoes: [
                    { label: "Acompanhar demanda", primario: true, onClick: () => location.href = linkDemanda(demanda) },
                    { label: "Ver no mapa", onClick: () => location.href = "mapa.html" }
                ]
            });
            limparFormulario();
        } catch (erro) {
            if (Object.keys(erro.campos).length) {
                mostrarErrosDeCampo(form, erro.campos, {
                    titulo: "title", categoria: "category", regiao: "region",
                    endereco: "location", descricao: "description"
                });
            } else {
                mostrarErro(erro, "Não foi possível registrar a demanda");
            }
        }
    });

    function limparFormulario() {
        form.reset();
        fotoSelecionada = null;
        photoPreview?.classList.remove("show");
        pontoSelecionado = null;
        if (marcador) {
            marcador.remove();
            marcador = null;
        }
        if (painel) painel.hidden = true;
        document.getElementById("pickerMapHint").textContent =
            "Selecione a Região Administrativa acima para centralizar o mapa, depois clique no ponto exato do problema.";
    }
});

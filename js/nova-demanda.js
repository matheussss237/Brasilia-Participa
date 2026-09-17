/* =========================================================
   NOVA-DEMANDA.JS
   ---------------------------------------------------------
   Cuida de três partes do formulário de nova demanda:

   1) Foto: leitura do arquivo/câmera e pré-visualização.
   2) Mapa (Leaflet): clique para marcar o local exato.
   3) Envio: salva através do store.js — a mesma fonte de
      dados usada por demandas.html e mapa.html — e mostra
      uma notificação própria do site (sem alert nativo).
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("demandForm");

    if (!form) return;

    /* ==========================================
       FOTO
    ========================================== */

    const photoInput = document.getElementById("photo");
    const photoPreview = document.getElementById("photoPreview");
    const photoPreviewImg = document.getElementById("photoPreviewImg");
    const photoRemove = document.getElementById("photoRemove");

    let fotoBase64 = null;

    if (photoInput) {

        photoInput.addEventListener("change", () => {

            const arquivo = photoInput.files[0];

            if (!arquivo) return;

            const leitor = new FileReader();

            leitor.onload = () => {

                fotoBase64 = leitor.result;

                photoPreviewImg.src = fotoBase64;
                photoPreview.classList.add("show");
            };

            leitor.readAsDataURL(arquivo);
        });

        photoRemove.addEventListener("click", () => {

            fotoBase64 = null;

            photoInput.value = "";
            photoPreview.classList.remove("show");
        });
    }

    /* ==========================================
       MAPA (Leaflet) — seleção do ponto exato
    ========================================== */

    const CENTRO_BRASILIA = [-15.7942, -47.8822];

    const pickerMapEl = document.getElementById("pickerMap");

    let marcadorSelecionado = null;
    let latitudeSelecionada = null;
    let longitudeSelecionada = null;

    if (pickerMapEl && typeof L !== "undefined") {

        const pickerMap = L.map("pickerMap").setView(CENTRO_BRASILIA, 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19
        }).addTo(pickerMap);

        const iconeSelecao = L.divIcon({
            className: "",
            html: `<div class="leaflet-pin leaflet-pin-select"><i class="fa-solid fa-location-dot"></i></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 32]
        });

        /* Se o usuário já escolheu a Região Administrativa,
           centraliza o mapa nela para facilitar o clique. */
        const regionSelect = document.getElementById("region");

        if (regionSelect) {

            regionSelect.addEventListener("change", () => {

                const coordenada = COORDENADAS_POR_REGIAO[regionSelect.value];

                if (coordenada) {
                    pickerMap.setView([coordenada.lat, coordenada.lng], 13);
                }
            });
        }

        pickerMap.on("click", evento => {

            latitudeSelecionada = evento.latlng.lat;
            longitudeSelecionada = evento.latlng.lng;

            if (marcadorSelecionado) {
                marcadorSelecionado.setLatLng(evento.latlng);
            } else {
                marcadorSelecionado = L.marker(evento.latlng, { icon: iconeSelecao }).addTo(pickerMap);
            }

            const hint = document.getElementById("pickerMapHint");
            if (hint) hint.style.display = "none";
        });

        /* Corrige um problema comum do Leaflet: se o mapa nasce
           dentro de um layout que ainda está sendo montado, ele
           calcula o tamanho errado e fica cortado/cinza. */
        setTimeout(() => pickerMap.invalidateSize(), 200);
    }

    /* ==========================================
       ENVIO DO FORMULÁRIO
    ========================================== */

    form.addEventListener("submit", evento => {

        evento.preventDefault();

        const titulo = document.getElementById("title").value.trim();
        const categoria = document.getElementById("category").value;
        const regiao = document.getElementById("region").value;
        const localizacao = document.getElementById("location").value.trim();
        const descricao = document.getElementById("description").value.trim();

        const dadosLocalizacao = (latitudeSelecionada !== null && longitudeSelecionada !== null)
            ? { lat: latitudeSelecionada, lng: longitudeSelecionada }
            : {};

        const demanda = adicionarDemanda({
            titulo,
            categoria,
            regiao,
            localizacao,
            descricao,
            foto: fotoBase64,
            ...dadosLocalizacao
        });

        mostrarConfirmacao(demanda);
    });

    function mostrarConfirmacao(demanda) {

        form.reset();

        if (photoPreview) photoPreview.classList.remove("show");

        fotoBase64 = null;
        latitudeSelecionada = null;
        longitudeSelecionada = null;

        if (marcadorSelecionado && marcadorSelecionado._map) {
            marcadorSelecionado._map.removeLayer(marcadorSelecionado);
            marcadorSelecionado = null;
        }

        mostrarNotificacao({
            titulo: "Demanda registrada com sucesso!",
            mensagem: `"${demanda.titulo}" já está na lista de demandas e marcada no mapa.`,
            tipo: "sucesso",
            duracao: 9000,
            acoes: [
                { label: "Ver no mapa", primario: true, onClick: () => window.location.href = "mapa.html" },
                { label: "Ver na lista", onClick: () => window.location.href = "demandas.html" }
            ]
        });
    }

});

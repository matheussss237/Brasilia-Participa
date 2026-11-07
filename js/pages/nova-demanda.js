/* Assistente (wizard) de nova demanda em 3 etapas, com validação por etapa. */
(function () {
    "use strict";

    const BP = window.BP;
    const { api, dominio, ui, util, dados } = BP;

    const CAMPOS_POR_ETAPA = { 1: ["titulo", "categoria", "descricao"], 2: ["regiao", "localizacao"], 3: [] };
    const TAMANHO_MAX_FOTO = 10 * 1024 * 1024;
    const LADO_MAX_FOTO = 1280;

    const form = document.getElementById("formDemanda");
    const etapas = [...form.querySelectorAll(".etapa-form")];
    const botoes = {
        voltar: document.getElementById("voltar"),
        avancar: document.getElementById("avancar"),
        enviar: document.getElementById("enviar")
    };

    const estado = { etapa: 1, foto: null, lat: null, lng: null };
    let mapa = null;
    let marcador = null;

    /* ---------------- Montagem dos campos ---------------- */

    function montarCampos() {
        document.getElementById("opcoesCategoria").innerHTML = dados.categorias
            .map(
                (c) => `
                <label class="opcao-categoria" style="--cor-categoria:${c.cor}">
                    <input type="radio" name="categoria" value="${c.id}" class="sr-only">
                    <span class="opcao-categoria__icone" aria-hidden="true"><i class="fa-solid ${c.icone}"></i></span>
                    <span>${util.escapar(c.nome)}</span>
                </label>`
            )
            .join("");

        const regioes = [...dados.regioes].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        form.regiao.insertAdjacentHTML("beforeend", regioes.map((r) => `<option value="${r.id}">${util.escapar(r.nome)}</option>`).join(""));

        form.querySelectorAll("[data-contador-de]").forEach((contador) => {
            const campo = form[contador.dataset.contadorDe];
            const atualizar = () => (contador.textContent = `${campo.value.length}/${campo.maxLength}`);
            campo.addEventListener("input", atualizar);
            atualizar();
        });
    }

    /* ---------------- Validação ---------------- */

    function valores() {
        return {
            titulo: form.titulo.value,
            categoria: form.categoria.value,
            descricao: form.descricao.value,
            regiao: form.regiao.value,
            localizacao: form.localizacao.value
        };
    }

    function mostrarErro(campo, mensagem) {
        const alvo = form.querySelector(`[data-erro="${campo}"]`);
        if (alvo) alvo.textContent = mensagem || "";
        const elementos = campo === "categoria" ? form.querySelectorAll('[name="categoria"]') : [form[campo]];
        elementos.forEach((el) => el && el.setAttribute("aria-invalid", mensagem ? "true" : "false"));
    }

    function validarEtapa(n) {
        const campos = CAMPOS_POR_ETAPA[n];
        const erros = dominio.validarDemanda(valores(), campos);
        campos.forEach((c) => mostrarErro(c, erros[c]));
        const primeiro = campos.find((c) => erros[c]);
        if (primeiro) {
            const foco = primeiro === "categoria" ? form.querySelector('[name="categoria"]') : form[primeiro];
            foco.focus();
            return false;
        }
        return true;
    }

    /* Ao corrigir um campo, o erro some sem precisar clicar em "Próximo". */
    function ligarValidacaoAoVivo() {
        form.addEventListener("input", (e) => {
            const nome = e.target.name;
            if (!nome || !form.querySelector(`[data-erro="${nome}"]`)?.textContent) return;
            const erros = dominio.validarDemanda(valores(), [nome]);
            mostrarErro(nome, erros[nome]);
        });
        form.addEventListener("change", (e) => {
            if (e.target.name === "categoria" || e.target.name === "regiao") mostrarErro(e.target.name, null);
        });
    }

    /* ---------------- Navegação entre etapas ---------------- */

    function irPara(n, focar = true) {
        estado.etapa = n;
        etapas.forEach((el) => (el.hidden = Number(el.dataset.etapa) !== n));
        document.querySelectorAll(".progresso__item").forEach((item) => {
            const passo = Number(item.dataset.passo);
            item.classList.toggle("progresso__item--feito", passo < n);
            item.classList.toggle("progresso__item--atual", passo === n);
            if (passo === n) item.setAttribute("aria-current", "step");
            else item.removeAttribute("aria-current");
        });
        botoes.voltar.hidden = n === 1;
        botoes.avancar.hidden = n === 3;
        botoes.enviar.hidden = n !== 3;

        const etapa = etapas[n - 1];
        if (n === 2) prepararMapa();
        if (n === 3) montarResumo();
        if (!focar) return;

        document.getElementById("progresso").scrollIntoView({ behavior: ui.reduzirMovimento() ? "auto" : "smooth", block: "nearest" });
        etapa.querySelector("input:not([type=hidden]), select, textarea")?.focus({ preventScroll: true });
    }

    /* ---------------- Mapa ---------------- */

    function prepararMapa() {
        if (mapa || !BP.mapa) return;
        mapa = BP.mapa.criar(document.getElementById("mapaSelecao"), { rolagem: false });
        if (!mapa) return;
        centralizarNaRegiao();
        mapa.on("click", (e) => marcarPonto(e.latlng.lat, e.latlng.lng));
    }

    function centralizarNaRegiao() {
        if (!mapa || !form.regiao.value) return;
        const r = dominio.regiao(form.regiao.value);
        if (!marcador) mapa.setView([r.lat, r.lng], 14);
    }

    function marcarPonto(lat, lng) {
        estado.lat = lat;
        estado.lng = lng;
        if (marcador) marcador.setLatLng([lat, lng]);
        else marcador = window.L.marker([lat, lng], { icon: BP.mapa.iconeSelecao(), draggable: true }).addTo(mapa);
        marcador.off("dragend").on("dragend", () => {
            const p = marcador.getLatLng();
            marcarPonto(p.lat, p.lng);
        });
        document.getElementById("pontoSelecionado").textContent = `Ponto marcado: ${lat.toFixed(5)}, ${lng.toFixed(5)} (arraste o pino para ajustar).`;
        document.getElementById("limparPonto").hidden = false;
    }

    function limparPonto() {
        estado.lat = estado.lng = null;
        if (marcador) {
            marcador.remove();
            marcador = null;
        }
        document.getElementById("pontoSelecionado").textContent = "Nenhum ponto marcado.";
        document.getElementById("limparPonto").hidden = true;
    }

    /* ---------------- Foto ---------------- */

    /* Reduz a foto antes de salvar: o localStorage tem pouco espaço
       (em geral ~5 MB) e uma foto de celular passa disso facilmente. */
    function comprimirImagem(arquivo) {
        return new Promise((resolver, rejeitar) => {
            const url = URL.createObjectURL(arquivo);
            const img = new Image();
            img.onload = () => {
                const escala = Math.min(1, LADO_MAX_FOTO / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * escala);
                canvas.height = Math.round(img.height * escala);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);
                resolver(canvas.toDataURL("image/jpeg", 0.75));
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                rejeitar(new Error("Não foi possível ler esta imagem."));
            };
            img.src = url;
        });
    }

    function ligarFoto() {
        const entrada = form.foto;
        const previa = document.getElementById("previaFoto");
        const area = document.getElementById("areaUpload");

        entrada.addEventListener("change", async () => {
            const arquivo = entrada.files[0];
            mostrarErro("foto", null);
            if (!arquivo) return;
            if (!arquivo.type.startsWith("image/")) return mostrarErro("foto", "Escolha um arquivo de imagem.");
            if (arquivo.size > TAMANHO_MAX_FOTO) return mostrarErro("foto", "A imagem passa de 10 MB. Escolha uma menor.");
            try {
                estado.foto = await comprimirImagem(arquivo);
                document.getElementById("previaImagem").src = estado.foto;
                previa.hidden = false;
                area.hidden = true;
                montarResumo();
            } catch (erro) {
                mostrarErro("foto", erro.message);
            }
        });

        document.getElementById("removerFoto").addEventListener("click", () => {
            estado.foto = null;
            entrada.value = "";
            previa.hidden = true;
            area.hidden = false;
            montarResumo();
            area.focus();
        });
    }

    /* ---------------- Resumo e envio ---------------- */

    function montarResumo() {
        const v = valores();
        const linhas = [
            ["Título", util.escapar(v.titulo.trim())],
            ["Categoria", ui.chipCategoria(v.categoria)],
            ["Descrição", util.escapar(v.descricao.trim())],
            ["Região", util.escapar(dominio.regiao(v.regiao).nome)],
            ["Local", util.escapar(v.localizacao.trim())],
            ["Ponto no mapa", estado.lat === null ? "Centro da região" : "Marcado no mapa"],
            ["Foto", estado.foto ? "Anexada" : "Sem foto"]
        ];
        document.getElementById("resumo").innerHTML = linhas
            .map(([rotulo, valor], i) => `<div><dt>${rotulo}</dt><dd>${valor} <button type="button" class="btn btn--texto btn--sm" data-editar="${i < 3 ? 1 : i < 6 ? 2 : 3}">Editar</button></dd></div>`)
            .join("");
    }

    async function enviar(e) {
        e.preventDefault();
        if (!validarEtapa(1)) return irPara(1);
        if (!validarEtapa(2)) return irPara(2);

        botoes.enviar.disabled = true;
        botoes.enviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>Enviando…';
        try {
            const nova = await api.demandas.criar({ ...valores(), foto: estado.foto, lat: estado.lat ?? undefined, lng: estado.lng ?? undefined });
            mostrarSucesso(nova);
        } catch (erro) {
            ui.erroGenerico(erro);
        } finally {
            botoes.enviar.disabled = false;
            botoes.enviar.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i>Enviar demanda';
        }
    }

    function mostrarSucesso(nova) {
        document.getElementById("assistente").hidden = true;
        document.getElementById("avisoAnonimo").hidden = true;
        const caixa = document.getElementById("sucesso");
        document.getElementById("textoSucesso").textContent =
            `"${nova.titulo}" foi registrada com o status "Recebida" e já aparece na lista e no mapa.`;
        document.getElementById("verNoMapa").href = `mapa.html?id=${encodeURIComponent(nova.id)}`;
        document.getElementById("verNaLista").href = `demandas.html?id=${encodeURIComponent(nova.id)}`;
        caixa.hidden = false;
        caixa.focus();
    }

    /* ---------------- Início ---------------- */

    BP.pronto.then((usuario) => {
        document.getElementById("avisoAnonimo").hidden = Boolean(usuario);
        montarCampos();
        ligarValidacaoAoVivo();
        ligarFoto();

        botoes.avancar.addEventListener("click", () => validarEtapa(estado.etapa) && irPara(estado.etapa + 1));
        botoes.voltar.addEventListener("click", () => irPara(estado.etapa - 1));
        form.addEventListener("submit", enviar);
        form.regiao.addEventListener("change", centralizarNaRegiao);
        document.getElementById("limparPonto").addEventListener("click", limparPonto);
        document.getElementById("resumo").addEventListener("click", (e) => {
            const b = e.target.closest("[data-editar]");
            if (b) irPara(Number(b.dataset.editar));
        });

        /* Enter em um campo de texto avança a etapa em vez de enviar o formulário. */
        form.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && e.target.tagName === "INPUT" && estado.etapa < 3) {
                e.preventDefault();
                botoes.avancar.click();
            }
        });

        irPara(1, false);
    });
})();

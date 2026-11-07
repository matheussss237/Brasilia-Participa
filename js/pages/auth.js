/* Login e cadastro (autenticação simulada no navegador). */
(function () {
    "use strict";

    const BP = window.BP;
    const { api, ui, util } = BP;

    const form = document.getElementById("formAuth");
    const modo = form.dataset.modo; // "entrar" | "cadastrar"

    /* Só aceita voltar para páginas do próprio site (evita redirecionamento aberto). */
    function destino() {
        const proximo = new URLSearchParams(location.search).get("proximo");
        return proximo && /^[a-z-]+\.html$/.test(proximo) ? proximo : "index.html";
    }

    function mostrarErro(campo, mensagem) {
        const alvo = form.querySelector(`[data-erro="${campo}"]`);
        if (alvo) alvo.textContent = mensagem || "";
        if (form[campo]) form[campo].setAttribute("aria-invalid", mensagem ? "true" : "false");
    }

    function limparErros() {
        form.querySelectorAll("[data-erro]").forEach((el) => mostrarErro(el.dataset.erro, null));
    }

    function validarLocal() {
        const erros = {};
        if (modo === "cadastrar" && String(form.nome.value).trim().split(/\s+/).length < 2) erros.nome = "Informe nome e sobrenome.";
        if (!BP.dominio.validarEmail(form.email.value)) erros.email = "Informe um e-mail válido.";
        if (!form.senha.value) erros.senha = "Informe sua senha.";
        else if (modo === "cadastrar" && form.senha.value.length < 6) erros.senha = "A senha precisa ter pelo menos 6 caracteres.";
        if (modo === "cadastrar" && form.confirmacao.value !== form.senha.value) erros.confirmacao = "As senhas não conferem.";
        return erros;
    }

    BP.pronto.then((usuario) => {
        if (usuario) {
            location.replace(destino());
            return;
        }

        const proximo = new URLSearchParams(location.search).get("proximo");
        if (proximo) {
            document.querySelectorAll("[data-manter-proximo]").forEach((a) => {
                a.href = `${a.getAttribute("href")}?proximo=${encodeURIComponent(proximo)}`;
            });
        }

        document.querySelectorAll("[data-mostrar-senha]").forEach((botao) => {
            botao.addEventListener("click", () => {
                const campo = document.getElementById(botao.dataset.mostrarSenha);
                const mostrar = campo.type === "password";
                campo.type = mostrar ? "text" : "password";
                botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
                botao.querySelector("i").className = `fa-solid ${mostrar ? "fa-eye-slash" : "fa-eye"}`;
            });
        });

        form.addEventListener("input", (e) => e.target.name && mostrarErro(e.target.name, null));

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            limparErros();

            const erros = validarLocal();
            const campos = Object.keys(erros);
            if (campos.length) {
                campos.forEach((c) => mostrarErro(c, erros[c]));
                form[campos[0]].focus();
                return;
            }

            const botao = form.querySelector("[type=submit]");
            botao.disabled = true;
            try {
                const dados = { nome: form.nome?.value, email: form.email.value, senha: form.senha.value };
                const conta = modo === "cadastrar" ? await api.auth.cadastrar(dados) : await api.auth.entrar(dados);
                ui.toast({ titulo: `Bem-vindo(a), ${util.primeiroNome(conta.nome)}!`, duracao: 1500 });
                setTimeout(() => location.replace(destino()), 600);
            } catch (erro) {
                botao.disabled = false;
                if (erro.name === "ErroAutenticacao" && erro.campo) {
                    mostrarErro(erro.campo, erro.message);
                    form[erro.campo].focus();
                } else {
                    ui.erroGenerico(erro);
                }
            }
        });
    });
})();

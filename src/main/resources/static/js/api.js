/* =========================================================
   API.JS
   ---------------------------------------------------------
   Único arquivo do front que conversa com o back-end
   (Spring Boot). Todas as páginas usam as funções daqui.

   Substitui o antigo store.js (que usava o localStorage):
   agora os dados vêm do MongoDB através da API REST.

   Segurança: em todo POST/PATCH/DELETE enviamos o token
   CSRF que o Spring coloca no cookie XSRF-TOKEN.
========================================================= */

class ApiErro extends Error {
    constructor(status, corpo) {
        super((corpo && corpo.mensagem) || "Não foi possível falar com o servidor.");
        this.status = status;
        this.campos = (corpo && corpo.campos) || {};
    }
}

const api = (() => {

    function lerCookie(nome) {
        const item = document.cookie.split("; ").find(c => c.startsWith(nome + "="));
        return item ? decodeURIComponent(item.split("=")[1]) : null;
    }

    /* Garante que temos o token CSRF antes de enviar dados. */
    async function tokenCsrf() {
        let token = lerCookie("XSRF-TOKEN");
        if (!token) {
            await fetch("/api/auth/csrf", { credentials: "same-origin" });
            token = lerCookie("XSRF-TOKEN");
        }
        return token;
    }

    async function requisicao(metodo, url, corpo) {
        const opcoes = { method: metodo, credentials: "same-origin", headers: { "Accept": "application/json" } };

        if (metodo !== "GET") {
            opcoes.headers["X-XSRF-TOKEN"] = await tokenCsrf();
        }

        if (corpo instanceof FormData) {
            opcoes.body = corpo; // o navegador monta o multipart sozinho
        } else if (corpo !== undefined) {
            opcoes.headers["Content-Type"] = "application/json";
            opcoes.body = JSON.stringify(corpo);
        }

        let resposta;
        try {
            resposta = await fetch(url, opcoes);
        } catch (erro) {
            throw new ApiErro(0, { mensagem: "Sem conexão com o servidor. Ele está rodando?" });
        }

        if (resposta.status === 204) return null;

        const dados = await resposta.json().catch(() => null);

        if (!resposta.ok) throw new ApiErro(resposta.status, dados);

        return dados;
    }

    /* Monta a query string ignorando filtros vazios. */
    function comParametros(url, parametros = {}) {
        const busca = new URLSearchParams();
        Object.entries(parametros).forEach(([chave, valor]) => {
            if (valor !== undefined && valor !== null && valor !== "" && valor !== "all") {
                busca.set(chave, valor);
            }
        });
        const texto = busca.toString();
        return texto ? `${url}?${texto}` : url;
    }

    let sessaoCache = null;
    let referenciasCache = null;

    return {
        get: url => requisicao("GET", url),
        post: (url, corpo) => requisicao("POST", url, corpo),

        /* ---------- Autenticação ---------- */

        /* { logado: true/false, usuario: {...} } — fica em cache na página */
        sessao() {
            if (!sessaoCache) {
                sessaoCache = requisicao("GET", "/api/auth/sessao")
                    .catch(() => ({ logado: false, usuario: null }));
            }
            return sessaoCache;
        },
        login: (email, senha) => requisicao("POST", "/api/auth/login", { email, senha }),
        cadastrar: (nome, email, senha) => requisicao("POST", "/api/auth/cadastro", { nome, email, senha }),
        logout: () => requisicao("POST", "/api/auth/logout"),

        /* ---------- Demandas ---------- */

        listarDemandas: (filtros = {}) => requisicao("GET", comParametros("/api/demandas", filtros)),
        buscarDemanda: id => requisicao("GET", `/api/demandas/${encodeURIComponent(id)}`),
        demandasProximas: (lat, lng, categoria) =>
            requisicao("GET", comParametros("/api/demandas/proximas", { lat, lng, categoria })),

        /* dados = objeto da demanda; foto = File (opcional) */
        criarDemanda(dados, foto) {
            const formulario = new FormData();
            formulario.append("dados", new Blob([JSON.stringify(dados)], { type: "application/json" }));
            if (foto) formulario.append("foto", foto);
            return requisicao("POST", "/api/demandas", formulario);
        },
        apoiar: id => requisicao("POST", `/api/demandas/${encodeURIComponent(id)}/apoio`),
        comentar: (id, texto) => requisicao("POST", `/api/demandas/${encodeURIComponent(id)}/comentarios`, { texto }),
        alterarStatus: (id, status, observacao) =>
            requisicao("PATCH", `/api/demandas/${encodeURIComponent(id)}/status`, { status, observacao }),
        excluirDemanda: id => requisicao("DELETE", `/api/demandas/${encodeURIComponent(id)}`),

        /* ---------- Outros ---------- */

        estatisticas: () => requisicao("GET", "/api/estatisticas"),
        perfil: () => requisicao("GET", "/api/perfil"),
        referencias() {
            if (!referenciasCache) referenciasCache = requisicao("GET", "/api/referencias");
            return referenciasCache;
        }
    };
})();

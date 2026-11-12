/* =========================================================
   API — camada única de acesso a dados.
   ---------------------------------------------------------
   Com o servidor (npm start) os dados vão para o MongoDB
   Atlas pela API REST abaixo. Sem o servidor, os dados ficam
   no navegador (localStorage, via BP.storage), como antes.
   As páginas usam sempre BP.api e não precisam mudar.

   Rotas da API (server/app.js):
     demandas.listar()          -> GET   /api/v1/demands
     demandas.obter(id)         -> GET   /api/v1/demands/{id}
     demandas.criar(dados)      -> POST  /api/v1/demands  (JSON, foto em base64)
     demandas.alternarApoio(id) -> PATCH /api/v1/demands/{id}/vote
     demandas.apoiadas()        -> GET   /api/v1/votes
     auth.entrar / cadastrar    -> POST  /api/v1/auth/login | /api/v1/auth/register
     auth.atual / sair          -> GET   /api/v1/auth/me    | POST /api/v1/auth/logout
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    const { storage, dados, util } = BP;

    const CHAVES = {
        demandas: "demandas",
        versaoSeed: "seed-versao",
        usuarios: "usuarios",
        sessao: "sessao",
        apoios: "apoios",
        visitante: "visitante-id"
    };

    function clonar(valor) {
        return JSON.parse(JSON.stringify(valor));
    }

    function gerarId(prefixo) {
        const aleatorio = Math.random().toString(36).slice(2, 8);
        return `${prefixo}-${Date.now().toString(36)}-${aleatorio}`;
    }

    function notificarMudanca(tipo, detalhe) {
        if (typeof root.dispatchEvent === "function" && typeof root.CustomEvent === "function") {
            root.dispatchEvent(new root.CustomEvent("bp:mudanca", { detail: { tipo, ...detalhe } }));
        }
    }

    /* ======================================================
       DEMANDAS
    ====================================================== */

    /* Carrega as demandas salvas. Se a versão do seed mudou, as demandas
       de exemplo são atualizadas, mas as criadas pelos usuários são mantidas. */
    function carregarDemandas() {
        const salvas = storage.ler(CHAVES.demandas);
        const versao = storage.ler(CHAVES.versaoSeed);

        if (Array.isArray(salvas) && versao === dados.versaoSeed) return salvas;

        const idsSeed = new Set(dados.demandas.map((d) => d.id));
        const criadasPorUsuarios = (Array.isArray(salvas) ? salvas : []).filter((d) => d.criadaPeloUsuario && !idsSeed.has(d.id));
        const lista = [...criadasPorUsuarios, ...clonar(dados.demandas)];

        try {
            storage.gravar(CHAVES.demandas, lista);
            storage.gravar(CHAVES.versaoSeed, dados.versaoSeed);
        } catch (_) {
            /* sem espaço: segue só em memória nesta visita */
        }
        return lista;
    }

    function salvarDemandas(lista) {
        storage.gravar(CHAVES.demandas, lista);
    }

    /* Quem está apoiando: o usuário logado ou um id anônimo deste navegador. */
    function idApoiador() {
        const sessao = storage.ler(CHAVES.sessao);
        if (sessao && sessao.usuarioId) return sessao.usuarioId;
        let visitante = storage.ler(CHAVES.visitante);
        if (!visitante) {
            visitante = gerarId("visitante");
            try {
                storage.gravar(CHAVES.visitante, visitante);
            } catch (_) {
                /* ignora */
            }
        }
        return visitante;
    }

    function apoiosDe(apoiador) {
        const todos = storage.ler(CHAVES.apoios, {});
        return new Set(todos[apoiador] || []);
    }

    function gravarApoiosDe(apoiador, conjunto) {
        const todos = storage.ler(CHAVES.apoios, {});
        todos[apoiador] = [...conjunto];
        storage.gravar(CHAVES.apoios, todos);
    }

    const demandas = {
        async listar() {
            return clonar(carregarDemandas());
        },

        async obter(id) {
            const demanda = carregarDemandas().find((d) => d.id === id);
            return demanda ? clonar(demanda) : null;
        },

        async doUsuario(usuarioId) {
            return clonar(carregarDemandas().filter((d) => d.autorId === usuarioId));
        },

        /**
         * Cria uma demanda. Lança erro com `campos` se a validação falhar,
         * ou erro "ErroCota" se não houver espaço para salvar (ex.: foto grande).
         */
        async criar(entrada) {
            const erros = BP.dominio.validarDemanda(entrada);
            if (Object.keys(erros).length) {
                const erro = new Error("Dados da demanda inválidos.");
                erro.name = "ErroValidacao";
                erro.campos = erros;
                throw erro;
            }

            const regiao = BP.dominio.regiao(entrada.regiao);
            const temPonto = Number.isFinite(entrada.lat) && Number.isFinite(entrada.lng);
            const sessao = storage.ler(CHAVES.sessao);

            const nova = {
                id: gerarId("d"),
                titulo: entrada.titulo.trim(),
                descricao: entrada.descricao.trim(),
                categoria: entrada.categoria,
                regiao: entrada.regiao,
                localizacao: entrada.localizacao.trim(),
                status: "recebida",
                apoios: 0,
                data: util.hojeISO(),
                foto: entrada.foto || null,
                lat: temPonto ? entrada.lat : regiao.lat,
                lng: temPonto ? entrada.lng : regiao.lng,
                pontoExato: temPonto,
                autorId: sessao ? sessao.usuarioId : null,
                criadaPeloUsuario: true
            };

            const lista = carregarDemandas();
            lista.unshift(nova);
            salvarDemandas(lista);
            notificarMudanca("demanda-criada", { id: nova.id });
            return clonar(nova);
        },

        /** Ids das demandas apoiadas por quem está usando o navegador agora. */
        async apoiadas() {
            return apoiosDe(idApoiador());
        },

        /** Apoia ou retira o apoio. Retorna { apoios, apoiada }. */
        async alternarApoio(id) {
            const lista = carregarDemandas();
            const demanda = lista.find((d) => d.id === id);
            if (!demanda) throw new Error("Demanda não encontrada.");

            const apoiador = idApoiador();
            const conjunto = apoiosDe(apoiador);
            const apoiada = !conjunto.has(id);

            if (apoiada) conjunto.add(id);
            else conjunto.delete(id);
            demanda.apoios = Math.max(0, (demanda.apoios || 0) + (apoiada ? 1 : -1));

            salvarDemandas(lista);
            gravarApoiosDe(apoiador, conjunto);
            notificarMudanca("apoio", { id, apoios: demanda.apoios, apoiada });
            return { apoios: demanda.apoios, apoiada };
        }
    };

    /* ======================================================
       AUTENTICAÇÃO (simulada)
       Atenção: é apenas uma simulação para o protótipo. A senha
       é guardada como hash, mas tudo fica no navegador — não é
       um mecanismo de segurança real.
    ====================================================== */

    async function hashSenha(senha, sal) {
        const texto = `${sal}:${senha}`;
        const subtle = root.crypto && root.crypto.subtle;
        if (subtle && typeof root.TextEncoder === "function") {
            const bytes = await subtle.digest("SHA-256", new root.TextEncoder().encode(texto));
            return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
        }
        /* Contexto sem Web Crypto (ex.: http em rede local): hash simples. */
        let h = 5381;
        for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
        return `djb2-${(h >>> 0).toString(16)}`;
    }

    function publico(usuario) {
        if (!usuario) return null;
        const { senhaHash, sal, ...resto } = usuario;
        return { ...resto };
    }

    function usuarios() {
        return storage.ler(CHAVES.usuarios, []);
    }

    function iniciarSessao(usuario) {
        /* Apoios dados antes do login passam a valer para a conta. */
        const visitante = storage.ler(CHAVES.visitante);
        if (visitante) {
            const daConta = apoiosDe(usuario.id);
            apoiosDe(visitante).forEach((id) => daConta.add(id));
            gravarApoiosDe(usuario.id, daConta);
            gravarApoiosDe(visitante, new Set());
        }
        storage.gravar(CHAVES.sessao, { usuarioId: usuario.id, desde: new Date().toISOString() });
        notificarMudanca("sessao", { usuarioId: usuario.id });
    }

    function erroAuth(mensagem, campo) {
        const erro = new Error(mensagem);
        erro.name = "ErroAutenticacao";
        erro.campo = campo;
        return erro;
    }

    const auth = {
        async atual() {
            const sessao = storage.ler(CHAVES.sessao);
            if (!sessao) return null;
            return publico(usuarios().find((u) => u.id === sessao.usuarioId));
        },

        async cadastrar({ nome, email, senha }) {
            nome = String(nome || "").trim();
            email = String(email || "").trim().toLowerCase();

            if (nome.split(/\s+/).length < 2) throw erroAuth("Informe nome e sobrenome.", "nome");
            if (!BP.dominio.validarEmail(email)) throw erroAuth("Informe um e-mail válido.", "email");
            if (String(senha || "").length < 6) throw erroAuth("A senha precisa ter pelo menos 6 caracteres.", "senha");

            const lista = usuarios();
            if (lista.some((u) => u.email === email)) throw erroAuth("Já existe uma conta com este e-mail.", "email");

            const sal = gerarId("sal");
            const usuario = {
                id: gerarId("u"),
                nome,
                email,
                sal,
                senhaHash: await hashSenha(senha, sal),
                criadoEm: new Date().toISOString()
            };
            lista.push(usuario);
            storage.gravar(CHAVES.usuarios, lista);
            iniciarSessao(usuario);
            return publico(usuario);
        },

        async entrar({ email, senha }) {
            email = String(email || "").trim().toLowerCase();
            const usuario = usuarios().find((u) => u.email === email);
            if (!usuario || (await hashSenha(senha, usuario.sal)) !== usuario.senhaHash) {
                throw erroAuth("E-mail ou senha incorretos.", "senha");
            }
            iniciarSessao(usuario);
            return publico(usuario);
        },

        async sair() {
            storage.remover(CHAVES.sessao);
            notificarMudanca("sessao", { usuarioId: null });
        }
    };

    /* ======================================================
       MONGODB ATLAS (via API REST do servidor Node — server.js)
       Quando o site é aberto pelo servidor (npm start), os dados
       vão para o MongoDB Atlas. Se o site for aberto sem o
       servidor (arquivo local, python http.server, testes), tudo
       continua funcionando com o localStorage, como antes.
    ====================================================== */

    const URL_API = "/api/v1";
    const CHAVE_SESSAO_API = "sessao-api";
    let modoAtual = null;

    /** "remoto" (MongoDB via servidor) ou "local" (localStorage). */
    function modo() {
        if (!modoAtual) {
            modoAtual = (async () => {
                const loc = root.location;
                if (!loc || !/^https?:$/.test(loc.protocol) || typeof root.fetch !== "function") return "local";
                try {
                    const resposta = await root.fetch(`${URL_API}/health`, { cache: "no-store" });
                    if (resposta.ok && (await resposta.json()).ok) return "remoto";
                } catch (_) {
                    /* servidor indisponível */
                }
                return "local";
            })();
        }
        return modoAtual;
    }

    function idVisitante() {
        let visitante = storage.ler(CHAVES.visitante);
        if (!visitante) {
            visitante = gerarId("visitante");
            try {
                storage.gravar(CHAVES.visitante, visitante);
            } catch (_) {
                /* ignora */
            }
        }
        return visitante;
    }

    async function chamar(metodo, caminho, corpo) {
        const cabecalhos = { "X-Visitante": idVisitante() };
        const sessao = storage.ler(CHAVE_SESSAO_API);
        if (sessao && sessao.token) cabecalhos.Authorization = `Bearer ${sessao.token}`;
        if (corpo !== undefined) cabecalhos["Content-Type"] = "application/json";

        let resposta;
        try {
            resposta = await root.fetch(URL_API + caminho, {
                method: metodo,
                headers: cabecalhos,
                body: corpo === undefined ? undefined : JSON.stringify(corpo)
            });
        } catch (_) {
            throw new Error("Não foi possível falar com o servidor. Verifique se ele está rodando.");
        }

        const dadosResposta = await resposta.json().catch(() => null);
        if (!resposta.ok) {
            const info = (dadosResposta && dadosResposta.erro) || {};
            const erro = new Error(info.message || `Erro ${resposta.status} no servidor.`);
            erro.name = info.name || "Error";
            if (info.campos) erro.campos = info.campos;
            if (info.campo) erro.campo = info.campo;
            throw erro;
        }
        return dadosResposta;
    }

    function guardarSessaoApi(resultado) {
        storage.gravar(CHAVE_SESSAO_API, { token: resultado.token, usuarioId: resultado.usuario.id, desde: new Date().toISOString() });
        notificarMudanca("sessao", { usuarioId: resultado.usuario.id });
        return resultado.usuario;
    }

    const remoto = {
        demandas: {
            listar: () => chamar("GET", "/demands"),
            async obter(id) {
                try {
                    return await chamar("GET", `/demands/${encodeURIComponent(id)}`);
                } catch (erro) {
                    if (/não encontrada/i.test(erro.message)) return null;
                    throw erro;
                }
            },
            doUsuario: (usuarioId) => chamar("GET", `/demands?autor=${encodeURIComponent(usuarioId)}`),
            async criar(entrada) {
                const erros = BP.dominio.validarDemanda(entrada);
                if (Object.keys(erros).length) {
                    const erro = new Error("Dados da demanda inválidos.");
                    erro.name = "ErroValidacao";
                    erro.campos = erros;
                    throw erro;
                }
                const nova = await chamar("POST", "/demands", entrada);
                notificarMudanca("demanda-criada", { id: nova.id });
                return nova;
            },
            async apoiadas() {
                return new Set(await chamar("GET", "/votes"));
            },
            async alternarApoio(id) {
                const resultado = await chamar("PATCH", `/demands/${encodeURIComponent(id)}/vote`);
                notificarMudanca("apoio", { id, ...resultado });
                return resultado;
            }
        },
        auth: {
            async atual() {
                const sessao = storage.ler(CHAVE_SESSAO_API);
                if (!sessao || !sessao.token) return null;
                const usuario = await chamar("GET", "/auth/me");
                if (!usuario) storage.remover(CHAVE_SESSAO_API);
                return usuario;
            },
            async cadastrar(dados) {
                return guardarSessaoApi(await chamar("POST", "/auth/register", dados));
            },
            async entrar(dados) {
                return guardarSessaoApi(await chamar("POST", "/auth/login", dados));
            },
            async sair() {
                try {
                    await chamar("POST", "/auth/logout", {});
                } finally {
                    storage.remover(CHAVE_SESSAO_API);
                    notificarMudanca("sessao", { usuarioId: null });
                }
            }
        }
    };

    /* Mesmo formato de antes (BP.api.demandas.*, BP.api.auth.*): cada
       função escolhe entre o MongoDB (servidor) e o localStorage. */
    function escolher(local, remotoGrupo) {
        const grupo = {};
        Object.keys(local).forEach((nome) => {
            grupo[nome] = async (...args) => ((await modo()) === "remoto" ? remotoGrupo[nome](...args) : local[nome](...args));
        });
        return grupo;
    }

    BP.api = { demandas: escolher(demandas, remoto.demandas), auth: escolher(auth, remoto.auth), modo };
})(typeof window !== "undefined" ? window : globalThis);

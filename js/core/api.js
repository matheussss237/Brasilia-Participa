/* =========================================================
   API — camada única de acesso a dados.
   ---------------------------------------------------------
   Hoje os dados vivem no navegador (localStorage, via
   BP.storage). Todas as funções já são assíncronas (Promise),
   com a mesma "forma" que terá a API REST futura. Para
   integrar um back-end basta trocar o corpo destas funções
   por chamadas fetch() — as páginas não precisam mudar.

   Mapeamento previsto:
     demandas.listar()          -> GET   /api/v1/demands
     demandas.obter(id)         -> GET   /api/v1/demands/{id}
     demandas.criar(dados)      -> POST  /api/v1/demands  (multipart/form-data)
     demandas.alternarApoio(id) -> PATCH /api/v1/demands/{id}/vote
     auth.entrar / cadastrar    -> POST  /api/v1/auth/login | /api/v1/auth/register
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

    BP.api = { demandas, auth };
})(typeof window !== "undefined" ? window : globalThis);

/* =========================================================
   API REST do Brasília Participa (Express + MongoDB Atlas).
   ---------------------------------------------------------
   Reaproveita as mesmas regras de negócio do front-end
   (js/core/dominio.js) e as mesmas demandas de exemplo
   (js/data/demandas-seed.js).

   Coleções no MongoDB:
     demandas  — as demandas (campos iguais aos do front-end)
     usuarios  — contas (senha guardada com scrypt + sal)
     sessoes   — tokens de login
     apoios    — { apoiador, demandas: [ids] }
========================================================= */
"use strict";

const path = require("node:path");
const crypto = require("node:crypto");
const express = require("express");

const RAIZ = path.join(__dirname, "..");

/* Carrega os scripts do front-end (que se registram em globalThis.BP). */
function carregarBP() {
    const arquivos = [
        "js/data/categorias.js",
        "js/data/regioes.js",
        "js/data/demandas-seed.js",
        "js/core/util.js",
        "js/core/dominio.js"
    ];
    for (const arquivo of arquivos) require(path.join(RAIZ, arquivo));
    return globalThis.BP;
}

const BP = carregarBP();

function gerarId(prefixo) {
    const aleatorio = crypto.randomBytes(4).toString("hex").slice(0, 6);
    return `${prefixo}-${Date.now().toString(36)}-${aleatorio}`;
}

function hashSenha(senha, sal) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(String(senha), sal, 64, (erro, chave) => (erro ? reject(erro) : resolve(chave.toString("hex"))));
    });
}

/* Remove campos internos do MongoDB antes de enviar ao navegador. */
function semInternos(doc) {
    if (!doc) return null;
    const { _id, ordem, ...resto } = doc;
    return resto;
}

function publico(usuario) {
    if (!usuario) return null;
    const { _id, senhaHash, sal, ...resto } = usuario;
    return resto;
}

function erroHttp(status, name, message, extras = {}) {
    const erro = new Error(message);
    erro.status = status;
    erro.name = name;
    Object.assign(erro, extras);
    return erro;
}

/** Cria as demandas de exemplo se a coleção estiver vazia, e os índices. */
async function prepararBanco(db) {
    const demandas = db.collection("demandas");
    if ((await demandas.countDocuments({})) === 0) {
        const total = BP.dados.demandas.length;
        const docs = BP.dados.demandas.map((d, i) => ({ ...JSON.parse(JSON.stringify(d)), ordem: -(i + 1), criadaPeloUsuario: false }));
        if (total) await demandas.insertMany(docs);
    }
    await demandas.createIndex({ id: 1 }, { unique: true });
    await db.collection("usuarios").createIndex({ email: 1 }, { unique: true });
    await db.collection("usuarios").createIndex({ id: 1 }, { unique: true });
    await db.collection("sessoes").createIndex({ token: 1 }, { unique: true });
    await db.collection("apoios").createIndex({ apoiador: 1 }, { unique: true });
}

function criarApp(db) {
    const app = express();
    const col = {
        demandas: db.collection("demandas"),
        usuarios: db.collection("usuarios"),
        sessoes: db.collection("sessoes"),
        apoios: db.collection("apoios")
    };

    /* Fotos chegam em base64 (já comprimidas pelo navegador). */
    app.use(express.json({ limit: "8mb" }));

    const api = express.Router();
    const assincrono = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

    /* Identifica quem está usando: usuário logado (token) ou visitante anônimo. */
    async function usuarioDaRequisicao(req) {
        const cabecalho = req.get("authorization") || "";
        const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;
        if (!token) return null;
        const sessao = await col.sessoes.findOne({ token });
        return sessao ? sessao.usuarioId : null;
    }

    async function apoiador(req) {
        const usuarioId = await usuarioDaRequisicao(req);
        if (usuarioId) return usuarioId;
        const visitante = String(req.get("x-visitante") || "").slice(0, 80);
        return visitante ? `visitante:${visitante}` : null;
    }

    async function apoiosDe(quem) {
        if (!quem) return [];
        const doc = await col.apoios.findOne({ apoiador: quem });
        return doc ? doc.demandas : [];
    }

    async function gravarApoiosDe(quem, lista) {
        await col.apoios.updateOne({ apoiador: quem }, { $set: { demandas: [...new Set(lista)] } }, { upsert: true });
    }

    /* Apoios dados antes do login passam a valer para a conta. */
    async function iniciarSessao(req, usuario) {
        const visitante = String(req.get("x-visitante") || "");
        if (visitante) {
            const chave = `visitante:${visitante}`;
            const doVisitante = await apoiosDe(chave);
            if (doVisitante.length) {
                await gravarApoiosDe(usuario.id, [...(await apoiosDe(usuario.id)), ...doVisitante]);
                await gravarApoiosDe(chave, []);
            }
        }
        const token = crypto.randomBytes(32).toString("hex");
        await col.sessoes.insertOne({ token, usuarioId: usuario.id, desde: new Date().toISOString() });
        return token;
    }

    /* ---------------- Saúde ---------------- */
    api.get("/health", (req, res) => res.json({ ok: true, banco: "mongodb" }));

    /* ---------------- Demandas ---------------- */
    api.get("/demands", assincrono(async (req, res) => {
        const filtro = req.query.autor ? { autorId: String(req.query.autor) } : {};
        const lista = await col.demandas.find(filtro).sort({ ordem: -1 }).toArray();
        res.json(lista.map(semInternos));
    }));

    api.get("/demands/:id", assincrono(async (req, res) => {
        const demanda = await col.demandas.findOne({ id: req.params.id });
        if (!demanda) throw erroHttp(404, "Error", "Demanda não encontrada.");
        res.json(semInternos(demanda));
    }));

    api.post("/demands", assincrono(async (req, res) => {
        const entrada = req.body || {};
        const erros = BP.dominio.validarDemanda(entrada);
        if (Object.keys(erros).length) {
            throw erroHttp(400, "ErroValidacao", "Dados da demanda inválidos.", { campos: erros });
        }

        const regiao = BP.dominio.regiao(entrada.regiao);
        const temPonto = Number.isFinite(entrada.lat) && Number.isFinite(entrada.lng);
        const foto = typeof entrada.foto === "string" && entrada.foto ? entrada.foto : null;

        const nova = {
            id: gerarId("d"),
            titulo: String(entrada.titulo).trim(),
            descricao: String(entrada.descricao).trim(),
            categoria: entrada.categoria,
            regiao: entrada.regiao,
            localizacao: String(entrada.localizacao).trim(),
            status: "recebida",
            apoios: 0,
            data: BP.util.hojeISO(),
            foto,
            lat: temPonto ? entrada.lat : regiao.lat,
            lng: temPonto ? entrada.lng : regiao.lng,
            pontoExato: temPonto,
            autorId: await usuarioDaRequisicao(req),
            criadaPeloUsuario: true
        };

        await col.demandas.insertOne({ ...nova, ordem: Date.now() });
        res.status(201).json(nova);
    }));

    api.get("/votes", assincrono(async (req, res) => {
        res.json(await apoiosDe(await apoiador(req)));
    }));

    api.patch("/demands/:id/vote", assincrono(async (req, res) => {
        const id = req.params.id;
        const demanda = await col.demandas.findOne({ id });
        if (!demanda) throw erroHttp(404, "Error", "Demanda não encontrada.");

        const quem = await apoiador(req);
        if (!quem) throw erroHttp(400, "Error", "Não foi possível identificar o apoiador.");

        const atuais = await apoiosDe(quem);
        const apoiada = !atuais.includes(id);
        await gravarApoiosDe(quem, apoiada ? [...atuais, id] : atuais.filter((x) => x !== id));

        const apoios = Math.max(0, (demanda.apoios || 0) + (apoiada ? 1 : -1));
        await col.demandas.updateOne({ id }, { $set: { apoios } });
        res.json({ apoios, apoiada });
    }));

    /* ---------------- Autenticação ---------------- */
    api.get("/auth/me", assincrono(async (req, res) => {
        const usuarioId = await usuarioDaRequisicao(req);
        const usuario = usuarioId ? await col.usuarios.findOne({ id: usuarioId }) : null;
        res.json(publico(usuario));
    }));

    api.post("/auth/register", assincrono(async (req, res) => {
        const nome = String((req.body || {}).nome || "").trim();
        const email = String((req.body || {}).email || "").trim().toLowerCase();
        const senha = String((req.body || {}).senha || "");

        if (nome.split(/\s+/).length < 2) throw erroHttp(400, "ErroAutenticacao", "Informe nome e sobrenome.", { campo: "nome" });
        if (!BP.dominio.validarEmail(email)) throw erroHttp(400, "ErroAutenticacao", "Informe um e-mail válido.", { campo: "email" });
        if (senha.length < 6) throw erroHttp(400, "ErroAutenticacao", "A senha precisa ter pelo menos 6 caracteres.", { campo: "senha" });
        if (await col.usuarios.findOne({ email })) {
            throw erroHttp(409, "ErroAutenticacao", "Já existe uma conta com este e-mail.", { campo: "email" });
        }

        const sal = crypto.randomBytes(16).toString("hex");
        const usuario = { id: gerarId("u"), nome, email, sal, senhaHash: await hashSenha(senha, sal), criadoEm: new Date().toISOString() };
        await col.usuarios.insertOne(usuario);
        const token = await iniciarSessao(req, usuario);
        res.status(201).json({ usuario: publico(usuario), token });
    }));

    api.post("/auth/login", assincrono(async (req, res) => {
        const email = String((req.body || {}).email || "").trim().toLowerCase();
        const senha = String((req.body || {}).senha || "");
        const usuario = await col.usuarios.findOne({ email });
        if (!usuario || (await hashSenha(senha, usuario.sal)) !== usuario.senhaHash) {
            throw erroHttp(401, "ErroAutenticacao", "E-mail ou senha incorretos.", { campo: "senha" });
        }
        const token = await iniciarSessao(req, usuario);
        res.json({ usuario: publico(usuario), token });
    }));

    api.post("/auth/logout", assincrono(async (req, res) => {
        const cabecalho = req.get("authorization") || "";
        if (cabecalho.startsWith("Bearer ")) await col.sessoes.deleteOne({ token: cabecalho.slice(7) });
        res.json({ ok: true });
    }));

    app.use("/api/v1", api);
    app.use("/api", (req, res) => res.status(404).json({ erro: { name: "Error", message: "Rota não encontrada." } }));

    /* ---------------- Arquivos do site ---------------- */
    /* Só as pastas públicas — nunca .env, node_modules ou o código do servidor. */
    const estatico = (pasta) => express.static(path.join(RAIZ, pasta), { dotfiles: "ignore" });
    app.use("/css", estatico("css"));
    app.use("/js", estatico("js"));
    app.use("/imagens", estatico("imagens"));
    app.use("/docs", estatico("docs"));
    app.get(["/", "/:pagina.html"], (req, res, next) => {
        const pagina = req.params.pagina || "index";
        if (!/^[a-z-]+$/.test(pagina)) return next();
        res.sendFile(path.join(RAIZ, `${pagina}.html`), (erro) => erro && next());
    });

    /* ---------------- Erros ---------------- */
    app.use((erro, req, res, next) => { // eslint-disable-line no-unused-vars
        const status = erro.status || (erro.type === "entity.too.large" ? 413 : 500);
        if (status >= 500) console.error(erro);
        const message = status === 413 ? "A foto é grande demais para salvar." : status >= 500 ? "Erro interno no servidor." : erro.message;
        const name = status === 413 ? "ErroCota" : erro.name;
        res.status(status).json({ erro: { name, message, campos: erro.campos, campo: erro.campo } });
    });

    return app;
}

module.exports = { criarApp, prepararBanco };

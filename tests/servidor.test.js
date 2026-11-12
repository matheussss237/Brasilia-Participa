"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const criarBancoFalso = require("./fake-mongo");
const { criarApp, prepararBanco } = require("../server/app");

async function subir() {
    const db = criarBancoFalso();
    await prepararBanco(db);
    const servidor = criarApp(db).listen(0);
    await new Promise((r) => servidor.once("listening", r));
    const base = `http://127.0.0.1:${servidor.address().port}`;
    const chamar = async (metodo, caminho, corpo, cabecalhos = {}) => {
        const r = await fetch(base + caminho, {
            method: metodo,
            headers: { "Content-Type": "application/json", ...cabecalhos },
            body: corpo === undefined ? undefined : JSON.stringify(corpo)
        });
        return { status: r.status, corpo: await r.json().catch(() => null), tipo: r.headers.get("content-type") };
    };
    return { servidor, base, chamar };
}

const valida = {
    titulo: "Buraco enorme na rua principal",
    categoria: "infraestrutura",
    descricao: "Buraco grande que já causou dois acidentes com motos.",
    regiao: "gama",
    localizacao: "Rua 10"
};

test("servidor: lista as demandas de exemplo gravadas no banco", async (t) => {
    const { servidor, chamar } = await subir();
    t.after(() => servidor.close());
    const { status, corpo } = await chamar("GET", "/api/v1/demands");
    assert.equal(status, 200);
    assert.equal(corpo.length, globalThis.BP.dados.demandas.length);
    assert.equal(corpo[0].id, globalThis.BP.dados.demandas[0].id);
    assert.equal(corpo[0]._id, undefined);
});

test("servidor: cria demanda, valida campos e mostra primeiro na lista", async (t) => {
    const { servidor, chamar } = await subir();
    t.after(() => servidor.close());
    const invalida = await chamar("POST", "/api/v1/demands", { titulo: "x" });
    assert.equal(invalida.status, 400);
    assert.equal(invalida.corpo.erro.name, "ErroValidacao");
    assert.ok(invalida.corpo.erro.campos.titulo);

    const nova = await chamar("POST", "/api/v1/demands", valida);
    assert.equal(nova.status, 201);
    assert.equal(nova.corpo.status, "recebida");
    const lista = await chamar("GET", "/api/v1/demands");
    assert.equal(lista.corpo[0].id, nova.corpo.id);
    const uma = await chamar("GET", `/api/v1/demands/${nova.corpo.id}`);
    assert.deepEqual(uma.corpo, nova.corpo);
});

test("servidor: apoio liga/desliga e é migrado no login", async (t) => {
    const { servidor, chamar } = await subir();
    t.after(() => servidor.close());
    const visitante = { "X-Visitante": "v1" };
    const id = globalThis.BP.dados.demandas[0].id;
    const antes = globalThis.BP.dados.demandas[0].apoios;

    let r = await chamar("PATCH", `/api/v1/demands/${id}/vote`, undefined, visitante);
    assert.deepEqual(r.corpo, { apoios: antes + 1, apoiada: true });
    assert.deepEqual((await chamar("GET", "/api/v1/votes", undefined, visitante)).corpo, [id]);

    const cad = await chamar("POST", "/api/v1/auth/register", { nome: "Maria Silva", email: "Maria@x.com", senha: "123456" }, visitante);
    assert.equal(cad.status, 201);
    const logado = { Authorization: `Bearer ${cad.corpo.token}`, ...visitante };
    assert.deepEqual((await chamar("GET", "/api/v1/votes", undefined, logado)).corpo, [id]);

    r = await chamar("PATCH", `/api/v1/demands/${id}/vote`, undefined, logado);
    assert.deepEqual(r.corpo, { apoios: antes, apoiada: false });
});

test("servidor: cadastro, login, sessão e logout", async (t) => {
    const { servidor, chamar } = await subir();
    t.after(() => servidor.close());
    const cad = await chamar("POST", "/api/v1/auth/register", { nome: "João Souza", email: "joao@x.com", senha: "segredo1" });
    assert.equal(cad.corpo.usuario.email, "joao@x.com");
    assert.equal(cad.corpo.usuario.senhaHash, undefined);

    const repetido = await chamar("POST", "/api/v1/auth/register", { nome: "João Souza", email: "JOAO@x.com", senha: "segredo1" });
    assert.equal(repetido.status, 409);
    assert.equal(repetido.corpo.erro.campo, "email");

    const errado = await chamar("POST", "/api/v1/auth/login", { email: "joao@x.com", senha: "errada" });
    assert.equal(errado.status, 401);

    const login = await chamar("POST", "/api/v1/auth/login", { email: "joao@x.com", senha: "segredo1" });
    const auth = { Authorization: `Bearer ${login.corpo.token}` };
    assert.equal((await chamar("GET", "/api/v1/auth/me", undefined, auth)).corpo.nome, "João Souza");

    const nova = await chamar("POST", "/api/v1/demands", valida, auth);
    assert.equal(nova.corpo.autorId, login.corpo.usuario.id);
    const minhas = await chamar("GET", `/api/v1/demands?autor=${login.corpo.usuario.id}`);
    assert.equal(minhas.corpo.length, 1);

    await chamar("POST", "/api/v1/auth/logout", {}, auth);
    assert.equal((await chamar("GET", "/api/v1/auth/me", undefined, auth)).corpo, null);
});

test("servidor: serve as páginas e não expõe arquivos internos", async (t) => {
    const { servidor, base } = await subir();
    t.after(() => servidor.close());
    for (const caminho of ["/", "/mapa.html", "/css/base.css", "/js/core/api.js", "/imagens/BuracoGama.jpg"]) {
        assert.equal((await fetch(base + caminho)).status, 200, caminho);
    }
    for (const caminho of ["/.env", "/server.js", "/package.json", "/node_modules/express/package.json", "/server/app.js"]) {
        assert.equal((await fetch(base + caminho)).status, 404, caminho);
    }
});

test("servidor: nova versão do seed atualiza os exemplos e mantém as demandas dos usuários", async (t) => {
    const db = criarBancoFalso();
    await prepararBanco(db);
    const app = criarApp(db).listen(0);
    t.after(() => app.close());
    await new Promise((r) => app.once("listening", r));
    const base = `http://127.0.0.1:${app.address().port}`;
    await fetch(base + "/api/v1/demands", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valida) });

    const BP = globalThis.BP;
    const original = { versao: BP.dados.versaoSeed, data: BP.dados.demandas[0].data };
    t.after(() => { BP.dados.versaoSeed = original.versao; BP.dados.demandas[0].data = original.data; });
    BP.dados.versaoSeed = "teste";
    BP.dados.demandas[0].data = "2030-01-01";
    await prepararBanco(db);
    await prepararBanco(db);

    const lista = await (await fetch(base + "/api/v1/demands")).json();
    assert.equal(lista.length, BP.dados.demandas.length + 1);
    assert.equal(lista[0].titulo, valida.titulo);
    assert.equal(lista.find((d) => d.id === BP.dados.demandas[0].id).data, "2030-01-01");
});

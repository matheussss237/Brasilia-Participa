"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const carregar = require("./carregar");

/* Cada teste começa com um "navegador" limpo (storage em memória). */
function novoBP() {
    globalThis.localStorage = undefined;
    return carregar();
}

const valida = {
    titulo: "Buraco enorme na rua principal",
    categoria: "infraestrutura",
    descricao: "Buraco grande que já causou dois acidentes com motos.",
    regiao: "gama",
    localizacao: "Rua 10"
};

test("lista o seed na primeira visita (T01)", async () => {
    const BP = novoBP();
    const lista = await BP.api.demandas.listar();
    assert.equal(lista.length, BP.dados.demandas.length);
});

test("cria demanda (T07) com status inicial e coordenadas da região", async () => {
    const BP = novoBP();
    const nova = await BP.api.demandas.criar(valida);
    assert.equal(nova.status, "recebida");
    assert.equal(nova.apoios, 0);
    assert.equal(nova.lat, BP.dominio.regiao("gama").lat);
    assert.equal(nova.pontoExato, false);
    const lista = await BP.api.demandas.listar();
    assert.equal(lista[0].id, nova.id);
    assert.deepEqual(await BP.api.demandas.obter(nova.id), nova);
});

test("rejeita demanda inválida com erros por campo", async () => {
    const BP = novoBP();
    await assert.rejects(BP.api.demandas.criar({ ...valida, titulo: "abc" }), (e) => e.name === "ErroValidacao" && "titulo" in e.campos);
});

test("apoio alterna e não fica negativo (T05)", async () => {
    const BP = novoBP();
    const [d] = await BP.api.demandas.listar();
    const r1 = await BP.api.demandas.alternarApoio(d.id);
    assert.deepEqual(r1, { apoios: d.apoios + 1, apoiada: true });
    assert.ok((await BP.api.demandas.apoiadas()).has(d.id));
    const r2 = await BP.api.demandas.alternarApoio(d.id);
    assert.deepEqual(r2, { apoios: d.apoios, apoiada: false });
    await assert.rejects(BP.api.demandas.alternarApoio("nao-existe"));
});

test("cadastro, login e logout simulados", async () => {
    const BP = novoBP();
    const { auth } = BP.api;
    await assert.rejects(auth.cadastrar({ nome: "Ana", email: "ana@x.com", senha: "123456" }), (e) => e.campo === "nome");
    const conta = await auth.cadastrar({ nome: "Ana Souza", email: "ANA@x.com", senha: "123456" });
    assert.equal(conta.email, "ana@x.com");
    assert.ok(!("senhaHash" in conta));
    assert.equal((await auth.atual()).id, conta.id);

    await assert.rejects(auth.cadastrar({ nome: "Ana Souza", email: "ana@x.com", senha: "123456" }), (e) => e.campo === "email");

    await auth.sair();
    assert.equal(await auth.atual(), null);
    await assert.rejects(auth.entrar({ email: "ana@x.com", senha: "errada" }), (e) => e.name === "ErroAutenticacao");
    assert.equal((await auth.entrar({ email: "ana@x.com", senha: "123456" })).id, conta.id);

    const nova = await BP.api.demandas.criar(valida);
    assert.equal(nova.autorId, conta.id);
    assert.equal((await BP.api.demandas.doUsuario(conta.id)).length, 1);
});

test("apoios dados antes do login passam para a conta", async () => {
    const BP = novoBP();
    const [d] = await BP.api.demandas.listar();
    await BP.api.demandas.alternarApoio(d.id);
    await BP.api.auth.cadastrar({ nome: "Beto Lima", email: "beto@x.com", senha: "abcdef" });
    assert.ok((await BP.api.demandas.apoiadas()).has(d.id));
});

test("nova versão do seed mantém as demandas criadas pelos usuários", async () => {
    const BP = novoBP();
    const nova = await BP.api.demandas.criar(valida);
    BP.dados.versaoSeed = "999";
    const lista = await BP.api.demandas.listar();
    assert.ok(lista.some((d) => d.id === nova.id));
    assert.equal(lista.length, BP.dados.demandas.length + 1);
});

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const BP = require("./carregar")();
const D = BP.dominio;

const base = (extra) => ({
    id: "x", titulo: "Título qualquer", descricao: "Descrição", categoria: "limpeza",
    regiao: "gama", localizacao: "Rua", status: "recebida", apoios: 0, data: "2026-09-01", ...extra
});

test("dados mockados são consistentes", () => {
    const idsCategorias = new Set(BP.dados.categorias.map((c) => c.id));
    const idsRegioes = new Set(BP.dados.regioes.map((r) => r.id));
    const idsStatus = new Set(D.STATUS.map((s) => s.id));
    const ids = new Set();
    for (const d of BP.dados.demandas) {
        assert.ok(!ids.has(d.id), `id duplicado: ${d.id}`);
        ids.add(d.id);
        assert.ok(idsCategorias.has(d.categoria), `categoria inválida em ${d.id}`);
        assert.ok(idsRegioes.has(d.regiao), `região inválida em ${d.id}`);
        assert.ok(idsStatus.has(d.status), `status inválido em ${d.id}`);
        assert.match(d.data, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(Number.isFinite(d.lat) && Number.isFinite(d.lng));
        assert.deepEqual(D.validarDemanda(d), {}, `seed inválido: ${d.id}`);
    }
    assert.equal(BP.dados.regioes.length, 33);
});

test("filtra por região (T02), categoria (T03), status e texto sem acento", () => {
    const lista = BP.dados.demandas;
    assert.ok(D.filtrarDemandas(lista, { regiao: "ceilandia" }).every((d) => d.regiao === "ceilandia"));
    assert.ok(D.filtrarDemandas(lista, { categoria: "transporte" }).every((d) => d.categoria === "transporte"));
    assert.ok(D.filtrarDemandas(lista, { status: "resolvida" }).every((d) => d.status === "resolvida"));
    const busca = D.filtrarDemandas(lista, { q: "SEMAFORO aguas" });
    assert.deepEqual(busca.map((d) => d.id), ["semaforo-aguas-claras"]);
    assert.equal(D.filtrarDemandas(lista, { q: "inexistente-xyz" }).length, 0);
});

test("ordena por apoios e por data", () => {
    const lista = [base({ id: "a", apoios: 5, data: "2026-01-01" }), base({ id: "b", apoios: 9, data: "2025-01-01" })];
    assert.deepEqual(D.filtrarDemandas(lista, { ordem: "apoiadas" }).map((d) => d.id), ["b", "a"]);
    assert.deepEqual(D.filtrarDemandas(lista, { ordem: "recentes" }).map((d) => d.id), ["a", "b"]);
    assert.deepEqual(D.filtrarDemandas(lista, { ordem: "antigas" }).map((d) => d.id), ["b", "a"]);
});

test("estatísticas refletem os dados (T08)", () => {
    const lista = [
        base({ id: "1", status: "resolvida", apoios: 3 }),
        base({ id: "2", status: "pendente", apoios: 2, regiao: "guara" }),
        base({ id: "3", status: "em-analise" }),
        base({ id: "4", status: "recebida" })
    ];
    const s = D.estatisticas(lista);
    assert.equal(s.total, 4);
    assert.equal(s.resolvidas, 1);
    assert.equal(s.emAndamento, 2);
    assert.equal(s.recebidas, 1);
    assert.equal(s.apoios, 5);
    assert.equal(s.regioes, 2);
    assert.equal(s.taxaResolucao, 0.25);
    assert.equal(D.estatisticas([]).taxaResolucao, 0);

    const dist = D.distribuicaoPorStatus(lista);
    assert.deepEqual(dist.map((i) => i.quantidade), [1, 1, 1, 1]);
});

test("ranking de regiões e série mensal", () => {
    const lista = [
        base({ id: "1", regiao: "gama", apoios: 1 }),
        base({ id: "2", regiao: "gama", apoios: 1, data: "2026-08-10" }),
        base({ id: "3", regiao: "guara", apoios: 50 })
    ];
    const ranking = D.rankingRegioes(lista);
    assert.equal(ranking[0].regiao.id, "gama");
    assert.equal(ranking[0].demandas, 2);

    const serie = D.porMes(lista, 3, new Date(2026, 8, 15));
    assert.deepEqual(serie.map((p) => p.chave), ["2026-07", "2026-08", "2026-09"]);
    assert.deepEqual(serie.map((p) => p.quantidade), [0, 1, 2]);
});

test("conquistas seguem as regras simuladas (T09)", () => {
    const nenhuma = D.conquistas([], 0);
    assert.ok(nenhuma.every((c) => !c.conquistada));

    const relatos = [base({ id: "1", apoios: 20 }), base({ id: "2", apoios: 5 }), base({ id: "3" })];
    const obtidas = Object.fromEntries(D.conquistas(relatos, 3).map((c) => [c.id, c.conquistada]));
    assert.equal(obtidas["primeiro-relato"], true);
    assert.equal(obtidas["colaborador-bronze"], true);
    assert.equal(obtidas["guardiao-do-bairro"], true);
    assert.equal(obtidas["voz-da-cidade"], true);
    assert.equal(obtidas["colaborador-prata"], false);
});

test("validação da demanda (T06)", () => {
    const erros = D.validarDemanda({ titulo: "curto", categoria: "x", descricao: "", regiao: "", localizacao: "" });
    assert.deepEqual(Object.keys(erros).sort(), ["categoria", "descricao", "localizacao", "regiao", "titulo"]);
    assert.deepEqual(D.validarDemanda({ titulo: "curto" }, ["categoria"]), { categoria: "Escolha uma categoria." });
    assert.ok(D.validarEmail("a@b.com"));
    assert.ok(!D.validarEmail("a@b"));
});

test("util: escapar evita injeção de HTML", () => {
    assert.equal(BP.util.escapar('<img src=x onerror="alert(1)">'), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    assert.equal(BP.util.iniciais("Maria da Silva"), "MS");
    assert.equal(BP.util.tempoRelativo("2026-09-01", new Date(2026, 8, 1, 15)), "Hoje");
    assert.equal(BP.util.tempoRelativo("2026-08-31", new Date(2026, 8, 1)), "Ontem");
    assert.equal(BP.util.tempoRelativo("2026-06-01", new Date(2026, 8, 1)), "Há 3 meses");
});

/* =========================================================
   ARMAZENAMENTO — wrapper seguro do localStorage.
   Em aba anônima, com cookies bloqueados ou cota cheia o
   localStorage pode lançar exceções; aqui isso nunca quebra
   a página. Se não houver localStorage, os dados ficam em
   memória até a página ser recarregada.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});
    const PREFIXO = "bp:v2:";
    const memoria = new Map();

    function backend() {
        try {
            const ls = root.localStorage;
            const teste = PREFIXO + "__teste__";
            ls.setItem(teste, "1");
            ls.removeItem(teste);
            return ls;
        } catch (_) {
            return null;
        }
    }

    const ls = backend();

    function ler(chave, padrao = null) {
        const k = PREFIXO + chave;
        try {
            const bruto = ls ? ls.getItem(k) : memoria.get(k);
            return bruto == null ? padrao : JSON.parse(bruto);
        } catch (_) {
            return padrao;
        }
    }

    /** Salva um valor. Lança BP.storage.ErroCota se o navegador recusar por falta de espaço. */
    function gravar(chave, valor) {
        const k = PREFIXO + chave;
        const bruto = JSON.stringify(valor);
        if (!ls) {
            memoria.set(k, bruto);
            return;
        }
        try {
            ls.setItem(k, bruto);
        } catch (erro) {
            const e = new Error("Sem espaço para salvar os dados no navegador.");
            e.name = "ErroCota";
            e.causa = erro;
            throw e;
        }
    }

    function remover(chave) {
        const k = PREFIXO + chave;
        try {
            if (ls) ls.removeItem(k);
            else memoria.delete(k);
        } catch (_) {
            /* ignora */
        }
    }

    BP.storage = { ler, gravar, remover, persistente: Boolean(ls) };
})(typeof window !== "undefined" ? window : globalThis);

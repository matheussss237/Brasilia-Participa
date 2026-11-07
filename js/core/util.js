/* =========================================================
   UTILITÁRIOS — funções puras usadas em todo o projeto.
========================================================= */
(function (root) {
    "use strict";

    const BP = (root.BP = root.BP || {});

    const ENTIDADES_HTML = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

    /** Escapa texto antes de inserir em HTML (evita XSS com dados digitados pelo usuário). */
    function escapar(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, (c) => ENTIDADES_HTML[c]);
    }

    /** Minúsculas e sem acentos — usado em buscas. */
    function normalizar(texto) {
        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .trim();
    }

    function formatarNumero(numero) {
        return Number(numero || 0).toLocaleString("pt-BR");
    }

    function formatarPercentual(fracao) {
        return `${Math.round((fracao || 0) * 100)}%`;
    }

    /** "2026-09-08" -> Date local (sem deslocamento de fuso). */
    function dataDeISO(dataISO) {
        const [ano, mes, dia] = String(dataISO).split("-").map(Number);
        return new Date(ano, (mes || 1) - 1, dia || 1);
    }

    function hojeISO(agora = new Date()) {
        const p = (n) => String(n).padStart(2, "0");
        return `${agora.getFullYear()}-${p(agora.getMonth() + 1)}-${p(agora.getDate())}`;
    }

    function formatarData(dataISO) {
        if (!dataISO) return "";
        return dataDeISO(dataISO).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    }

    /** Texto relativo: "Hoje", "Ontem", "Há 5 dias", "Há 2 meses". */
    function tempoRelativo(dataISO, agora = new Date()) {
        if (!dataISO) return "";
        const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const dias = Math.round((inicioHoje - dataDeISO(dataISO)) / 86400000);

        if (dias <= 0) return "Hoje";
        if (dias === 1) return "Ontem";
        if (dias < 30) return `Há ${dias} dias`;
        const meses = Math.floor(dias / 30);
        if (meses < 12) return meses === 1 ? "Há 1 mês" : `Há ${meses} meses`;
        const anos = Math.floor(meses / 12);
        return anos === 1 ? "Há 1 ano" : `Há ${anos} anos`;
    }

    /** "Maria da Silva" -> "MS" */
    function iniciais(nome) {
        const partes = String(nome || "").trim().split(/\s+/).filter(Boolean);
        if (partes.length === 0) return "?";
        const primeira = partes[0][0];
        const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
        return (primeira + ultima).toUpperCase();
    }

    function primeiroNome(nome) {
        return String(nome || "").trim().split(/\s+/)[0] || "";
    }

    function debounce(fn, espera = 200) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), espera);
        };
    }

    function pluralizar(qtd, singular, plural) {
        return `${formatarNumero(qtd)} ${qtd === 1 ? singular : plural}`;
    }

    BP.util = {
        escapar,
        normalizar,
        formatarNumero,
        formatarPercentual,
        dataDeISO,
        hojeISO,
        formatarData,
        tempoRelativo,
        iniciais,
        primeiroNome,
        debounce,
        pluralizar
    };
})(typeof window !== "undefined" ? window : globalThis);

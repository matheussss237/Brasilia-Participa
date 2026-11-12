/* Banco MongoDB simulado em memória — só para os testes do servidor
   (implementa apenas as operações usadas em server/app.js). */
"use strict";

function combina(doc, filtro) {
    return Object.entries(filtro).every(([k, v]) => doc[k] === v);
}

function colecao() {
    const docs = [];
    const unicos = [];
    const copia = (d) => JSON.parse(JSON.stringify(d));
    const violaUnico = (novo, ignorar) =>
        unicos.some((campo) => docs.some((d) => d !== ignorar && d[campo] !== undefined && d[campo] === novo[campo]));

    return {
        async countDocuments(filtro = {}) { return docs.filter((d) => combina(d, filtro)).length; },
        async createIndex(chaves, opcoes = {}) { if (opcoes.unique) unicos.push(Object.keys(chaves)[0]); },
        async insertOne(doc) {
            if (violaUnico(doc)) throw new Error("E11000 duplicate key");
            docs.push(copia({ _id: docs.length + 1, ...doc }));
            return { acknowledged: true };
        },
        async insertMany(lista) { for (const d of lista) await this.insertOne(d); },
        async findOne(filtro) { const d = docs.find((x) => combina(x, filtro)); return d ? copia(d) : null; },
        find(filtro = {}) {
            let ordem = null;
            return {
                sort(o) { ordem = o; return this; },
                async toArray() {
                    const lista = docs.filter((d) => combina(d, filtro)).map(copia);
                    if (ordem) {
                        const [campo, dir] = Object.entries(ordem)[0];
                        lista.sort((a, b) => (a[campo] < b[campo] ? -1 : a[campo] > b[campo] ? 1 : 0) * dir);
                    }
                    return lista;
                }
            };
        },
        async updateOne(filtro, { $set }, opcoes = {}) {
            const d = docs.find((x) => combina(x, filtro));
            if (d) Object.assign(d, copia($set));
            else if (opcoes.upsert) docs.push(copia({ _id: docs.length + 1, ...filtro, ...$set }));
        },
        async deleteMany(filtro) { for (let i = docs.length - 1; i >= 0; i--) if (combina(docs[i], filtro)) docs.splice(i, 1); },
        async deleteOne(filtro) { const i = docs.findIndex((x) => combina(x, filtro)); if (i >= 0) docs.splice(i, 1); }
    };
}

module.exports = function criarBancoFalso() {
    const colecoes = new Map();
    return {
        collection(nome) {
            if (!colecoes.has(nome)) colecoes.set(nome, colecao());
            return colecoes.get(nome);
        }
    };
};

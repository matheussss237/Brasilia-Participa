/* =========================================================
   Servidor do Brasília Participa — conecta no MongoDB Atlas
   e serve o site + a API REST em http://localhost:PORTA.

   Configuração (arquivo .env na raiz do projeto):
     MONGODB_URI=mongodb+srv://usuario:senha@cluster.xxxxx.mongodb.net/
     MONGODB_DB=brasilia_participa   (opcional)
     PORT=3000                       (opcional)
========================================================= */
"use strict";

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { criarApp, prepararBanco } = require("./server/app");

const URI = process.env.MONGODB_URI;
const NOME_BANCO = process.env.MONGODB_DB || "brasilia_participa";
const PORTA = Number(process.env.PORT) || 3000;

async function iniciar() {
    if (!URI) {
        console.error("\n[ERRO] MONGODB_URI não definido.");
        console.error("Copie o arquivo .env.example para .env e cole a connection string do MongoDB Atlas.\n");
        process.exit(1);
    }

    const cliente = new MongoClient(URI, { serverSelectionTimeoutMS: 10000 });
    try {
        console.log("Conectando ao MongoDB Atlas...");
        await cliente.connect();
        await cliente.db(NOME_BANCO).command({ ping: 1 });
    } catch (erro) {
        console.error("\n[ERRO] Não foi possível conectar ao MongoDB Atlas:");
        console.error("  " + erro.message);
        console.error("\nConfira:");
        console.error("  1. Atlas > Network Access: o seu IP (ou 0.0.0.0/0) está liberado?");
        console.error("  2. Atlas > Database Access: usuário e senha estão corretos no .env?");
        console.error("     (caracteres especiais na senha, como @ # / :, precisam ser codificados — ex.: @ vira %40)");
        console.error("  3. O cluster está ativo (não pausado)?");
        console.error("  4. A rede (Wi-Fi da faculdade, por exemplo) não bloqueia a porta 27017?\n");
        process.exit(1);
    }

    const db = cliente.db(NOME_BANCO);
    await prepararBanco(db);
    console.log(`Conectado ao banco "${NOME_BANCO}".`);

    criarApp(db).listen(PORTA, () => {
        console.log(`Brasília Participa rodando em http://localhost:${PORTA}`);
    });

    const encerrar = async () => {
        await cliente.close();
        process.exit(0);
    };
    process.on("SIGINT", encerrar);
    process.on("SIGTERM", encerrar);
}

iniciar();

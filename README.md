# Brasília Participa

Portal de participação cidadã para registrar e acompanhar demandas urbanas no Distrito Federal.

**Status do projeto:** Em desenvolvimento. Back-end em Java (Spring Boot) + MongoDB, front-end em HTML, CSS e JavaScript.

---

## Identificação Acadêmica

| Item | Descrição |
|---|---|
| **Instituição de Ensino** | UniCEPLAC – Centro Universitário do Planalto Central |
| **Curso** | Engenharia de Software |
| **Disciplina** | Projeto Integrado de Certificação em Governança e Gestão de TI |
| **Orientador** | Profº Hudson Neves |

---

## Descrição

O **Brasília Participa** é um portal web de participação cidadã. Com ele, os moradores do Distrito Federal:

- registram problemas urbanos com foto e o ponto exato no mapa;
- apoiam e comentam as demandas de outros moradores;
- acompanham o andamento numa **linha do tempo**.

O poder público, por sua vez, usa um **painel de gestão** para priorizar as demandas, atualizar o status e responder oficialmente.

### Problema que o sistema resolve

Falta um canal simples, transparente e centralizado em que o cidadão relate problemas urbanos e acompanhe a resolução.

### Público-alvo

- **Cidadãos** do DF que querem relatar problemas na sua região administrativa.
- **Servidores públicos** (administradores) que tratam essas demandas.

---

## Funcionalidades

| Para quem | Funcionalidade |
|---|---|
| Todos | Página inicial com números reais e demandas recentes |
| Todos | Lista de demandas com busca, filtros (status, categoria, região), ordenação e "carregar mais" |
| Todos | Mapa interativo (Leaflet) com pinos coloridos por status; a legenda também serve de filtro |
| Todos | Página de detalhe com foto, mini mapa, **linha do tempo** do status e comentários |
| Todos | Dashboard com gráficos (Chart.js), taxa de resolução, tempo médio e ranking das regiões |
| Cidadão | Cadastro e login (senha criptografada com BCrypt) |
| Cidadão | Registro de demanda com foto, "usar minha localização" (GPS) e ponto no mapa |
| Cidadão | **Aviso de demanda parecida**: ao marcar o ponto, o sistema procura demandas da mesma categoria a até 300 m e sugere apoiar a existente, em vez de criar uma duplicada |
| Cidadão | Apoiar e remover o apoio (cada pessoa apoia só uma vez) |
| Cidadão | Comentários |
| Cidadão | Perfil com números de participação e **conquistas** (gamificação: "Colaborador Bronze", "Guardião do Bairro"...) |
| Administrador | Painel **Gestão** com resumo por status e troca rápida de status na tabela |
| Administrador | Mudança de status com observação, que vai para a linha do tempo da demanda |
| Administrador | Comentário como **resposta oficial** (destacado para o cidadão) |
| Administrador | Exclusão de demandas (spam ou duplicadas) |
| Todos | Tema claro/escuro, layout responsivo (celular) e respeito a `prefers-reduced-motion` |

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 4 (Web MVC, Data MongoDB, Security, Validation) |
| Banco de dados | MongoDB (as fotos ficam no próprio Mongo, via **GridFS**) |
| Documentação da API | springdoc-openapi (Swagger UI) |
| Front-end | HTML5, CSS3 e JavaScript puro (sem framework) |
| Bibliotecas do front | Leaflet (mapa), Chart.js (gráficos), Font Awesome (ícones). Ficam em `static/vendor/`, então funcionam sem CDN |
| Testes | JUnit 5 + MockMvc + mongo-java-server (MongoDB em memória) |
| Build | Maven (com Maven Wrapper: `mvnw`) |

---

## Arquitetura

```
 Navegador (HTML/CSS/JS)                    Servidor Spring Boot                       MongoDB
┌─────────────────────────┐  fetch() JSON  ┌──────────────────────────────────┐      ┌──────────────┐
│ index, demandas, mapa,  │ ─────────────► │ controller  →  service  →  repo  │ ───► │ demandas     │
│ demanda, nova-demanda,  │ ◄───────────── │ (REST)        (regras)   (Mongo) │ ◄─── │ usuarios     │
│ dashboard, perfil, admin│                │ security: sessão + CSRF + perfis │      │ fs.files/    │
│ js/api.js = único ponto │                │ static/: entrega o próprio site  │      │ fs.chunks    │
│ de contato com a API    │                └──────────────────────────────────┘      │ (fotos)      │
└─────────────────────────┘                                                          └──────────────┘
```

- **Um projeto só:** o mesmo servidor entrega o site (pasta `src/main/resources/static`) e a API (`/api/...`).
- **Camadas:** `controller` recebe a requisição, `service` aplica as regras de negócio e `repository` acessa o MongoDB.
- **`js/api.js`:** todas as páginas falam com o back-end por ele. Foi o arquivo que substituiu o antigo `store.js` (localStorage).

### Estrutura de pastas

```
brasilia-participa/
├── pom.xml                         dependências (Maven)
├── mvnw / mvnw.cmd                 Maven Wrapper (não precisa instalar o Maven)
├── docker-compose.yml              MongoDB local com 1 comando (opcional)
├── docs/                           backlog, caso de uso e relatório
└── src/
    ├── main/java/br/com/brasiliaparticipa/
    │   ├── BrasiliaParticipaApplication.java   ▶ rode esta classe
    │   ├── config/        segurança, Swagger e dados iniciais
    │   ├── controller/    endpoints REST (/api/...)
    │   ├── dto/           o que entra e sai da API (records)
    │   ├── exception/     erros padronizados em JSON
    │   ├── model/         documentos do MongoDB (Demanda, Usuario...)
    │   ├── repository/    acesso ao MongoDB (Spring Data)
    │   ├── security/      usuário logado e login
    │   └── service/       regras de negócio
    ├── main/resources/
    │   ├── application.properties
    │   └── static/        o site: *.html, css/, js/, imagens/, vendor/
    └── test/java/br/com/brasiliaparticipa/
        ├── ApiIntegracaoTest.java              testes da API
        ├── BrasiliaParticipaDemo.java          ▶ modo demonstração (sem instalar Mongo)
        └── MongoEmbutidoConfig.java
```

---

## Modelagem do banco (MongoDB)

Coleção **`demandas`**. O histórico, os comentários e quem apoiou ficam **dentro** do próprio documento: uma única leitura traz tudo, sem JOIN.

```json
{
  "_id": "6720f0c1...",
  "titulo": "Buraco na Avenida Principal do Gama",
  "descricao": "O asfalto está danificado próximo ao ponto de ônibus...",
  "categoria": "Infraestrutura",
  "regiao": "Gama",
  "endereco": "Avenida Principal, próximo ao ponto de ônibus",
  "latitude": -16.0206,
  "longitude": -48.0611,
  "status": "EM_ANALISE",
  "fotoUrl": "/api/fotos/6720f0c9...",
  "autorId": "671ff...", "autorNome": "Maria Silva",
  "apoiadores": ["671ff...", "6720a..."],
  "totalApoios": 2,
  "historico": [
    { "status": "RECEBIDA",   "observacao": "Demanda registrada pelo cidadão.", "responsavel": "Maria Silva", "data": "..." },
    { "status": "EM_ANALISE", "observacao": "Equipe enviada para vistoria.",    "responsavel": "Administração GDF", "data": "..." }
  ],
  "comentarios": [
    { "id": "…", "autorNome": "Administração GDF", "texto": "Equipe agendada.", "oficial": true, "data": "..." }
  ],
  "criadaEm": "...", "atualizadaEm": "...", "resolvidaEm": null
}
```

Coleção **`usuarios`**: `nome`, `email` (índice único), `senhaHash` (BCrypt), `perfil` (`CIDADAO` ou `ADMIN`) e `criadoEm`.

**Fotos:** ficam no **GridFS** (coleções `fs.files` e `fs.chunks`). O servidor confere a assinatura do arquivo (JPG/PNG/WEBP/GIF) e aceita até 5 MB.

**Dashboard:** os números por status, categoria e região são calculados pelo próprio MongoDB com o **Aggregation Framework** (`$group`). Veja `EstatisticaService.java`.

---

## Como rodar no IntelliJ IDEA (passo a passo)

### 1. Abrir o projeto

1. **File → Open…** e escolha a pasta `brasilia-participa` (a que tem o `pom.xml`).
2. Se perguntar, clique em **Trust Project** e **Load Maven Project**.
3. Espere a barra de baixo terminar de baixar as dependências. Na primeira vez demora alguns minutos.
4. Configure o **Java 21**: **File → Project Structure → Project → SDK**. Se não tiver, clique em **Add SDK → Download JDK…**, escolha a versão **21** e qualquer fornecedor (ex.: Eclipse Temurin).

### 2. Rodar SEM instalar o MongoDB (modo demonstração)

O jeito mais rápido de ver tudo funcionando:

1. Abra `src/test/java/br/com/brasiliaparticipa/BrasiliaParticipaDemo.java`.
2. Clique no **▶ verde** ao lado do `main` e escolha **Run**.
3. Acesse **http://localhost:8080**.

> Nesse modo o banco é um MongoDB em memória: **os dados somem quando você para o servidor**. Serve para testar e para apresentar; para o projeto "de verdade", use o passo 3.

### 3. Rodar com o MongoDB de verdade

Escolha **uma** das opções para ter um MongoDB rodando:

| Opção | Como fazer |
|---|---|
| **A) Instalar no PC** (recomendado) | Baixe o **MongoDB Community Server** em mongodb.com/try/download/community e instale com as opções padrão (marque "Install MongoDB as a Service" e também o **MongoDB Compass**, que serve para visualizar o banco). |
| **B) Docker** | Na pasta do projeto, rode `docker compose up -d`. |
| **C) MongoDB Atlas** (nuvem, grátis) | Crie um cluster gratuito em mongodb.com/atlas, crie um usuário de banco e libere seu IP. Em **Connect → Drivers**, copie a *connection string*. No IntelliJ, vá em **Run → Edit Configurations… → BrasiliaParticipaApplication → Environment variables** e adicione `MONGODB_URI=mongodb+srv://usuario:senha@.../brasilia_participa`. |

Depois:

1. Abra `src/main/java/br/com/brasiliaparticipa/BrasiliaParticipaApplication.java`.
2. Clique no **▶ verde** e escolha **Run**.
3. Acesse **http://localhost:8080**.

Na primeira execução, com o banco vazio, o sistema cria sozinho as **22 demandas de exemplo** e as contas abaixo.

### Contas de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Cidadão | `cidadao@email.com` | `cidadao123` |
| Administrador | `admin@brasiliaparticipa.df.gov.br` | `admin123` |

Na tela de login há botões que preenchem essas contas com um clique. **Troque as senhas antes de colocar o sistema na internet** (variáveis `ADMIN_EMAIL` e `ADMIN_SENHA`, ou o `application.properties`).

### Pelo terminal (opcional)

```bash
./mvnw spring-boot:run
```

Esse comando roda com o MongoDB de verdade. No Windows, use `mvnw.cmd` no lugar de `./mvnw`.

```bash
./mvnw spring-boot:test-run
```

Esse comando roda o modo demonstração, com o MongoDB em memória.

```bash
./mvnw test
```

Esse comando roda os testes automatizados.

### Dicas do dia a dia

- **Editou HTML, CSS ou JS?** Aperte **Ctrl+F9** (Build) no IntelliJ e recarregue a página. O DevTools atualiza o servidor sozinho.
- **Editou Java?** Também é só **Ctrl+F9**: o DevTools reinicia o servidor em poucos segundos.
- **Quer ver o banco?** Abra o **MongoDB Compass** e conecte em `mongodb://localhost:27017`. O banco se chama `brasilia_participa`.
- **Quer testar a API?** Abra **http://localhost:8080/swagger-ui.html**.

---

## API REST

Documentação interativa em **`/swagger-ui.html`**.

| Método | Rota | Quem pode | O que faz |
|---|---|---|---|
| GET | `/api/demandas?q=&status=&categoria=&regiao=&ordenar=&pagina=&tamanho=` | Todos | Lista com filtros e paginação |
| GET | `/api/demandas/{id}` | Todos | Detalhe com linha do tempo e comentários |
| GET | `/api/demandas/proximas?lat=&lng=&categoria=` | Todos | Demandas parecidas a até 300 m |
| POST | `/api/demandas` (multipart: `dados` + `foto`) | Logado | Registra demanda |
| POST | `/api/demandas/{id}/apoio` | Logado | Apoia / remove apoio |
| POST | `/api/demandas/{id}/comentarios` | Logado | Comenta |
| PATCH | `/api/demandas/{id}/status` | **ADMIN** | Muda o status (vai para a linha do tempo) |
| DELETE | `/api/demandas/{id}` | **ADMIN** | Exclui |
| GET | `/api/estatisticas` | Todos | Números do dashboard |
| GET | `/api/referencias` | Todos | Categorias, regiões (com coordenadas) e status |
| GET | `/api/fotos/{id}` | Todos | Foto de uma demanda |
| POST | `/api/auth/cadastro` · `/api/auth/login` · `/api/auth/logout` | — | Conta e sessão |
| GET | `/api/auth/sessao` | Todos | Quem está logado |
| GET | `/api/perfil` | Logado | Perfil, números e conquistas |

Os erros sempre voltam no mesmo formato:

```json
{ "status": 400, "erro": "Bad Request", "mensagem": "Confira os campos destacados.",
  "campos": { "titulo": "O título deve ter entre 5 e 120 caracteres" } }
```

---

## Segurança

- **Senhas** guardadas com **BCrypt** (nunca em texto puro).
- **Sessão** com cookie `HttpOnly`. O id da sessão muda no login, contra o ataque de *session fixation*.
- **CSRF:** todo POST/PATCH/DELETE precisa do token do cookie `XSRF-TOKEN`. O `js/api.js` já envia.
- **Permissões por perfil:** só `ADMIN` muda status e exclui. A regra fica no back-end (`SecurityConfig`), não só escondida na tela.
- **XSS:** todo texto digitado por usuários passa por `escaparHtml()` antes de aparecer na página.
- **Validação** de todos os dados no servidor (`@Valid`), além de conferir se o ponto está dentro do DF.
- **Upload:** o tipo real da imagem é conferido pelos primeiros bytes do arquivo, e o tamanho máximo é 5 MB.
- **Busca:** o texto digitado é tratado como literal (`Pattern.quote`), então não dá para injetar expressões regulares.

---

## Testes

`ApiIntegracaoTest` sobe o sistema inteiro com um MongoDB em memória e testa, entre outros:

- dados iniciais, filtros, busca e ordenação;
- cadastro (validação e e-mail repetido), login, senha errada e logout;
- bloqueio sem login e sem token CSRF;
- fluxo completo: criar com foto → demanda parecida por perto → apoiar/remover → comentar → cidadão **não** pode mudar status → admin muda status → perfil/conquistas → admin exclui (a foto vai junto);
- pontos fora do DF, arquivo que não é imagem e título vazio.

```bash
./mvnw test
```

---

## Roteiro sugerido para a apresentação

1. **Home:** os números vêm do banco em tempo real.
2. **Demandas:** filtre por região/status e ordene por "mais apoiadas".
3. Entre como **cidadão** e clique em **Registrar demanda**. Marque no mapa um ponto perto do "Buraco na Avenida Principal do Gama" e mostre o aviso de **demanda parecida**. Depois registre outra com foto.
4. Abra a demanda criada e mostre a **linha do tempo**. Apoie e comente.
5. Saia e entre como **administrador**. Em **Gestão**, mude o status, escreva uma observação e responda como **resposta oficial**.
6. Volte como cidadão: a linha do tempo mudou e o **perfil** mostra as conquistas.
7. **Dashboard:** gráficos e ranking das regiões, calculados por agregação no MongoDB.
8. **Mapa:** use a legenda para filtrar os status.
9. Mostre o **Swagger** (`/swagger-ui.html`) e o banco no **MongoDB Compass**.

---

## Equipe do Projeto

| Nome |
|---|
| Gabriel Alves da Cunha de Souza |
| Gabriel Andrade de Melo |
| Gabriel Mendes Siqueira |
| Iago Camilo Soares Pedroso |
| Igor Gabriel da Costa Souza |
| Igor Gabriel Ildefonso Costa |
| João Paulo Messias Dos Santos |
| João Vitor De Souza Guedes |
| Luiz Felipe Rodrigues Gusmão |
| Matheus Henrique Madeira Amorim |
| Oto Pereira Bonfim |

## Backlog e Cronograma

O backlog do produto (50 itens, BL01–BL50), o cronograma de sprints, os marcos, o escopo funcional, os cenários de teste e os entregáveis estão em [`docs/BACKLOG.md`](docs/BACKLOG.md). A planilha original está em [`docs/backlog_cronograma.xlsx`](docs/backlog_cronograma.xlsx).

## Melhorias futuras

- Notificação por e-mail quando o status de uma demanda mudar
- Integração com a Ouvidoria do DF (OuvDF)
- Recuperação de senha
- Deploy público (ex.: Render ou Railway + MongoDB Atlas)

## Licença

Este projeto não possui licença definida. Sem uma licença explícita, por padrão ninguém tem permissão legal para reutilizar o código, mesmo estando o repositório público.

# Brasília Participa

Portal de participação cidadã para registro e acompanhamento de demandas urbanas no Distrito Federal.

**Status do projeto:** Em desenvolvimento

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

**Brasília Participa** é um portal web de participação cidadã que permite aos moradores do Distrito Federal registrar problemas urbanos (infraestrutura, iluminação, limpeza, segurança, transporte, meio ambiente, educação, saúde e acessibilidade), acompanhar o andamento das solicitações em um mapa interativo e visualizar indicadores de participação em um dashboard.

Atualmente o projeto é um **front-end estático**, com os dados persistidos no `localStorage` do navegador e uma camada de dados única (`js/core/api.js`) já preparada para a integração com um back-end via API REST.

## Objetivos

### Objetivo Geral

Facilitar a comunicação entre a população e o poder público, oferecendo um canal digital centralizado para o registro, acompanhamento e visualização de demandas urbanas.

### Problema que o sistema resolve

A ausência de um canal simples, transparente e centralizado para que o cidadão relate problemas urbanos e acompanhe seu status de resolução.

### Público-alvo

Cidadãos e moradores do Distrito Federal (Brasília) que desejam relatar problemas em sua região administrativa e acompanhar o andamento dos atendimentos.

## Funcionalidades

- **Página inicial** (`index.html`): chamada para registrar demanda, indicadores gerais, "como funciona", demandas recentes e atalhos por categoria.
- **Demandas** (`demandas.html`): busca (sem diferenciar acentos), filtros por status, categoria e região administrativa, ordenação (recentes, mais apoiadas, antigas), paginação e filtros refletidos na URL (links compartilháveis).
- **Detalhes da demanda**: janela com foto, local, data, andamento (Recebida → Em análise → Resolvida) e botão de apoio.
- **Apoio ("Apoiaria esta causa")**: cada pessoa apoia uma vez; o apoio pode ser retirado. Apoios dados antes do login passam para a conta.
- **Mapa** (`mapa.html`): pinos coloridos por status com ícone do tipo de problema, filtros por status e categoria e painel de detalhes. `mapa.html?id=<id>` abre já focado em uma demanda.
- **Nova demanda** (`nova-demanda.html`): assistente em 3 etapas (problema → local → foto e revisão), validação por etapa, seleção do ponto exato no mapa (pino arrastável) e foto comprimida automaticamente antes de salvar.
- **Dashboard** (`dashboard.html`): indicadores, situação das demandas, demandas por categoria, ranking das regiões mais ativas, evolução mensal e mais apoiadas — tudo calculado dos dados, com filtro por região e tabela de dados para cada gráfico.
- **Perfil** (`perfil.html`): dados do usuário, suas demandas, causas apoiadas e **conquistas** (gamificação): Primeiro relato, Colaborador Bronze, Colaborador Prata, Guardião do Bairro e Voz da Cidade.
- **Cadastro e login simulados** (`cadastro.html` / `login.html`): contas salvas no navegador, com senha guardada como hash.
- **Tema claro/escuro** (segue o sistema por padrão), layout responsivo e cuidados de acessibilidade (navegação por teclado, foco visível, rótulos, link "pular para o conteúdo", respeito a "reduzir movimento").

## Tecnologias Utilizadas

- HTML5, CSS3 e JavaScript puro (sem frameworks e sem etapa de build)
- [Leaflet](https://leafletjs.com/) 1.9.4 + OpenStreetMap (mapas)
- Font Awesome 6.5.2 (ícones) e fonte Inter (Google Fonts)
- `localStorage` do navegador para persistência local
- `node:test` (Node.js 18+) para os testes automatizados

## Arquitetura da Solução

Front-end estático multipágina, organizado em camadas. Os scripts são carregados em ordem e se registram no objeto global `BP`:

| Camada | Arquivos | Responsabilidade |
|---|---|---|
| Dados (mocks) | `js/data/*.js` | Categorias, regiões administrativas e demandas de exemplo |
| Núcleo | `js/core/util.js` | Funções puras: escape de HTML, datas, formatação |
| | `js/core/storage.js` | Acesso seguro ao `localStorage` (com fallback em memória) |
| | `js/core/dominio.js` | Regras de negócio puras: status, filtros, estatísticas, ranking, conquistas, validação |
| | `js/core/api.js` | **Camada única de dados** (assíncrona) — ponto de troca para a API REST |
| Interface | `js/ui/layout.js` | Cabeçalho, rodapé, menu mobile e tema (gerados uma única vez para todas as páginas) |
| | `js/ui/componentes.js` | Card, badges, botão de apoio, modal de detalhes, notificações, contadores |
| | `js/ui/mapa-base.js` | Configuração comum do Leaflet |
| Páginas | `js/pages/*.js` | Lógica específica de cada tela |

Todo texto digitado pelo usuário é escapado antes de ir para o HTML (`BP.util.escapar`), evitando injeção de código.

### Integração futura com o back-end

Todas as funções de `js/core/api.js` já retornam `Promise`. Para conectar uma API REST (ex.: Java/Spring), basta trocar o corpo delas por `fetch()` — as páginas não mudam:

| Função | Rota prevista |
|---|---|
| `BP.api.demandas.listar()` | `GET /api/v1/demands` |
| `BP.api.demandas.obter(id)` | `GET /api/v1/demands/{id}` |
| `BP.api.demandas.criar(dados)` | `POST /api/v1/demands` (`multipart/form-data`) |
| `BP.api.demandas.alternarApoio(id)` | `PATCH /api/v1/demands/{id}/vote` |
| `BP.api.auth.entrar()` / `cadastrar()` / `sair()` | `POST /api/v1/auth/login` · `/register` · `/logout` |

## Modelagem dos Dados

Ainda não há banco de dados. Os dados ficam no `localStorage` com o prefixo `bp:v2:` (`demandas`, `usuarios`, `sessao`, `apoios`, `tema`).

**Demanda:** `id`, `titulo`, `descricao`, `categoria` (id), `regiao` (id), `localizacao`, `status` (`recebida` · `em-analise` · `pendente` · `resolvida`), `apoios`, `data` (AAAA-MM-DD), `foto` (URL ou imagem em base64), `lat`, `lng`, `pontoExato`, `autorId`.

**Usuário:** `id`, `nome`, `email`, `senhaHash`, `sal`, `criadoEm`.

Quando as demandas de exemplo mudam (`BP.dados.versaoSeed`), elas são atualizadas no navegador **sem apagar** as demandas criadas pelos usuários.

## Pré-requisitos

- Navegador moderno (Chrome, Edge, Firefox ou Safari atualizados)
- Conexão com a internet para carregar mapa, ícones e fonte via CDN
- Opcional: Python 3 (servidor local) e Node.js 18+ (testes)

## Instalação

```bash
git clone https://github.com/matheussss237/Brasilia-Participa.git
cd Brasilia-Participa
```

Não há dependências para instalar.

## Como Executar

Abra o `index.html` no navegador **ou** sirva a pasta com um servidor local:

```bash
python3 -m http.server 8000
```

e acesse `http://localhost:8000`. (Também funciona com `npm start`.)

Para recomeçar com os dados de exemplo, limpe os dados do site no navegador (ou apague as chaves `bp:v2:*` do `localStorage`).

## Testes

Testes automatizados das regras de negócio e da camada de dados (filtros, estatísticas, ranking, conquistas, validação, apoio, cadastro/login, escape de HTML):

```bash
npm test
```

Os cenários T01–T03 e T05–T09 de [`docs/BACKLOG.md`](docs/BACKLOG.md) estão indicados nos nomes dos testes. O T04 (clique no pino do mapa) ainda não tem teste automatizado; sua validação está registrada sob BL44 no [backlog oficial](docs/BACKLOG.md).

## Estrutura do Projeto

```
Brasilia-Participa/
├── index.html            # Página inicial
├── demandas.html         # Lista, busca e filtros
├── mapa.html             # Mapa interativo
├── nova-demanda.html     # Assistente de nova demanda (3 etapas)
├── dashboard.html        # Indicadores e gráficos
├── perfil.html           # Perfil, conquistas e minhas demandas
├── login.html            # Entrar
├── cadastro.html         # Criar conta
├── css/
│   ├── base.css          # Tokens de design (claro/escuro), reset, tipografia
│   ├── layout.css        # Cabeçalho, menu, rodapé, seções
│   ├── componentes.css   # Botões, formulários, cards, modal, toasts...
│   └── paginas.css       # Estilos específicos de cada página
├── js/
│   ├── data/             # Mocks: categorias, regiões e demandas de exemplo
│   ├── core/             # util, storage, dominio (regras) e api (dados)
│   ├── ui/               # layout, componentes, mapa-base, tema-inicial
│   └── pages/            # Um script por página
├── tests/                # Testes automatizados (node:test)
├── imagens/              # Fotos das demandas de exemplo, fundo e favicon
└── docs/                 # Backlog, caso de uso, relatório e Scrum
```

## Exemplos de Uso

1. Na página inicial, clique em **"Reporte um problema na sua região"**.
2. Etapa 1: informe título, categoria e descrição.
3. Etapa 2: escolha a região administrativa, o endereço e, se quiser, marque o ponto exato no mapa.
4. Etapa 3: anexe uma foto (opcional), revise e envie.
5. A demanda aparece na lista, no mapa e no dashboard. Outras pessoas podem apoiá-la.
6. Com uma conta, acompanhe suas demandas e conquistas em **Meu perfil**.

## Capturas de Tela

As capturas finais da apresentação **ainda não foram anexadas/validadas**. Após o teste manual, a equipe pode inseri-las em `docs/screenshots/`.

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

O backlog oficial do projeto contém **55 Issues (BL01–BL55)**, organizadas em sprints 0 a 12 e rastreáveis pelo GitHub. Consulte [`docs/BACKLOG.md`](docs/BACKLOG.md) para o cronograma, status das Issues, evidências e critérios de aceite. A planilha [`docs/backlog_cronograma.xlsx`](docs/backlog_cronograma.xlsx) é histórica e **não está reconciliada com os IDs atuais**.

## Melhorias Futuras

- Back-end em Java/Spring com API REST e banco de dados (substituindo `js/core/api.js`)
- Autenticação real e integração com identidade do cidadão
- Upload real de imagens
- Integração com sistemas de ouvidoria (ex.: OuvDF) e notificações de mudança de status
- Painel para servidores públicos atualizarem o status das demandas

## Licença

Este projeto não possui licença definida. Sem uma licença explícita, por padrão ninguém tem permissão legal para reutilizar o código, mesmo estando o repositório público.

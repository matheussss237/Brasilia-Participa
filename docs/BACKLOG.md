# Backlog e Cronograma — Brasília Participa

> Gerado a partir da planilha [`backlog_cronograma.xlsx`](backlog_cronograma.xlsx). Atualize o status dos itens aqui ou na planilha conforme o projeto avança.
>
> **Revisão de 07/11/2026:** status, responsáveis, campos dos mocks, status das demandas, marcos, equipe e testes foram alinhados ao que existe no repositório. Itens que mudaram em relação ao plano original têm "Mudança:" na observação; itens feitos fora do plano entraram como BL51–BL57. "A confirmar" marca o que não dá para verificar pelo repositório (personas, wireframes, Figma, testes de usabilidade).

## Sumário

- [Resumo](#resumo)
- [Marcos do projeto](#marcos-do-projeto)
- [Backlog](#backlog)
- [Cronograma](#cronograma)
- [Escopo funcional](#escopo-funcional)
- [Mocks e dados](#mocks-e-dados)
- [Integrações futuras](#integrações-futuras)
- [Equipe](#equipe)
- [Testes e aceite](#testes-e-aceite)
- [Entregáveis](#entregáveis)
- [Fora do escopo atual](#fora-do-escopo-atual)

## Resumo

| Campo | Descrição |
|---|---|
| Tipo | GovTech / Cidadania / Cidades Inteligentes |
| Tema | Engajamento cidadão e melhorias urbanas na comunidade local. |
| Visão | Plataforma web para mapear, relatar, apoiar e priorizar demandas urbanas nas Regiões Administrativas do DF, com transparência visual e gamificação. |
| Equipe | 11 alunos (ver aba Equipe) |
| Foco atual | Frontend estático com dados de exemplo em js/data/*.js e persistência no localStorage do navegador. |
| Frontend | HTML, CSS e JavaScript puro (sem framework e sem build), Leaflet + OpenStreetMap. |
| Backend atual | Não há. js/core/api.js é o ponto único de troca para a API REST futura (Java/Spring Boot + MongoDB, conforme o Relatório parcial). |
| Dados | Mocks em JS: demandas (demandas-seed.js), categorias (categorias.js) e regiões administrativas (regioes.js). |

## Marcos do projeto

| Sprint | Marco | Resultado | Status | Observação |
|---|---|---|---|---|
| Sprint 2 | M1 | Landing e feed navegáveis. | Concluído | Os filtros (BL12–BL14) são da Sprint 3, depois do M1. BL01, BL03 e BL04 (Sprints 0–1) seguem a confirmar. |
| Sprint 4 | M2 | Mapa interativo (Leaflet), detalhes da demanda e apoio. | Concluído | Mapa real em vez de simulado. |
| Sprint 6 | M3 | Wizard de nova solicitação completo. | Concluído |  |
| Sprint 8 | M4 | Dashboard e gamificação funcionando com mocks. | Concluído | Conquistas exibidas em perfil.html. |
| Sprint 10 | M5 | Testes do frontend e contratos das APIs REST futuras. | Em andamento | Testes automatizados prontos; contratos só resumidos no README (falta BACKEND_INTEGRATION.md). |
| Sprint 12 | M6 | MVP testado, documentado e pronto para apresentação. | Em andamento |  |

## Backlog

Total de itens: **57** — Concluído: **36** · Em andamento: **9** · A confirmar: **4** · Não iniciado: **8**.

| ID | Épico | Item do backlog | Prioridade | Dependência | Responsável | Status | Sprint | Observação |
|---|---|---|---|---|---|---|---|---|
| BL01 | Planejamento | Definir personas e jornada principal do cidadão | Alta | — | Documentação | A confirmar | Sprint 0 | Não há artefato de personas no repositório. |
| BL02 | Planejamento | Definir arquitetura de informação e fluxos de navegação | Alta | BL01 | Dev | Concluído | Sprint 0 | 8 páginas: início, demandas, mapa, nova demanda, dashboard, perfil, login e cadastro. |
| BL03 | UI/UX | Criar wireframes das telas principais | Alta | BL01 | Documentação | A confirmar | Sprint 0 | Não há wireframes no repositório. |
| BL04 | UI/UX | Criar protótipo de alta fidelidade e guia de estilos no Figma | Alta | BL03 | Documentação | A confirmar | Sprint 1 | Não há link do Figma no repositório. Tokens de design estão em css/base.css. |
| BL05 | Frontend | Estruturar projeto, componentes e padrão responsivo | Alta | BL02, BL04 | Dev | Concluído | Sprint 1 | Camadas js/data, js/core, js/ui e js/pages; CSS em base, layout, componentes e páginas. |
| BL06 | Mocks | Definir schema das demandas (js/data/demandas-seed.js) | Alta | BL02 | Dev | Concluído | Sprint 1 | Mudança: arquivo JS em vez de demands.json. Campos: id, titulo, descricao, categoria, regiao, localizacao, status, apoios, data, foto, lat, lng, pontoExato, autorId. |
| BL07 | Mocks | Definir categorias com ícones e cores (js/data/categorias.js) | Alta | BL02 | Dev | Concluído | Sprint 1 | Mudança: arquivo JS em vez de categories.json. 9 categorias com ícone Font Awesome e cor. |
| BL08 | Mocks | Definir regiões administrativas para filtros (js/data/regioes.js) | Alta | BL02 | Dev | Concluído | Sprint 1 | Mudança: arquivo JS em vez de regions.json. Cada RA tem lat/lng; não há bairros. |
| BL09 | Landing/Feed | Implementar hero com CTA 'Reporte um problema na sua região' | Alta | BL04, BL05 | Dev | Concluído | Sprint 2 | index.html. |
| BL10 | Landing/Feed | Criar cards de demandas com imagem, título, categoria, votos e status | Alta | BL05, BL06, BL07 | Dev | Concluído | Sprint 2 | js/ui/componentes.js. |
| BL11 | Landing/Feed | Carregar feed a partir dos mocks pela camada BP.api | Alta | BL06, BL10 | Dev | Concluído | Sprint 2 | Mudança: o seed é copiado para o localStorage na 1ª visita e lido via js/core/api.js. |
| BL12 | Landing/Feed | Implementar filtro por Região Administrativa | Alta | BL08, BL11 | Dev | Concluído | Sprint 3 | Mudança: filtro por bairro não implementado (regiões não têm bairros). |
| BL13 | Landing/Feed | Implementar filtro por categoria | Alta | BL07, BL11 | Dev | Concluído | Sprint 3 |  |
| BL14 | Landing/Feed | Implementar status Recebida, Em análise, Pendente e Resolvida | Alta | BL10 | Dev | Concluído | Sprint 3 | Mudança: 4 status em vez de 3. 'Pendente' não aparece no fluxo Recebida → Em análise → Resolvida (ver BL57). |
| BL15 | Mapa | Criar mapa interativo com Leaflet + OpenStreetMap | Alta | BL04, BL05 | Dev | Concluído | Sprint 4 | Mudança: mapa real em vez de simulado. |
| BL16 | Mapa | Renderizar pins interativos com as coordenadas dos mocks | Alta | BL06, BL15 | Dev | Concluído | Sprint 4 | Pinos coloridos por status, com ícone da categoria. |
| BL17 | Mapa | Abrir resumo da demanda ao clicar no pin | Alta | BL16 | Dev | Concluído | Sprint 4 | Painel de detalhes; mapa.html?id=<id> abre focado. Sem teste automatizado (ver BL56). |
| BL18 | Engajamento | Implementar botão 'Apoiaria esta causa' (1 apoio por pessoa, pode ser retirado) | Alta | BL17 | Dev | Concluído | Sprint 4 | Mudança: apoio salvo no localStorage, não só em memória. |
| BL19 | Solicitação | Criar estrutura do Wizard em 3 etapas | Alta | BL04, BL05 | Dev | Concluído | Sprint 5 | nova-demanda.html. |
| BL20 | Solicitação | Etapa 1: título, categoria e descrição | Alta | BL19 | Dev | Concluído | Sprint 5 |  |
| BL21 | Solicitação | Etapa 2: região, endereço e ponto exato no mapa | Alta | BL08, BL19 | Dev | Concluído | Sprint 5 | Pino arrastável no mapa. |
| BL22 | Solicitação | Etapa 3: foto (comprimida e salva no navegador) | Alta | BL19 | Dev | Concluído | Sprint 6 | Mudança: foto real em base64 no localStorage, não simulada. |
| BL23 | Solicitação | Adicionar validação, navegação anterior/próximo e resumo final | Alta | BL20, BL21, BL22 | Dev | Concluído | Sprint 6 |  |
| BL24 | Solicitação | Criar nova demanda (salva no localStorage) | Alta | BL23 | Dev | Concluído | Sprint 6 | Mudança: persistida no navegador, não só em memória. |
| BL25 | Dashboard | Criar indicador de total de demandas resolvidas | Alta | BL06 | Dev | Concluído | Sprint 7 |  |
| BL26 | Dashboard | Criar ranking visual das regiões mais ativas | Alta | BL06, BL08 | Dev | Concluído | Sprint 7 |  |
| BL27 | Gamificação | Definir regras simuladas de badges por votos/relatos | Alta | BL06 | Dev | Concluído | Sprint 7 | Prioridade corrigida de Média para Alta (escopo diz Obrigatório). Regras em js/core/dominio.js. |
| BL28 | Gamificação | Criar badges 'Colaborador Bronze' e 'Guardião do Bairro' | Alta | BL27 | Dev | Concluído | Sprint 8 | Prioridade corrigida para Alta. 'Guardião do Bairro' conta relatos na mesma RA. Extras: Primeiro relato, Colaborador Prata, Voz da Cidade. |
| BL29 | Dashboard | Criar gráficos calculados a partir dos dados | Alta | BL25, BL26 | Dev | Concluído | Sprint 8 | Gráficos em HTML/CSS, com tabela de dados e filtro por região. |
| BL30 | Dashboard | Integrar indicadores, ranking, gráficos e badges | Alta | BL25–BL29 | Dev | Concluído | Sprint 8 | Badges ficam em perfil.html. |
| BL31 | UX | Implementar feedbacks de vazio, carregamento e erro | Alta | BL11, BL24, BL30 | Dev | Em andamento | Sprint 9 | Estados de vazio e erro existem; conferir o de carregamento. |
| BL32 | UX | Revisar responsividade mobile/tablet/desktop | Alta | BL09–BL30 | Dev | Em andamento | Sprint 9 | Layout responsivo implementado; falta a revisão formal (T10). |
| BL33 | Acessibilidade | Revisar contraste, foco, labels, teclado e textos alternativos | Alta | BL09–BL30 | Dev | Em andamento | Sprint 9 | Foco visível, rótulos, teclado e 'pular para o conteúdo' implementados; falta a revisão formal (T11). |
| BL34 | QA | Executar testes de usabilidade do fluxo de feed e filtros | Alta | BL09–BL14 | Tester | A confirmar | Sprint 9 | T01–T03 automatizados e passando; teste de usabilidade com pessoas não registrado. |
| BL35 | QA | Executar testes de mapa, modal e upvote | Alta | BL15–BL18 | Tester | Em andamento | Sprint 9 | T05 automatizado; T04 (clique no pino) sem teste. |
| BL36 | QA | Executar testes do Wizard e validações | Alta | BL19–BL24 | Tester | Concluído | Sprint 10 | T06 e T07 automatizados (npm test). |
| BL37 | QA | Executar testes do dashboard e gamificação | Alta | BL25–BL30 | Tester | Concluído | Sprint 10 | T08 e T09 automatizados (npm test). |
| BL38 | Integração futura | Documentar GET /api/v1/demands | Alta | BL11 | Documentação | Em andamento | Sprint 10 | Rota listada no README; falta o contrato (parâmetros, paginação, resposta). |
| BL39 | Integração futura | Documentar POST /api/v1/demands com multipart/form-data | Alta | BL19–BL24 | Documentação | Em andamento | Sprint 10 | Rota listada no README; falta o payload. |
| BL40 | Integração futura | Documentar PATCH /api/v1/demands/{id}/vote | Alta | BL18 | Documentação | Em andamento | Sprint 10 | Rota listada no README. Atenção: o apoio alterna (dar/retirar), não só incrementa. |
| BL41 | Integração futura | Mapear substituição dos mocks pela API REST futura | Alta | BL38–BL40 | Documentação | Em andamento | Sprint 11 | README relaciona as funções de js/core/api.js às rotas. |
| BL42 | Integração futura | Mapear integração futura de identidade do cidadão | Média | BL51 | Documentação | Não iniciado | Sprint 11 | Provavelmente gov.br; confirmar a especificação. |
| BL43 | Integração futura | Mapear geolocalização por GPS (mapa Leaflet já em uso) | Média | BL15, BL16 | Documentação | Em andamento | Sprint 11 | Leaflet foi adiantado para a Sprint 4; falta só o GPS real. |
| BL44 | Integração futura | Mapear webhook para sistemas de ouvidoria pública, como OuvDF | Média | — | Documentação | Não iniciado | Sprint 11 |  |
| BL45 | Documentação | Criar BACKEND_INTEGRATION.md com contratos, payloads e pontos de troca | Alta | BL38–BL44 | Documentação | Não iniciado | Sprint 11 | Arquivo ainda não existe; bloqueia o T12. |
| BL46 | Qualidade | Refatorar componentes reutilizáveis e organização do código | Alta | BL05–BL30 | Dev | Concluído | Sprint 12 | Reescrita em camadas (commit c4152ff). |
| BL47 | Qualidade | Corrigir defeitos identificados pelo QA e testes de usabilidade | Alta | BL34–BL37 | Dev | Não iniciado | Sprint 12 |  |
| BL48 | Documentação | Criar README com execução, arquitetura de mocks e estrutura do projeto | Alta | BL05–BL30 | Documentação | Concluído | Sprint 12 | Falta a seção de capturas de tela. |
| BL49 | Apresentação | Preparar roteiro de demonstração e divisão da apresentação | Alta | BL45–BL48 | Equipe | Não iniciado | Sprint 12 |  |
| BL50 | Entrega | Validação final do MVP e critérios de aceite | Alta | BL46–BL49 | Equipe | Não iniciado | Sprint 12 |  |
| BL51 | Autenticação | Cadastro e login simulados (senha guardada como hash) | Média | BL05 | Dev | Concluído | Não planejado | Item novo: feito sem estar no backlog. cadastro.html e login.html. |
| BL52 | Perfil | Página de perfil com minhas demandas, causas apoiadas e conquistas | Média | BL28, BL51 | Dev | Concluído | Não planejado | Item novo: feito sem estar no backlog. perfil.html. |
| BL53 | Landing/Feed | Busca sem acento, filtro por status, ordenação, paginação e filtros na URL | Média | BL11 | Dev | Concluído | Não planejado | Item novo: feito sem estar no backlog. demandas.html. |
| BL54 | UX | Tema claro/escuro seguindo o sistema | Baixa | BL05 | Dev | Concluído | Não planejado | Item novo: feito sem estar no backlog. |
| BL55 | QA | Testes automatizados com node:test (npm test) | Alta | BL46 | Tester | Concluído | Não planejado | Item novo: 15 testes passando, cobrindo T01–T03 e T05–T09. |
| BL56 | QA | Criar teste do clique no pino (T04) | Alta | BL17, BL55 | Tester | Não iniciado | Sprint 12 | Item novo: o README diz que T01–T09 estão cobertos, mas falta o T04. |
| BL57 | Qualidade | Definir onde o status 'Pendente' entra no fluxo de andamento | Média | BL14 | Dev | Não iniciado | Sprint 12 | Item novo: o fluxo exibido é Recebida → Em análise → Resolvida. |

## Cronograma

| Sprint | Fase | Frontend % | Integração futura % | QA/UX/Docs % | Entregas principais | Marco |
|---|---|---|---|---|---|---|
| Sprint 0 | Descoberta/Planejamento | 10 | 0 | 90 | Personas, jornada, arquitetura da informação e wireframes |  |
| Sprint 1 | Design + Fundação | 50 | 10 | 40 | Figma, guia de estilos, estrutura do frontend e schemas JSON |  |
| Sprint 2 | Frontend | 85 | 10 | 5 | Hero, cards e feed carregado dos mocks | M1 — Feed navegável |
| Sprint 3 | Frontend | 85 | 10 | 5 | Filtros de região/categoria e status visuais |  |
| Sprint 4 | Frontend/Interação | 80 | 10 | 10 | Mapa simulado, pins, modal e upvote em memória | M2 — Mapa e apoio |
| Sprint 5 | Frontend | 85 | 10 | 5 | Wizard: etapas 1 e 2 |  |
| Sprint 6 | Frontend | 80 | 10 | 10 | Evidência simulada, validações e criação em memória | M3 — Nova solicitação |
| Sprint 7 | Frontend/Dados | 75 | 15 | 10 | Indicadores, ranking e regras de gamificação |  |
| Sprint 8 | Frontend/Dashboard | 75 | 15 | 10 | Gráficos e badges integrados | M4 — Dashboard completo |
| Sprint 9 | UX/QA | 50 | 10 | 40 | Estados de interface, responsividade, acessibilidade e testes |  |
| Sprint 10 | QA/Integração futura | 35 | 30 | 35 | Testes e documentação das três APIs REST futuras | M5 — Contratos de API |
| Sprint 11 | Transição futura | 25 | 45 | 30 | Mapeamento de substituição dos mocks e integrações externas |  |
| Sprint 12 | Estabilização | 25 | 20 | 55 | Refatoração, correções, README, documentação e apresentação | M6 — MVP concluído |

## Escopo funcional

| Grupo | Área | Funcionalidade | Prioridade | Backlog | Status |
|---|---|---|---|---|---|
| A | Landing Page & Feed | Hero com CTA. | Obrigatório | BL09 | Concluído |
| A | Landing Page & Feed | Cards com imagem, título, categoria, votos e status. | Obrigatório | BL10–BL11 | Concluído |
| A | Landing Page & Feed | Filtros por Região Administrativa e Categoria. | Obrigatório | BL12–BL13 | Concluído (sem bairro) |
| A | Landing Page & Feed | Status das demandas. | Obrigatório | BL14 | Concluído |
| B | Mapa | Mapa interativo (Leaflet) com pins. | Obrigatório | BL15–BL16 | Concluído |
| B | Mapa | Detalhes da demanda e botão de apoio. | Obrigatório | BL17–BL18 | Concluído |
| C | Nova Solicitação | Wizard: título, categoria e descrição. | Obrigatório | BL19–BL20 | Concluído |
| C | Nova Solicitação | Wizard: região, endereço e ponto no mapa. | Obrigatório | BL21 | Concluído |
| C | Nova Solicitação | Wizard: foto, validação, revisão e envio. | Obrigatório | BL22–BL24 | Concluído |
| D | Dashboard | Total de demandas resolvidas. | Obrigatório | BL25 | Concluído |
| D | Dashboard | Ranking das regiões mais ativas. | Obrigatório | BL26 | Concluído |
| D | Gamificação | Badges conforme votos/relatos. | Obrigatório | BL27–BL30 | Concluído |

## Mocks e dados

| Arquivo | Objetivo | Campos | Consumidores | Observação |
|---|---|---|---|---|
| js/data/demandas-seed.js | Demandas de exemplo (equivale a demands.json). | id, titulo, descricao, categoria, regiao, localizacao, status, apoios, data, foto, lat, lng (+ pontoExato e autorId nas criadas pelo usuário) | Feed, mapa, dashboard, perfil | Copiado para o localStorage (bp:v2:demandas); atualizado quando versaoSeed muda, sem apagar as do usuário. |
| js/data/categorias.js | Categorias de demandas (equivale a categories.json). | id, nome, icone, cor | Feed, filtros, formulário, mapa, dashboard | 9 categorias: Infraestrutura, Iluminação, Limpeza, Segurança, Transporte, Meio ambiente, Educação, Saúde, Acessibilidade. |
| js/data/regioes.js | Regiões administrativas do DF (equivale a regions.json). | id, nome, lat, lng | Filtros, formulário, mapa, dashboard | Sem bairros. lat/lng centralizam o mapa e são a posição padrão quando não há ponto exato. |

## Integrações futuras

| Tipo | Método | Rota/Integração | Finalidade | Nota de transição |
|---|---|---|---|---|
| REST | GET | /api/v1/demands | Listar demandas (paginado). | Substitui BP.api.demandas.listar(). |
| REST | GET | /api/v1/demands/{id} | Obter uma demanda. | Substitui BP.api.demandas.obter(id). |
| REST | POST | /api/v1/demands | Criar demanda com dados e imagem. | Usar multipart/form-data. Substitui BP.api.demandas.criar(dados). |
| REST | PATCH | /api/v1/demands/{id}/vote | Dar ou retirar apoio. | Substitui BP.api.demandas.alternarApoio(id), hoje no localStorage. |
| REST | POST | /api/v1/auth/login · /register · /logout | Autenticação. | Substitui BP.api.auth (login simulado). |
| Externa | — | Identidade do cidadão | Validação futura de identidade. | Provavelmente gov.br; especificação a definir. |
| Externa | — | Geolocalização (GPS) | Posição exata do cidadão. | Leaflet + OpenStreetMap já em uso; falta só o GPS. |
| Webhook | — | Ouvidoria pública / OuvDF | Integração futura com sistema de ouvidoria. | Mapear eventos, payloads e autenticação. |

## Equipe

Papéis conforme o Relatório parcial (`docs/Relatorio_parcial.pdf`).

| Papel | Pessoas | Integrantes | Responsabilidades | Backlog predominante |
|---|---|---|---|---|
| Scrum Master | 1 | Matheus Henrique Madeira Amorim | Facilitar cerimônias, remover impedimentos e manter o backlog atualizado. | Acompanhamento; coordena BL49–BL50 (feitos pela equipe toda) |
| Dev | 4 | Iago Camilo Soares Pedroso, Igor Gabriel da Costa Souza, Luiz Felipe Rodrigues Gusmão, Oto Pereira Bonfim | Interface responsiva, componentes, mocks, feed, mapa, wizard, dashboard e correções. | BL02, BL05–BL33, BL46–BL47, BL51–BL54, BL57 |
| Tester | 1 | Gabriel Alves da Cunha de Souza | Testes automatizados, testes de usabilidade e critérios de aceite. | BL34–BL37, BL55–BL56 |
| Documentação | 5 | Gabriel Andrade de Melo, Gabriel Mendes Siqueira, Igor Gabriel Ildefonso Costa, João Paulo Messias Dos Santos, João Vitor de Souza Guedes | Personas, protótipos, documentação das integrações futuras e README. | BL01, BL03–BL04, BL38–BL45, BL48 |

## Testes e aceite

Execute com `npm test`.

| ID | Cenário | Resultado esperado | Status | Observação |
|---|---|---|---|---|
| T01 | Feed carrega dados mockados | Cards exibem dados essenciais e status corretamente. | Aprovado | tests/api.test.js |
| T02 | Filtro por região | Feed mostra somente demandas da região selecionada. | Aprovado | tests/dominio.test.js |
| T03 | Filtro por categoria | Feed mostra somente a categoria selecionada. | Aprovado | tests/dominio.test.js |
| T04 | Clique em pin | Painel abre com resumo da demanda correspondente. | Não executado | Sem teste automatizado (BL56). |
| T05 | Apoio | Contagem aumenta (e diminui ao retirar) sem recarregar a página. | Aprovado | tests/api.test.js |
| T06 | Wizard incompleto | Usuário não avança sem campos obrigatórios da etapa. | Aprovado | tests/dominio.test.js (validação) |
| T07 | Wizard completo | Resumo é exibido e a nova demanda é salva. | Aprovado | tests/api.test.js |
| T08 | Dashboard | Indicadores refletem os dados. | Aprovado | tests/dominio.test.js |
| T09 | Gamificação | Badge exibido corresponde às regras definidas. | Aprovado | tests/dominio.test.js |
| T10 | Responsividade | Fluxos principais funcionam em mobile, tablet e desktop. | Não executado | Revisão manual pendente (BL32). |
| T11 | Acessibilidade | Fluxos críticos possuem foco visível, labels e navegação por teclado. | Não executado | Revisão manual pendente (BL33). |
| T12 | Documentação futura | BACKEND_INTEGRATION.md descreve rotas e pontos de substituição dos mocks. | Bloqueado | Arquivo não existe (BL45). |

## Entregáveis

| Entregável | Conteúdo | Responsável | Status |
|---|---|---|---|
| Protótipo Figma | Personas, telas de alta fidelidade e guia visual. | Documentação | A confirmar |
| Frontend | Landing/feed, filtros, mapa, wizard, dashboard, perfil e login. | Dev | Concluído |
| Mocks | Demandas, categorias e regiões (em js/data/*.js). | Dev | Concluído |
| Testes automatizados | npm test com 15 testes (T01–T03, T05–T09). | Tester | Concluído |
| Testes de usabilidade | Resultados e ajustes priorizados. | Tester + Documentação | A confirmar |
| BACKEND_INTEGRATION.md | APIs REST futuras, integrações externas e pontos de troca dos mocks. | Documentação | Não iniciado |
| README | Execução, estrutura, mocks e arquitetura do frontend. | Documentação | Concluído |
| Kanban/Backlog | Acompanhamento das tarefas e responsáveis. | Scrum Master | Em andamento |
| Demonstração | Roteiro e apresentação do fluxo completo. | Equipe | Não iniciado |

## Fora do escopo atual

| Não implementar nesta etapa | Situação atual |
|---|---|
| Banco de dados real | Não há. Os dados ficam no localStorage do navegador (prefixo bp:v2:). |
| Backend/API real | js/core/api.js já retorna Promise e é o ponto de troca; contratos vão para o BACKEND_INTEGRATION.md. |
| Persistência real de votos | Os apoios ficam só no navegador de cada pessoa (localStorage). |
| Upload real de imagens | A foto é comprimida e guardada no navegador em base64; não vai para servidor. |
| GPS/geolocalização real | O mapa é real (Leaflet), mas o ponto é marcado manualmente; não usa GPS. |
| Autenticação real | Login e cadastro são simulados no navegador (senha guardada como hash). |
| Integração real com identidade/ouvidoria | Somente mapear no BACKEND_INTEGRATION.md. |

# Backlog e Cronograma — Brasília Transparente & Participativa

> Gerado a partir da planilha [`backlog_cronograma.xlsx`](backlog_cronograma.xlsx). Atualize o status dos itens aqui ou na planilha conforme o projeto avança.

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
| Visão | Plataforma web para mapear, relatar, apoiar e priorizar demandas urbanas nas Regiões Administrativas, com transparência visual e gamificação. |
| Equipe | 7 alunos |
| Foco atual | Frontend com dados mockados em arquivos JSON locais. |
| Frontend | HTML/CSS/JavaScript ou React |
| Backend atual | Não obrigatório nesta etapa; apenas documentação de integração futura. |
| Dados | Mocks locais: solicitações, categorias e regiões. |

## Marcos do projeto

| Sprint | Marco | Resultado | Status |
|---|---|---|---|
| Sprint 2 | M1 | Landing, feed e filtros navegáveis. | Planejado |
| Sprint 4 | M2 | Mapa simulado, modal e upvote em memória. | Planejado |
| Sprint 6 | M3 | Wizard de nova solicitação completo. | Planejado |
| Sprint 8 | M4 | Dashboard e gamificação funcionando com mocks. | Planejado |
| Sprint 10 | M5 | Frontend integrado aos JSONs e documentação de APIs futuras. | Planejado |
| Sprint 12 | M6 | MVP testado, documentado e pronto para apresentação. | Planejado |

## Backlog

Total de itens: **50**.

| ID | Épico | Item do backlog | Prioridade | Dependência | Responsável | Status | Sprint |
|---|---|---|---|---|---|---|---|
| BL01 | Planejamento | Definir personas e jornada principal do cidadão | Alta | — |  | Não iniciado | Sprint 0 |
| BL02 | Planejamento | Definir arquitetura de informação e fluxos de navegação | Alta | BL01 |  | Não iniciado | Sprint 0 |
| BL03 | UI/UX | Criar wireframes das telas principais | Alta | BL01 |  | Não iniciado | Sprint 0 |
| BL04 | UI/UX | Criar protótipo de alta fidelidade e guia de estilos no Figma | Alta | BL03 |  | Não iniciado | Sprint 1 |
| BL05 | Frontend | Estruturar projeto, componentes e padrão responsivo | Alta | BL02, BL04 |  | Não iniciado | Sprint 1 |
| BL06 | Mocks | Definir schema de demands.json | Alta | BL02 |  | Não iniciado | Sprint 1 |
| BL07 | Mocks | Definir categories.json com ícones e cores | Alta | BL02 |  | Não iniciado | Sprint 1 |
| BL08 | Mocks | Definir regions.json para filtros | Alta | BL02 |  | Não iniciado | Sprint 1 |
| BL09 | Landing/Feed | Implementar hero com CTA 'Reporte um problema na sua região' | Alta | BL04–BL05 |  | Não iniciado | Sprint 2 |
| BL10 | Landing/Feed | Criar cards de demandas com imagem, título, categoria, votos e status | Alta | BL05–BL07 |  | Não iniciado | Sprint 2 |
| BL11 | Landing/Feed | Carregar feed a partir de demands.json | Alta | BL06, BL10 |  | Não iniciado | Sprint 2 |
| BL12 | Landing/Feed | Implementar filtro por Região/Bairro | Alta | BL08, BL11 |  | Não iniciado | Sprint 3 |
| BL13 | Landing/Feed | Implementar filtro por categoria | Alta | BL07, BL11 |  | Não iniciado | Sprint 3 |
| BL14 | Landing/Feed | Implementar estados Pendente, Em Análise e Resolvido | Alta | BL10 |  | Não iniciado | Sprint 3 |
| BL15 | Mapa | Criar visualizador simulado de mapa | Alta | BL04–BL05 |  | Não iniciado | Sprint 4 |
| BL16 | Mapa | Renderizar pins interativos usando coordenadas fictícias dos mocks | Alta | BL06, BL15 |  | Não iniciado | Sprint 4 |
| BL17 | Mapa | Abrir modal de resumo ao clicar no pin | Alta | BL16 |  | Não iniciado | Sprint 4 |
| BL18 | Engajamento | Implementar botão 'Apoiaria esta causa' com upvote em memória | Alta | BL17 |  | Não iniciado | Sprint 4 |
| BL19 | Solicitação | Criar estrutura do Wizard em 3 etapas | Alta | BL04–BL05 |  | Não iniciado | Sprint 5 |
| BL20 | Solicitação | Etapa 1: título, categoria e descrição | Alta | BL19 |  | Não iniciado | Sprint 5 |
| BL21 | Solicitação | Etapa 2: Região/Rua com seletor visual | Alta | BL19, BL08 |  | Não iniciado | Sprint 5 |
| BL22 | Solicitação | Etapa 3: upload visual simulado de foto | Alta | BL19 |  | Não iniciado | Sprint 6 |
| BL23 | Solicitação | Adicionar validação, navegação anterior/próximo e resumo final | Alta | BL20–BL22 |  | Não iniciado | Sprint 6 |
| BL24 | Solicitação | Simular criação de nova demanda em memória | Alta | BL23 |  | Não iniciado | Sprint 6 |
| BL25 | Dashboard | Criar indicador de total de demandas resolvidas | Alta | BL06 |  | Não iniciado | Sprint 7 |
| BL26 | Dashboard | Criar ranking visual das regiões mais ativas | Alta | BL06, BL08 |  | Não iniciado | Sprint 7 |
| BL27 | Gamificação | Definir regras simuladas de badges por votos/relatos | Média | BL06 |  | Não iniciado | Sprint 7 |
| BL28 | Gamificação | Criar badges 'Colaborador Bronze' e 'Guardião do Bairro' | Média | BL27 |  | Não iniciado | Sprint 8 |
| BL29 | Dashboard | Criar gráficos estáticos/dinâmicos em memória | Alta | BL25–BL26 |  | Não iniciado | Sprint 8 |
| BL30 | Dashboard | Integrar indicadores, ranking, gráficos e badges | Alta | BL25–BL29 |  | Não iniciado | Sprint 8 |
| BL31 | UX | Implementar feedbacks de vazio, carregamento e erro dos mocks | Alta | Fluxos principais |  | Não iniciado | Sprint 9 |
| BL32 | UX | Revisar responsividade mobile/tablet/desktop | Alta | Fluxos principais |  | Não iniciado | Sprint 9 |
| BL33 | Acessibilidade | Revisar contraste, foco, labels, teclado e textos alternativos | Alta | Fluxos principais |  | Não iniciado | Sprint 9 |
| BL34 | QA | Executar testes de usabilidade do fluxo de feed e filtros | Alta | BL09–BL14 |  | Não iniciado | Sprint 9 |
| BL35 | QA | Executar testes de mapa, modal e upvote | Alta | BL15–BL18 |  | Não iniciado | Sprint 9 |
| BL36 | QA | Executar testes do Wizard e validações | Alta | BL19–BL24 |  | Não iniciado | Sprint 10 |
| BL37 | QA | Executar testes do dashboard e gamificação | Alta | BL25–BL30 |  | Não iniciado | Sprint 10 |
| BL38 | Integração futura | Documentar GET /api/v1/demands | Alta | Fluxos definidos |  | Não iniciado | Sprint 10 |
| BL39 | Integração futura | Documentar POST /api/v1/demands com multipart/form-data | Alta | Wizard definido |  | Não iniciado | Sprint 10 |
| BL40 | Integração futura | Documentar PATCH /api/v1/demands/{id}/vote | Alta | Upvote definido |  | Não iniciado | Sprint 10 |
| BL41 | Integração futura | Mapear substituição dos mocks pela API REST futura | Alta | BL38–BL40 |  | Não iniciado | Sprint 11 |
| BL42 | Integração futura | Mapear integração futura de identidade do cidadão | Média | — |  | Não iniciado | Sprint 11 |
| BL43 | Integração futura | Mapear Google Maps/Leaflet para geolocalização futura | Média | BL15–BL16 |  | Não iniciado | Sprint 11 |
| BL44 | Integração futura | Mapear webhook para sistemas de ouvidoria pública, como OuvDF | Média | — |  | Não iniciado | Sprint 11 |
| BL45 | Documentação | Criar BACKEND_INTEGRATION.md com contratos, payloads e pontos de troca | Alta | BL38–BL44 |  | Não iniciado | Sprint 11 |
| BL46 | Qualidade | Refatorar componentes reutilizáveis e organização do código | Alta | MVP funcional |  | Não iniciado | Sprint 12 |
| BL47 | Qualidade | Corrigir defeitos identificados pelo QA e testes de usabilidade | Alta | BL34–BL37 |  | Não iniciado | Sprint 12 |
| BL48 | Documentação | Criar README com execução, arquitetura de mocks e estrutura do projeto | Alta | MVP funcional |  | Não iniciado | Sprint 12 |
| BL49 | Apresentação | Preparar roteiro de demonstração e divisão da apresentação | Alta | BL45–BL48 |  | Não iniciado | Sprint 12 |
| BL50 | Entrega | Validação final do MVP e critérios de aceite | Alta | BL46–BL49 |  | Não iniciado | Sprint 12 |

## Cronograma

| Sprint | Fase | Frontend % | Integração futura % | QA/UX/Docs % | Entregas principais | Marco |
|---|---|---|---|---|---|---|
| Sprint 0 | Descoberta/Planejamento | 65 | 25 | 10 | Personas, jornada, arquitetura da informação e wireframes |  |
| Sprint 1 | Design + Fundação | 65 | 25 | 10 | Figma, guia de estilos, estrutura do frontend e schemas JSON |  |
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

| Grupo | Área | Funcionalidade | Prioridade | Backlog |
|---|---|---|---|---|
| A | Landing Page & Feed | Hero com CTA. | Obrigatório | BL09 |
| A | Landing Page & Feed | Cards com imagem, título, categoria, votos e status. | Obrigatório | BL10–BL11 |
| A | Landing Page & Feed | Filtros por Região/Bairro e Categoria. | Obrigatório | BL12–BL14 |
| B | Mapa | Mapa visual simulado com pins interativos. | Obrigatório | BL15–BL16 |
| B | Mapa | Modal de solicitação e upvote visual em memória. | Obrigatório | BL17–BL18 |
| C | Nova Solicitação | Wizard: título, categoria e descrição. | Obrigatório | BL19–BL20 |
| C | Nova Solicitação | Wizard: Região/Rua. | Obrigatório | BL21 |
| C | Nova Solicitação | Wizard: evidência/foto simulada. | Obrigatório | BL22–BL24 |
| D | Dashboard | Total de demandas resolvidas. | Obrigatório | BL25 |
| D | Dashboard | Ranking das regiões mais ativas. | Obrigatório | BL26 |
| D | Gamificação | Badges conforme votos/relatos simulados. | Obrigatório | BL27–BL30 |

## Mocks e dados

| Arquivo | Objetivo | Campos sugeridos | Consumidores | Observação |
|---|---|---|---|---|
| demands.json | Lista de solicitações urbanas. | id, título, descrição, categoriaId, regiãoId, rua, coordenadas fictícias, fotoUrl, votos, status, data | Feed, mapa, dashboard | Dados locais; sem persistência real. |
| categories.json | Categorias de demandas. | id, nome, ícone, cor | Feed, filtros, formulário, mapa | Ex.: Acessibilidade, Iluminação, Asfalto, Lixo/Limpeza. |
| regions.json | Regiões/bairros disponíveis. | id, nome, bairros | Filtros, formulário, dashboard | Base para ranking e seletor de localização. |

## Integrações futuras

| Tipo | Método | Rota/Integração | Finalidade | Nota de transição |
|---|---|---|---|---|
| REST | GET | /api/v1/demands | Retorno paginado das demandas. | Substitui leitura de demands.json. |
| REST | POST | /api/v1/demands | Criação de demanda com dados e imagem. | Usar multipart/form-data. |
| REST | PATCH | /api/v1/demands/{id}/vote | Incrementar voto de apoio. | Substitui upvote apenas em memória. |
| Externa | — | Identidade do cidadão | Validação futura de identidade. | O texto fornecido cita conexão com API 'br'; especificação exata não foi informada. |
| Externa | — | Google Maps / Leaflet | Geolocalização exata via GPS. | Substitui mapa/coordenadas simuladas. |
| Webhook | — | Ouvidoria pública / OuvDF | Integração futura com sistema de ouvidoria. | Mapear eventos, payloads e autenticação futuramente. |

## Equipe

| Papel | Pessoas | Responsabilidades | Backlog predominante |
|---|---|---|---|
| Scrum Master | 1 | Facilitar cerimônias, remover impedimentos e manter Kanban atualizado. | Planejamento e acompanhamento |
| UI/UX Designers | 2 | Personas, protótipos no Figma, guia de estilos e testes de usabilidade. | BL01–BL04, BL31–BL34 |
| Desenvolvedores Frontend | 3 | Interface responsiva, componentes, mocks, feed, mapa, wizard e dashboard. | BL05–BL30, BL46–BL47 |
| QA / Tech Writer | 1 | Testes, critérios de aceite e documentação das integrações futuras. | BL34–BL45, BL48–BL50 |

## Testes e aceite

| ID | Cenário | Resultado esperado | Status |
|---|---|---|---|
| T01 | Feed carrega dados mockados | Cards exibem dados essenciais e status corretamente. | Não executado |
| T02 | Filtro por região | Feed mostra somente demandas da região selecionada. | Não executado |
| T03 | Filtro por categoria | Feed mostra somente a categoria selecionada. | Não executado |
| T04 | Clique em pin | Modal abre com resumo da demanda correspondente. | Não executado |
| T05 | Upvote | Contagem visual aumenta em memória sem recarregar a página. | Não executado |
| T06 | Wizard incompleto | Usuário não avança sem campos obrigatórios da etapa. | Não executado |
| T07 | Wizard completo | Resumo é exibido e nova demanda é simulada em memória. | Não executado |
| T08 | Dashboard | Indicadores refletem os dados dos mocks. | Não executado |
| T09 | Gamificação | Badge exibido corresponde às regras simuladas definidas. | Não executado |
| T10 | Responsividade | Fluxos principais funcionam em mobile, tablet e desktop. | Não executado |
| T11 | Acessibilidade | Fluxos críticos possuem foco visível, labels e navegação por teclado. | Não executado |
| T12 | Documentação futura | BACKEND_INTEGRATION.md descreve rotas e pontos de substituição dos mocks. | Não executado |

## Entregáveis

| Entregável | Conteúdo | Responsável sugerido | Status |
|---|---|---|---|
| Protótipo Figma | Personas, telas de alta fidelidade e guia visual. | UI/UX | Não iniciado |
| Frontend | Landing/feed, filtros, mapa, wizard e dashboard. | Frontend | Não iniciado |
| Mocks JSON | Demandas, categorias e regiões. | Frontend | Não iniciado |
| Testes de usabilidade | Resultados e ajustes priorizados. | UI/UX + QA | Não iniciado |
| BACKEND_INTEGRATION.md | APIs REST futuras, integrações externas e pontos de troca dos mocks. | QA / Tech Writer | Não iniciado |
| README | Execução, estrutura, mocks e arquitetura do frontend. | QA / Tech Writer | Não iniciado |
| Kanban/Backlog | Acompanhamento das tarefas e responsáveis. | Scrum Master | Não iniciado |
| Demonstração | Roteiro e apresentação do fluxo completo. | Equipe | Não iniciado |

## Fora do escopo atual

| Não implementar nesta etapa | Tratamento |
|---|---|
| Banco de dados real | Usar arquivos JSON locais e estado em memória. |
| Backend/API real | Apenas documentar contratos para integração futura. |
| Persistência real de votos | Upvote é apenas visual/em memória. |
| Upload real de imagens | Simular visualmente; POST multipart fica documentado para o futuro. |
| GPS/geolocalização real | Usar mapa e coordenadas fictícias nesta etapa. |
| Integração real com identidade/ouvidoria | Somente mapear no BACKEND_INTEGRATION.md. |

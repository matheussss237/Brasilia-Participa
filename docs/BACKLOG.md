# Backlog e Cronograma — Brasília Participa

> Gerado a partir da planilha [`backlog_brasilia_participa.xlsx`](backlog_brasilia_participa.xlsx), que segue o formato do [modelo da disciplina](modelo_backlog_cronograma.xlsx). Atualize o status na planilha e regenere este arquivo.

## Sumário

- [Resumo](#resumo)
- [Marcos do projeto](#marcos-do-projeto)
- [Progresso](#progresso)
- [Backlog](#backlog)
- [Cronograma](#cronograma)
- [Escopo Funcional](#escopo-funcional)
- [Mocks e Dados](#mocks-e-dados)
- [Integrações Futuras](#integrações-futuras)
- [Equipe](#equipe)
- [Testes e Aceite](#testes-e-aceite)
- [Entregáveis](#entregáveis)
- [Fora do Escopo Atual](#fora-do-escopo-atual)

## Resumo

| Campo | Descrição |
|---|---|
| Tipo | GovTech / Cidadania / Cidades Inteligentes |
| Tema | Participação cidadã no registro e acompanhamento de demandas urbanas no Distrito Federal. |
| Visão | Portal web para registrar, mapear, apoiar e acompanhar demandas urbanas nas Regiões Administrativas do DF, com transparência visual e gamificação. |
| Instituição | UniCEPLAC — Engenharia de Software — Projeto Integrado de Certificação em Governança e Gestão de TI (Prof. Hudson Silva Neves) |
| Equipe | 11 alunos (ver aba Equipe) |
| Foco atual | Front-end estático com dados persistidos no localStorage (js/store.js). |
| Frontend | HTML5, CSS3, JavaScript vanilla e Leaflet 1.9.4 (mapa) |
| Backend | Planejado em Java + Spring Boot + MongoDB; ainda não existe neste repositório. Nesta etapa, apenas a documentação da integração. |
| Dados | Seed de demandas, categorias e RAs em js/store.js; votos, sessão e tema no localStorage. |
| Publicação | https://matheussss237.github.io/Brasilia-Participa/ |

## Marcos do projeto

| Sprint | Marco | Resultado | Status | Observação |
|---|---|---|---|---|
| Sprint 3 | M1 | Home, listagem de demandas, busca e filtro por status. | Em andamento | Faltam filtros por região e categoria (BL16, BL17). |
| Sprint 4 | M2 | Mapa Leaflet com pins, detalhe e apoio. | Concluído | Apoio pelo mapa fica como melhoria (BL22). |
| Sprint 6 | M3 | Nova demanda com foto, ponto no mapa, login e cadastro. | Em andamento | Faltam login obrigatório (BL25) e Wizard (BL30). |
| Sprint 8 | M4 | Dashboard com ranking, gráficos e gamificação. | Em andamento | Indicadores prontos; faltam BL34–BL37. |
| Sprint 11 | M5 | API REST e modelagem MongoDB documentadas. | Planejado |  |
| Sprint 12 | M6 | MVP testado, documentado e apresentado. | Planejado |  |

## Progresso

| Progresso do backlog | Quantidade |
|---|---|
| Total de itens | 55 |
| Concluído | 30 |
| Em andamento | 4 |
| Não iniciado | 21 |
| Bloqueado | 0 |
| % concluído | 54.5% |

## Backlog

| ID | Épico | Item do backlog | Prioridade | Dependência | Responsável | Status | Sprint | Critério/Observação |
|---|---|---|---|---|---|---|---|---|
| BL01 | Planejamento | Definir personas (morador, líder comunitário, cidadão interessado) e jornada principal | Alta | — | Documentação / UX | Concluído | Sprint 0 | Registrado no Relatório parcial (docs/Relatorio_parcial.pdf). |
| BL02 | Planejamento | Levantar requisitos e definir arquitetura de informação e fluxos de navegação das 8 páginas | Alta | BL01 | Documentação / UX | Concluído | Sprint 0 | Home, Login, Cadastro, Demandas, Nova demanda, Mapa, Dashboard e Perfil. |
| BL03 | Planejamento | Documentar o caso de uso 'Registrar Demanda Urbana' | Alta | BL02 | Documentação | Concluído | Sprint 0 | docs/caso de uso.pdf (fluxo principal + alternativos A.1–A.4). |
| BL04 | UI/UX | Criar wireframes das telas principais | Alta | BL01 | Documentação / UX | Concluído | Sprint 0 | Conforme relatório parcial. |
| BL05 | UI/UX | Criar protótipo de alta fidelidade e guia de estilos no Figma | Alta | BL04 | Documentação / UX | Concluído | Sprint 1 | Conforme relatório parcial. Anexar o link do Figma aqui. |
| BL06 | Fundação | Estruturar projeto multipágina (HTML/CSS/JS) com CSS modular: reset, style, components, pages, responsive | Alta | BL02, BL05 | Dev | Concluído | Sprint 1 | Pastas css/, js/ e imagens/. |
| BL07 | Fundação | Criar cabeçalho, navegação, rodapé e alternância de tema claro/escuro | Alta | BL06 | Dev | Concluído | Sprint 1 | js/main.js (tema salvo na chave 'theme'). |
| BL08 | Dados | Criar js/store.js como fonte única de dados no localStorage, com seed versionado | Alta | BL06 | Dev | Concluído | Sprint 1 | Chaves bp_demandas e bp_demandas_versao (SEED_VERSION). |
| BL09 | Dados | Definir as 9 categorias com ícones e cores | Alta | BL08 | Dev | Concluído | Sprint 1 | Infraestrutura, Iluminação, Limpeza, Segurança, Transporte, Meio ambiente, Educação, Saúde, Acessibilidade. |
| BL10 | Dados | Cadastrar as Regiões Administrativas do DF com coordenadas para o mapa | Alta | BL08 | Dev | Concluído | Sprint 1 | Coordenadas aproximadas do centro de cada RA. |
| BL11 | Dados | Criar demandas de exemplo com fotos reais das RAs | Alta | BL09, BL10 | Dev | Concluído | Sprint 2 | 22 demandas no DEMANDAS_SEED; fotos em imagens/. |
| BL12 | Home/Demandas | Implementar hero com CTA 'Registrar demanda' e estatísticas gerais | Alta | BL05, BL06 | Dev | Concluído | Sprint 2 | index.html; números calculados por calcularEstatisticas(). |
| BL13 | Home/Demandas | Exibir demandas recentes na página inicial | Alta | BL08, BL12 | Dev | Concluído | Sprint 2 |  |
| BL14 | Home/Demandas | Criar cards de demandas com foto, título, categoria, região, apoios e status | Alta | BL08, BL09 | Dev | Concluído | Sprint 2 | demandas.html + js/demandas.js. |
| BL15 | Home/Demandas | Implementar busca por texto e filtro por status | Alta | BL14 | Dev | Concluído | Sprint 3 |  |
| BL16 | Home/Demandas | Implementar filtro por Região Administrativa | Alta | BL10, BL14 | Dev | Não iniciado | Sprint 3 | Previsto no escopo do modelo; ainda não existe na listagem. |
| BL17 | Home/Demandas | Implementar filtro por categoria | Alta | BL09, BL14 | Dev | Não iniciado | Sprint 3 | Previsto no escopo do modelo; ainda não existe na listagem. |
| BL18 | Home/Demandas | Exibir status Recebida, Em análise, Pendente e Resolvida com cores | Alta | BL14 | Dev | Concluído | Sprint 3 | classeDoStatus() / corDoStatus() em store.js. |
| BL19 | Mapa | Criar mapa interativo com Leaflet e pins coloridos por status | Alta | BL10 | Dev | Concluído | Sprint 4 | mapa.html + js/mapa.js (Leaflet 1.9.4). |
| BL20 | Mapa | Exibir painel de detalhe ao clicar no pin | Alta | BL19 | Dev | Concluído | Sprint 4 |  |
| BL21 | Engajamento | Permitir apoiar/remover apoio de uma demanda (upvote) com contagem salva localmente | Alta | BL14 | Dev | Concluído | Sprint 4 | Chave bp_votos; disponível na página Demandas. |
| BL22 | Engajamento | Permitir apoiar a demanda também pelo detalhe do mapa | Média | BL20, BL21 | Dev | Não iniciado | Sprint 4 | Hoje o mapa só mostra o número de apoios. |
| BL23 | Acesso | Implementar cadastro de usuário com validação e bloqueio de e-mail duplicado | Alta | BL06 | Dev | Concluído | Sprint 5 | Simulado no localStorage (bp_cadastro_*). |
| BL24 | Acesso | Implementar login com bloqueio de credenciais inválidas | Alta | BL23 | Dev | Concluído | Sprint 5 | Simulado no localStorage (bp_logado, bp_usuario_*). |
| BL25 | Acesso | Exigir login para registrar demanda (pré-condição do caso de uso) | Alta | BL24, BL26 | Dev | Não iniciado | Sprint 5 | Hoje nova-demanda.html abre sem login. |
| BL26 | Nova demanda | Formulário com título, categoria, região, localização e descrição, com validação dos obrigatórios | Alta | BL09, BL10 | Dev | Concluído | Sprint 5 | Fluxo alternativo A.1 do caso de uso. |
| BL27 | Nova demanda | Upload de foto com pré-visualização | Alta | BL26 | Dev | Concluído | Sprint 6 | A imagem fica só no navegador. |
| BL28 | Nova demanda | Marcação do ponto no mapa habilitada só após escolher a RA | Alta | BL19, BL26 | Dev | Concluído | Sprint 6 | Fluxo alternativo A.2 do caso de uso. |
| BL29 | Nova demanda | Tela de confirmação e gravação da demanda no store (aparece em Demandas, Mapa e Dashboard) | Alta | BL26–BL28 | Dev | Concluído | Sprint 6 |  |
| BL30 | Nova demanda | Dividir o formulário em Wizard de 3 etapas (dados → localização → foto/resumo) | Média | BL29 | Dev | Não iniciado | Sprint 6 | Objetivo específico do relatório; hoje é um formulário único. |
| BL31 | Perfil | Exibir no perfil os dados do usuário logado | Alta | BL24 | Dev | Em andamento | Sprint 7 | perfil.html ainda mostra nome e e-mail fixos. |
| BL32 | Perfil | Criar 'Minhas demandas' filtrando pelo autor | Média | BL29, BL31 | Dev | Não iniciado | Sprint 7 | Exige salvar o autor na demanda; hoje o botão leva para todas as demandas. |
| BL33 | Dashboard | Indicadores (total, resolvidas, em andamento, regiões) calculados a partir do store | Alta | BL08 | Dev | Concluído | Sprint 7 | Revisar: 'Cidadãos participantes' e 'Usuários' mostram o total de apoios. |
| BL34 | Dashboard | Criar ranking das Regiões Administrativas mais ativas | Alta | BL10, BL33 | Dev | Não iniciado | Sprint 7 |  |
| BL35 | Dashboard | Substituir os placeholders por gráficos dinâmicos (status, categoria, evolução no tempo) | Alta | BL33 | Dev | Não iniciado | Sprint 8 | Hoje dashboard.html tem 3 chart-placeholder. |
| BL36 | Gamificação | Definir regras de badges por apoios e relatos | Média | BL21, BL29 | Documentação | Não iniciado | Sprint 8 | Ex.: Colaborador Bronze, Guardião do Bairro. |
| BL37 | Gamificação | Exibir badges no perfil e no dashboard | Média | BL31, BL36 | Dev | Não iniciado | Sprint 8 |  |
| BL38 | UX | Implementar estados de vazio, carregamento e erro em todas as listas | Média | Fluxos principais | Dev | Em andamento | Sprint 9 | Demandas já trata lista vazia; falta mapa, home e dashboard. |
| BL39 | UX | Revisar responsividade mobile/tablet/desktop | Alta | Fluxos principais | Tester | Concluído | Sprint 9 | Evidência no relatório parcial. |
| BL40 | Acessibilidade | Revisar contraste, foco, labels, navegação por teclado e textos alternativos | Alta | Fluxos principais | Tester | Não iniciado | Sprint 9 |  |
| BL41 | Qualidade | Otimizar o tamanho das imagens | Média | BL11 | Dev | Não iniciado | Sprint 9 | Ex.: imagens/BuracoGama.jpg tem ~3,3 MB. |
| BL42 | QA | Testar login e cadastro | Alta | BL23, BL24 | Tester | Concluído | Sprint 9 | Credenciais inválidas, obrigatórios, e-mail duplicado, senha oculta. |
| BL43 | QA | Testar nova demanda e validações | Alta | BL26–BL29 | Tester | Concluído | Sprint 9 | Obrigatórios, listas suspensas, prévia da foto, mapa após RA. |
| BL44 | QA | Testar listagem, filtros, mapa e apoio | Alta | BL14–BL22 | Tester | Em andamento | Sprint 10 | Repetir após BL16, BL17 e BL22. |
| BL45 | QA | Testar dashboard e gamificação | Alta | BL33–BL37 | Tester | Não iniciado | Sprint 10 |  |
| BL46 | Integração futura | Documentar a API REST (Spring Boot): demandas, apoio, autenticação e usuários | Alta | Fluxos definidos | Documentação | Não iniciado | Sprint 10 | Ver aba Integrações Futuras. |
| BL47 | Integração futura | Modelar as coleções MongoDB (usuarios, demandas, categorias, regioes) | Alta | BL46 | Documentação | Não iniciado | Sprint 10 | O relatório cita Java/Spring Boot/MongoDB; não há back-end neste repositório. |
| BL48 | Integração futura | Mapear a troca das funções do store.js por chamadas fetch() à API | Alta | BL46 | Dev | Não iniciado | Sprint 11 | obterDemandas, adicionarDemanda, atualizarApoios. |
| BL49 | Integração futura | Mapear autenticação gov.br, geolocalização por GPS e webhook para a Ouvidoria (OuvDF) | Média | BL46 | Documentação | Não iniciado | Sprint 11 |  |
| BL50 | Documentação | Criar BACKEND_INTEGRATION.md com contratos, payloads e pontos de troca | Alta | BL46–BL49 | Documentação | Não iniciado | Sprint 11 |  |
| BL51 | Documentação | Atualizar o README (URL de clone, estrutura, capturas de tela) | Alta | MVP funcional | Documentação | Em andamento | Sprint 12 | O README ainda usa 'teste.git' no clone. |
| BL52 | Entrega | Publicar no GitHub Pages | Alta | MVP funcional | Dev | Concluído | Sprint 12 | https://matheussss237.github.io/Brasilia-Participa/ |
| BL53 | Qualidade | Corrigir defeitos encontrados pelo QA e refatorar código repetido | Alta | BL42–BL45 | Dev | Não iniciado | Sprint 12 |  |
| BL54 | Apresentação | Preparar roteiro de demonstração e divisão da apresentação | Alta | BL50–BL53 | Scrum Master | Não iniciado | Sprint 12 |  |
| BL55 | Entrega | Validação final do MVP e dos critérios de aceite | Alta | BL54 | Equipe | Não iniciado | Sprint 12 |  |

## Cronograma

| Sprint | Fase | Frontend % | Integração futura % | QA/UX/Docs % | Entregas principais | Marco |
|---|---|---|---|---|---|---|
| Sprint 0 | Descoberta/Planejamento | 65 | 25 | 10 | Personas, requisitos, caso de uso e wireframes |  |
| Sprint 1 | Design + Fundação | 65 | 25 | 10 | Figma, guia de estilos, estrutura do projeto, store.js, categorias e RAs |  |
| Sprint 2 | Frontend | 85 | 10 | 5 | Seed de demandas, home e cards de demandas |  |
| Sprint 3 | Frontend | 85 | 10 | 5 | Busca e filtros (status, região, categoria) e cores de status | M1 — Demandas navegáveis |
| Sprint 4 | Frontend/Interação | 80 | 10 | 10 | Mapa Leaflet, pins, detalhe e apoio | M2 — Mapa e apoio |
| Sprint 5 | Frontend | 85 | 10 | 5 | Login, cadastro e formulário de nova demanda |  |
| Sprint 6 | Frontend | 80 | 10 | 10 | Foto, ponto no mapa, confirmação e Wizard | M3 — Nova demanda |
| Sprint 7 | Frontend/Dados | 75 | 15 | 10 | Perfil, indicadores e ranking de RAs |  |
| Sprint 8 | Frontend/Dashboard | 75 | 15 | 10 | Gráficos dinâmicos e badges | M4 — Dashboard completo |
| Sprint 9 | UX/QA | 50 | 10 | 40 | Estados de interface, responsividade, acessibilidade, imagens e testes |  |
| Sprint 10 | QA/Integração futura | 35 | 30 | 35 | Testes e documentação da API REST e do MongoDB |  |
| Sprint 11 | Transição futura | 25 | 45 | 30 | Troca do store.js por fetch(), gov.br, GPS, OuvDF e BACKEND_INTEGRATION.md | M5 — Contratos de API |
| Sprint 12 | Estabilização | 25 | 20 | 55 | Correções, README, GitHub Pages e apresentação | M6 — MVP concluído |

## Escopo Funcional

| Grupo | Área | Funcionalidade | Prioridade | Backlog |
|---|---|---|---|---|
| A | Home & Demandas | Hero com CTA, estatísticas e demandas recentes. | Obrigatório | BL12–BL13 |
| A | Home & Demandas | Cards com foto, título, categoria, região, apoios e status. | Obrigatório | BL14, BL18 |
| A | Home & Demandas | Busca e filtros por status, Região Administrativa e categoria. | Obrigatório | BL15–BL17 |
| B | Mapa | Mapa interativo (Leaflet) com pins por status e detalhe da demanda. | Obrigatório | BL19–BL20 |
| B | Mapa | Apoio (upvote) às demandas. | Obrigatório | BL21–BL22 |
| C | Nova Demanda | Formulário com validação: título, categoria, região, localização e descrição. | Obrigatório | BL26, BL30 |
| C | Nova Demanda | Foto com pré-visualização e ponto no mapa após escolher a RA. | Obrigatório | BL27–BL29 |
| D | Acesso & Perfil | Cadastro, login e registro de demanda só com login. | Obrigatório | BL23–BL25 |
| D | Acesso & Perfil | Perfil com dados do usuário e 'Minhas demandas'. | Desejável | BL31–BL32 |
| E | Dashboard | Indicadores, ranking das RAs e gráficos. | Obrigatório | BL33–BL35 |
| E | Gamificação | Badges conforme apoios e relatos. | Obrigatório | BL36–BL37 |

## Mocks e Dados

| Arquivo | Objetivo | Campos sugeridos | Consumidores | Observação |
|---|---|---|---|---|
| js/store.js → bp_demandas | Lista de demandas urbanas (seed + novas). | id, titulo, descricao, categoria, regiao, localizacao, lat, lng, foto, apoios, status, data | Home, Demandas, Mapa, Nova demanda, Dashboard | Seed recarregado quando SEED_VERSION muda. Falta o campo autor (BL32). |
| js/store.js → ICONE/COR_POR_CATEGORIA | Categorias das demandas. | nome, ícone Font Awesome, cor | Cards, mapa, formulário | 9 categorias. |
| js/store.js → coordenadas das RAs | Regiões Administrativas do DF. | nome, lat, lng | Formulário, mapa, filtros, ranking | Base para o filtro por região e o ranking. |
| localStorage → bp_votos | Demandas apoiadas pelo usuário. | { idDemanda: true } | Demandas | Somente local; vira PATCH na API futura. |
| localStorage → bp_cadastro_*, bp_logado, bp_usuario_* | Cadastro e sessão simulados. | nome, email, logado | Login, Cadastro, Header, Perfil | Sem segurança real; vira autenticação na API. |
| localStorage → theme | Tema claro/escuro. | light \| dark | Todas as páginas |  |

## Integrações Futuras

| Tipo | Método | Rota/Integração | Finalidade | Nota de transição |
|---|---|---|---|---|
| REST | GET | /api/v1/demandas | Listar demandas com paginação e filtros (status, região, categoria). | Substitui obterDemandas(). |
| REST | GET | /api/v1/demandas/{id} | Detalhe de uma demanda. | Substitui obterDemandaPorId(). |
| REST | POST | /api/v1/demandas | Criar demanda com dados e foto. | Substitui adicionarDemanda(); usar multipart/form-data. |
| REST | PATCH | /api/v1/demandas/{id}/apoio | Adicionar ou remover apoio. | Substitui atualizarApoios() e a chave bp_votos. |
| REST | POST | /api/v1/usuarios  •  /api/v1/auth/login | Cadastro e login. | Substitui as chaves bp_cadastro_* e bp_logado. |
| Banco | — | MongoDB | Persistência de usuários, demandas, categorias e regiões. | Back-end em Java + Spring Boot, conforme relatório. |
| Externa | — | gov.br | Autenticação e validação de identidade do cidadão. | Especificação a definir. |
| Externa | — | Geolocalização (GPS do navegador) | Preencher o ponto da ocorrência automaticamente. | O Leaflet já está no projeto; falta usar a posição do usuário. |
| Webhook | — | Ouvidoria pública / OuvDF | Encaminhar demandas para o órgão responsável. | Mapear eventos, payloads e autenticação. |

## Equipe

| Papel | Pessoas | Responsabilidades | Backlog predominante |
|---|---|---|---|
| Scrum Master | Matheus Henrique Madeira Amorim | Conduzir as cerimônias, remover impedimentos e manter o backlog/Kanban atualizado. | Acompanhamento, BL54 |
| Dev | Iago Camilo Soares Pedroso; Igor Gabriel da Costa Souza; Luiz Felipe Rodrigues Gusmão; Oto Pereira Bonfim | Front-end, store.js, mapa, formulário, dashboard, gamificação e correções. | BL06–BL37, BL41, BL48, BL52–BL53 |
| Tester | Gabriel Alves da Cunha de Souza | Testes funcionais, de responsividade e acessibilidade; registrar defeitos. | BL39–BL40, BL42–BL45 |
| Documentação | Gabriel Andrade de Melo; Gabriel Mendes Siqueira; Igor Gabriel Ildefonso Costa; João Paulo Messias Dos Santos; João Vitor de Souza Guedes | Personas, caso de uso, relatórios, README, contratos de API e modelagem do banco. | BL01–BL05, BL36, BL46–BL47, BL49–BL51 |

## Testes e Aceite

| ID | Cenário | Resultado esperado | Status |
|---|---|---|---|
| T01 | Home e Demandas carregam os dados do store | Cards exibem os dados essenciais e o status correto. | Aprovado |
| T02 | Busca e filtro por status | A lista mostra somente as demandas que atendem à busca e ao status. | Não executado |
| T03 | Filtro por região e por categoria | A lista mostra somente a região/categoria selecionada. | Não executado |
| T04 | Clique em pin do mapa | O detalhe abre com o resumo da demanda correspondente. | Não executado |
| T05 | Apoio (upvote) | A contagem aumenta/diminui sem recarregar e se mantém ao voltar à página. | Não executado |
| T06 | Login com credenciais inválidas | O acesso é bloqueado e o usuário é avisado. | Aprovado |
| T07 | Cadastro com e-mail duplicado / campos vazios | O cadastro é bloqueado e o motivo é informado. | Aprovado |
| T08 | Nova demanda sem campos obrigatórios | O envio é bloqueado e os campos pendentes são indicados. | Aprovado |
| T09 | Mapa da nova demanda sem RA selecionada | A marcação no mapa permanece desabilitada. | Aprovado |
| T10 | Nova demanda completa com foto | A prévia da foto aparece e a demanda surge em Demandas, Mapa e Dashboard. | Não executado |
| T11 | Dashboard | Indicadores, ranking e gráficos refletem os dados do store. | Não executado |
| T12 | Gamificação | O badge exibido corresponde às regras definidas. | Não executado |
| T13 | Responsividade | Os fluxos principais funcionam em mobile, tablet e desktop. | Aprovado |
| T14 | Acessibilidade | Foco visível, labels e navegação por teclado nos fluxos críticos. | Não executado |
| T15 | Documentação futura | BACKEND_INTEGRATION.md descreve rotas, payloads e pontos de troca do store.js. | Não executado |

## Entregáveis

| Entregável | Conteúdo | Responsável sugerido | Status |
|---|---|---|---|
| Protótipo Figma | Personas, telas de alta fidelidade e guia visual. | Documentação / UX | Concluído |
| Caso de uso | Registrar Demanda Urbana (docs/caso de uso.pdf). | Documentação | Concluído |
| Relatório parcial | docs/Relatorio_parcial.pdf. | Documentação | Concluído |
| Frontend | Home, demandas, filtros, mapa, nova demanda, login, perfil e dashboard. | Dev | Em andamento |
| Dados locais (store.js) | Demandas, categorias, RAs e persistência no localStorage. | Dev | Concluído |
| Site publicado | GitHub Pages. | Dev | Concluído |
| Testes de usabilidade | Resultados e ajustes priorizados. | Tester + Documentação | Em andamento |
| BACKEND_INTEGRATION.md | API REST, modelagem MongoDB, integrações externas e troca do store.js. | Documentação | Não iniciado |
| README | Execução, estrutura, dados e arquitetura do front-end. | Documentação | Em andamento |
| Kanban/Backlog | Esta planilha + GitHub Projects com as issues. | Scrum Master | Em andamento |
| Demonstração | Roteiro e apresentação do fluxo completo. | Equipe | Não iniciado |

## Fora do Escopo Atual

| Não implementar nesta etapa | Tratamento |
|---|---|
| Back-end Java/Spring Boot real | Apenas documentar contratos e modelagem (BL46–BL50). |
| Banco de dados MongoDB real | Manter os dados no localStorage via store.js. |
| Autenticação real / gov.br | Login e cadastro simulados; mapear no BACKEND_INTEGRATION.md. |
| Persistência real de apoios | Apoio salvo apenas no navegador (bp_votos). |
| Upload real de imagens | Pré-visualização local; POST multipart documentado para o futuro. |
| GPS / geolocalização real | Ponto marcado manualmente no mapa Leaflet. |
| Integração real com Ouvidoria (OuvDF) | Somente mapear no BACKEND_INTEGRATION.md. |
| Notificações, comentários e app mobile | Evolução futura citada na conclusão do relatório. |

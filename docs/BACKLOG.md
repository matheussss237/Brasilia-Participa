# BACKLOG OFICIAL — BRASÍLIA-PARTICIPA

> Revisão de 08/11/2026 para a apresentação acadêmica. **Fonte oficial dos IDs, títulos e estados:** [GitHub Issues](https://github.com/matheussss237/Brasilia-Participa/issues).
>
> A antiga revisão deste documento, de 07/11/2026, usava 57 itens com uma numeração incompatível com as Issues. Esta edição usa **BL01–BL55**, exatamente como as 55 Issues do repositório, preservando seus links. A versão anterior permanece acessível pelo histórico do Git.

## 1. Contexto e escopo

| Campo | Situação |
|---|---|
| Sistema | Portal de participação cidadã e acompanhamento de demandas urbanas do DF |
| Foco do MVP | Página inicial, demandas/filtros, mapa, registro em etapas, dashboard, perfil e conquistas |
| Stack | HTML, CSS, JavaScript e Leaflet/OpenStreetMap |
| Persistência | `localStorage` do navegador e dados de exemplo |
| Backend/API e banco reais | **Não implementados**; planejamento futuro |
| Organização | Scrum, GitHub Issues, GitHub Projects, sprints 0–12 |
| Código | **Não alterado nesta revisão** |

## 2. Resumo e critério de status

| Métrica | Valor |
|---|---:|
| Issues com códigos BL01–BL55 | **55** |
| Issues fechadas | **31** |
| Issues abertas | **24** |
| Issues atribuídas a contas individuais (Assignees) | **0** |

**Importante:** o estado *Fechada* ou *Aberta* nesta tabela é o estado da **Issue no GitHub**, não o campo *Status* do GitHub Projects e não um teste de qualidade. Para colocar um cartão em **Feito** no Kanban, a equipe deve comprovar implementação + critério de aceite + teste. Quando existir implementação, mas faltar teste, preferir **Em andamento/Validação**, e não declarar *Feito* automaticamente.

## 3. Backlog completo — rastreabilidade oficial

Os dados de prioridade, dependência, papel e sprint foram preservados das Issues existentes. **Papel responsável** (Dev/Tester/Documentação) não significa que existe alguém atribuído no GitHub. Não foram inventadas datas, duração, estimativas ou story points ausentes das Issues.

| ID / Issue | Épico | Entrega | Prioridade | Dependências | Papel | Sprint | Estado da Issue | Observações de revisão / aceite |
|---|---|---|---|---|---|---|---|---|
| **BL01** [#5](https://github.com/matheussss237/Brasilia-Participa/issues/5) | Planejamento | Definir personas (morador, líder comunitário, cidadão interessado) e jornada principal | Alta | — | Documentação / UX | Sprint 0 | Fechada | Solicitar link das personas/jornada (não localizado no repositório). |
| **BL02** [#6](https://github.com/matheussss237/Brasilia-Participa/issues/6) | Planejamento | Levantar requisitos e definir arquitetura de informação e fluxos de navegação das 8 páginas | Alta | BL01 (#5) | Documentação / UX | Sprint 0 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL03** [#7](https://github.com/matheussss237/Brasilia-Participa/issues/7) | Planejamento | Documentar o caso de uso 'Registrar Demanda Urbana' | Alta | BL02 (#6) | Documentação | Sprint 0 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL04** [#8](https://github.com/matheussss237/Brasilia-Participa/issues/8) | UI/UX | Criar wireframes das telas principais | Alta | BL01 (#5) | Documentação / UX | Sprint 0 | Fechada | Confirmar arquivo dos wireframes; não localizado na revisão. |
| **BL05** [#9](https://github.com/matheussss237/Brasilia-Participa/issues/9) | UI/UX | Criar protótipo de alta fidelidade e guia de estilos no Figma | Alta | BL04 (#8) | Documentação / UX | Sprint 1 | Fechada | Confirmar link do Figma, não localizado na revisão. |
| **BL06** [#10](https://github.com/matheussss237/Brasilia-Participa/issues/10) | Fundação | Estruturar projeto multipágina (HTML/CSS/JS) com CSS modular: reset, style, components, pages, responsive | Alta | BL02 (#6), BL05 (#9) | Dev | Sprint 1 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL07** [#11](https://github.com/matheussss237/Brasilia-Participa/issues/11) | Fundação | Criar cabeçalho, navegação, rodapé e alternância de tema claro/escuro | Alta | BL06 (#10) | Dev | Sprint 1 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL08** [#12](https://github.com/matheussss237/Brasilia-Participa/issues/12) | Dados | Criar js/store.js como fonte única de dados no localStorage, com seed versionado | Alta | BL06 (#10) | Dev | Sprint 1 | Fechada | Nomenclatura antiga: hoje os dados estão em js/core/storage.js e js/core/api.js, não js/store.js. |
| **BL09** [#13](https://github.com/matheussss237/Brasilia-Participa/issues/13) | Dados | Definir as 9 categorias com ícones e cores | Alta | BL08 (#12) | Dev | Sprint 1 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL10** [#14](https://github.com/matheussss237/Brasilia-Participa/issues/14) | Dados | Cadastrar as Regiões Administrativas do DF com coordenadas para o mapa | Alta | BL08 (#12) | Dev | Sprint 1 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL11** [#15](https://github.com/matheussss237/Brasilia-Participa/issues/15) | Dados | Criar demandas de exemplo com fotos reais das RAs | Alta | BL09 (#13), BL10 (#14) | Dev | Sprint 2 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL12** [#16](https://github.com/matheussss237/Brasilia-Participa/issues/16) | Home/Demandas | Implementar hero com CTA 'Registrar demanda' e estatísticas gerais | Alta | BL05 (#9), BL06 (#10) | Dev | Sprint 2 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL13** [#17](https://github.com/matheussss237/Brasilia-Participa/issues/17) | Home/Demandas | Exibir demandas recentes na página inicial | Alta | BL08 (#12), BL12 (#16) | Dev | Sprint 2 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL14** [#18](https://github.com/matheussss237/Brasilia-Participa/issues/18) | Home/Demandas | Criar cards de demandas com foto, título, categoria, região, apoios e status | Alta | BL08 (#12), BL09 (#13) | Dev | Sprint 2 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL15** [#19](https://github.com/matheussss237/Brasilia-Participa/issues/19) | Home/Demandas | Implementar busca por texto e filtro por status | Alta | BL14 (#18) | Dev | Sprint 3 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL16** [#20](https://github.com/matheussss237/Brasilia-Participa/issues/20) | Home/Demandas | Implementar filtro por Região Administrativa | Alta | BL10 (#14), BL14 (#18) | Dev | Sprint 3 | Aberta | Filtro por RA identificado em js/pages/demandas.js; validar interface. |
| **BL17** [#21](https://github.com/matheussss237/Brasilia-Participa/issues/21) | Home/Demandas | Implementar filtro por categoria | Alta | BL09 (#13), BL14 (#18) | Dev | Sprint 3 | Fechada | Filtro por categoria identificado em js/pages/demandas.js; Issue fechada com descrição antiga. |
| **BL18** [#22](https://github.com/matheussss237/Brasilia-Participa/issues/22) | Home/Demandas | Exibir status Recebida, Em análise, Pendente e Resolvida com cores | Alta | BL14 (#18) | Dev | Sprint 3 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL19** [#23](https://github.com/matheussss237/Brasilia-Participa/issues/23) | Mapa | Criar mapa interativo com Leaflet e pins coloridos por status | Alta | BL10 (#14) | Dev | Sprint 4 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL20** [#24](https://github.com/matheussss237/Brasilia-Participa/issues/24) | Mapa | Exibir painel de detalhe ao clicar no pin | Alta | BL19 (#23) | Dev | Sprint 4 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL21** [#25](https://github.com/matheussss237/Brasilia-Participa/issues/25) | Engajamento | Permitir apoiar/remover apoio de uma demanda (upvote) com contagem salva localmente | Alta | BL14 (#18) | Dev | Sprint 4 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL22** [#26](https://github.com/matheussss237/Brasilia-Participa/issues/26) | Engajamento | Permitir apoiar a demanda também pelo detalhe do mapa | Média | BL20 (#24), BL21 (#25) | Dev | Sprint 4 | Aberta | Botão de apoio presente no painel de js/pages/mapa.js; teste manual pendente. |
| **BL23** [#27](https://github.com/matheussss237/Brasilia-Participa/issues/27) | Acesso | Implementar cadastro de usuário com validação e bloqueio de e-mail duplicado | Alta | BL06 (#10) | Dev | Sprint 5 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL24** [#28](https://github.com/matheussss237/Brasilia-Participa/issues/28) | Acesso | Implementar login com bloqueio de credenciais inválidas | Alta | BL23 (#27) | Dev | Sprint 5 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL25** [#29](https://github.com/matheussss237/Brasilia-Participa/issues/29) | Acesso | Exigir login para registrar demanda (pré-condição do caso de uso) | Alta | BL24 (#28), BL26 (#30) | Dev | Sprint 5 | Aberta | O MVP aceita nova demanda sem login; requisito requer decisão da equipe. |
| **BL26** [#30](https://github.com/matheussss237/Brasilia-Participa/issues/30) | Nova demanda | Formulário com título, categoria, região, localização e descrição, com validação dos obrigatórios | Alta | BL09 (#13), BL10 (#14) | Dev | Sprint 5 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL27** [#31](https://github.com/matheussss237/Brasilia-Participa/issues/31) | Nova demanda | Upload de foto com pré-visualização | Alta | BL26 (#30) | Dev | Sprint 6 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL28** [#32](https://github.com/matheussss237/Brasilia-Participa/issues/32) | Nova demanda | Marcação do ponto no mapa habilitada só após escolher a RA | Alta | BL19 (#23), BL26 (#30) | Dev | Sprint 6 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL29** [#33](https://github.com/matheussss237/Brasilia-Participa/issues/33) | Nova demanda | Tela de confirmação e gravação da demanda no store (aparece em Demandas, Mapa e Dashboard) | Alta | BL26 (#30)–BL28 (#32) | Dev | Sprint 6 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL30** [#34](https://github.com/matheussss237/Brasilia-Participa/issues/34) | Nova demanda | Dividir o formulário em Wizard de 3 etapas (dados → localização → foto/resumo) | Média | BL29 (#33) | Dev | Sprint 6 | Aberta | Wizard de 3 etapas presente em js/pages/nova-demanda.js; Issue ainda aberta. |
| **BL31** [#35](https://github.com/matheussss237/Brasilia-Participa/issues/35) | Perfil | Exibir no perfil os dados do usuário logado | Alta | BL24 (#28) | Dev | Sprint 7 | Aberta | Perfil lê dados de usuário em js/pages/perfil.js; Issue aberta. |
| **BL32** [#36](https://github.com/matheussss237/Brasilia-Participa/issues/36) | Perfil | Criar 'Minhas demandas' filtrando pelo autor | Média | BL29 (#33), BL31 (#35) | Dev | Sprint 7 | Aberta | Filtro de demandas por autor presente em js/pages/perfil.js; Issue aberta. |
| **BL33** [#37](https://github.com/matheussss237/Brasilia-Participa/issues/37) | Dashboard | Indicadores (total, resolvidas, em andamento, regiões) calculados a partir do store | Alta | BL08 (#12) | Dev | Sprint 7 | Fechada | Validação da entrega conforme critérios de aceite da Issue. |
| **BL34** [#38](https://github.com/matheussss237/Brasilia-Participa/issues/38) | Dashboard | Criar ranking das Regiões Administrativas mais ativas | Alta | BL10 (#14), BL33 (#37) | Dev | Sprint 7 | Aberta | Ranking implementado em js/pages/dashboard.js; Issue aberta. |
| **BL35** [#39](https://github.com/matheussss237/Brasilia-Participa/issues/39) | Dashboard | Substituir os placeholders por gráficos dinâmicos (status, categoria, evolução no tempo) | Alta | BL33 (#37) | Dev | Sprint 8 | Aberta | Gráficos dinâmicos presentes em js/pages/dashboard.js; Issue aberta. |
| **BL36** [#40](https://github.com/matheussss237/Brasilia-Participa/issues/40) | Gamificação | Definir regras de badges por apoios e relatos | Média | BL21 (#25), BL29 (#33) | Documentação | Sprint 8 | Aberta | Regras de conquistas presentes em js/core/dominio.js; Issue aberta. |
| **BL37** [#41](https://github.com/matheussss237/Brasilia-Participa/issues/41) | Gamificação | Exibir badges no perfil e no dashboard | Média | BL31 (#35), BL36 (#40) | Dev | Sprint 8 | Aberta | Badges presentes no perfil; exibição também no dashboard não comprovada. |
| **BL38** [#42](https://github.com/matheussss237/Brasilia-Participa/issues/42) | UX | Implementar estados de vazio, carregamento e erro em todas as listas | Média | Fluxos principais | Dev | Sprint 9 | Aberta | Estados de vazio presentes em partes do sistema; validar estados de carregamento/erro em todas as listas. |
| **BL39** [#43](https://github.com/matheussss237/Brasilia-Participa/issues/43) | UX | Revisar responsividade mobile/tablet/desktop | Alta | Fluxos principais | Tester | Sprint 9 | Fechada | Issue fechada; conferir evidências da revisão de responsividade. |
| **BL40** [#44](https://github.com/matheussss237/Brasilia-Participa/issues/44) | Acessibilidade | Revisar contraste, foco, labels, navegação por teclado e textos alternativos | Alta | Fluxos principais | Tester | Sprint 9 | Aberta | Revisão formal de acessibilidade pendente. |
| **BL41** [#45](https://github.com/matheussss237/Brasilia-Participa/issues/45) | Qualidade | Otimizar o tamanho das imagens | Média | BL11 (#15) | Dev | Sprint 9 | Aberta | Otimização não comprovada; conferir peso das imagens. |
| **BL42** [#46](https://github.com/matheussss237/Brasilia-Participa/issues/46) | QA | Testar login e cadastro | Alta | BL23 (#27), BL24 (#28) | Tester | Sprint 9 | Fechada | Há testes de autenticação em tests/api.test.js; teste visual ainda necessário. |
| **BL43** [#47](https://github.com/matheussss237/Brasilia-Participa/issues/47) | QA | Testar nova demanda e validações | Alta | BL26 (#30)–BL29 (#33) | Tester | Sprint 9 | Fechada | Há testes de validação/criação; teste visual completo ainda necessário. |
| **BL44** [#48](https://github.com/matheussss237/Brasilia-Participa/issues/48) | QA | Testar listagem, filtros, mapa e apoio | Alta | BL14 (#18)–BL22 (#26) | Tester | Sprint 10 | Aberta | Testes de regras de filtros/apoios presentes; T04 clique no pino não automatizado. |
| **BL45** [#49](https://github.com/matheussss237/Brasilia-Participa/issues/49) | QA | Testar dashboard e gamificação | Alta | BL33 (#37)–BL37 (#41) | Tester | Sprint 10 | Aberta | Há testes de estatísticas/conquistas; QA de interface ainda pendente. |
| **BL46** [#50](https://github.com/matheussss237/Brasilia-Participa/issues/50) | Integração futura | Documentar a API REST (Spring Boot): demandas, apoio, autenticação e usuários | Alta | Fluxos definidos | Documentação | Sprint 10 | Aberta | Backend REST não implementado, apenas previsto. |
| **BL47** [#51](https://github.com/matheussss237/Brasilia-Participa/issues/51) | Integração futura | Modelar as coleções MongoDB (usuarios, demandas, categorias, regioes) | Alta | BL46 (#50) | Documentação | Sprint 10 | Aberta | MongoDB não implementado no MVP. |
| **BL48** [#52](https://github.com/matheussss237/Brasilia-Participa/issues/52) | Integração futura | Mapear a troca das funções do store.js por chamadas fetch() à API | Alta | BL46 (#50) | Dev | Sprint 11 | Aberta | O ponto de integração atual é js/core/api.js, não js/store.js. |
| **BL49** [#53](https://github.com/matheussss237/Brasilia-Participa/issues/53) | Integração futura | Mapear autenticação gov.br, geolocalização por GPS e webhook para a Ouvidoria (OuvDF) | Média | BL46 (#50) | Documentação | Sprint 11 | Aberta | gov.br, GPS e OuvDF são integrações futuras, não funcionais hoje. |
| **BL50** [#54](https://github.com/matheussss237/Brasilia-Participa/issues/54) | Documentação | Criar BACKEND_INTEGRATION.md com contratos, payloads e pontos de troca | Alta | BL46 (#50)–BL49 (#53) | Documentação | Sprint 11 | Aberta | Documento BACKEND_INTEGRATION.md ainda não localizado. |
| **BL51** [#57](https://github.com/matheussss237/Brasilia-Participa/issues/57) | Documentação | Atualizar o README (URL de clone, estrutura, capturas de tela) | Alta | MVP funcional | Documentação | Sprint 12 | Aberta | README parcialmente atualizado; screenshots ainda não anexadas. |
| **BL52** [#58](https://github.com/matheussss237/Brasilia-Participa/issues/58) | Entrega | Publicar no GitHub Pages | Alta | MVP funcional | Dev | Sprint 12 | Fechada | Issue fechada; validar link público do GitHub Pages antes da apresentação. |
| **BL53** [#59](https://github.com/matheussss237/Brasilia-Participa/issues/59) | Qualidade | Corrigir defeitos encontrados pelo QA e refatorar código repetido | Alta | BL42 (#46)–BL45 (#49) | Dev | Sprint 12 | Aberta | Não concluir sem evidências de correções do QA. |
| **BL54** [#60](https://github.com/matheussss237/Brasilia-Participa/issues/60) | Apresentação | Preparar roteiro de demonstração e divisão da apresentação | Alta | BL50 (#54)–BL53 (#59) | Scrum Master | Sprint 12 | Aberta | Roteiro e divisão dos integrantes a validar. |
| **BL55** [#61](https://github.com/matheussss237/Brasilia-Participa/issues/61) | Entrega | Validação final do MVP e dos critérios de aceite | Alta | BL54 (#60) | Equipe | Sprint 12 | Aberta | Aceite final pendente dos testes e da equipe. |

## 4. Cronograma por sprint

Os agrupamentos são do planejamento por sprint; sem datas de início/fim ou estimativas verificadas, **não** inventar prazos durante a apresentação.

| Sprint | Total | Fechadas | Abertas |
|---|---:|---:|---:|
| Sprint 0 | 4 | 4 | 0 |
| Sprint 1 | 6 | 6 | 0 |
| Sprint 2 | 4 | 4 | 0 |
| Sprint 3 | 4 | 3 | 1 |
| Sprint 4 | 4 | 3 | 1 |
| Sprint 5 | 4 | 3 | 1 |
| Sprint 6 | 4 | 3 | 1 |
| Sprint 7 | 4 | 1 | 3 |
| Sprint 8 | 3 | 0 | 3 |
| Sprint 9 | 6 | 3 | 3 |
| Sprint 10 | 4 | 0 | 4 |
| Sprint 11 | 3 | 0 | 3 |
| Sprint 12 | 5 | 1 | 4 |
| **Total** | **55** | **31** | **24** |

**Marcos planejados:** M1/Sprint 2 — início e feed; M2/Sprint 4 — mapa e apoios; M3/Sprint 6 — nova demanda; M4/Sprint 8 — dashboard e gamificação; M5/Sprint 10 — QA/contratos futuros; M6/Sprint 12 — entrega e apresentação. Marco planejado não equivale a aprovado.

## 5. Revisão técnica sem alterar o código

| Itens | Evidência inspecionada | Leitura correta |
|---|---|---|
| BL08 | [`js/core/storage.js`](../js/core/storage.js), [`js/core/api.js`](../js/core/api.js) | Arquitetura atual em camadas; a referência antiga a `js/store.js` está desatualizada |
| BL16/BL17 | [`js/pages/demandas.js`](../js/pages/demandas.js), [`js/core/dominio.js`](../js/core/dominio.js) | Filtros de região e categoria presentes; testar na interface |
| BL19/BL20/BL22 | [`js/pages/mapa.js`](../js/pages/mapa.js) | Pinos, painel e apoio identificados no código; testar clique e atualização |
| BL25 | [`js/core/api.js`](../js/core/api.js) | O MVP admite nova demanda sem login; requisito precisa de decisão |
| BL30 | [`js/pages/nova-demanda.js`](../js/pages/nova-demanda.js) | Formulário em três etapas presente; validar fluxo completo |
| BL31/BL32 | [`js/pages/perfil.js`](../js/pages/perfil.js) | Dados de usuário e filtragem por autor presentes; conferir sessão e dados |
| BL34/BL35 | [`js/pages/dashboard.js`](../js/pages/dashboard.js) | Ranking e gráficos dinâmicos presentes; validar resultados |
| BL36/BL37 | [`js/core/dominio.js`](../js/core/dominio.js), [`js/pages/perfil.js`](../js/pages/perfil.js) | Badges calculados/exibidos no perfil; dashboard não comprovado |
| BL42–BL45 | [`tests/api.test.js`](../tests/api.test.js), [`tests/dominio.test.js`](../tests/dominio.test.js) | Testes de regra presentes; cobertura de interação visual não comprovada |
| BL46–BL50 | [`js/core/api.js`](../js/core/api.js) | Interfaces assíncronas locais; nenhuma API real, banco MongoDB, gov.br ou OuvDF no MVP |

**Pontos críticos para corrigir no quadro/Issues:** alguns textos antigos dizem que não existe filtro ou wizard, embora os arquivos atuais os implementem. Atualizar a descrição e documentar o aceite antes de fechar tarefas. A coluna Status do GitHub Projects deve ser verificada separadamente: os seus cartões não são atualizados por este documento. Não transferir automaticamente os 31 fechamentos de Issue para *Feito* sem revisão da equipe.

## 6. Testes e critérios de aceite

> Existem testes automatizados no repositório, mas **não foram executados nesta revisão**. A existência do teste não comprova que passou nesta data.

| Cenário | Verificação | Evidência / ação necessária |
|---|---|---|
| T01 — seed/feed | Automatizada em código | `tests/api.test.js`, executar `npm test` e revisar UI |
| T02 — filtro região | Automatizada em código | `tests/dominio.test.js` + testar UI |
| T03 — filtro categoria | Automatizada em código | `tests/dominio.test.js` + testar UI |
| T04 — clique no pino | **Teste automatizado não localizado** | Abrir mapa, clicar no pin e registrar evidência; BL44 |
| T05 — apoio e retirada | Automatizada em código | `tests/api.test.js` + conferir contagem visual |
| T06 — validação formulário | Automatizada em código | `tests/dominio.test.js` + teste visual do wizard |
| T07 — criação de demanda | Automatizada em código | `tests/api.test.js` + conferir feed/mapa/dashboard |
| T08 — estatísticas/dashboard | Automatizada em código | `tests/dominio.test.js` + conferir gráficos |
| T09 — conquistas | Automatizada em código | `tests/dominio.test.js` + conferir perfil |
| T10 — responsividade | **Revisão manual pendente de evidência** | Ver mobile, tablet e desktop; BL39 |
| T11 — acessibilidade | **Revisão manual pendente de evidência** | Navegação por teclado, foco, rótulos, contraste; BL40 |
| T12 — contratos REST | **Documento ainda não localizado** | `docs/BACKEND_INTEGRATION.md`; BL46–BL50 |

**Aceite de uma tarefa:** escopo implementado, critério atendido, teste registrado e responsável validado. Até lá, a evidência de código pode justificar *Em validação*, mas não aprovação irrestrita.

## 7. Responsabilidades da equipe

Os papéis abaixo constam na documentação acadêmica anterior. As Issues atuais não têm contas atribuídas no campo Assignees; atribuir responsáveis reais quando a equipe confirmar.

| Papel | Integrantes | Entregas |
|---|---|---|
| Scrum Master | Matheus Henrique Madeira Amorim | Cerimônias, alinhamento do backlog, sprints e aceite final |
| Dev | Iago Camilo Soares Pedroso; Igor Gabriel da Costa Souza; Luiz Felipe Rodrigues Gusmão; Oto Pereira Bonfim | Frontend, dados, componentes e correções |
| Tester | Gabriel Alves da Cunha de Souza | QA, evidências e critérios de aceite |
| Documentação | Gabriel Andrade de Melo; Gabriel Mendes Siqueira; Igor Gabriel Ildefonso Costa; João Paulo Messias Dos Santos; João Vitor de Souza Guedes | Requisitos, Figma, documentação e apresentação |

## 8. Checklist de preparo para a apresentação

- [ ] Confirmar que os códigos oficiais exibidos nos slides são BL01–BL55 das Issues.
- [ ] Reconciliar o status dos cartões do GitHub Projects após a equipe validar os critérios.
- [ ] Corrigir descrições antigas de Issues e atribuir responsáveis individuais.
- [ ] Executar `npm test` e registrar saída com data/commit.
- [ ] Testar T04 (clique no pino), T10 (responsividade) e T11 (acessibilidade).
- [ ] Validar home, filtros, mapa, apoios, wizard, dashboard e perfil na versão apresentada.
- [ ] Anexar ou conferir links de personas, Figma, wireframes e capturas de tela, se forem citados.
- [ ] Conferir acesso ao GitHub Pages (BL52) antes de mostrar link ao professor.
- [ ] Explicar que o MVP usa localStorage e não tem backend/banco reais.
- [ ] Realizar ensaio, divisão de falas e aceite final (BL54/BL55).

## 9. Fontes e controle de mudanças

- [GitHub Issues — identificação oficial](https://github.com/matheussss237/Brasilia-Participa/issues)
- [GitHub Projects — quadro visual a reconciliar](https://github.com/matheussss237/Brasilia-Participa/projects)
- [README](../README.md): execução e tecnologias.
- `docs/backlog_cronograma.xlsx`: planilha **histórica** do planejamento; IDs e estados podem estar divergentes e não são fonte oficial desta versão.
- Histórico de commits: mantém a versão antiga de 57 IDs para auditoria, mas **não** a use para referenciar Issues ou apresentar o quadro.

**Escopo da revisão:** somente arquivos Markdown de documentação. Nenhum HTML, CSS, JS, test ou estrutura do programa foi alterado. A inspeção foi estática, sem executar o site nem os testes.

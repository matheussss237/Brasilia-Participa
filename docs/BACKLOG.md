# Backlog do produto — Brasília Participa

> **Base de referência:** 55 GitHub Issues identificadas como BL01–BL55 em 08/11/2026. Esta tabela reproduz a identidade, as informações e os **status declarados no texto das issues**. Não significa que o funcionamento de cada entrega foi testado nem que a coluna do GitHub Projects esteja sincronizada.
>
> **Planejamento anterior preservado:** [BACKLOG_PLANEJAMENTO_20261107.md](BACKLOG_PLANEJAMENTO_20261107.md). Esse documento tem **57 itens com numeração diferente**, por isso seus códigos BL não devem ser usados como equivalentes aos das issues.

## Resumo

| Indicador | Valor |
|---|---|
| Issues do backlog | **55** (BL01–BL55) |
| Status informado: Concluído | **30** |
| Status informado: Em andamento | **4** |
| Status informado: Não iniciado | **21** |
| Fonte de status | Campo textual `Status no backlog` nas issues; não é o status em tempo real do GitHub Projects |
| Sprints | Conforme a issue de cada atividade |

## Itens do backlog (identificadores oficiais das issues)

| ID | Issue | Atividade | Épico | Prioridade | Responsável (papel) | Sprint | Status declarado | Dependências declaradas |
|---|---|---|---|---|---|---|---|---|
| BL01 | [#5](https://github.com/matheussss237/Brasilia-Participa/issues/5) | Definir personas (morador, líder comunitário, cidadão interessado) e jornada principal | Planejamento | Alta | Documentação / UX | Sprint 0 | Concluído | — |
| BL02 | [#6](https://github.com/matheussss237/Brasilia-Participa/issues/6) | Levantar requisitos e definir arquitetura de informação e fluxos de navegação das 8 páginas | Planejamento | Alta | Documentação / UX | Sprint 0 | Concluído | BL01 (#5) |
| BL03 | [#7](https://github.com/matheussss237/Brasilia-Participa/issues/7) | Documentar o caso de uso 'Registrar Demanda Urbana' | Planejamento | Alta | Documentação | Sprint 0 | Concluído | BL02 (#6) |
| BL04 | [#8](https://github.com/matheussss237/Brasilia-Participa/issues/8) | Criar wireframes das telas principais | UI/UX | Alta | Documentação / UX | Sprint 0 | Concluído | BL01 (#5) |
| BL05 | [#9](https://github.com/matheussss237/Brasilia-Participa/issues/9) | Criar protótipo de alta fidelidade e guia de estilos no Figma | UI/UX | Alta | Documentação / UX | Sprint 1 | Concluído | BL04 (#8) |
| BL06 | [#10](https://github.com/matheussss237/Brasilia-Participa/issues/10) | Estruturar projeto multipágina (HTML/CSS/JS) com CSS modular: reset, style, components, pages, responsive | Fundação | Alta | Dev | Sprint 1 | Concluído | BL02 (#6), BL05 (#9) |
| BL07 | [#11](https://github.com/matheussss237/Brasilia-Participa/issues/11) | Criar cabeçalho, navegação, rodapé e alternância de tema claro/escuro | Fundação | Alta | Dev | Sprint 1 | Concluído | BL06 (#10) |
| BL08 | [#12](https://github.com/matheussss237/Brasilia-Participa/issues/12) | Criar js/store.js como fonte única de dados no localStorage, com seed versionado | Dados | Alta | Dev | Sprint 1 | Concluído | BL06 (#10) |
| BL09 | [#13](https://github.com/matheussss237/Brasilia-Participa/issues/13) | Definir as 9 categorias com ícones e cores | Dados | Alta | Dev | Sprint 1 | Concluído | BL08 (#12) |
| BL10 | [#14](https://github.com/matheussss237/Brasilia-Participa/issues/14) | Cadastrar as Regiões Administrativas do DF com coordenadas para o mapa | Dados | Alta | Dev | Sprint 1 | Concluído | BL08 (#12) |
| BL11 | [#15](https://github.com/matheussss237/Brasilia-Participa/issues/15) | Criar demandas de exemplo com fotos reais das RAs | Dados | Alta | Dev | Sprint 2 | Concluído | BL09 (#13), BL10 (#14) |
| BL12 | [#16](https://github.com/matheussss237/Brasilia-Participa/issues/16) | Implementar hero com CTA 'Registrar demanda' e estatísticas gerais | Home/Demandas | Alta | Dev | Sprint 2 | Concluído | BL05 (#9), BL06 (#10) |
| BL13 | [#17](https://github.com/matheussss237/Brasilia-Participa/issues/17) | Exibir demandas recentes na página inicial | Home/Demandas | Alta | Dev | Sprint 2 | Concluído | BL08 (#12), BL12 (#16) |
| BL14 | [#18](https://github.com/matheussss237/Brasilia-Participa/issues/18) | Criar cards de demandas com foto, título, categoria, região, apoios e status | Home/Demandas | Alta | Dev | Sprint 2 | Concluído | BL08 (#12), BL09 (#13) |
| BL15 | [#19](https://github.com/matheussss237/Brasilia-Participa/issues/19) | Implementar busca por texto e filtro por status | Home/Demandas | Alta | Dev | Sprint 3 | Concluído | BL14 (#18) |
| BL16 | [#20](https://github.com/matheussss237/Brasilia-Participa/issues/20) | Implementar filtro por Região Administrativa | Home/Demandas | Alta | Dev | Sprint 3 | Não iniciado | BL10 (#14), BL14 (#18) |
| BL17 | [#21](https://github.com/matheussss237/Brasilia-Participa/issues/21) | Implementar filtro por categoria | Home/Demandas | Alta | Dev | Sprint 3 | Não iniciado | BL09 (#13), BL14 (#18) |
| BL18 | [#22](https://github.com/matheussss237/Brasilia-Participa/issues/22) | Exibir status Recebida, Em análise, Pendente e Resolvida com cores | Home/Demandas | Alta | Dev | Sprint 3 | Concluído | BL14 (#18) |
| BL19 | [#23](https://github.com/matheussss237/Brasilia-Participa/issues/23) | Criar mapa interativo com Leaflet e pins coloridos por status | Mapa | Alta | Dev | Sprint 4 | Concluído | BL10 (#14) |
| BL20 | [#24](https://github.com/matheussss237/Brasilia-Participa/issues/24) | Exibir painel de detalhe ao clicar no pin | Mapa | Alta | Dev | Sprint 4 | Concluído | BL19 (#23) |
| BL21 | [#25](https://github.com/matheussss237/Brasilia-Participa/issues/25) | Permitir apoiar/remover apoio de uma demanda (upvote) com contagem salva localmente | Engajamento | Alta | Dev | Sprint 4 | Concluído | BL14 (#18) |
| BL22 | [#26](https://github.com/matheussss237/Brasilia-Participa/issues/26) | Permitir apoiar a demanda também pelo detalhe do mapa | Engajamento | Média | Dev | Sprint 4 | Não iniciado | BL20 (#24), BL21 (#25) |
| BL23 | [#27](https://github.com/matheussss237/Brasilia-Participa/issues/27) | Implementar cadastro de usuário com validação e bloqueio de e-mail duplicado | Acesso | Alta | Dev | Sprint 5 | Concluído | BL06 (#10) |
| BL24 | [#28](https://github.com/matheussss237/Brasilia-Participa/issues/28) | Implementar login com bloqueio de credenciais inválidas | Acesso | Alta | Dev | Sprint 5 | Concluído | BL23 (#27) |
| BL25 | [#29](https://github.com/matheussss237/Brasilia-Participa/issues/29) | Exigir login para registrar demanda (pré-condição do caso de uso) | Acesso | Alta | Dev | Sprint 5 | Não iniciado | BL24 (#28), BL26 (#30) |
| BL26 | [#30](https://github.com/matheussss237/Brasilia-Participa/issues/30) | Formulário com título, categoria, região, localização e descrição, com validação dos obrigatórios | Nova demanda | Alta | Dev | Sprint 5 | Concluído | BL09 (#13), BL10 (#14) |
| BL27 | [#31](https://github.com/matheussss237/Brasilia-Participa/issues/31) | Upload de foto com pré-visualização | Nova demanda | Alta | Dev | Sprint 6 | Concluído | BL26 (#30) |
| BL28 | [#32](https://github.com/matheussss237/Brasilia-Participa/issues/32) | Marcação do ponto no mapa habilitada só após escolher a RA | Nova demanda | Alta | Dev | Sprint 6 | Concluído | BL19 (#23), BL26 (#30) |
| BL29 | [#33](https://github.com/matheussss237/Brasilia-Participa/issues/33) | Tela de confirmação e gravação da demanda no store (aparece em Demandas, Mapa e Dashboard) | Nova demanda | Alta | Dev | Sprint 6 | Concluído | BL26 (#30)–BL28 (#32) |
| BL30 | [#34](https://github.com/matheussss237/Brasilia-Participa/issues/34) | Dividir o formulário em Wizard de 3 etapas (dados → localização → foto/resumo) | Nova demanda | Média | Dev | Sprint 6 | Não iniciado | BL29 (#33) |
| BL31 | [#35](https://github.com/matheussss237/Brasilia-Participa/issues/35) | Exibir no perfil os dados do usuário logado | Perfil | Alta | Dev | Sprint 7 | Em andamento | BL24 (#28) |
| BL32 | [#36](https://github.com/matheussss237/Brasilia-Participa/issues/36) | Criar 'Minhas demandas' filtrando pelo autor | Perfil | Média | Dev | Sprint 7 | Não iniciado | BL29 (#33), BL31 (#35) |
| BL33 | [#37](https://github.com/matheussss237/Brasilia-Participa/issues/37) | Indicadores (total, resolvidas, em andamento, regiões) calculados a partir do store | Dashboard | Alta | Dev | Sprint 7 | Concluído | BL08 (#12) |
| BL34 | [#38](https://github.com/matheussss237/Brasilia-Participa/issues/38) | Criar ranking das Regiões Administrativas mais ativas | Dashboard | Alta | Dev | Sprint 7 | Não iniciado | BL10 (#14), BL33 (#37) |
| BL35 | [#39](https://github.com/matheussss237/Brasilia-Participa/issues/39) | Substituir os placeholders por gráficos dinâmicos (status, categoria, evolução no tempo) | Dashboard | Alta | Dev | Sprint 8 | Não iniciado | BL33 (#37) |
| BL36 | [#40](https://github.com/matheussss237/Brasilia-Participa/issues/40) | Definir regras de badges por apoios e relatos | Gamificação | Média | Documentação | Sprint 8 | Não iniciado | BL21 (#25), BL29 (#33) |
| BL37 | [#41](https://github.com/matheussss237/Brasilia-Participa/issues/41) | Exibir badges no perfil e no dashboard | Gamificação | Média | Dev | Sprint 8 | Não iniciado | BL31 (#35), BL36 (#40) |
| BL38 | [#42](https://github.com/matheussss237/Brasilia-Participa/issues/42) | Implementar estados de vazio, carregamento e erro em todas as listas | UX | Média | Dev | Sprint 9 | Em andamento | Fluxos principais |
| BL39 | [#43](https://github.com/matheussss237/Brasilia-Participa/issues/43) | Revisar responsividade mobile/tablet/desktop | UX | Alta | Tester | Sprint 9 | Concluído | Fluxos principais |
| BL40 | [#44](https://github.com/matheussss237/Brasilia-Participa/issues/44) | Revisar contraste, foco, labels, navegação por teclado e textos alternativos | Acessibilidade | Alta | Tester | Sprint 9 | Não iniciado | Fluxos principais |
| BL41 | [#45](https://github.com/matheussss237/Brasilia-Participa/issues/45) | Otimizar o tamanho das imagens | Qualidade | Média | Dev | Sprint 9 | Não iniciado | BL11 (#15) |
| BL42 | [#46](https://github.com/matheussss237/Brasilia-Participa/issues/46) | Testar login e cadastro | QA | Alta | Tester | Sprint 9 | Concluído | BL23 (#27), BL24 (#28) |
| BL43 | [#47](https://github.com/matheussss237/Brasilia-Participa/issues/47) | Testar nova demanda e validações | QA | Alta | Tester | Sprint 9 | Concluído | BL26 (#30)–BL29 (#33) |
| BL44 | [#48](https://github.com/matheussss237/Brasilia-Participa/issues/48) | Testar listagem, filtros, mapa e apoio | QA | Alta | Tester | Sprint 10 | Em andamento | BL14 (#18)–BL22 (#26) |
| BL45 | [#49](https://github.com/matheussss237/Brasilia-Participa/issues/49) | Testar dashboard e gamificação | QA | Alta | Tester | Sprint 10 | Não iniciado | BL33 (#37)–BL37 (#41) |
| BL46 | [#50](https://github.com/matheussss237/Brasilia-Participa/issues/50) | Documentar a API REST (Spring Boot): demandas, apoio, autenticação e usuários | Integração futura | Alta | Documentação | Sprint 10 | Não iniciado | Fluxos definidos |
| BL47 | [#51](https://github.com/matheussss237/Brasilia-Participa/issues/51) | Modelar as coleções MongoDB (usuarios, demandas, categorias, regioes) | Integração futura | Alta | Documentação | Sprint 10 | Não iniciado | BL46 (#50) |
| BL48 | [#52](https://github.com/matheussss237/Brasilia-Participa/issues/52) | Mapear a troca das funções do store.js por chamadas fetch() à API | Integração futura | Alta | Dev | Sprint 11 | Não iniciado | BL46 (#50) |
| BL49 | [#53](https://github.com/matheussss237/Brasilia-Participa/issues/53) | Mapear autenticação gov.br, geolocalização por GPS e webhook para a Ouvidoria (OuvDF) | Integração futura | Média | Documentação | Sprint 11 | Não iniciado | BL46 (#50) |
| BL50 | [#54](https://github.com/matheussss237/Brasilia-Participa/issues/54) | Criar BACKEND_INTEGRATION.md com contratos, payloads e pontos de troca | Documentação | Alta | Documentação | Sprint 11 | Não iniciado | BL46 (#50)–BL49 (#53) |
| BL51 | [#57](https://github.com/matheussss237/Brasilia-Participa/issues/57) | Atualizar o README (URL de clone, estrutura, capturas de tela) | Documentação | Alta | Documentação | Sprint 12 | Em andamento | MVP funcional |
| BL52 | [#58](https://github.com/matheussss237/Brasilia-Participa/issues/58) | Publicar no GitHub Pages | Entrega | Alta | Dev | Sprint 12 | Concluído | MVP funcional |
| BL53 | [#59](https://github.com/matheussss237/Brasilia-Participa/issues/59) | Corrigir defeitos encontrados pelo QA e refatorar código repetido | Qualidade | Alta | Dev | Sprint 12 | Não iniciado | BL42 (#46)–BL45 (#49) |
| BL54 | [#60](https://github.com/matheussss237/Brasilia-Participa/issues/60) | Preparar roteiro de demonstração e divisão da apresentação | Apresentação | Alta | Scrum Master | Sprint 12 | Não iniciado | BL50 (#54)–BL53 (#59) |
| BL55 | [#61](https://github.com/matheussss237/Brasilia-Participa/issues/61) | Validação final do MVP e dos critérios de aceite | Entrega | Alta | Equipe | Sprint 12 | Não iniciado | BL54 (#60) |

## Critérios para manter o quadro correto

1. **Não confundir número da issue com código BL:** por exemplo, a issue #21 é BL17 (filtro por categoria), enquanto o BL17 do planejamento anterior descreve um pino do mapa.
2. **Não concluir tarefas só porque o código existe:** confirmar comportamento, teste e critérios de aceite antes de marcar `Feito` e fechar a issue.
3. **Sincronizar três lugares:** descrição da issue, campo de status no GitHub Projects e esta tabela. Este documento é uma fotografia dos status escritos nas issues em 08/11/2026.
4. **Manter os papéis genéricos até validar os integrantes:** `Dev`, `Tester`, `Documentação` e `Equipe` não são atribuições de usuário. O Scrum Master deve confirmar responsáveis reais.
5. **Revisar dependências antigas:** referências a arquivos como `js/store.js` podem estar obsoletas, pois a arquitetura atual usa `js/core/api.js` e `js/core/storage.js`.
6. **Registrar evidências:** para concluir, anexar link do commit/PR, teste executado ou captura de tela na issue.

## Diferença entre backlog do GitHub e planejamento revisado

O planejamento de 07/11/2026 foi preservado integralmente para evitar perda de histórico. Ele contém BL01–BL57 e usa outros significados para vários IDs; **não é uma versão equivalente** das 55 issues do GitHub. Para apresentar o quadro do GitHub Projects, utilize a tabela desta página. Para o histórico de sprints, marcos e escopo, consulte o planejamento preservado, sem misturar seus IDs.

## Validação pendente

- Conferir se o status **real do GitHub Projects** corresponde aos status declarados nas issues.
- Executar `npm test` e os testes manuais (mapa, filtros, criação de demanda, login, responsividade e acessibilidade).
- Revisar com a equipe quais itens do planejamento de 57 atividades precisam virar novas issues, sem reutilizar IDs já existentes.
- Confirmar que as tarefas realmente concluídas têm evidência e responsável.

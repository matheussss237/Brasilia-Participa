# Validação da apresentação — Brasília-Participa

## Resultado automatizado verificado em 08/11/2026

**Fonte:** [GitHub Actions — execução #42452638703](https://github.com/matheussss237/Brasilia-Participa/actions/runs/42452638703) na branch `qa/validacao-apresentacao-2026-11-08`, commit `3e2bb45783fa62086cb679f963072071c9374a32`, derivado de `main`.

| Verificação realmente executada | Resultado |
|---|---|
| `node --check` nos arquivos de `js/` e `tests/` | **Aprovado** |
| `npm test` com Node.js 22 | **15 testes passaram, 0 falharam** |
| Integridade de referências locais dos HTML | **8 páginas verificadas, nenhuma referência ausente** |
| Resultado global do workflow | **Sucesso** |

**Limitações da evidência:** os testes automatizados cobrem lógica e dados, mas **não substituem** validação visual/manual da interface, cliques em pinos (T04), responsividade (T10), acessibilidade (T11), conexão de bibliotecas externas, nem um teste de ponta a ponta no navegador. A revisão foi executada sobre o código da `main` no momento da criação da branch de QA; nenhuma alteração funcional foi feita. O log de setup registra avisos de depreciação das GitHub Actions utilizadas, sem provocar falha nos testes.


> **Verificação em andamento:** os testes automatizados já foram executados e passaram (15/15). Os testes manuais foram realizados parcialmente e as verificações ainda pendentes estão indicadas abaixo. IDs oficiais e status das Issues: [BACKLOG.md](BACKLOG.md).

## Preparação

1. Confirmar a branch/commit da versão que será demonstrada.
2. **Concluído no GitHub Actions:** `npm test` com Node.js 22, **15 passaram e 0 falharam**. O log da execução está vinculado acima.
3. **Verificado pelo usuário:** o protótipo abriu pelo Live Server do VS Code em `http://127.0.0.1:5500`. A conexão de internet é necessária para bibliotecas via CDN/mapa.
4. Verificar o link GitHub Pages antes de colocá-lo nos slides.
5. Conferir se todos os slides usam os códigos BL01–BL55 reais das Issues.

## Passo a passo da validação manual

| Tela / cenário | Como testar | Critério de aceite | Registro |
|---|---|---|---|
| Home | Abrir index.html | CTA, cards e indicadores renderizam corretamente | **Validado visualmente em print** (08/11) |
| BL16 / BL17 | Abrir Demandas e alternar RA/categoria | Resultados respeitam ambos os filtros | **Validado visualmente em prints**: Saúde → 3 de 22; Taguatinga → 2 de 22 (08/11) |
| BL19 / BL20 | Abrir Mapa e clicar em um pino | Painel correto abre (T04) | **Validado visualmente em print**: mapa, 22 pinos e detalhes de uma demanda (08/11) |
| BL21 / BL22 | Apoiar/retirar apoio no mapa | Botão e contador atualizam | **Relatado pelo usuário**: 41 → 42 → 41; persistência após F5 **não comprovada** |
| BL26 / BL30 | Tentar avançar wizard vazio; preencher 3 etapas | Obrigatórios validados e demanda criada | **Print confirma avanço à etapa 2 e mapa carregado**; usuário relatou funcionamento geral; criação persistida ainda sem print de comprovação |
| BL33–BL35 | Criar demanda e abrir dashboard | Indicadores e gráficos condizem com dados | ☐ A testar |
| BL31 / BL32 / BL37 | Login e abertura de Perfil | Dados e demandas corretos, badges coerentes | **Cadastro e login relatados como funcionais**; perfil e badges ainda não verificados com evidência |
| BL39 | Larguras mobile, tablet e desktop | Sem corte, navegação e botões utilizáveis (T10) | ☐ A testar |
| BL40 | Navegar por Tab e teclado | Foco visível, rótulos e contraste adequados (T11) | ☐ A testar |

## Pendências que devem aparecer de forma transparente

- Os estados do **GitHub Projects** podem diferir das **Issues**; a equipe precisa reconciliar os cartões.
- Algumas Issues falam em `js/store.js`, mas o projeto atual usa `js/core/api.js` e `js/core/storage.js`.
- BL25 exige decisão: o MVP permite registrar demanda sem login.
- BL37 prevê badges também no dashboard; só a exibição no perfil foi identificada.
- BL44 inclui a interação T04, não automatizada na revisão.
- BL46–BL50 tratam de especificação de backend e integrações futuras, **não de recursos já operacionais**.
- Screenshots de apresentação e links externos precisam de confirmação.

## Registro da equipe

| Verificação | Responsável | Data | Evidência / resultado |
|---|---|---|---|
| Execução de `npm test` | Tester | A preencher | A anexar |
| Mapa, pino e apoio | Tester | A preencher | A anexar |
| Responsividade e acessibilidade | Tester / Dev | A preencher | A anexar |
| Conciliação Issues/Projects | Scrum Master | A preencher | A anexar |
| Screenshots, Figma e README | Documentação | A preencher | A anexar |
| Ensaio e aceite final | Equipe | A preencher | A anexar |

## Resumo seguro para apresentação

> “O Brasília-Participa é um protótipo web de participação cidadã. O backlog possui 55 Issues rastreáveis, das quais 31 estavam fechadas e 24 abertas na consulta de 08/11/2026. O projeto usa HTML, CSS, JavaScript, Leaflet e armazenamento no navegador. A API real e o banco de dados são evoluções futuras. O andamento é acompanhado no GitHub, separando implementação de testes de aceitação.”

**Observação:** houve execução real de testes automatizados e inspeção de capturas de tela encaminhadas pelo usuário. Ainda faltam evidências para fluxo completo de nova demanda, persistência após recarga, dashboard, perfil, responsividade e acessibilidade. A validação final de equipe continua pendente.

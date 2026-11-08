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


> Documento de verificação **a executar**, não relatório de testes realizados. IDs oficiais e status das Issues: [BACKLOG.md](BACKLOG.md).

## Preparação

1. Confirmar a branch/commit da versão que será demonstrada.
2. Rodar `npm test` com Node.js 18+ e **registrar o resultado real**, com quantidade de testes que passaram/falharam.
3. Iniciar o protótipo em servidor local com `python3 -m http.server 8000` e abrir `http://localhost:8000`. Conexão de internet é necessária para bibliotecas via CDN/mapa.
4. Verificar o link GitHub Pages antes de colocá-lo nos slides.
5. Conferir se todos os slides usam os códigos BL01–BL55 reais das Issues.

## Passo a passo da validação manual

| Tela / cenário | Como testar | Critério de aceite | Registro |
|---|---|---|---|
| Home | Abrir index.html | CTA, cards e indicadores renderizam corretamente | ☐ A testar |
| BL16 / BL17 | Abrir Demandas e alternar RA/categoria | Resultados respeitam ambos os filtros | ☐ A testar |
| BL19 / BL20 | Abrir Mapa e clicar em um pino | Painel correto abre (T04) | ☐ A testar |
| BL21 / BL22 | Apoiar/retirar apoio no mapa | Botão e contador atualizam | ☐ A testar |
| BL26 / BL30 | Tentar avançar wizard vazio; preencher 3 etapas | Obrigatórios validados e demanda criada | ☐ A testar |
| BL33–BL35 | Criar demanda e abrir dashboard | Indicadores e gráficos condizem com dados | ☐ A testar |
| BL31 / BL32 / BL37 | Login e abertura de Perfil | Dados e demandas corretos, badges coerentes | ☐ A testar |
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

**Observação:** esta revisão é estática; testes e demonstração ainda precisam da validação real da equipe.

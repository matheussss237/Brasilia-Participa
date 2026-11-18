# Plano de apresentação e revisão — Brasília-Participa

> Material de apoio para apresentação acadêmica. **O tempo e os apresentadores abaixo são uma sugestão**, sujeita às regras do professor e à confirmação da equipe. A versão principal do código não é modificada.

## 1. Veredito da revisão
**Não refazer o projeto do zero.** O repositório tem 8 páginas HTML; em uma revisão estática de referências locais dessas páginas não foram encontrados caminhos quebrados. Já há código para filtros de demanda, mapa, apoio, registro de demanda em três etapas, dashboard, perfil e conquistas. Isso **não comprova funcionamento em navegador**, que depende de testes reais.

O MVP usa HTML, CSS, JavaScript, Leaflet/OpenStreetMap e `localStorage`. **Não existe API real com Java/Spring, MongoDB ou integração operante com gov.br/OuvDF.** Essas são evoluções futuras.

## 2. Status e prioridades para a entrega
| Área | Situação | O que fazer |
|---|---|---|
| Backlog | 55 Issues rastreáveis (31 fechadas, 24 abertas na consulta de 08/11/2026) | Rever e aprovar o [PR #65](https://github.com/matheussss237/Brasilia-Participa/pull/65) |
| Sprints | 0 a 12, agrupadas no `BACKLOG.md` | Usar essa numeração nos slides, não a planilha antiga de 57 IDs |
| GitHub Projects | Estado visual não foi reconciliado nesta revisão | Conferir cartões e campo Status com o Scrum Master |
| Código | Não há indicação de que refazer tudo seja necessário | Evitar mudanças sem defeito reproduzido |
| Testes | **15 de 15 testes automatizados aprovados** no GitHub Actions em 08/11/2026 ([execução e logs](https://github.com/matheussss237/Brasilia-Participa/actions/runs/42452638703)) | Resultado de `npm test` registrado (15/15); concluir testes visuais, persistência após F5 e responsividade |
| Design/documentação | Figma, personas, wireframes e screenshots sem links verificados | Localizar, conferir e anexar apenas artefatos reais |
| MVP | Tem frontend e persistência local | Comunicar limitações de backend e autenticação simulada |

## 3. Estrutura recomendada dos slides
| Slide | Conteúdo | Evidência |
|---|---|---|
| 1 | Capa, equipe, disciplina e professor | Dados acadêmicos conferidos |
| 2 | Problema urbano e público-alvo | Exemplo simples de uma demanda |
| 3 | Objetivo e proposta de valor | Tela inicial |
| 4 | Escopo, arquitetura e tecnologias | Diagrama simples do frontend e localStorage |
| 5 | Processo Scrum, sprints e backlog | GitHub Issues BL01–BL55 e Kanban atualizado |
| 6 | Feed de demandas e filtros | `demandas.html` |
| 7 | Mapa, pins, detalhes e apoio | `mapa.html` |
| 8 | Wizard de nova demanda | `nova-demanda.html` |
| 9 | Dashboard, perfil e conquistas | `dashboard.html` / `perfil.html` |
| 10 | QA: testes, pendências, limitações | Captura da execução de `npm test` e checklist |
| 11 | Conclusão e próximos passos | Resumo do MVP, sem prometer backend real |

## 4. Divisão **sugerida** entre os 11 integrantes
Proposta para uma fala de aproximadamente **12 a 14 minutos**, ajustável. **Não são responsáveis já atribuídos às Issues.**

| Ordem | Integrante | Parte |
|---|---|---|
| 1 | Matheus Henrique Madeira Amorim | Abertura, Scrum e objetivo |
| 2 | Gabriel Andrade de Melo | Problema e público-alvo |
| 3 | Gabriel Mendes Siqueira | Requisitos e caso de uso |
| 4 | Igor Gabriel Ildefonso Costa | Arquitetura e tecnologias |
| 5 | João Paulo Messias Dos Santos | Sprints, backlog e rastreabilidade |
| 6 | João Vitor de Souza Guedes | Fluxos de navegação e Figma, **se houver evidência** |
| 7 | Iago Camilo Soares Pedroso | Demonstração: home, demandas e filtros |
| 8 | Igor Gabriel da Costa Souza | Demonstração: mapa e apoio |
| 9 | Luiz Felipe Rodrigues Gusmão | Demonstração: cadastro/login simulado e wizard |
| 10 | Oto Pereira Bonfim | Demonstração: dashboard, perfil e conquistas |
| 11 | Gabriel Alves da Cunha de Souza | Testes, limitações e encerramento |

Caso o tempo concedido seja curto, agrupar as falas da documentação e concentrar a demonstração nos desenvolvedores. Confirmar previamente cada atribuição com os colegas.

## 5. Roteiro da demonstração, com ordem fixa
1. Abrir a página inicial e explicar para quem serve o portal.
2. Abrir Demandas, filtrar por Região Administrativa e por categoria.
3. Abrir o Mapa, clicar em um pino e mostrar as informações; dar e retirar um apoio.
4. Acessar login/cadastro **simulados** e explicar que não são autenticação de produção.
5. Abrir Nova Demanda, tentar avançar com um obrigatório vazio e depois concluir o formulário de três etapas.
6. Conferir a demanda criada em Demandas, Mapa e Dashboard. Atenção: os dados ficam neste navegador.
7. Abrir Perfil e mostrar demandas vinculadas ao usuário e conquistas, quando aplicável.
8. Apresentar o resultado **real** dos testes e dizer quais verificações ainda faltam.

**Plano B:** deixar o site local pronto no PC e capturas reais das telas caso a rede/CDN do mapa falhe. Evitar exibir dados pessoais reais em contas de demonstração.

## 6. Comandos para testar no Windows / VS Code
Abra a pasta raiz `Brasilia-Participa` no VS Code, depois use o terminal:

```powershell
node --version
npm test
```

É necessário ter Node.js 18 ou superior. Guarde um print da saída: **não diga que os testes passaram antes de conferir**.

Em outro terminal:

```powershell
py -m http.server 8000
```

Se `py` não funcionar, tente `python -m http.server 8000`. Acesse `http://localhost:8000`.

## 7. Checklist final e responsáveis propostos
| Ordem | Pendência | Papel sugerido | Evidência de conclusão |
|---|---|---|---|
| 1 | Revisar/aprovar PR #65 (documentação) | Scrum Master + equipe | PR incorporado à main após revisão |
| 2 | Revisar 55 Issues e sincronizar cartões Projects | Scrum Master | Quadro coerente com status comprovados |
| 3 | Corrigir descrições antigas BL16/17, BL22, BL30–37 e arquitetura store.js | Dev + Scrum Master | Issues atualizadas com critérios |
| 4 | Conferir evidência dos 15 testes aprovados no GitHub Actions | Tester | [Log oficial da execução](https://github.com/matheussss237/Brasilia-Participa/actions/runs/42452638703) |
| 5 | Testes manuais do clique no pin, responsividade e acessibilidade | Tester + Dev | Checklist T04/T10/T11 registrado |
| 6 | Validar requisito BL25 (login exigido ou não) e BL37 (dashboard) | Equipe | Decisões de escopo documentadas |
| 7 | Conferir Figma, wireframes, personas, prints e link da implantação | Documentação | Evidências válidas nos slides |
| 8 | Revisar capa e nomes, inclusive imagens Scrum em docs/ | Documentação | Arquivos e autores conferidos |
| 9 | Ensaiar a apresentação e dividir o tempo | Todos | Ensaio completo e plano de contingência |
| 10 | Avaliar BL55: aceite final | Todos | Critérios e evidências aprovados |

## 8. Frases seguras para falar ao professor
**Backlog:** “Organizamos o trabalho com 55 Issues rastreáveis entre as sprints 0 e 12. Na consulta de 8 de novembro, 31 estavam fechadas e 24 abertas. Diferenciamos status do GitHub de validação por testes.”

**Produto:** “O Brasília-Participa permite registrar demandas urbanas, filtrá-las, visualizá-las no mapa e consultar indicadores. Nesta versão, utilizamos dados armazenados localmente no navegador.”

**Limitações:** “Backend, banco de dados e integrações reais com serviços públicos não estão disponíveis neste MVP e foram definidos como possíveis evoluções futuras.”

**QA:** “O repositório possui testes automatizados. A aprovação da execução será apresentada com base no resultado registrado do comando `npm test` e nos testes manuais realizados.”

## 9. O que NÃO dizer sem evidência
- “Está 100% pronto e sem erros.”
- “Todas as tarefas do backlog foram concluídas.”
- “Já temos Java/Spring, MongoDB, gov.br e OuvDF integrados.”
- “Todos os testes passaram” sem imprimir a saída real.
- “O Kanban está sincronizado” sem conferir GitHub Projects.
- “Temos sistema de login seguro de produção” (o login é simulado).

**Decisão final:** manter o código; concluir organização, provas de teste, revisão do quadro, slides e ensaio. Se um defeito for confirmado, registrar uma Issue específica e corrigi-lo separadamente.

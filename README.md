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

Atualmente o projeto é um **front-end estático**, com os dados das demandas persistidos no `localStorage` do navegador (arquivo `js/store.js`), já preparado para futura integração com um back-end via API REST.

## Objetivos

### Objetivo Geral

Facilitar a comunicação entre a população e o poder público, oferecendo um canal digital centralizado para o registro, acompanhamento e visualização de demandas urbanas.

### Problema que o sistema resolve

A ausência de um canal simples, transparente e centralizado para que o cidadão relate problemas urbanos e acompanhe seu status de resolução.

### Público-alvo

Cidadãos e moradores do Distrito Federal (Brasília) que desejam relatar problemas em sua região administrativa e acompanhar o andamento dos atendimentos.

## Funcionalidades

- Cadastro e login de usuários (`cadastro.html` / `login.html`)
- Registro de nova demanda com título, categoria, região administrativa, localização, descrição, foto e seleção do ponto exato em mapa interativo (`nova-demanda.html`)
- Listagem de demandas com busca por texto e filtro por status (`demandas.html`)
- Mapa interativo com marcadores coloridos por status (Recebida, Em análise, Pendente, Resolvida) (`mapa.html`)
- Dashboard com indicadores estatísticos de participação (`dashboard.html`)
- Página de perfil do usuário (`perfil.html`)
- Alternância entre tema claro e escuro
- Página inicial com estatísticas gerais e demandas recentes (`index.html`)

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (vanilla, sem frameworks)
- `localStorage` do navegador para persistência local dos dados

## Arquitetura da Solução

O projeto é atualmente um **front-end estático multi-página** (sem back-end próprio). O módulo `js/store.js` centraliza o acesso aos dados das demandas e é utilizado por `index.html`, `demandas.html`, `mapa.html` e `nova-demanda.html`.

Conforme comentário presente no código-fonte (`js/store.js`), a arquitetura foi planejada para que, quando um back-end em **Java/Spring** for implementado, as funções de acesso a dados sejam substituídas por chamadas `fetch()` a uma API REST, sem necessidade de alterar o restante do front-end.

## Modelagem do Banco de Dados

Atualmente não há banco de dados: os dados das demandas são armazenados no `localStorage` do navegador (chave `bp_demandas`). A modelagem de um banco de dados para o futuro back-end está **a ser definida pela equipe**.

## Pré-requisitos

- Navegador web moderno com suporte a JavaScript e `localStorage`
- Conexão com a internet (para carregar fontes, ícones e o mapa via CDN)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/matheussss237/teste.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd teste
   ```

## Como Executar

Por ser um projeto front-end estático, não é necessário instalar dependências. Basta:

- Abrir o arquivo `index.html` diretamente no navegador; **ou**
- Servir a pasta do projeto com um servidor HTTP local, por exemplo:
  ```bash
  python -m http.server 8000
  ```
  e acessar `http://localhost:8000` no navegador.

## Estrutura do Projeto

```
teste/
├── index.html          # Página inicial
├── login.html           # Login
├── cadastro.html         # Cadastro de usuário
├── demandas.html         # Listagem de demandas
├── nova-demanda.html      # Registro de nova demanda
├── mapa.html              # Mapa interativo de demandas
├── dashboard.html         # Indicadores de participação
├── perfil.html            # Perfil do usuário
├── css/
│   ├── reset.css
│   ├── style.css
│   ├── components.css
│   ├── pages.css
│   └── responsive.css
├── js/
│   ├── store.js           # Fonte única de dados (localStorage)
│   ├── toast.js            # Notificações
│   ├── main.js              # Lógica geral / navegação
│   ├── demandas.js           # Lógica da listagem de demandas
│   ├── nova-demanda.js        # Lógica do formulário de nova demanda
│   ├── mapa.js                 # Lógica do mapa interativo
│   └── dashboard.js             # Lógica do dashboard
└── imagens/
    ├── bsb.jpg
    └── favicon-verde.svg
```

## Exemplos de Uso

1. O cidadão acessa a página inicial e clica em **"Registrar demanda"**.
2. Preenche o formulário com título, categoria, região administrativa, descrição e, opcionalmente, uma foto.
3. Marca no mapa interativo o local exato do problema.
4. Envia a demanda, que passa a aparecer nas páginas **Demandas**, **Mapa** e no **Dashboard**.
5. O cidadão pode pesquisar e filtrar demandas por status na página **Demandas**.

## API

O projeto ainda não possui uma API própria. Os dados são manipulados localmente via `localStorage` (arquivo `js/store.js`). A integração com uma API REST está **a ser definida pela equipe**.

## Capturas de Tela

*Inserir as capturas de tela do sistema nesta seção (ex: em uma pasta `docs/screenshots/` ou `imagens/`), referenciando-as em Markdown, por exemplo:*

```markdown
![Página inicial](imagens/screenshot-home.png)
![Mapa de demandas](imagens/screenshot-mapa.png)
![Dashboard](imagens/screenshot-dashboard.png)
```

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

O backlog do produto (50 itens, BL01–BL50), o cronograma de sprints (0 a 12), os marcos, o escopo funcional, os cenários de teste e os entregáveis estão em [`docs/BACKLOG.md`](docs/BACKLOG.md). A planilha original está em [`docs/backlog_cronograma.xlsx`](docs/backlog_cronograma.xlsx).

## Melhorias Futuras

- Implementação de back-end em Java/Spring com API REST
- Persistência dos dados em banco de dados
- Autenticação real de usuários (atualmente os formulários de login/cadastro não possuem integração com back-end)
- Gráficos dinâmicos no dashboard (atualmente com placeholders)
- Notificações de atualização de status das demandas

## Licença

Este projeto não possui licença definida. Sem uma licença explícita, por padrão ninguém tem permissão legal para reutilizar o código, mesmo estando o repositório público.

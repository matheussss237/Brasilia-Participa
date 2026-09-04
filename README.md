# Brasília Participa

## Identificação Acadêmica

| Informação                | Detalhes                   |
| ------------------------- | -------------------------- |
| **Instituição de Ensino** | UNICEPLAC                  |
| **Curso**                 | Engenharia de Software     |
| **Disciplina**            | A ser definido pela equipe |
| **Orientador**            | Profº Hudson Neves         |

---

## Descrição

O **Brasília Participa** é uma plataforma web desenvolvida com o objetivo de aproximar a população dos problemas urbanos do Distrito Federal.

O sistema permite que os cidadãos registrem, consultem e acompanhem demandas relacionadas à infraestrutura e aos serviços públicos de suas regiões.

A proposta é centralizar essas informações em uma plataforma simples, moderna e intuitiva, facilitando a identificação dos principais problemas apontados pela população.

---

## Objetivos

### Objetivo Geral

Desenvolver uma plataforma digital que facilite a participação da população na identificação, registro e acompanhamento de demandas relacionadas à infraestrutura e aos serviços públicos do Distrito Federal.

### Objetivos Específicos

* Facilitar o registro de problemas encontrados pela população.
* Permitir a consulta de demandas cadastradas.
* Organizar as demandas por região e categoria.
* Permitir que usuários apoiem demandas existentes.
* Apresentar visualmente a distribuição das demandas.
* Disponibilizar informações estatísticas por meio de um dashboard.
* Incentivar a participação cidadã.
* Desenvolver uma interface moderna, intuitiva e responsiva.

---

## Problema que o Sistema Resolve

Diversos problemas relacionados à infraestrutura urbana são identificados diariamente pela população, como problemas de iluminação, pavimentação e infraestrutura.

Entretanto, muitas vezes não existe uma forma simples e centralizada para registrar essas ocorrências, acompanhar seu andamento e visualizar quais problemas possuem maior concentração em determinadas regiões.

O **Brasília Participa** busca solucionar esse problema oferecendo uma plataforma onde os cidadãos podem registrar e acompanhar essas demandas de forma organizada.

---

## Público-Alvo

O sistema é destinado principalmente a:

* Moradores do Distrito Federal;
* Cidadãos que desejam registrar problemas urbanos;
* Usuários interessados em acompanhar demandas de sua região;
* Pessoas interessadas em participar ativamente da identificação de problemas públicos.

---

## Funcionalidades

### 🔐 Autenticação

* Login de usuários.
* Cadastro de novos usuários.
* Formulário de cadastro.
* Validação de informações.
* Navegação entre login e cadastro.

### 🏠 Página Inicial

* Apresentação do Brasília Participa.
* Acesso às principais funcionalidades.
* Exibição de estatísticas.
* Apresentação de demandas recentes.
* Navegação para as demais áreas do sistema.

### 📋 Demandas

* Visualização das demandas cadastradas.
* Pesquisa de demandas.
* Filtros por situação.
* Identificação da região da demanda.
* Visualização da quantidade de apoios.
* Classificação por status.

### ➕ Nova Demanda

Permite ao usuário registrar uma nova demanda relacionada a um problema encontrado em sua região.

### 🗺️ Mapa

* Visualização geográfica das demandas.
* Identificação das regiões com ocorrências.
* Representação visual dos problemas cadastrados.

### 📊 Dashboard

* Apresentação de estatísticas.
* Indicadores relacionados às demandas.
* Visualização geral dos dados do sistema.

### 👤 Perfil

* Área destinada às informações do usuário.
* Acesso às funcionalidades relacionadas ao perfil.

### 🌙 Tema

* Modo claro.
* Modo escuro.
* Alternância entre os temas.

### ✨ Interface

* Design responsivo.
* Animações.
* Elementos interativos.
* Interface moderna e intuitiva.

---

## Tecnologias Utilizadas

| Tecnologia   | Utilização                                    |
| ------------ | --------------------------------------------- |
| HTML5        | Estrutura das páginas                         |
| CSS3         | Estilização e responsividade                  |
| JavaScript   | Interatividade e lógica da aplicação          |
| JSON         | Armazenamento dos dados utilizados atualmente |
| Font Awesome | Ícones da interface                           |
| Google Fonts | Tipografia                                    |

---

## Arquitetura da Solução

A versão atual do projeto utiliza uma arquitetura baseada em aplicação web no lado do cliente.

```text
                    USUÁRIO
                       │
                       ▼
              ┌─────────────────┐
              │  Interface Web  │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          HTML5              CSS3
             │                   │
             └─────────┬─────────┘
                       ▼
                  JavaScript
                       │
                       ▼
                 Dados locais
                 JSON / JS
```

A estrutura separa a apresentação da aplicação, seus estilos e suas funcionalidades JavaScript.

---

## Modelagem do Banco de Dados

### Banco de Dados

**A ser definido pela equipe.**

Na versão atual, os dados utilizados pela interface estão armazenados localmente em arquivos JavaScript e JSON.

A implementação de um banco de dados será realizada em uma etapa posterior do projeto.

---

## Pré-requisitos

Para executar a versão atual do projeto são necessários:

* Computador;
* Navegador web atualizado;
* Visual Studio Code ou outro editor de código;
* Git, caso o projeto seja clonado pelo repositório.

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/matheussss237/Brasilia-Participa.git
```

### 2. Entrar na pasta do projeto

```bash
cd Brasilia-Participa
```

### 3. Abrir no Visual Studio Code

```bash
code .
```

Caso o comando `code` não esteja disponível, basta abrir a pasta manualmente pelo Visual Studio Code.

---

## Como Executar

A aplicação pode ser executada através do arquivo:

```text
index.html
```

Também é recomendado utilizar uma extensão como **Live Server** no Visual Studio Code para executar o projeto em um servidor local durante o desenvolvimento.

Após iniciar a aplicação, o usuário poderá navegar pelas páginas disponíveis:

* Página inicial;
* Login;
* Cadastro;
* Demandas;
* Nova demanda;
* Mapa;
* Dashboard;
* Perfil.

---

## Estrutura do Projeto

```text
Brasilia-Participa/
│
├── css/
│   ├── components.css
│   ├── home.css
│   ├── layout.css
│   ├── pages.css
│   ├── reset.css
│   ├── responsive.css
│   ├── style.css
│   └── variables.css
│
├── data/
│   ├── dados.js
│   └── demandas.json
│
├── js/
│   ├── app.js
│   ├── dashboard.js
│   ├── demandas.js
│   ├── home.js
│   ├── main.js
│   └── theme.js
│
├── cadastro.html
├── dashboard.html
├── demandas.html
├── index.html
├── login.html
├── mapa.html
├── nova-demanda.html
├── perfl.html
└── README.md
```

### Diretórios

#### `css/`

Contém os arquivos responsáveis pela aparência e organização visual da aplicação.

#### `js/`

Contém os arquivos JavaScript responsáveis pelas funcionalidades e interações do sistema.

#### `data/`

Contém os dados utilizados atualmente pela aplicação.

#### Arquivos HTML

Cada arquivo HTML representa uma página ou funcionalidade do sistema.

---

## Exemplos de Uso

### Registrar uma demanda

O usuário pode acessar a área de **Nova Demanda** e informar um problema identificado em sua região.

Exemplos:

* Problemas de iluminação;
* Problemas de asfalto;
* Problemas de infraestrutura;
* Outros problemas urbanos.

### Consultar demandas

O usuário pode acessar a página **Demandas** para visualizar os problemas registrados e utilizar os filtros disponíveis.

### Apoiar uma demanda

O usuário pode demonstrar apoio às demandas cadastradas, permitindo identificar problemas que possuem maior interesse da população.

### Visualizar no mapa

A área **Mapa** permite visualizar a distribuição das demandas pelas diferentes regiões.

### Consultar estatísticas

A área **Dashboard** apresenta informações e indicadores relacionados às demandas cadastradas no sistema.

---

## API

A versão atual do projeto não possui uma API implementada.

**API:** A ser definida pela equipe.

Uma API poderá ser implementada futuramente para realizar a comunicação entre o front-end e um back-end.

---

## Capturas de Tela

As imagens abaixo devem ser adicionadas ao README para demonstrar as principais telas da aplicação.

### Página Inicial

```markdown
![Página Inicial](./screenshots/home.png)
```

> Adicione uma captura de tela da página inicial na pasta `screenshots`.

### Login

```markdown
![Login](./screenshots/login.png)
```

### Cadastro

```markdown
![Cadastro](./screenshots/cadastro.png)
```

### Demandas

```markdown
![Demandas](./screenshots/demandas.png)
```

### Mapa

```markdown
![Mapa](./screenshots/mapa.png)
```

### Dashboard

```markdown
![Dashboard](./screenshots/dashboard.png)
```

---

## Equipe do Projeto

### Integrantes

**A ser definido pela equipe.**

| Integrante                 | Responsabilidade           |
| -------------------------- | -------------------------- |
| A ser definido pela equipe | A ser definido pela equipe |
| A ser definido pela equipe | A ser definido pela equipe |
| A ser definido pela equipe | A ser definido pela equipe |

---

## Melhorias Futuras

Entre as melhorias planejadas para o projeto estão:

* Implementação de banco de dados;
* Desenvolvimento de API;
* Integração entre front-end e back-end;
* Implementação de autenticação real;
* Persistência das demandas;
* Integração com mapas e geolocalização;
* Sistema de notificações;
* Gerenciamento completo das demandas;
* Diferentes níveis de acesso para usuários;
* Aprimoramento do dashboard;
* Melhorias de segurança;
* Integração com serviços públicos;
* Aplicação das demandas em dados reais.

---

## Status do Projeto

**🚧 Em Desenvolvimento**

O **Brasília Participa** encontra-se em desenvolvimento.

A interface principal e as funcionalidades de apresentação e interação estão sendo desenvolvidas, enquanto futuras etapas poderão incluir a implementação de back-end, banco de dados, API e persistência real das informações.

---

## Licença

**A ser definida pela equipe.**

---

## Projeto Acadêmico

Este projeto foi desenvolvido como parte das atividades acadêmicas do curso de **Engenharia de Software da UNICEPLAC**, sob orientação do **Profº Hudson Neves**.

---

<p align="center">
  <strong>Brasília Participa</strong>
  <br>
  Sua voz transforma Brasília. 🇧🇷
</p>

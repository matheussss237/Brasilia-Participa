![Uploading logo-uniceplac.<img width="366" height="120" alt="logo-uniceplac" src="https://github.com/user-attachments/assets/3699cb1a-04eb-4d4d-873e-35b885096334" />
png…]()
# 🇧🇷 Brasília Participa

<p align="center">
  <img src="./logo-uniceplac.png" width="120" alt="Logo UNICEPLAC">
</p>

<h1 align="center">Brasília Participa</h1>

<p align="center">
  <strong>Uma plataforma digital para aproximar o cidadão da gestão pública do Distrito Federal.</strong>
</p>

---

## 📚 Identificação Acadêmica

<table>
  <tr>
    <td width="70%">

### Projeto Integrador — Engenharia de Software

**Instituição:** UNICEPLAC
**Curso:** Engenharia de Software
**Disciplina:** Projeto Integrador
**Área:** Desenvolvimento de Sistemas
**Projeto:** Brasília Participa

```
</td>
<td width="30%" align="center">
```

<img src="./logo-uniceplac.png" width="140" alt="Logo UNICEPLAC">

```
</td>
```

  </tr>
</table>

---

## 📌 Sobre o Projeto

O **Brasília Participa** é uma plataforma desenvolvida com o objetivo de facilitar a comunicação entre a população e o poder público do Distrito Federal.

A proposta é permitir que os cidadãos possam **registrar demandas, reclamações e problemas encontrados em suas regiões**, contribuindo para a identificação das principais necessidades de cada localidade.

A plataforma busca transformar a participação da população em dados organizados, facilitando a visualização das demandas e possibilitando uma gestão pública mais eficiente e próxima dos cidadãos.

---

## 🎯 Objetivo

O principal objetivo do projeto é desenvolver uma solução tecnológica capaz de:

* Facilitar o registro de demandas da população;
* Permitir a identificação da região onde o problema está localizado;
* Organizar as demandas por categorias;
* Exibir as ocorrências em um mapa interativo;
* Apresentar dados e estatísticas através de um dashboard;
* Aumentar a participação da população;
* Aproximar cidadão e administração pública;
* Auxiliar na identificação das regiões que possuem maior quantidade de problemas.

---

## 💡 Problema

Muitas vezes, problemas relacionados à infraestrutura urbana são identificados pela população, mas existe dificuldade em **registrar, organizar e visualizar essas informações de maneira centralizada**.

Entre os problemas que podem ser registrados estão:

* 💡 Iluminação pública;
* 🛣️ Asfalto e pavimentação;
* 🏗️ Infraestrutura;
* 🚮 Limpeza urbana;
* 🌳 Áreas verdes;
* 🚦 Sinalização;
* 🚧 Vias e calçadas;
* 🏘️ Problemas relacionados à região.

O Brasília Participa busca centralizar essas informações em uma única plataforma.

---

## 🚀 Funcionalidades

### 👤 Cadastro e Login

O usuário poderá criar sua conta e realizar autenticação na plataforma.

### 📢 Registro de Demandas

O cidadão poderá registrar uma nova demanda informando:

* Categoria do problema;
* Descrição;
* Localização;
* Região administrativa;
* Data;
* Outras informações relevantes.

### 🗺️ Mapa Interativo

As demandas poderão ser visualizadas através de um mapa, permitindo identificar **onde os problemas estão concentrados no Distrito Federal**.

### 📊 Dashboard

O sistema contará com um painel para apresentar informações como:

* Quantidade total de demandas;
* Demandas por categoria;
* Demandas por região;
* Regiões com maior número de ocorrências;
* Situação das demandas;
* Indicadores gerais da plataforma.

### 📰 Demandas Recentes

A página inicial apresentará as demandas registradas recentemente, permitindo que o usuário acompanhe os principais problemas identificados pela população.

### 🌓 Tema Claro e Escuro

A plataforma contará com suporte a **Dark Mode e Light Mode**, permitindo que o usuário escolha sua preferência visual.

---

## 🖥️ Estrutura da Plataforma

O sistema será organizado em diferentes páginas:

```text
Brasília Participa
│
├── 🔐 Login / Cadastro
│
├── 🏠 Página Inicial
│
├── 📢 Demandas
│
├── 🗺️ Mapa
│
├── 📊 Dashboard
│
└── 👤 Perfil do Usuário
```

---

## 🛠️ Tecnologias Utilizadas

### Front-end

* HTML5
* CSS3
* JavaScript

### Back-end

* Java
* Spring Boot
* Spring Security
* API REST

### Banco de Dados

* MongoDB

### Ferramentas

* Visual Studio Code
* IntelliJ IDEA
* Git
* GitHub
* Postman

---

## 🏗️ Arquitetura

O projeto será desenvolvido utilizando uma arquitetura separando o **Front-end** do **Back-end**.

```text
┌─────────────────────────────┐
│          USUÁRIO            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         FRONT-END           │
│      HTML / CSS / JS        │
└──────────────┬──────────────┘
               │
               │ API REST
               ▼
┌─────────────────────────────┐
│          BACK-END           │
│      Java + Spring Boot     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          MONGODB            │
│       Banco de Dados        │
└─────────────────────────────┘
```

---

## 📂 Organização do Front-end

A estrutura planejada para o projeto é:

```text
frontend/
│
├── index.html
├── demandas.html
├── mapa.html
├── dashboard.html
│
├── css/
│   ├── style.css
│   ├── home.css
│   ├── demandas.css
│   ├── mapa.css
│   └── dashboard.css
│
├── js/
│   ├── main.js
│   ├── demandas.js
│   └── dashboard.js
│
└── assets/
    └── imagens/
```

---

## 🔐 Segurança

O sistema contará com mecanismos de autenticação e autorização para proteger os dados dos usuários e controlar o acesso às funcionalidades da plataforma.

Entre os recursos previstos estão:

* Autenticação de usuários;
* Controle de acesso;
* Spring Security;
* JWT;
* Validação de dados;
* Proteção das APIs.

---

## 🌎 Impacto Social

O Brasília Participa busca utilizar a tecnologia como ferramenta de **participação cidadã**.

Ao permitir que a população registre problemas e visualize as demandas existentes, a plataforma pode contribuir para:

* Maior transparência;
* Participação popular;
* Organização das informações;
* Identificação de problemas recorrentes;
* Melhor visualização das necessidades das regiões;
* Aproximação entre população e poder público.

---

## 📈 Possíveis Evoluções

Futuramente, o projeto poderá receber novas funcionalidades, como:

* Sistema de votação nas demandas;
* Comentários dos usuários;
* Notificações;
* Acompanhamento do status da solicitação;
* Integração com serviços públicos;
* Aplicativo mobile;
* Sistema de avaliação;
* Inteligência Artificial para classificação das demandas;
* Relatórios avançados;
* Geolocalização automática.

---

## 👨‍💻 Desenvolvimento

O projeto foi desenvolvido como parte das atividades acadêmicas do curso de **Engenharia de Software**, buscando aplicar na prática conceitos de desenvolvimento web, engenharia de software, banco de dados, APIs e segurança.

A proposta também busca demonstrar como diferentes tecnologias podem ser integradas para criar uma solução voltada para um problema real da sociedade.

---

## 📸 Projeto

<p align="center">
  <img src="./logo-uniceplac.png" width="180" alt="UNICEPLAC">
</p>

---

# 🇧🇷 Sua voz transforma Brasília

<p align="center">
  <strong>Participe. Registre. Acompanhe. Transforme.</strong>
</p>

<p align="center">
  O Brasília Participa acredita que a tecnologia pode aproximar as pessoas das decisões que impactam suas comunidades.
</p>

<p align="center">
  <img src="./logo-uniceplac.png" width="120" alt="Logo UNICEPLAC">
</p>

---

<p align="center">
  Desenvolvido para fins acadêmicos — Engenharia de Software | UNICEPLAC
</p>

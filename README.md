# 💳 Valex API

**Valex** é uma API de gerenciamento de cartões de benefícios (Voucher Cards).

A API é responsável pela criação, ativação e recarga de cartões, assim como o processamento das compras realizadas utilizando o cartão de benefício.

## 🗒️ Índice

- [💳 Valex API](#-valex-api)
  - [🗒️ Índice](#️-índice)
  - [🚧 Status](#-status)
  - [🧰 Tecnologias](#-tecnologias)
  - [🧭 Referência da API](#-referência-da-api)
  - [⚙️ Rodando a aplicação](#️-rodando-a-aplicação)
    - [Rodando Localmente](#rodando-localmente)
    - [Rodando com Docker](#rodando-com-docker)
  - [🧑‍💻 Motivação de Estudo](#-motivação-de-estudo)
    - [SOLID](#solid)
      - [Referências SOLID](#referências-solid)
    - [Test-Driven Development](#test-driven-development)
      - [Referências TDD](#referências-tdd)
    - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
      - [Referências DDD](#referências-ddd)
    - [Behavior-Driven Development (BDD)](#behavior-driven-development-bdd)
      - [Referências BDD](#referências-bdd)
    - [Either Pattern](#either-pattern)
      - [Referências Either Pattern](#referências-either-pattern)

## 🚧 Status

![status-ongoing](https://img.shields.io/badge/status-ongoing-yellow?style=for-the-badge)

## 🧰 Tecnologias

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## 🧭 Referência da API

*Em andamento..*

## ⚙️ Rodando a aplicação

### Rodando Localmente

*Em andamento...*

### Rodando com Docker

*Em andamento...*

## 🧑‍💻 Motivação de Estudo

A proposta original do projeto foi elaborada pela [Driven Education](https://www.driven.com.br/) como parte do curso intensivo de **Desenvolvimento Web Full Stack**.

Entretanto, esse projeto é uma refatoração do [projeto original](https://github.com/akiraTatesawa/valex), a fim de colocar em prática alguns conceitos dos quais eu me interesso e estou estudando atualmente.

### SOLID

> "SOLID é um acrônimo para cinco princípios de padrões de projeto em OOP criado por Robert C. Martin, que tem o intuito de facilitar o desenvolvimento e manutenção de software."

Os cinco princípios são:

- **Single Responsibility Principle** — Princípio de responsabilidade única.
- **Open/Closed Principle** — Princípio de Aberto/Fechado.
- **Liskov Substitution Principle** — Princípio da Substituição de Liskov.
- **Interface Segregation Principle** — Princípio da Segregação de Interface.
- **Dependency Inversion Principle** — Princípio da Inversão de Dependência.

#### Referências SOLID

- [Princípios SOLID com Typescript](https://medium.com/@matheusbessa_44838/princ%C3%ADpios-solid-com-typescript-4f8a9d5d1ef8), por Gabriel Silvestre;
- [Introdução a Orientação a Objeto](https://dev.to/gabrielhsilvestre/introducao-a-orientacao-a-objeto-5f24), por Matheus Bessa;
- [Seu próximo back-end Node com TESTES! + SOLID](https://www.youtube.com/watch?v=jBOLRzjEERk&t=1436s), pela Rocketseat;
- [Construindo APIs Node.js escaláveis com SOLID + TDD](https://www.youtube.com/watch?v=mjBsii0eiuI&t=3150s), pela Rocketseat;

### Test-Driven Development

> O TDD é uma metodologia que visa aumentar a qualidade do software através do uso intensivo de testes durante o desenvolvimento.

Ciclo de desenvolvimento: *Red*, *Green* and *Refactor*. Ou seja:

- Escrevemos um Teste que inicialmente não passa (Red);
- Adicionamos uma nova funcionalidade do sistema;
- Fazemos o Teste passar (Green);
- Refatoramos o código da nova funcionalidade (Refactoring);
- Escrevemos o próximo Teste.

#### Referências TDD

- [Test Driven Development: TDD Simples e Prático](https://www.devmedia.com.br/test-driven-development-tdd-simples-e-pratico/18533), pela DevMedia;
- [ENTENDENDO E APLICANDO O TEST DRIVEN DEVELOPMENT](https://blog.onedaytesting.com.br/test-driven-development/), pela OneDayTesting;
- [TDD na prática](https://www.youtube.com/watch?v=sg1zFpNM5Jw&t=2778s), por Diego da Rocketseat e Rodrigo Manguinho;
- [Série: Teste de Software](https://www.youtube.com/playlist?list=PLpJIjBkNnEt9wdWPQ0GGABmhXn_E_XFll), playlist de aulas por Otavio Lemos;
- [NodeJs, TDD e Clean Architecture](https://youtube.com/playlist?list=PL9aKtVrF05DyEwK5kdvzrYXFdpZfj1dsG), playlist de aulas por Rodrigo Manguinho;
- [Introduction to Test-Driven Development (TDD) with Classic TDD Example](https://khalilstemmler.com/articles/test-driven-development/introduction-to-tdd/), por Khalil Stemmler;

### Domain-Driven Design (DDD)

> “É um conjunto de princípios com foco em domínio, exploração de modelos de formas criativas e definir e falar a linguagem Ubíqua, baseado no contexto delimitado.”

O **Domain Driven Design** combina práticas de design e desenvolvimento. Oferece ferramentas de modelagem estratégica e tática para entregar um software de alta qualidade. O objetivo é acelerar o desenvolvimento de software que lidam com complexos processos de negócio.

#### Referências DDD

- [Domain-Driven Design - Conceitos básicos](https://www.brunobrito.net.br/domain-driven-design/), por Bruno Brito;
- [O que é DDD – Domain Driven Design](https://fullcycle.com.br/domain-driven-design/), pela FullCycle;
- [Arquitetura de Software](https://youtube.com/playlist?list=PLpJIjBkNnEt8CFafj7CzhjaZ2IPm0vsux), playlist de aulas por Otavio Lemos;
- [An Introduction to Domain-Driven Design (DDD)](https://khalilstemmler.com/articles/domain-driven-design-intro/), por Khalil Stemmler;
- [Value Objects - DDD w/ TypeScript](https://khalilstemmler.com/articles/typescript-value-object/), por Khalil Stemmler;
- [Understanding Domain Entities [with Examples] - DDD w/ TypeScript](https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/), por Khalil Stemmler;
- [Implementing DTOs, Mappers & the Repository Pattern using the Sequelize ORM [with Examples] - DDD w/ TypeScript](https://khalilstemmler.com/articles/typescript-domain-driven-design/repository-dto-mapper/), por Khalil Stemmler;

### Behavior-Driven Development (BDD)

> BDD é técnica de desenvolvimento ágil que visa integrar regras de negócios com linguagem de programação, focando o comportamento do software. Além disso, pode-se dizer também, que BDD é a evolução do TDD. Isto porque, os testes ainda orientam o desenvolvimento, ou seja, primeiro se escreve o teste e depois o código.

A ideia é descrever o comportamento esperado desta funcionalidade (através de Gherkin) e não tentar dizer como ela deve ser implementada.

#### Referências BDD

- [Saiba qual é a diferença entre TDD e BDD](https://blog.locaweb.com.br/temas/codigo-aberto/diferenca-entre-bdd-tdd/), pelo blog LocalWeb;
- [Desenvolvimento orientado por comportamento (BDD)](https://www.devmedia.com.br/desenvolvimento-orientado-por-comportamento-bdd/21127), pela DevMedia;
- [175 - TDD != BDD? COMO É?](https://www.youtube.com/watch?v=_Pdmkw5wEws), por Otavio Lemos;
- [#1 Clean Architecture & Typescript - BDD Specs + Use Cases](https://www.youtube.com/watch?v=7ylqtGk9bTo&t=371s), por Rodrigo Manguinho;
- [escrevendo features](https://docbehat.readthedocs.io/pt/v3.1/guides/1.gherkin.html), por behat;

### Either Pattern

> O "Either Pattern" é uma abordagem de tratamento de erros sem lançar exceções de código (throw).

No caso da aplicação, utilizou-se as classes **Right**, para representação de uma operação bem sucedida, e a classe **Left**, que representa um erro.

Além disso, para armazenamento do resultado das operações na aplicação, utilizou-se a classe **Result**.

#### Referências Either Pattern

- [The Either data type as an alternative to throwing exceptions](https://www.thoughtworks.com/insights/blog/either-data-type-alternative-throwing-exceptions), por ThoughtWorks;
- [Flexible Error Handling w/ the Result Class](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/handling-errors-result-class/), por Khalil Stemmler;
- [Functional Error Handling with Express.js and DDD](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/), por Khalil Stemmler;
- [Clean Architecture + DDD: Erros por camada e uso do Either](https://www.youtube.com/watch?v=PXVcs5BrTSQ), por Otavio Lemos;
- [Lidando com erros utilizando padrão EITHER em aplicação NodeJS](https://www.youtube.com/watch?v=RwWr6vnkHJs&t=1168s), por Daniele Leão;
- [Tratamento Flexível de Erros em TypeScript + Node.js | Princípio da Menor Surpresa](https://www.youtube.com/watch?v=ai-gumm3Ois), por Otavio Lemos;

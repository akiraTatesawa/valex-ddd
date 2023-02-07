# Criação de Cartão Virtual

Funcionários podem gerar cartões virtuais a partir de um cartão físico.

Para criar um cartão virtual, é necessário fornecer o identificador do cartão `cardId` e a senha do cartão `password`.

- Cartões virtuais só podem ser vinculados a cartões originais cadastrados;
- Cartões virtuais possuem a mesma senha do cartão vinculado;
- Cartões virtuais possuem o mesmo nome do cartão vinculado;
- A bandeira do cartão deve ser Mastercard;
- O número gerado para o cartão deve ser único e válido;
- Cartões virtuais herdam o tipo do cartão vinculado.

> ## Funcionamento

- [x] Sistema recebe o `cardId` e a `password`;
- [x] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [x] Sistema verifica se o cartão está ativo;
- [x] Sistema verifica se a senha do cartão `password` está correta;
- [x] Sistema persiste o cartão;
- [x] Sistema retorna os dados do cartão virtual gerado para o funcionário;

> ## Exceções

> ### Cartão não encontrado

- [x] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

> ### Cartão inativo

- [x] Sistema envia um erro informando que o cartão está inativo;

> ### Senha incorreta

- [x] Sistema envia um erro informando que a senha `password` está incorreta;

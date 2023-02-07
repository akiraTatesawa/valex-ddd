# Exclusão de Cartão Virtual

Funcionários podem excluir cartões virtuais.

Para excluir um cartão virtual, é necessário fornecer o identificador do cartão `cardId` e a senha do cartão `password`.

> ## Funcionamento

- [x] Sistema recebe o `cardId` e a `password`;
- [x] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [x] Sistema verifica se o cartão é de fato virtual;
- [x] Sistema verifica se a senha do cartão `password` está correta;
- [x] Sistema remove o cartão do banco de dados;

> ## Exceções

> ### Cartão não encontrado

- [x] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

> ### Cartão não é virtual

- [x] Sistema envia um erro informando que o cartão não é virtual, portanto não pode ser excluído;

> ### Senha incorreta

- [x] Sistema envia um erro informando que a senha `password` está incorreta;

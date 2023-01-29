# Exclusão de Cartão Virtual

Funcionários podem excluir cartões virtuais.

Para excluir um cartão virtual, é necessário fornecer o identificador do cartão `cardId` e a senha do cartão `password`.

> ## Funcionamento

- [ ] Sistema recebe o `cardId` e a `password`;
- [ ] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [ ] Sistema verifica se o cartão é de fato virtual;
- [ ] Sistema verifica se a senha do cartão `password` está correta;
- [ ] Sistema remove o cartão do banco de dados;

> ## Exceções

> ### Cartão não encontrado

- [ ] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

> ### Cartão não é virtual

- [ ] Sistema envia um erro informando que o cartão não é virtual, portanto não pode ser excluído;

> ### Senha incorreta

- [ ] Sistema envia um erro informando que a senha `password` está incorreta;

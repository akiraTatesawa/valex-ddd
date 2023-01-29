# Compras em Points of Sale (POS)

Funcionários podem gerar cartões virtuais a partir de um cartão físico.

Para criar um cartão virtual, é necessário fornecer o identificador do cartão `cardId` e a senha do cartão `password`.

- Cartões virtuais só podem ser vinculados a cartões originais cadastrados;
- Cartões virtuais possuem a mesma senha do cartão vinculado;
- Cartões virtuais possuem o mesmo nome do cartão vinculado;
- A bandeira do cartão deve ser Mastercard;
- O número gerado para o cartão deve ser único e válido;
- Cartões virtuais herdam o tipo do cartão vinculado.

> ## Funcionamento

- [ ] Sistema recebe o `cardId` e a `password`;
- [ ] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [ ] Sistema verifica se o cartão está ativo;
- [ ] Sistema verifica se a senha do cartão `password` está correta;
- [ ] Sistema persiste o cartão;
- [ ] Sistema retorna os dados do cartão virtual gerado para o funcionário;

> ## Exceções

> ### Cartão não encontrado

- [ ] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

> ### Cartão inativo

- [ ] Sistema envia um erro informando que o cartão está inativo;

> ### Senha incorreta

- [ ] Sistema envia um erro informando que a senha `password` está incorreta;

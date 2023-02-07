# Compras em Points of Sale (POS)

Funcionários podem realizar compras em maquininhas POS (Points of Sale). Para uma compra em um POS ser efetuada, é necessário fornecer o identificador do cartão `cardId`, a senha do cartão `cardPassword`, o identificador do estabelecimento `businessId` e o montante da compra `amount`

> ## Funcionamento

- [x] Sistema recebe o `cardId`, `cardPassword`, `businessId` e `amount`;
- [x] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [x] Sistema verifica se o cartão não é virtual;
- [x] Sistema verifica se o cartão está ativo;
- [x] Sistema verifica se o cartão está expirado;
- [x] Sistema verifica se o cartão está bloqueado;
- [x] Sistema verifica se a senha do cartão `cardPassword` está correta;
- [x] Sistema verifica se o estabelecimento existe, utilizando o `businessId`;
- [x] Sistema verifica se o tipo de estabelecimento é igual ao tipo do cartão utilizado na compra;
- [x] Sistema verifica se o cartão possui saldo suficiente para realizar a compra;
- [x] Sistema persiste a compra;
- [x] Sistema retorna o recibo da compra;

> ## Exceções

> ### Cartão não encontrado

- [x] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

> ### Cartão virtual

- [x] Sistema envia um erro informando que cartões virtuais não podem ser utilizados na compra POS;

> ### Cartão inativo

- [x] Sistema envia um erro informando que o cartão está inativo e apenas cartões ativos podem realizar compras;

> ### Cartão expirado

- [x] Sistema envia um erro informando que o cartão está expirado e apenas cartões não-expirados podem realizar compras;

> ### Cartão bloqueado

- [x] Sistema envia um erro informando que o cartão está bloqueado e apenas cartões desbloqueados podem realizar compras;

> ### Senha incorreta

- [x] Sistema envia um erro informando que a senha `cardPassword` está incorreta;

> ### Estabelecimento não encontrado

- [x] Sistema envia um erro informando que o `businessId` fornecido não pertence a um estabelecimento cadastrado;

> ### Incompatibilidade de tipos entre o cartão e o estabelecimento

- [x] Sistema envia um erro informando que o tipo do estabelecimento não é compatível com o tipo do cartão;

> ### Saldo insuficiente

- [x] Sistema envia um erro informando que o saldo do cartão é insuficiente para cobrir a compra;

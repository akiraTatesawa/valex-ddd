# Visualização de Saldo

Funcionários podem visualizar o saldo e histórico de transações de um determinado cartão.
Para visualizar o saldo, é necessário fornecer o identificador do cartão `cardId`.

> ## Funcionamento

- [x] Sistema recebe o `cardId`;
- [x] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [x] Sistema busca os pagamentos e recargas referentes ao cartão;
- [x] Sistema calcula o saldo do cartão;
- [x] Sistema retorna o saldo e o extrato do cartão.

> ## Exceções

> ### Cartão não encontrado

- [x] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

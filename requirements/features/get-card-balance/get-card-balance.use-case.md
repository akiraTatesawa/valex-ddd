# Visualização de Saldo

Funcionários podem visualizar o saldo e histórico de transações de um determinado cartão.
Para visualizar o saldo, é necessário fornecer o identificador do cartão `cardId`.

> ## Funcionamento

- [ ] Sistema recebe o `cardId`;
- [ ] Sistema verifica se o cartão existe, utilizando o `cardId`;
- [ ] Sistema busca os pagamentos e recargas referentes ao cartão;
- [ ] Sistema calcula o saldo do cartão;
- [ ] Sistema retorna o saldo e o extrato do cartão.

> ## Exceções

> ### Cartão não encontrado

- [ ] Sistema envia um erro informando que o `cardId` fornecido não pertence a um cartão cadastrado;

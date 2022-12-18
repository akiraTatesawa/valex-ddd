# Recarga de Cartão

Uma empresa com uma `api key` válida pode recarregar um cartão de benefícios dado um `cardId` e um `amount`;

## Funcionamento

- [ ] Sistema recebe a `api key`, o `cardId` e o valor de recarga `amount`;
- [ ] Sistema valida se a empresa está cadastrada;
- [ ] Sistema valida se o cartão existe;
- [ ] Sistema valida se o cartão está ativo;
- [ ] Sistema valida se o cartão não está expirado;
- [ ] Sistema valida o valor de `amount`;
- [ ] Sistema persiste a recarga;

## Exceções

### Empresa não encontrada

- [ ] Sistema retorna um erro caso não haja alguma empresa com a `api key` fornecida;

### Cartão não encontrado

- [ ] Sistema retorna um erro caso não haja algum cartão com o `cardId` fornecido;

### Cartão inativo

- [ ] Sistema retorna um erro caso o cartão esteja inativo;

### Cartão expirado

- [ ] Sistema retorna um erro caso o cartão esteja expirado;

### Valor de recarga inválido

- [ ] Sistema retorna um erro caso o `amount` não seja um número inteiro maior que zero;

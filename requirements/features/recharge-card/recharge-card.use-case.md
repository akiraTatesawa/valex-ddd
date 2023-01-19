# Recarga de Cartão

Uma empresa com uma `api key` válida pode recarregar um cartão de benefícios dado um `cardId` e um `amount`;

## Funcionamento

- [x] Sistema recebe a `api key`, o `cardId` e o valor de recarga `amount`;
- [x] Sistema valida se a empresa está cadastrada;
- [x] Sistema valida se o cartão existe;
- [x] Sistema valida se o cartão está ativo;
- [x] Sistema valida se o cartão não está expirado;
- [x] Sistema valida o valor de `amount`;
- [x] Sistema persiste a recarga;

## Exceções

### Empresa não encontrada

- [x] Sistema retorna um erro caso não haja alguma empresa com a `api key` fornecida;

### Cartão não encontrado

- [x] Sistema retorna um erro caso não haja algum cartão com o `cardId` fornecido;

### Cartão inativo

- [x] Sistema retorna um erro caso o cartão esteja inativo;

### Cartão expirado

- [x] Sistema retorna um erro caso o cartão esteja expirado;

### Valor de recarga inválido

- [x] Sistema retorna um erro caso o `amount` não seja um número inteiro maior que zero;

# Compras em Points of Sale (POS)

Funcionários podem realizar compras de forma Online.

Para uma compra online ser efetuada, é necessário fornecer os dados do cartão `cardInfo`, o identificador do estabelecimento `businessId` e o montante da compra `amount`.

Os dados presentes em `cardInfo` são:

- Número do cartão `cardNumber`;
- Nome impresso no cartão `cardholderName`;
- Data de expiração do cartão `expirationDate`;
- Código de segurança do cartão `cvv`;

Exemplo de entrada:

```json
    {
        "cardInfo": {
            "cardNumber": "5253036535187953",
            "cardholderName": "FAKE PERSON",
            "expirationDate": "01/28",
            "cvv": "123"
        },
        "businessId": "0b61b13d-71e6-44e5-86e6-bd24c33fc57a",
        "amount": 100
    }

```

> ## Funcionamento

- [x] Sistema recebe os dados do cartão `cardInfo`, o identificador do estabelecimento `businessId` e o montante da compra `amount`;
- [x] Sistema valida os dados do cartão;
- [x] Sistema verifica se o cartão está ativo;
- [x] Sistema verifica se o cartão está bloqueado;
- [x] Sistema verifica se o cartão está expirado;
- [x] Sistema valida se o CVV está correto;
- [x] Sistema verifica se o estabelecimento existe;
- [x] Sistema verifica se o tipo de cartão corresponde ao tipo do estabelecimento;
- [x] Sistema verifica se o cartão possui saldo suficiente;
- [x] Sistema persiste a compra;
- [x] Sistema retorna o recibo da compra;

> ## Exceções

> ### Cartão não encontrado

- [x] Sistema envia um erro informando que o `cardInfo` fornecido não pertence a um cartão cadastrado;

> ### Cartão inativo

- [x] Sistema envia um erro informando que o cartão está inativo e apenas cartões ativos podem realizar compras;

> ### Cartão expirado

- [x] Sistema envia um erro informando que o cartão está expirado e apenas cartões não-expirados podem realizar compras;

> ### Cartão bloqueado

- [x] Sistema envia um erro informando que o cartão está bloqueado e apenas cartões desbloqueados podem realizar compras;

> ### Código de segurança incorreto

- [x] Sistema envia um erro informando que o código de segurança `cardInfo.cvv` está incorreto;

> ### Estabelecimento não encontrado

- [x] Sistema envia um erro informando que o `businessId` fornecido não pertence a um estabelecimento cadastrado;

> ### Incompatibilidade de tipos entre o cartão e o estabelecimento

- [x] Sistema envia um erro informando que o tipo do estabelecimento não é compatível com o tipo do cartão;

> ### Saldo insuficiente

- [x] Sistema envia um erro informando que o saldo do cartão é insuficiente para cobrir a compra;

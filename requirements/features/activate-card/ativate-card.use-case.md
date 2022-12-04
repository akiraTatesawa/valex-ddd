# Ativação de Cartão

Um funcionário pode solicitar a ativação de um cartão de benefícios cadastrando uma `senha` de quatro dígitos numéricos.

> ## Funcionamento

- [x] Sistema recebe o `id` e o `CVV (código de segurança)` do cartão, assim uma `senha` de quatro dígitos numéricos que será utilizada para ativar o cartão;
- [x] Sistema verifica se o cartão existe;
- [x] Sistema verifica se o cartão já está ativado;
- [x] Sistema verifica se o cartão não está expirado;
- [x] Sistema verifica se o `CVV` está correto;
- [x] Sistema verifica se o formato `senha` fornecida é válido;
- [x] Sistema ativa o cartão;

> ## Exceções

> ### Cartão não existe

- [x] Sistema retorna um erro caso não seja possível encontrar um cartão através do `id` fornecido;

> ### Cartão já está ativado

- [x] Sistema retorna um erro caso o cartão já esteja ativado;

> ### Cartão expirado

- [x] Sistema retorna um erro caso o cartão esteja expirado;

> ### CVV incorreto

- [x] Sistema retorna um erro caso o `CVV` fornecido esteja incorreto;

> ### Senha inválida

- [x] Sistema retorna um erro caso o formato da `senha` fornecida seja inválido;

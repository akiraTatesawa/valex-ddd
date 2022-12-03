# Ativação de Cartão

Um funcionário pode solicitar a ativação de um cartão de benefícios cadastrando uma `senha` de quatro dígitos numéricos.

> ## Funcionamento

- [ ] Sistema recebe o `id` e o `CVV (código de segurança)` do cartão, assim uma `senha` de quatro dígitos numéricos que será utilizada para ativar o cartão;
- [ ] Sistema verifica se o cartão existe;
- [ ] Sistema verifica se o cartão já está ativado;
- [ ] Sistema verifica se o cartão não está expirado;
- [ ] Sistema verifica se o `CVV` está correto;
- [ ] Sistema verifica se o formato `senha` fornecida é válido;
- [ ] Sistema ativa o cartão;

> ## Exceções

> ### Cartão não existe

- [ ] Sistema retorna um erro caso não seja possível encontrar um cartão através do `id` fornecido;

> ### Cartão já está ativado

- [ ] Sistema retorna um erro caso o cartão já esteja ativado;

> ### Cartão expirado

- [ ] Sistema retorna um erro caso o cartão esteja expirado;

> ### CVV incorreto

- [ ] Sistema retorna um erro caso o `CVV` fornecido esteja incorreto;

> ### Senha inválida

- [ ] Sistema retorna um erro caso o formato da `senha` fornecida seja inválido;

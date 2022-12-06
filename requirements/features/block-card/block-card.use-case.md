# Bloqueio de Cartão

Um funcionário pode solicitar o bloqueio de um cartão, informando o `id` e a `senha` do cartão.

> ## Funcionamento

- [x] Sistema recebe o `id` e a `senha` do cartão;
- [x] Sistema verifica, a partir do `id`, se o cartão existe;
- [x] Sistema verifica se o cartão está ativo;
- [x] Sistema verifica se a `senha` do cartão está correta;
- [x] Sistema verifica se o cartão está expirado;
- [x] Sistema verifica se o cartão está bloqueado;
- [x] Sistema bloqueia o cartão;
- [x] Sistema persiste a informação;

> ## Exceções

> ### Cartão não existe

- [x] Sistema retorna um erro informando que o cartão não existe;

> ### Cartão não foi ativado

- [x] Sistema retorna um erro informando que o cartão não está ativo;

> ### Senha incorreta

- [x] Sistema retorna um erro informando que a `senha` do cartão está incorreta;

> ### Cartão expirado

- [x] Sistema retorna um erro informando que o cartão está expirado;

> ### Cartão já está bloqueado

- [x] Sistema retorna um erro informando que o cartão já está bloqueado;

# Bloqueio de Cartão

Um funcionário pode solicitar o bloqueio de um cartão, informando o `id` e a `senha` do cartão.

> ## Funcionamento

- [ ] Sistema recebe o `id` e a `senha` do cartão;
- [ ] Sistema verifica, a partir do `id`, se o cartão existe;
- [ ] Sistema verifica se a `senha` do cartão está correta;
- [ ] Sistema verifica se o cartão está expirado;
- [ ] Sistema verifica se o cartão está bloqueado;
- [ ] Sistema bloqueia o cartão;
- [ ] Sistema persiste a informação;

> ## Exceções

> ### Cartão não existe

- [ ] Sistema retorna um erro informando que o cartão não existe;

> ### Senha incorreta

- [ ] Sistema retorna um erro informando que a `senha` do cartão está incorreta;

> ### Cartão expirado

- [ ] Sistema retorna um erro informando que o cartão está expirado;

> ### Cartão já está bloqueado

- [ ] Sistema retorna um erro informando que o cartão já está bloqueado;

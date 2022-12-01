# Criação de Cartão

Uma empresa cadastrada pode solicitar a criação de um cartão de benefícios para um funcionário.

> ## Funcionamento

- [ ] Sistema recebe a `api-key` da empresa, o `id` do funcionário e o `tipo` de cartão de benefícios;
- [ ] Sistema verifica se existe uma empresa cadastrada a partir da `api-key`;
- [ ] Sistema verifica se existe um funcionário com o `id`;
- [ ] Sistema verifica se o funcionário pertence à empresa;
- [ ] Sistema verifica se o funcionário já possui um cartão com o mesmo `tipo` da solicitação;
- [ ] Sistema cria o cartão de benefícios desativado (sem senha cadastrada);

> ## Exceções

> ### Empresa não encontrada

- [ ] Sistema envia um erro informando que não existe uma empresa cadastrada com a `api-key` fornecida;

> ### Funcionário não encontrado

- [ ] Sistema envia um erro informando que não existe um funcionário com o `id` fornecido;

> ### Funcionário não pertence à empresa

- [ ] Sistema envia um erro informando que o funcionário não pertence à empresa que solicitou a criação do cartão;

> ### Funcionário já possui um cartão com o tipo fornecido

- [ ] Sistema envia um erro informando que o funcionário já possui um cartão do mesmo `tipo` que foi solicitado;

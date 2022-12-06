# language: pt

Funcionalidade: Bloqueio de Cartão
 A fim de bloquear o meu cartão
 Como um funcionário
 Eu quero solicitar o bloqueio do cartão
 De modo a não poder mais utilizar o cartão

Cenario: Funcionário bloqueia cartão
 Dado que o funcionário tenha um cartão
 E a senha esteja correta
 E o cartão não esteja expirado
 E o cartão não esteja bloqueado
  Quando o funcionário solicitar o bloqueio de cartão
  Entao o cartão deve ser bloqueado

Cenario: Funcionário falha ao bloquear cartão que não existe
 Dado que o funcionário não tenha um cartão
  Quando o funcionário solicitar o bloqueio de cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão não existe

Cenario: Funcionário falha ao bloquear cartão que não foi ativado
 Dado que o funcionário tenha um cartão
 Mas o cartão não esteja ativado
  Quando o funcionário solicitar o bloqueio de cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão não está ativo

Cenario: Funcionário falha ao bloquear cartão com senha incorreta
 Dado que o funcionário tenha um cartão
 Mas a senha fornecida esteja incorreta
  Quando o funcionário solicitar o bloqueio de cartão
  Entao o funcionário recebe uma mensagem de erro informando que a senha está incorreta

Cenario: Funcionário falha ao bloquear cartão expirado
 Dado que o funcionário tenha um cartão
 E a senha esteja correta
 Mas o cartão esteja expirado
  Quando o funcionário solicitar o bloqueio de cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão está expirado

Cenario: Funcionário falha ao bloquear cartão que já está bloqueado
 Dado que o funcionário tenha um cartão
 E a senha esteja correta
 E o cartão não esteja expirado
 Mas o cartão já esteja bloqueado
  Quando o funcionário solicitar o bloqueio de cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão já está bloqueado
 
 
 
 
 
 
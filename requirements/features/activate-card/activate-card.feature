# language: pt

Funcionalidade: Ativação de Cartão
 A fim de ativar o cartão de benefícios
 Como um funcionário
 Quero ativar o cartão cadastrando uma senha
 De modo a poder desfrutar dos benefícios do cartão

Cenario: Funcionário ativa o cartão
 Dado que o funcionário tenha um cartão
 E o cartão não esteja ativado
 E o cartão não esteja expirado
 E o código de segurança do cartão esteja correto
 E o funcionário forneça uma senha de ativação válida
  Quando o funcionário solicitar a ativação do cartão
  Entao o cartão deve ser ativado

Cenario: Funcionário falha ao ativar cartão que não existe
 Dado que o funcionário não tenha um cartão
  Quando o funcionário solicitar a ativação do cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão não existe

Cenario: Funcionário falha ao ativar um cartão pertencente a outro funcionário
 Dado que o funcionário forneça um identificador de cartão pertencente a outra pessoa
  Quando o funcionário solicitar a ativação do cartão
  Entao o funcionário recebe uma mensagem de erro informando que o não pertence a ele

Cenario: Funcionário falha ao ativar cartão que já está ativado
 Dado que o funcionário tenha um cartão
 Mas o cartão já está ativado
  Quando o funcionário solicitar a ativação do cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão já está ativado

Cenario: Funcionário falha ao ativar cartão que está expirado
 Dado que o funcionário tenha um cartão
 E o cartão não esteja ativado
 Mas o cartão esteja expirado
  Quando o funcionário solicitar a ativação do cartão
  Entao o funcionário recebe uma mensagem de erro informando que o cartão está expirado
 
Cenario: Funcionário falha ao ativar cartão com CVV incorreto
 Dado que o funcionário tenha um cartão
 E que o cartão não esteja ativado
 E que o cartão não esteja expirado
 Mas o código de segurança do cartão esteja incorreto
  Quando o funcionário solicitar a ativação do cartão
  Entao o funcionário recebe uma mensagem de erro informanto que o código de securança está incorreto
 
Cenario: Funcionário falha ao ativar cartão com senha inválida
 Dado que o funcionário tenha um cartão
 E que o cartão não esteja ativado
 E que o cartão não esteja expirado
 E que o código de segurança do cartão esteja correto
 Mas o funcionário forneça uma senha inválida
  Quando o funcionário solicitar a ativação do cartão
  Entao o funcionário recebe uma mensagem de erro informanto que o formato da senha é inválido
 
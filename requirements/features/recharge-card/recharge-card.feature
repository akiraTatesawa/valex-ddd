# language: pt

Funcionalidade: Recarga de Cartão
 A fim de recarregar um cartão
 Como uma empresa
 Eu quero recarregar o cartão do meu funcionário
 De modo a alterar aumentar o saldo do cartão

Cenario: Empresa recarrega o cartão
 Dado que a empresa esteja cadastrada no sistema
 E a empresa forneça uma chave de api válida
 E o cartão exista
 E o cartão esteja ativo
 E o cartão não esteja expirado
 E o valor da recarga seja um inteiro maior que zero
  Quando a empresa solicitar a recarga do cartão
  Entao o cartão deve ser recarregado de acordo com o valor fornecido pela empresa
 
Cenario: Empresa não cadastrada falha ao recarregar o cartão
 Dado que a empresa não esteja cadastrada no sistema
 E a empresa forneça uma chave de api válida
  Quando a empresa solicitar a recarga do cartão
  Entao a empresa recebe uma mensagem de erro informando que ela não está cadastrada no sistema

Cenario: Empresa com chave api inválida falha ao recarregar o cartão
 Dado que a empresa esteja cadastrada no sistema
 Mas a empresa forneça uma chave de api inválida
  Quando a empresa solicitar a recarga do cartão
  Entao a empresa recebe uma mensagem de erro informando que o formato da chave api é inválida
 
Cenario: Empresa falha ao recarregar cartão que não existe
 Dado que a empresa esteja cadastrada no sistema
 E a empresa forneça uma chave de api válida
 Mas o cartão não exista
  Quando a empresa solicitar a recarga do cartão
  Entao a empresa recebe uma mensagem de erro informando que o cartão não existe

Cenario: Empresa falha ao recarregar cartão que não está ativo
 Dado que a empresa esteja cadastrada no sistema
 E a empresa forneça uma chave de api válida
 E o cartão exista
 Mas o cartão não esteja ativo
  Quando a empresa solicitar a recarga do cartão
  Entao a empresa recebe uma mensagem de erro informando que o cartão não está ativo

Cenario: Empresa falha ao recarregar cartão expirado
 Dado que a empresa esteja cadastrada no sistema
 E a empresa forneça uma chave de api válida
 E o cartão exista
 E o cartão esteja ativo
 Mas o cartão esteja expirado
  Quando a empresa solicitar a recarga do cartão
  Entao a empresa recebe uma mensagem de erro informando que o cartão está expirado

Cenario: Empresa falha ao recarregar cartão com um valor de recarga inválido
 Dado que a empresa esteja cadastrada no sistema
 E a empresa forneça uma chave de api válida
 E o cartão exista
 E o cartão esteja ativo
 E o cartão não esteja expirado
 Mas o valor da recarga não seja um inteiro maior que zero
  Quando a empresa solicitar a recarga do cartão
  Entao a empresa recebe uma mensagem de erro informando que a recarga deve ser um inteiro maior que zero
 
 
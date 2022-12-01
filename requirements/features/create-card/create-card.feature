# language: pt

Funcionalidade: Criação de Cartão
 A fim de criar um cartão de benefícios para meu funcionário
 Como empresa, quero ser capaz de gerar um cartão de benefícios

Cenario: Empresa registrada cria um cartão de benefícios
 Dado que a empresa esteja registrada
 E a empresa forneça uma chave de api válida
 E o funcionário esteja registrado no sistema
 E o funcionário não tenha um cartão do mesmo tipo da solicitação
  Quando a empresa solicitar a criação de um cartão
  Entao o sistema deve cadastrar o cartão com sucesso

Cenario: Empresa não registrada falha ao criar um cartão
 Dado que a empresa não esteja registrada
 Mas a empresa forneça uma chave de api válida
  Quando a empresa solicitar a criação de um cartão
  Entao o sistema deve mostrar um erro informando que a empresa não está cadastrada
 
Cenario: Empresa registrada mas com chave de api inválida falha ao criar um cartão
 Dado que a empresa esteja registrada
 Mas a empresa forneça uma chave de api inválida
  Quando a empresa solicitar a criação de um cartão
  Entao o sistema deve mostrar um erro de autenticação
 
Cenario: Empresa registrada falha ao criar um cartão para um funcionário que não existe
 Dado que a empresa esteja registrada
 E a empresa forneça uma chave de api válida
 Mas o funcionário não esteja cadastrado
  Quando a empresa solicitar a criação de um cartão
  Entao o sistema deve mostrar um erro informando que o funcionário não existe

Cenario: Empresa registrada falha ao criar um cartão para um funcionário que já possui um cartão do mesmo tipo
 Dado que a empresa esteja registrada
 E a empresa forneça uma chave de api válida
 E o funcionário esteja cadastrado
 Mas o funcionário possui um cartão com o mesmo tipo da solicitação
  Quando a empresa solicitar a criação de um cartão
  Entao o sistema deve mostrar um erro informando que o funcionário já possui um cartão daquele tipo
 
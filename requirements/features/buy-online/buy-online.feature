# language: pt-br

Funcionalidade: Compra Online
 A fim de realizar uma compra online
 Como um funcionário
 Eu quero poder comprar de forma online utilizando meu cartão de benefícios

    Cenario: Funcionário realiza a compra com sucesso
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     E o cartão não esteja bloqueado
     E a senha do cartão esteja correta
     E o estabelecimento esteja cadastrado
     E o tipo do estabelecimento seja igual ao tipo do cartão de benefício
     E o cartão possua saldo suficiente
     E o montante da compra seja maior que zero
      Entao o funcionário deve ser capaz de realizar uma compra
      E o funcionário recebe um recibo do pagamento

    Cenario: Funcionário falha ao realizar compra com cartão não cadastrado
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     Mas o cartão não esteja cadastrado
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o cartão não está cadastrado

    Cenario: Funcionário falha ao realizar compra com cartão inativo
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     Mas o cartão não esteja ativo
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o cartão está inativo
    
    Cenario: Funcionário falha ao realizar compra com cartão expirado
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     Mas o cartão esteja expirado
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o cartão está expirado

    Cenario: Funcionário falha ao realizar compra com cartão bloqueado
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     Mas o cartão esteja bloqueado
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o cartão está bloqueado
    
    Cenario: Funcionário falha ao realizar compra com código de segurança errado
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     E o cartão não esteja bloqueado
     Mas o código de segurança do cartão esteja incorreto
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando 
        que o código de segurança do cartão está incorreto
    
    Cenario: Funcionário falha ao realizar compra num estabelecimento não cadastrado
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     E o cartão não esteja bloqueado
     E a senha do cartão esteja correta
     Mas o estabelecimento não esteja cadastrado
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o estabelecimento não está cadastrado
    
    Cenario: Funcionário falha ao realizar compra num estabelecimento com tipo diferente do cartão
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     E o cartão não esteja bloqueado
     E a senha do cartão esteja correta
     E o estabelecimento esteja cadastrado
     Mas o tipo de estabelecimento seja diferente do tipo do cartão
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o tipo do estabelecimento é diferente do tipo do cartão
     
    Cenario: Funcionário falha ao realizar compra com saldo insuficiente
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     E o cartão não esteja bloqueado
     E a senha do cartão esteja correta
     E o estabelecimento esteja cadastrado
     E o tipo de estabelecimento seja igual ao tipo do cartão
     Mas o saldo do cartão seja insuficiente para cobrir a compra
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o cartão não possui saldo suficiente

    Cenario: Funcionário falha ao realizar compra com montante igual ou menor que zero
     Dado que o funcionário opte por pagar uma compra online utilizando seu cartão de benefícios
     E o cartão esteja cadastrado
     E o cartão esteja ativo
     E o cartão não esteja expirado
     E o cartão não esteja bloqueado
     E a senha do cartão esteja correta
     E o estabelecimento esteja cadastrado
     E o tipo de estabelecimento seja igual ao tipo do cartão
     E o saldo do cartão seja suficiente para cobrir a compra
     Mas o montante da compra seja igual ou menor que zero
      Entao o funcionário não deve ser capaz de realizar uma compra
      E o funcionário recebe uma mensagem de erro informando que o valor da compra deve ser maior que zero
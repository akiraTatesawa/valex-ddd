# language: pt-br

Funcionalidade: Visualização de Saldo
 A fim de visualizar o saldo do cartão
 Como um funcionário
 Eu quero poder visualizar o saldo do meu cartão e o meu histórico de transações

    Cenario: Funcionário visualiza o saldo do cartão
     Dado que o funcionário queira visualizar o saldo do cartão
     E o cartão exista
     E haja um histórico de recargas e pagamentos
        Entao o funcionário deve ser capaz de visualizar o saldo
        E obter o extrato do cartão

    Cenario: Funcionário visualiza o saldo do cartão, porém sem histórico de transações
     Dado que o funcionário queira visualizar o saldo do cartão
     E o cartão exista
     Mas não haja um histórico de recargas e pagamentos
        Entao o funcionário deve ser capaz de visualizar o saldo
        Mas não haverá dados no extrato
    
    Cenario: Funcionário falha ao visualizar o saldo de um cartão que não existe
     Dado que o funcionário queira visualizar o saldo do cartão
     Mas o cartão não exista
        Entao o funcionário não deve ser capaz de visualizar o saldo
        E o funcionário recebe uma mensagem de erro informando que o cartão não está cadastrado no sistema
     
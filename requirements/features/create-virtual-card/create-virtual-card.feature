Funcionalidade: Criação de Cartão Virtual
    A fim de criar um cartão virtual
    Como funcionário
    Eu quero ser capaz de gerar um cartão virtual a partir de um cartão físico existente

    Cenario: Funcionário cria cartão virtual
        Dado que o funcionário queira criar um cartão virtual a partir de um cartão físico
        E o cartão físico esteja cadastrado no sistema
        E a senha do cartão esteja correta
            Entao o funcionário deve ser capaz de gerar um cartão virtual
            E o funcionário recebe os dados do novo cartão virtual
    
    Cenario: Funcionário falha ao criar cartão virtual a partir de um cartão que não existe
        Dado que o funcionário queira criar um cartão virtual a partir de um cartão físico
        Mas o cartão físico não esteja cadastrado no sistema
            Entao o funcionário não deve ser capaz de gerar um cartão virtual
            E o funcionário recebe uma mensagem de erro informando que o cartão físico não está registrado no sistema
    
    Cenario: Funcionário falha ao criar cartão virtual com a senha errada
        Dado que o funcionário queira criar um cartão virtual a partir de um cartão físico
        E o cartão físico esteja cadastrado no sistema
        Mas a senha do cartão esteja incorreta
            Entao o funcionário não deve ser capaz de gerar um cartão virtual
            E o funcionário recebe uma mensagem de erro informando que a senha fornecida está incorreta
 

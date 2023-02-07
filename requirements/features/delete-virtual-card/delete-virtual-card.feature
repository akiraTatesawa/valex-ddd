Funcionalidade: Exclusão de Cartão Virtual
    A fim de criar excluir um cartão virtual
    Como funcionário
    Eu quero ser capaz de excluir um cartão virtual

    Cenario: Funcionário exclui cartão virtual
        Dado que o funcionário queira excluir um cartão virtual
        E o cartão esteja cadastrado no sistema
        E o cartão seja virtual
        E a senha do cartão esteja correta
            Entao o funcionário deve ser capaz de excluir um cartão virtual

    Cenario: Funcionário falha ao excluir cartão que não existe
        Dado que o funcionário queira excluir um cartão virtual
        Mas o cartão não esteja cadastrado no sistema
            Entao o funcionário não deve ser capaz de excluir um cartão virtual
            E o funcionário recebe uma mensagem de erro informando que o cartão não está cadastrado no sistema

    Cenario: Funcionário falha o excluir cartão não-virtual
        Dado que o funcionário queira excluir um cartão virtual
        E o cartão esteja cadastrado no sistema
        Mas o cartão não seja virtual
            Entao o funcionário não deve ser capaz de excluir um cartão virtual
            E o funcionário recebe uma mensagem de erro informando que não é possível excluir cartões físicos, apenas cartões virtuais

    Cenario: Funcionário falha o excluir cartão virtual com senha errada
        Dado que o funcionário queira excluir um cartão virtual
        E o cartão esteja cadastrado no sistema
        E o cartão seja virtual
        Mas a senha esteja incorreta
            Entao o funcionário não deve ser capaz de excluir um cartão virtual
            E o funcionário recebe uma mensagem de erro informando que a senha está incorreta


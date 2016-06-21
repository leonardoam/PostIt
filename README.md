#Projeto PostIt

#Grupo:
    Cláudio César Domene Júnior         - 7987310
    Emanuel Carlos de Alcântara Valente - 7143506
    Leonardo Alves Miguel               - 7987265

#Funcionalidades por página:
templates/index.html
    -> realiza login
    -> faz a autenticacao
    -> faz import/export de dados

templates/signup.html
    -> realiza o cadastro
    -> faz a validacao do formulario

templates/content.html
    -> busca a timeline com as publicacoes e republicacoes do usuario e de quem ele segue e ordena por tempo
    -> permite que o usuario realize publicacoes
    -> mostra os grupos q o usuario participa
    -> permite criar grupos
    -> mostra a quantidade de postagens, seguidores e quem o usuario segue (coluna da esquerda)
    -> mostra os seguidores e quem o usuario segue por login (coluna da direita)
    -> postagens permitindo o uso de tags como $i, $v, por exemplo...
    -> permite a republicacao de postagens
    -> possibilidade de deletar postagens
    -> publicacoes podem receber reacoes (like/dislike)

templates/groups.html
    -> visualiza os membros do grupo por login
    -> caso o usuario seja dono do grupo permite que ele adicione ou remova pessoas, e tambem delete o grupo
    -> caso o usuario seja apenas um membro permite a opcao dele sair do grupo

templates/profile.html
    -> visualiza as publicacoes e republicacoes feitas pelo usuario do perfil
    -> visualiza os dados pessoais do usuario
    -> permite seguir ou deixar de seguir o usuario, caso esteja vendo o proprio perfil nenhuma opcao aparece

templates/statistics.html
    -> visualiza o top20 dos usuarios por pontuacao
    -> visualiza o top20 publicacoes por pontuacao

templates/search
    -> faz buscas por usuarios e por grupos
    -> no caso do grupo, o usuario deve buscar exatamente o nome do grupo, assim, aparecerá os grupos com tal nome e os donos
    -> no caso dos usuarios, pode-se buscar por parte do nome ou pelo nome completo que a busca achara
    -> usuarios encontrados possuem links para seus respectivos perfis

templates/config
    -> busca todos os dados e exibe no formulario para que o usuario possa modificar a vontade
    -> permite que o usuario possa modificar o password
    -> permite que o usuario delete sua conta


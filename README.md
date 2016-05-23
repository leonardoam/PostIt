# PostIt

a [Sails](http://sailsjs.org) application

Status do Projeto
---------------------
Client: 
- mapeamentos disponíveis:
 '/' ->pagina inicial:  login
    templateUrl: 'templates/index.html',
    controller: 'c1'
	
  '/#/signup' -> pagina criacao de conta
    templateUrl: 'templates/signup.html',
     controller: 'c2'
		 
  '/#/content' -> conteudo (home) do usuario depois de logar
  templateUrl: 'templates/content.html',
  controller: 'c2'
	
  '/#/groups' -> grupos criados pelo usuario
    templateUrl: 'templates/groups.html',
  controller: 'c2'
  
  '/#/profile'-> profile do usuario logado
    templateUrl: 'templates/profile.html',
    controller: 'c2'

Server: 

APIs disponíveis:

/user/create_user
/user/create_users  (apenas teste, cria direto do array)

aceita os seguintes atributos:

    nome: {
      type: 'string'
    },
    login: {
      type: 'string',
      unique: true
    },
    password: {
      type: 'string'
    },
    birthday: {
      type: 'datetime'
    },
    bio: {
      type: 'text'
    },
    email: {
      type: 'string'
    }

  }

  *Para criar usuario direto do terminal use:
  
 curl -i -X POST -H "Content-Type: application/json" -d '{"nome": "Emanuel Valente", "login": "emanuel100", "password": "emapass", "birthday": "1900-12-27T00:00:00Z", "bio": "ema bio", "email": "emanuelvalente@gmail.com"}' http://localhost:1337/user/create_user


Notas
---------
1. Crie uma aplicacaoo sails antes de copiar o conteudo desse projeto
2. Instale as dependencias com o bower:
- Dentro do diretorio assets, digite: bower init
e insira as seguintes dependencias no arquivo, recem criado, bower.json:
 "dependencies":{
     "angular": "*",
     "angular-route": "*",
     "bootstrap": "*",
     "jquery": "*"
  }
- digite (ainda dentro do dir assets): 'bower install'para instalar as dependencias que você colocou.  

Conteúdos de cada diretório que devem ser sobrepostos após criação da aplicação Sails:
-----------------------------------------------------------------------------------------

/api:
- controllers/ (tudo)
- models/ (tudo)


/assets:
- images/ (tudo)
- js/angular/ (tudo) -> AQUI ESTA TODA A APLICACAO (angular) DO CLIENTE
- styles/ (tudo)
- templates/ (tudo)  -> AQUI FICA TODO O CONTEUDO HTML (que chama os controllers angular) DO CLIENTE

/config:
- routes.js    
- views.js
- connections.js  /*postgres*/
- models.js /*escolhe o adaptador postgres*/

/task:
- pipeline.js

/views:
- layout.ejs   (NAO PRECISA MEXER NESSES DOIS ARQUIVOS -> Apenas modifique a aplicacao angular (/assets/angular/) e os templates em /assets/templates)
- homepage.ejs


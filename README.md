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

Server: TODO

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
- NADA (por enquanto), pois é a aplicação do lado do servidor


/assets:
- images (tudo)
- js/angular (tudo) -> AQUI ESTA TODA A APLICACAO (angular) DO CLIENTE
- styles (tudo)
- templates (tudo)  -> AQUI FICA TODO O CONTEUDO HTML (que chama os controllers angular) DO CLIENTE

/config:
- routes.js
- views.js

/task:
- pipeline.js

/views:
- layout.ejs   (NAO PRECISA MEXER NESSES DOIS ARQUIVOS -> Apenas modifique a aplicacao angular (/assets/angular/) e os templates em /assets/templates)
- homepage.ejs


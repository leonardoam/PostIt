/*
-------------------- VALIDACAO DE FORMULARIOS --------------------
Serviço que realiza a valizadão de campos de formulários, possuindo
métodos para cada tipo de campo que se pretende verificar.

*/

	myApp.factory('Validacao', function(Service) {
		var letras = /^[A-Za-z]+$/;
        var letrasComEspaco = /^[A-Za-z ]+$/;
    	var numeros = /^[0-9]+$/;

		return {
			'firstname': function(firstname){
				if(firstname == undefined || firstname == ""){
    				alert("Preencha o campo nome!");
    				return 0;
    			}
    			if(firstname.length > 10){
    				alert("Campo nome deve conter até 10 letras!");
    				return 0;
    			}
    			if(!firstname.match(letrasComEspaco)){
    				alert("O campo nome deve conter apenas letras.");
      				return 0;
    			}
    			return 1;
			},

			'lastname': function(lastname){
				if(lastname == undefined || lastname == ""){
	    			alert("Preencha o campo sobrenome!");
	    			return 0;
	    		}
	    		if(lastname.length > 10){
	    			alert("Campo sobrenome deve conter até 10 letras!");
	    			return 0;
	    		}
	    		if(!lastname.match(letrasComEspaco)){
	    			alert("O campo sobrenome deve conter apenas letras.");
	      			return 0;
	    		}
	    		return 1;
			},

			'name': function(name){
				if(name == undefined || name == ""){
	    			alert("Preencha o campo nome!");
	    			return 0;
	    		}
	    		if(name.length > 20){
	    			alert("Campo nome deve conter até 20 letras!");
	    			return 0;
	    		}
	    		if(!name.match(letrasComEspaco)){
	    			alert("O campo nome deve conter apenas letras.");
	      			return 0;
	    		}
	    		return 1;
			},

			'email': function(email){
	    		if(email == undefined || email == ""){
	    			alert("Preencha o campo de e-mail.");
	    			return false;
	    		}
	 			var erro = 0;
	 			var emailaux = email;
			    emailaux = emailaux.split("@");
			    if(emailaux.length != 2 || emailaux[0] < 1){ //verifica se o email exite duas partes, uma antes de @ e outra depois
			        erro = 1;
			        alert("Formato de e-mail incorreto. O e-mail deve ter o formato example@example.com");
			        return false;
			    }            
			    else{   //verifica se a segunda parte esta correta
			    	var a = emailaux[1].split(".");                    
			    	if(a.length != 2) erro = 1;
			    	else if( a[0] < 3 || a[1] != "com") erro = 1;
			    }
			    if(erro){
			    	alert("Formato de e-mail incorreto. O e-mail deve ter o formato example@example.com");
			      	return false;
			    }
			    return true;
			},

			'login': function(login){
	    		if(login == undefined || login == ""){
	    			alert("Preencha o campo de login.");
	    			return false;
	    		}
	    		if(!login.match(letras)){
	    			alert("O login deve ter apenas letras");
	      			return false;
	    		}
	    		Service.post('user','find_user',{'login_user': login}).then(
	    			function(respon){
	    				if(respon.data.success == 'true'){
	    					alert("Login já existe, tente outro...");
	    					return false;
	    				}
	    			}
	    		);
	    		return true;
			},
			
			'password': function(password,passwordConfirm){
	    		if(password == undefined || passwordConfirm == undefined || password == "" || passwordConfirm == ""){
	    			alert("Preencha os campos de password.");
	    			return false;
	    		}
	    		if(password != passwordConfirm){
	    			alert("Os campos de senha estão diferentes.");
	    			return false;
	    		}
    			return true;
			},
			
			'bio': function(bio){
	    		if(bio == undefined || bio == ""){
	    			alert("Escreva uma descrição.");
	    			return false;
	    		}
	    		if(bio.length > 200){
	    			alert("Descrição muito grande! Máximo de 200 letras");
	    			return false;
	    		}
	    		return true;
			},

			'gender': function(gender){
	    		if(gender == undefined || gender == ""){
	    			alert("Escolha um gênero");
	    			return false;
	    		}

	    		return true;
			},

			'birthday': function(birthday){
	    		if(birthday == undefined || birthday == ""){
	    			alert("Escolha uma data de aniversaio");
	    			return false;
	    		}

	    		return true;
			},
		}
	});
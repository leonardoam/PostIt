function validateSingup(form){
    var firstname = form["firstname"].value
    var lastname = form["lastname"].value
    var email = form["email"].value
    var password = form["password"].value
    var passwordConfirm = form["passwordConfirm"].value
    var descricao = form["descricao"].value
    var day = form["day"].value
    var month = form["month"].value
    var year = form["year"].value
    var sexo = form["sexo"].value
    var user = form["user"].value

    var letras = /^[A-Za-z]+$/;
    var numeros = /^[0-9]+$/;
    var erro;

    //valida nome
    if(firstname.length < 1){
      alert("Preencha o campo nome.");
      return false;
    }
    if(!firstname.match(letras)){
      alert("O campo nome deve conter apenas letras.");
      return false;
    }

    //valida sobrenome
    if(lastname.length < 1){
      alert("Preencha o campo sobrenome.");
      return false;
    }
    if(!lastname.match(letras)){
      alert("O campo sobrenome deve conter apenas letras.");
      return false;
    }

    //verifica user
    if(user == ""){
      alert("Preencha o campo de nome de usuario user.");
      return false;
    }

    //valida email
    erro = 0;
    email = email.split("@");
    //verifica se o email exite duas partes, uma antes de @ e outra depois
    if(email.length != 2 || email[0] < 1){
        erro = 1;
        alert("Formato de e-mail incorreto. O e-mail deve ter o formato example@example.com");
    }            
    else{   //verifica se a segunda parte esta correta
      var a = email[1].split(".");                    
      if(a.length != 2) erro = 1;
      else if( a[0] < 3 || a[1] != "com") erro = 1;
    }
    if(erro){
      return false;
    }

    //valida senha
    if(password.length < 1 || passwordConfirm.length < 1){
      alert("Preencha os campos de password.");
      return false;
    }
    if(password != passwordConfirm){
      alert("Os campos de password devem ser iguais");
      return false;
    }


    //valida a descricao
    if(descricao.length < 1){
      alert("Preencha o campo descricao.");
      return false;
    }

    //verifica data de aniversario
    if(day == "" || month == "" || year == ""){
      alert("Preencha o campo de data de aniversario.");
      return false;
    }

    //verifica sexo
    if(sexo == ""){
      alert("Preencha o campo sexo.");
      return false;
    }

    return true;
}
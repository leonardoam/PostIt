/*
-------------------- GROUP --------------------
Controlador para funcionalidades relacionadas aos grupos da rede social

Metodos:
    dataGroup: busca os dados do grupo (os membros, o dono e os tweets relacionados)
    createGroup: cria um grupo
    deleteGroup deleta um grupo
    addMember: adicionar um membro no grupo
    deleteMember: remover um outro membro do grupo
    leaveGroup: sair do grupo que pertence
*/

myApp.controller('group-controller', function ($scope, Service,$location,$routeParams) {

		$scope.dataGroup = function(){
			var x = $routeParams.groupParam.split(':');
			$scope.id_group = x[1];
			$scope.name_group = x[2];

			Service.post('group','get_members',{'id_group': $scope.id_group}).then(
				function(respon){
					$scope.members = respon.data;
					$scope.membersNumber = respon.data.length; 
				},
				function(respon){}
			);

			Service.post('group','get_master',{'id_group': $scope.id_group}).then(
				function(respon){
					$scope.master = respon.data.id;
					$scope.userId = Service.get_user();
				},
				function(respon){}
			);

			Service.post('group','get_tweets',{'id_group': $scope.id_group, 'name_group': $scope.name_group}).then(
				function(respon){
					$scope.tweetsList = respon.data;
				}
			);
		}

		$scope.createGroup = function(user) {
			var id_user = Service.get_user();
			var group_data = {'id_user': id_user, 'name_group': $scope.groupName};
			
			$scope.groupName = "";

			//cria o grupo
        	Service.post('group','create_group',group_data).then(
				function(respon){	//SUCESSO
					group_data = {'id_user': id_user, 'id_group': respon.data.relativeId};
					Service.post('group','join_member', group_data);
					$scope.getUserData();
				},

				function(respon){	//FALHA
					alert("falha ao tentar criar um grupo!");
				}
			);//then
    	}

    	$scope.deleteGroup = function(){
    		var id = {'id_group': $scope.id_group};

    		Service.post('group','delete_group',id).then(
    			function(respon){
					$location.path('/content');
					alert("grupo deletado. :(");
    			},
    			function(respon){}
    		);
        }

        $scope.addMember = function(add_member){
        	$scope.add_member = "";

        	Service.post('user','find_user',{'login_user': add_member}).then(
				function(respon){	//SUCESSO
					group_data = {'id_user': respon.data.id, 'id_group': $scope.id_group};

					Service.post('group','join_member', group_data).then(
						function(respon){
							if(respon.data.success){
								$scope.dataGroup();
								alert(add_member+" adicionado ao grupo! :D");

							} else
								alert("Usuário já está no grupo. :/");

						},
						function(respon){
							alert("caraio");
						}
					);
				},

				function(respon){	//FALHA
					alert("Usuário não encontrado. :/ \n Talvez você tenha digitado o nome errado, certifique-se de não incluir @ quando for procurar.");
				}
			);//then
        }

        $scope.deleteMember = function(del_member){
        	$scope.del_member = "";

   			Service.post('user','find_user',{'login_user': del_member}).then(
				function(respon){	//SUCESSO

					if(respon.data.id == Service.get_user())
						alert("Cara, você não pode se excluir do grupo.\nSe você quiser você pode deletar o grupo todo.. é uma opção.")
					else{
						group_data = {'id_user': respon.data.id, 'id_group': $scope.id_group};

						Service.post('group','delete_member', group_data).then(
							function(respon){
								if(respon.data.success){
									$scope.dataGroup();
									alert(del_member+" excluido do grupo com sucesso.");
								} else
									alert("Não existe usuário com esse nome aqui.");
							},
							function(respon){}
						);
					}
				},

				function(respon){	//FALHA
					alert("Não existe usuário com esse nome aqui.");
				}
			);//then
        }

        $scope.leaveGroup = function(){
        	Service.post('group','delete_member', {'id_user': Service.get_user(), 'id_group': $scope.id_group}).then(
        		function(respon){
					if(respon.data.success){
						alert("Você saiu do grupo " + $scope.name_group + " com sucesso. :)");
						$location.path('/content');
					} else
						alert("Não existe usuário com esse nome aqui.");
				},
				function(respon){}
        	);
        }

        $scope.groupSelected = function(group) {
        	$location.path('/groups:' + group.relativeId + ':' + group.name);
        }
	});
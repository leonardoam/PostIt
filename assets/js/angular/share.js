/*
-------------------- SHARE --------------------
Controlador para funcionalidades ligadas as republicacoes
Metodos:
	share: metodo para o usuario republicaralgum tweet
*/
myApp.controller('share-controller', function ($scope, Service, $rootScope) {
		
		$scope.share = function(tweet) {
			var id_user = Service.get_user();
			var id_tweet = tweet.id;

			Service.post('share', 'add_share', {'id_user': Service.get_user(), 'id_tweet': id_tweet}).then(
				function(respon){
					if(respon.data.success == "true")
						$rootScope.$emit("call-get_tweetsMethod", {});
					else if(respon.data.success == "false")
						alert("Você já republicou essa postagem.");
				}
			);
		}
	});
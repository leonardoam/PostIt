/*
-------------------- REACTION --------------------
Controlador para funcionalidades relacionadas as reacoes de 'like' e 'dislike'
Metodos:
	atualizeReactions: busca todos os likes/dislikes que a publicacao recebeu
	like: dar like para uma publicacao. O metodo eh chamado 1x para dar o like e se for precionado novamente
		  entao ele cancela o like (deleta a reaction). Acontece a mesma coisa com o botao de dislike.
	dislike: dar dislike para uma publicacao
*/

myApp.controller('reaction-controller', function ($scope, Service) {
		
		$scope.atualizeReactions = function(tweet){
			var id_tweet = tweet.id;

			Service.post('reaction', 'find_all_reactions', {'id_tweet': id_tweet}).then(
				function(respon){
					$scope.likeNumber = respon.data.likes;
					$scope.dislikeNumber = respon.data.dislikes;
				}
			);
		}

		$scope.like = function(tweet){
			var id_user = Service.get_user();
			var id_tweet = tweet.id;

			Service.post('reaction','set_like',{'id_user': id_user, 'id_tweet': id_tweet}).then(
				function(respon){
					$scope.atualizeReactions(tweet);
				}
			);
		}

		$scope.dislike = function(tweet){
			var id_user = Service.get_user();
			var id_tweet = tweet.id;

			Service.post('reaction','set_dislike',{'id_user': id_user, 'id_tweet': id_tweet}).then(
				function(respon){
					$scope.atualizeReactions(tweet);
				}
			);
		}
	});
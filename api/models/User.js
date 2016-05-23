/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

/*all types of attributes:
http://sailsjs.org/documentation/concepts/models-and-orm/attributes
*/
module.exports = {

  attributes: {

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
};


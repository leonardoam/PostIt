/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
/*
	group: 
		"id": inteiro, FK de user
		"list": [
			{
				"nome": string, deve ser único por usuário
				"users": [2,3,4], lista de inteiros, FK de user -> id
				"relativeId": PK
			}
		] lista de conjunto nome, users e relativeId
*/
module.exports = {

  attributes: {
    relativeId: {
      model: 'user',
      required: true,
      notNull: true
    },
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      required: true,
      notNull: true
    },
    users: {
      collection: 'user',
      via: 'groups'
    }
  }
};

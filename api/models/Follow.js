/**
 * Follow.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

/*
	follow:
		"id": inteiro, PK
		"follower": inteiro, FK de user -> id
		"follows": inteiro, FK de user-> id
		"timestamp": "2016-05-18T20:43:17.463Z", horário atual + timezone http://www.w3schools.com/jsref/jsref_tojson.asp

*/

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    follower: {
      model: 'user',
      required: true,
      notNull: true
    },
    follows: {
      model: 'user',
      required: true,
      notNull: true
    },
    timestamp: {
      type: 'string',
      required: true,
      notNull: true
    }
  }
};

/**
 * Reaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

/*
	reactions:
		"tweet": inteiro, PK
		"user": inteiro, FK de user -> id
		"reaction": inteiro 0 ou 1
		"timestamp": "2016-05-18T20:43:17.463Z", horário atual + timezone http://www.w3schools.com/jsref/jsref_tojson.asp

*/
module.exports = {

  attributes: {
    tweet: {
      model: 'tweet',
      required: true,
      notNull: true
    },
    user: {
      model: 'user',
      required: true,
      notNull: true
    },
    reaction: {
      type: 'integer',
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

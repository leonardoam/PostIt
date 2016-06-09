/**
 * Tweet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

/*
tweets: 
		"id": inteiro, PK
		"user": inteiro, FK de user -> id
		"title": string,
		"text": string,
		"timestamp": "2016-05-18T20:43:17.463Z", horário atual + timezone http://www.w3schools.com/jsref/jsref_tojson.asp
*/

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      model: 'user',
      required: true,
      notNull: true
    },
    title: {
      type: 'string',
      required: true,
      notNull: true
    },
    text: {
      type: 'string',
      required: true,
      notNull: true
    },
    timestamp: {
      type: 'datetime',
      required: true,
      notNull: true
    }
  }
};

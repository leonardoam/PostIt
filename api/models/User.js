/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

/*all types of attributes:
http://sailsjs.org/documentation/concepts/models-and-orm/attributes
*/
/*
user:
    "id": inteiro, PK
    "nome": string,
    "login": string,
    "password": string, "senha sem criptografia",
    "birthday": "dd-mm-yyyy", string
    "bio": string
*/
module.exports = {
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncremet: true
    },
    name: {
      type: 'string',
      required: true,
      notNull: true
    },
    login: {
      type: 'string',
      required: true,
      notNull: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true,
      notNull: true
    },
    birthday: {
      type: 'datetime',
      required: true,
      notNull: true
    },
    bio: {
      type: 'text',
      required: true,
      notNull: true
    },
    email: {
      type: 'string',
      required: true,
      notNull: true
    },
    groups: {
      collection: 'group',
      via: 'users'
    }
  }
};

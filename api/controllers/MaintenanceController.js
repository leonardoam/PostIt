/**
 * MaintenanceController
 *
 * @description :: Server-side logic for managing maintenances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	export_schema: function(req, res) {
		var PostgresSchema = require('pg-json-schema-export');
		var connection = {	
  		user: 'postgres',
  		password: 'sua_senha',
  		host: 'localhost',
  		port: 5432,
  		database: 'postit'
		};
	
		PostgresSchema.toJSON(connection, 'public')
  		.then(function (schemas) {
  			res.json(schemas);
  		})
  		.catch(function (error) {
  	 	console.log(error);
  		});		

	},

	export_data: function(req, res) {
		var exporter = require('pg-json-data-export');
		var connection = {	
  		user: 'postgres',
  		password: 'sua_senha',
  		host: 'localhost',
  		port: 5432,
  		database: 'postit'
		};
		
		exporter.toJSON(connection, 'public')
  		.then(function (alldata) {
   		 	//console.log(dump.table1.rows);
   		 	res.json(alldata)
  		})
  		.catch(function (error) {
  	 		console.log(error);
  	 		res.json(error);
  		});		

	},
	
};


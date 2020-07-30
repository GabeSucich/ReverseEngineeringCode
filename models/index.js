'use strict';

// Here we require all the necessary npm packages
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');

// This gets the name of the file we are currently in (index.js)
var basename  = path.basename(module.filename);

// This is specifying the name of the environment from which we are trying to connect to our SQL database.
// If we are hosting on a service like heroku, there will be a process.env.NODE_ENV environment which we can specify in the config.json file.
// Otherwise, we are using the 'development' configuration.
var env       = process.env.NODE_ENV || 'development';

// First, we require the json object located in the config.json file. We can then select the configuration object from
// the 'env' key determined above which determines the context in which we are running our app.
var config    = require(__dirname + '/../config/config.json')[env];

// Our database is originally set to an empty object. We will populate it with models below.
var db        = {};

// When we deploy on heroku, where the config object has a use_env_variable key, then we will instantiate a sequelize instance with the environment-specific configuration
// Otherwise, we will instantiate a sequelize instance with the information contained in the 'development' settings object of the config.json file.
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  // We read in the list of files contained inside of the models directory
  .readdirSync(__dirname)
  // We filter the files. All hidden files starting with "." are removed. The index.js file is removed. We only look at .js files.
  // This filter function gives only the .js files which contain our models.
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // Each model .js file in the models directory is exporting its model. In this line, we import these models from each of the files.
  // Then, we add this model to the database (db) as a value with an associated key of the model name. This will allow us to access the models
  // in our routes.
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });


// Object.keys(db) returns an iterable of each of the model-name keys in the object. We then examine the "associate" key of each model object
// by looking it up in the db object under the key of the model name. If the "associate" key exists, then we associate the object with the database
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// To the database we add a key of 'sequelize'. The value is our sequelize instance.
// To the database we add a key of "Sequqlize". The value is the standard sequelize libary.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the database with all the models added.
module.exports = db;

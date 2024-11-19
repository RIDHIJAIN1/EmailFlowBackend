'use strict';
const fs = require('fs');
const path = require('path');

const models = {};

// Load all files in the current directory except for the index.js file
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    const modelName = model.modelName; // Assuming modelName property is used in the model file
    models[modelName] = model;
  });

// If models have associations, you can define them here
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Modèle des utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Plugin pour vérifier que l'email de l'utilisateur soit unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
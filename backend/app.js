const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const path = require('path');

//Création d'application express
const app = express();

//Import des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Connection à la base de donnée MongoDB
mongoose.connect('mongodb+srv://jonathan:N71cUcu3PqcE2M0W@cluster0.dui5l.mongodb.net/piiquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Header pour contourner erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Rendre la requete exploitable
app.use(bodyParser.json());

//Gestion de la ressource image de façon statique
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes attendues
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
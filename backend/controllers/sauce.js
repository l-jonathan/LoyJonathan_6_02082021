//Package file system pour modifier le système de donnée pour la fonction delete
const fs = require('fs');


//Import du modele de la sauce
const Sauce = require('../models/sauce');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
  console.log('je suis ici');
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  console.log('je suis là');
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Récupère une sauce unique par l'id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
  _id: req.params.id
}).then(
  (sauce) => {
    res.status(200).json(sauce);
  }
).catch(
  (error) => {
    res.status(404).json({
      error: error
    });
  }
);
};

//Récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Supprimer une sauce
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Like sauce
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    //cancel = 0
    //check if the user had liked or disliked the sauce
    //uptade the sauce, send message/error
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    //likes = 1
    //uptade the sauce, send message/error
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    //likes = -1
    //uptade the sauce, send message/error
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    default:
      console.error('not today : mauvaise requête');
  }
};
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //Récupération du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //Décodage du token
    const userId = decodedToken.userId; //Récupération du userID
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
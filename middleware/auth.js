const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = "supersecreto"; //MI .ENV NO ESTA FUNCIONANDO NO ME BAJE PROFE

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'No token provided.' });
    }

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.user.id); 

    if (!user || user.isActive === false) {
      return res.status(401).send({ error: 'User not found or inactive.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;

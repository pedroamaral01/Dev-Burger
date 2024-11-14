import jwt from 'jsonwebtoken';
import authconfig from '../../config/authconfig.js';

function authMiddlewares(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ erro: 'Token not provided' });
  }

  const checkToken = authToken.split(' ').at(1);

  try {
    jwt.verify(checkToken, authconfig.secret, (err, decoded) => {
      if (err) {
        throw new Error('Token is invalid');
      }

      req.userId = decoded.id;
      req.userName = decoded.name;
    });
  } catch (err) {
    return res.status(401).json({ erro: err.message });
  }

  return next();
}

export default authMiddlewares;

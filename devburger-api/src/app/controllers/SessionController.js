import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authconfig from '../../config/authconfig.js';

class SessionController {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(req.body);

    const dataIncorrect = () => {
      res
        .status(401)
        .json({ error: 'Make sure your email or password are correct' });
    };

    if (!isValid) {
      return dataIncorrect();
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return dataIncorrect();
    }

    const isSamePassword = await user.comparePassword(password);

    if (!isSamePassword) {
      return dataIncorrect();
    }

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authconfig.secret, {
        expiresIn: authconfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

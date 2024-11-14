import { v4 } from 'uuid';
import User from '../models/User.js';
import * as Yup from 'yup';

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .strict(true)
        .matches(/^[A-Za-z\s]+$/, 'The name must contain only letters')
        .required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = req.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });
    return res.status(200).json({
      id: user.id,
      name,
      email,
    });
  }
}

export default new UserController();

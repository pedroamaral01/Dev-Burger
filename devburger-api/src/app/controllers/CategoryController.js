import * as Yup from 'yup';
import Category from '../models/Category.js';
import User from '../models/User.js';

class CategoryController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .strict(true)
        .matches(/^[A-Za-z\s]+$/, 'The name must contain only letters')
        .required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res.status(401).json();
    }

    const { filename: path } = req.file;
    const { name } = req.body;

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const { id } = await Category.create({
      name,
      path,
    });

    return res.status(201).json({ id, name });
  }

  async update(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .strict(true)
        .matches(/^[A-Za-z\s]+$/, 'The name must contain only letters'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { id } = req.params;

    const categoryExistsId = await Category.findByPk(id);

    if (!categoryExistsId) {
      return res.status(400).json({ error: 'Category does not exist' });
    }

    const { admin: isAdmin } = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res.status(401).json();
    }

    let path;
    if (req.file) {
      path = req.file;
    }

    const { name } = req.body;

    if (name) {
      const categoryExists = await Category.findOne({
        where: {
          name,
        },
      });
      if (categoryExists && categoryExists.id != id) {
        return res.status(400).json({ error: 'Category already exists' });
      }
    }

    await Category.update(
      {
        name,
        path,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json();
  }

  async index(req, res) {
    const category = await Category.findAll();

    return res.json(category);
  }
}

export default new CategoryController();

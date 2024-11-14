import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer.js';

import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';

import authMiddlewares from '.././src/app/middlewares/auth.js';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', async (req, res) => {
  return res.status(200).json({ message: 'Hello World' });
});
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddlewares);

routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);

routes.post('/categories', upload.single('file'), CategoryController.store);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);
routes.get('/categories', CategoryController.index);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

export default routes;

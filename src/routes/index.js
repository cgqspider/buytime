import express from 'express';
const router = express.Router();
import { registerController, loginController, usersController, refreshController, productController } from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

// User Module
// Register & Verify a User
// Login a User
// Logout a User

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', registerController.register);
router.get('/register/activate/:token', registerController.activate);
router.post('/login', loginController.login);
router.get('/me', auth, usersController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

// Get the List of products for given IDs for Cart
router.post('/products/cart-items', productController.getProducts);

router.post('/products', [auth, admin],  productController.store);
router.put('/products/:id',[auth, admin],productController.update);
router.delete('/products/:id', [auth, admin],productController.destroy);
router.get('/products', productController.getAll);
router.get('/products/:id', productController.show);

//Orders
router.post('/orders', registerController.register);

router.post('/checkout', productController.checkout);
router.post('/payment/verify', productController.verify);

// router.get('/products/:id',auth, productController.show);
// router.put('/products/:id',[auth, admin], productController.update);


export default router;
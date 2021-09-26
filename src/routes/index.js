import express from 'express';
const router = express.Router();
import { registerController, loginController, usersController, refreshController, productController } from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';



router.post('/register', registerController.register);
router.get('/register/activate/:token', registerController.activate);
router.post('/login', loginController.login);
router.get('/me', auth, usersController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);


router.post('/products/cart-items', productController.getProducts);

router.post('/products', productController.store);
router.put('/products/:id',productController.update);
router.delete('/products/:id', [auth, admin],productController.destroy);
router.get('/products', productController.getAll);
router.get('/products/:id', productController.show);

router.post('/checkout', productController.checkout);
router.post('/payment/verify', productController.verify);

// router.get('/products/:id',auth, productController.show);
// router.put('/products/:id',[auth, admin], productController.update);


export default router;
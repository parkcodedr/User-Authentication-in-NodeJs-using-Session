const { Router } = require('express');
const authController = require('../controllers/authController');
const router = Router();

const upload = require('../middleware/upload');
router.get('/signup', authController.sign_up_get);
router.post('/signup', upload.single('avater'), authController.sign_up_post);
//router.get('/products',authController.sign_in_get);
router.get('/signin', authController.sign_in_get);
router.post('/signin', authController.sign_in_post);
router.get('/logout', authController.logout_get);
//router.get('/signup', authController.sign_up);


module.exports = router;
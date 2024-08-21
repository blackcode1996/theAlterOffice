import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { registerValidationRules, loginValidationRules } from '../middleware/auth/validation';
import { validate } from '../middleware/auth/validate';

const router = Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);

export default router;

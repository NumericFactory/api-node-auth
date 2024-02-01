import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middleware/checkJwt';
import { asyncHandler } from '../middleware/asyncHandler';
import UserController from '../controllers/UserController';

const router = Router();
// Login route.
router.post('/', [checkJwt], asyncHandler(UserController.addNewReview));

// Change my password.
router.post('/:movie_id', asyncHandler(UserController.getReviews));

export default router;
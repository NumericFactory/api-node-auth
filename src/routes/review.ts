import { Router } from 'express';
import { checkJwt } from '../middleware/checkJwt';
import { asyncHandler } from '../middleware/asyncHandler';
import ReviewController from '../controllers/ReviewController';


const router = Router();
// Add New Review
router.post('/', [checkJwt], asyncHandler(ReviewController.addNewReview));

// Delete Review
router.delete('/:id', [checkJwt], asyncHandler(ReviewController.deleteReview));

// Get reviews
router.get('/:type/:id', asyncHandler(ReviewController.getReviews));
// router.get('/user/:user_id', asyncHandler(ReviewController.getReviews));
// router.get('/movie/:movie_id', asyncHandler(ReviewController.getReviews));
// router.get('/tv/:tv_id', asyncHandler(ReviewController.getReviews));
// router.get('/person/:person_id', asyncHandler(ReviewController.getReviews));

export default router;
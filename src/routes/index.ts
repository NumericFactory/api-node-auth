import { Router } from 'express';
import auth from './auth';
import user from './user';
import review from './review';

const routes = Router();

routes.use('/auth', auth);
// All user operations will be available under the "users" route prefix.
routes.use('/users', user);
// All review operations will be available under the "reviews" route prefix.
routes.use('/reviews', review);
// All watchlist operations will be available under the "watchlist" route prefix.
routes.use('/watchlist', review);

// Allow our router to be used outside of this file.
export default routes;

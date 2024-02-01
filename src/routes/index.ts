import { Router } from 'express';
import auth from './auth';
import user from './user';
import review from './review';

const routes = Router();

routes.use('/auth', auth);
// All user operations will be available under the "users" route prefix.
routes.use('/users', user);

routes.use('/review', review);

// Allow our router to be used outside of this file.
export default routes;

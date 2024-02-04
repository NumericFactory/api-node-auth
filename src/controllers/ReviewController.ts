import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../exceptions/forbiddenError';
import { ClientError } from '../exceptions/clientError';
import { CustomRequest } from '../middleware/checkJwt';
import { Roles } from '../state/users';
import { IReview } from '../config/models/all.model';
import { getAllReviewsByMovieId, getAllReviewsByTvshowId, getAllReviewsByUserId, createReview, deleteReview, getReview, } from '../state/reviews';
import { NotFoundError } from '../exceptions/notFoundError';

class ReviewController {

    static addNewReview = async (req: Request, res: Response, next: NextFunction) => {
        // // Validate permissions.
        // if ((req as CustomRequest).token.payload.role === Roles.USER &&
        //     req.params.id !== (req as CustomRequest).token.payload.userId) {
        //     throw new ForbiddenError('Not enough permissions');
        // }
        // Get values from the body.
        const { user_id, score, comment, media_type, media_id } = req.body;
        // We can only create regular review through this function.
        const newReview = await createReview(user_id, score, comment, media_type, media_id);
        // Send an HTTP "Created" response.
        res.status(201).type('json').send(newReview);
    }


    static getReviews = async (req: Request, res: Response, next: NextFunction) => {
        const type: string = req.params.type; // movie | serie | person
        const id: number = parseInt(req.params.id);
        let foundReviews: IReview[] | undefined = undefined;
        // Get the Reviews with the requested movie ID | serie ID | person ID.
        if (type === 'user') {
            foundReviews = getAllReviewsByUserId(id)
        }
        else if (type === 'movie') {
            foundReviews = getAllReviewsByMovieId(id)
        }
        else if (type === 'tv') {
            foundReviews = getAllReviewsByTvshowId(id)
        }
        else {
            throw new ClientError('Invalid type - type must be movie, tv or user');
        }
        if (!foundReviews) {
            // Send an HTTP "No Content" response.
            throw new NotFoundError(`No review found for this ${type} - ID ${id}`)
        }
        res.status(200).type('json').send(foundReviews);
    }


    static deleteReview = async (req: Request, res: Response, next: NextFunction) => {
        const review_id: number = parseInt(req.params.id);
        // Validate permissions.
        const user_id = getReview(review_id).user_id;
        const userIdPayloadToken: number = parseInt((req as CustomRequest).token.payload.userId)
        console.log('user_id', user_id)
        console.log('payload', userIdPayloadToken)
        if ((req as CustomRequest).token.payload.role === Roles.USER &&
            user_id !== userIdPayloadToken) {
            throw new ForbiddenError('Not enough permissions');
        }
        let deletedReviewId = deleteReview(review_id);
        res.status(200).type('json').send({ id: deletedReviewId });
    }



}


export default ReviewController;
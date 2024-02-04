import { NotFoundError } from '../exceptions/notFoundError';
import { IReview, Genre, Movie, TvShow } from "../config/models/all.model";
import { ClientError } from '../exceptions/clientError';

// state reviews
export let reviews: IReview[] = [
    { id: 1, user_id: 1, score: 9, comment: "Super Film", media_type: 'movie', media_id: 57280, created_at: 1706992953352 },
    { id: 2, user_id: 2, score: 8, comment: "Comme un poisson dans l'eau", media_type: 'movie', media_id: 572802, created_at: 1706992981313 },
    { id: 3, user_id: 3, score: 4, comment: "Bof! Film très moyen", media_type: 'movie', media_id: 572802, created_at: 1706992992749 }
];

// Generate a copy of the reviews
const generateSafeCopy = (review: IReview): IReview => {
    let _review = { ...review };
    return _review;
};

export const getAllReviews = (): IReview[] => {
    return reviews.map((elem) => generateSafeCopy(elem));
};
// Recover reviews based on userId if present, using the userId as the query.
export const getAllReviewsByUserId = (userId: number): IReview[] | undefined => {
    const possibleReviews = reviews.filter((item) => item.user_id === userId);
    if (possibleReviews.length == 0) return undefined;
    return possibleReviews.map(review => generateSafeCopy(review));
};
// Recover reviews based on movieId if present, using the movieId as the query.
export const getAllReviewsByMovieId = (movieId: number): IReview[] | undefined => {
    const possibleReviews = reviews.filter((item) => item.media_type === 'movie' && item.media_id === movieId);
    if (possibleReviews.length == 0) return undefined;
    return possibleReviews.map(review => generateSafeCopy(review));
};
// Recover reviews based on tvshowId if present, using the tvshowId as the query.
export const getAllReviewsByTvshowId = (tvshowId: number): IReview[] | undefined => {
    const possibleReviews = reviews.filter((item) => item.media_type === 'tv' && item.media_id === tvshowId);
    if (possibleReviews.length == 0) return undefined;
    return possibleReviews.map(review => generateSafeCopy(review));
};
// Recover a review if present.
export const getReview = (id: number): IReview => {
    let review = reviews.find(item => item.id === id)
    if (!review) throw new NotFoundError(`Review with ID ${id} not found`);
    return generateSafeCopy(review);
};

export const createReview = async (
    user_id: number,
    score: number,
    comment: string,
    media_type: 'movie' | 'tv' | 'person',
    media_id: number
): Promise<IReview> => {
    // Clean data quality
    user_id = typeof user_id === 'string' ? parseInt(user_id) : user_id;
    score = typeof score === 'string' ? parseInt(score) : score;
    comment = comment.trim();
    media_id = typeof media_id === 'string' ? parseInt(media_id) : media_id;
    // Reader: Add checks according to our custom use case.
    if (comment.length < 3) throw new ClientError('Invalid comment - minimum 3');
    else if (score < 1 || score > 10) throw new ClientError('Invalid score - between 1-10');
    else if (media_type != 'movie' && media_type != 'tv' && media_type != 'person') throw new ClientError('Invalid media type');
    // Generate a user id.
    const newid = Date.now();
    // generate new review
    const newReview: IReview = {
        id: newid,
        score: score,
        comment: comment,
        media_type: media_type,
        media_id: media_id,
        user_id: user_id,
        created_at: Date.now()
    }
    // add new review to reviews
    reviews = [...reviews, newReview];
    return newReview;
}

export const deleteReview = (reviewId: number): number => {
    let review = reviews.find(item => item.id === reviewId)
    if (!review) throw new NotFoundError(`Review with ID ${reviewId} not found`);
    reviews = reviews.filter(item => item.id != reviewId);
    return reviewId;
};


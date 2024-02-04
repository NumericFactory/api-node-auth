export interface WatchList {
    movies: Movie[],
    tv: TvShow[]
}

export interface Genre {
    id: number,
    name: string
}

export interface IReview {
    id: number;
    score: number;
    comment: string;
    media_type: 'movie' | 'tv' | 'person';
    media_id: number;
    user_id: number;
    created_at: number;
}

export interface Movie {
    id: number;
    titre: string;
    duration: undefined | number;
    resume: string;
    image_landscape: string;
    image_protrait: string;
    score: number;
    genres: Genre[];
    date: Date;
    hasVideo: boolean;
    video: string | undefined;
    reviews: IReview[];
}
export interface TvShow {
    id: number;
    titre: string;
    resume: string;
    episode_runtime: number | undefined;
    image_landscape: string;
    image_protrait: string;
    score: number;
    genres: Genre[];
    date: Date;
    video: any[];
}
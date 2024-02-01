import bcrypt from 'bcrypt';
import { NotFoundError } from '../exceptions/notFoundError';
import { ClientError } from '../exceptions/clientError';

// Define the code interface for user objects.
export interface IUser {
    id: string;
    username: string;
    // The password is marked as optional to allow us to return this structure
    // without a password value. We'll validate that it is not empty when creating a user.
    password?: string;
    role: Roles;
    watchList: WatchList;
    reviews: Review[];
}

// User WatchList
export interface WatchList {
    movies: Movie[],
    tv: TvShow[]
}

interface Genre {
    id: number,
    name: string
}

interface Review {
    id: number;
    score: number;
    comment: string;
    media_type: 'movie' | 'tv';
    media_id: number;
    user_id: number;
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
    reviews: Review[];
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
// Our API supports both an admin and regular user, as defined by a role.
export enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER'
}


let reviews: Review[] = [
    {
        id: 1,
        user_id: 1,
        score: 5,
        comment: "Super Film",
        media_type: 'movie',
        media_id: 572802
    },
    {
        id: 2,
        user_id: 2,
        score: 4,
        comment: "Comme un poisson dans l'eau",
        media_type: 'movie',
        media_id: 572802
    },
    {
        id: 3,
        user_id: 3,
        score: 2,
        comment: "Bof! Film très moyen",
        media_type: 'movie',
        media_id: 572802
    }

];

// Generate a copy of the users without their passwords.
const generateSafeCopyOfReviews = (review: Review): Review => {
    let _review = { ...review };
    return _review;
};
export const getAllReviews = (): Review[] => {
    return Object.values(reviews).map((elem) => generateSafeCopyOfReviews(elem));
};

export const createReview = async (
    score: number,
    comment: string,
    media_type: 'movie' | 'tv',
    media_id: number,
    user_id: number): Promise<Review> => {

    // Reader: Add checks according to your custom use case.
    // if (username.length === 0) throw new ClientError('Invalid username');
    // else if (password.length === 0) throw new ClientError('Invalid password');
    // // Check for duplicates.
    // if (getUserByUsername(username) != undefined) throw new ClientError('Username is taken');

    // Generate a user id.

    const newid = Date.now();

    const newReview = {
        id: newid,
        score: score,
        comment: comment,
        media_type: media_type,
        media_id: media_id,
        user_id: user_id
    }


    // Create the user.
    reviews = [...reviews, newReview];
    return newReview;
};



/******************************* */


// Let's initialize our example API with some user records.
// NOTE: We generate passwords using the Node.js CLI with this command:
// "await require('bcrypt').hash('PASSWORD_TO_HASH', 12)"
let users: { [id: string]: IUser } = {
    '0': {
        id: '0',
        username: 'testuser1',
        // Plaintext password: testuser1_password
        password: '$2b$12$ov6s318JKzBIkMdSMvHKdeTMHSYMqYxCI86xSHL9Q1gyUpwd66Q2e',
        role: Roles.USER,
        watchList: { movies: [], tv: [] },
        reviews: []
    },
    '1': {
        id: '1',
        username: 'testuser2',
        // Plaintext password: testuser2_password
        password: '$2b$12$63l0Br1wIniFBFUnHaoeW.55yh8.a3QcpCy7hYt9sfaIDg.rnTAPC',
        role: Roles.USER,
        watchList: { movies: [], tv: [] },
        reviews: []
    },
    '2': {
        id: '2',
        username: 'testuser3',
        // Plaintext password: testuser3_password
        password: '$2b$12$fTu/nKtkTsNO91tM7wd5yO6LyY1HpyMlmVUE9SM97IBg8eLMqw4mu',
        role: Roles.USER,
        watchList: { movies: [], tv: [] },
        reviews: []
    },
    '3': {
        id: '3',
        username: 'testadmin1',
        // Plaintext password: testadmin1_password
        password: '$2b$12$tuzkBzJWCEqN1DemuFjRuuEs4z3z2a3S5K0fRukob/E959dPYLE3i',
        role: Roles.ADMIN,
        watchList: { movies: [], tv: [] },
        reviews: []
    },
    '4': {
        id: '4',
        username: 'testadmin2',
        // Plaintext password: testadmin2_password
        password: '$2b$12$.dN3BgEeR0YdWMFv4z0pZOXOWfQUijnncXGz.3YOycHSAECzXQLdq',
        role: Roles.ADMIN,
        watchList: { movies: [], tv: [] },
        reviews: []
    }
};

let nextUserId = Object.keys(users).length;

// NOTE: Validation errors are handled directly within these functions.

// Generate a copy of the users without their passwords.
const generateSafeCopy = (user: IUser): IUser => {
    let _user = { ...user };
    delete _user.password;
    return _user;
};

// Recover a user if present.
export const getUser = (id: string): IUser => {
    if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);
    return generateSafeCopy(users[id]);
};

// Recover a user based on username if present, using the username as the query.
export const getUserByUsername = (username: string): IUser | undefined => {
    const possibleUsers = Object.values(users).filter((user) => user.username === username);
    // Undefined if no user exists with that username.
    if (possibleUsers.length == 0) return undefined;
    return generateSafeCopy(possibleUsers[0]);
};

export const getAllUsers = (): IUser[] => {
    return Object.values(users).map((elem) => generateSafeCopy(elem));
};

export const createUser = async (username: string, password: string, role: Roles): Promise<IUser> => {
    username = username.trim();
    password = password.trim();

    // Reader: Add checks according to your custom use case.
    if (username.length === 0) throw new ClientError('Invalid username');
    else if (password.length === 0) throw new ClientError('Invalid password');
    // Check for duplicates.
    if (getUserByUsername(username) != undefined) throw new ClientError('Username is taken');

    // Generate a user id.
    const id: string = nextUserId.toString();
    nextUserId++;
    // Create the user.
    users[id] = {
        username,
        password: await bcrypt.hash(password, 12),
        role,
        id,
        watchList: { movies: [], tv: [] },
        reviews: []
    };
    return generateSafeCopy(users[id]);
};

export const updateUser = (id: string, username: string, role: Roles): IUser => {
    // Check that user exists.
    if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);

    // Reader: Add checks according to your custom use case.
    if (username.trim().length === 0) throw new ClientError('Invalid username');
    username = username.trim();
    const userIdWithUsername = getUserByUsername(username)?.id;
    if (userIdWithUsername !== undefined && userIdWithUsername !== id) throw new ClientError('Username is taken');

    // Apply the changes.
    users[id].username = username;
    users[id].role = role;
    return generateSafeCopy(users[id]);
};

export const deleteUser = (id: string) => {
    if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);
    delete users[id];
};

export const isPasswordCorrect = async (id: string, password: string): Promise<boolean> => {
    if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);
    return await bcrypt.compare(password, users[id].password!);
};

export const changePassword = async (id: string, password: string) => {
    if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);

    password = password.trim();
    // Reader: Add checks according to your custom use case.
    if (password.length === 0) throw new ClientError('Invalid password');

    // Store encrypted password.
    users[id].password = await bcrypt.hash(password, 12);
};



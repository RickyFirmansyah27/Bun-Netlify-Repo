import userRoute from './user-route';

const basePath = '/express';

export const routes = [
    { path: `${basePath}/user`, router: userRoute },
];


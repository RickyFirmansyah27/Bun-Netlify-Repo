import userRoute from './user-route';

const basePath = '/api/v1/data';

export const routes = [
    { path: `${basePath}/user`, router: userRoute },
];


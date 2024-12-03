import path from 'path';
import { config } from 'dotenv';
const envPath = path.resolve(__dirname, '../.env');

config({ path: envPath });

import boom from 'express-boom';
import { HttpLogger, Logger } from './helper';
import express, { Express } from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { routes } from './routes';
import { DBConnection } from './config/dbPoolInfra';

const app: Express = express();
const router = express.Router();

// Middleware
router.use(cors({
  origin: ['*', 'http://localhost:8000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
router.use(express.json());
app.use(boom());
app.use(HttpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes.forEach(route => {
    app.use(route.path, route.router);
});

// For local development
if (require.main === module) {
  const port = process.env.PORT || 8000;
  app.listen(port, async (): Promise<void> => {
    try {
        await DBConnection();
        Logger.info(`[Bun-Service] Server is running on port ${port}`);
    } catch (error) {
        if (error instanceof Error) {
            Logger.error(
                `Error starting server: Message: ${error.message} | Stack: ${error.stack}`
            );
        } else {
            Logger.error(`Error starting server: ${String(error)}`);
        }
    }
  });
}

export default app;
export const handler = serverless(app);

/* eslint-disable @typescript-eslint/no-var-requires,global-require,no-console,import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import express, { Application, json } from 'express';
import cookieParser from 'cookie-parser';
import RefreshTokenCron from './crons/refresh-token-crons';

const app: Application = express();
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { DB_URL, PORT } = process.env;

const startApp = () => {
    const { useRouters } = require('./router');

    app.use(json());
    app.use(cookieParser());
    useRouters(app);

    app.listen(PORT, () => console.log(`SERVER_PORT: ${PORT}`));

    RefreshTokenCron.start();
};

mongoose.connect(DB_URL!, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(startApp)
    .catch(console.log);

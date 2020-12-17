/* eslint-disable @typescript-eslint/no-var-requires,global-require,no-console,import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import express, { Application, json } from 'express';
// import expressFileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

const app: Application = express();
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { DB_URL, PORT } = process.env;

const startApp = () => {
    const { useRouters } = require('./router');

    // app.use(expressFileUpload({ limits: { fileSize: 10000000 } }));
    app.use(json());
    app.use(cookieParser());
    useRouters(app);

    app.listen(PORT, () => console.log(`SERVER_PORT: ${PORT}`));
};

mongoose.connect(DB_URL!, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(startApp)
    .catch(console.log);

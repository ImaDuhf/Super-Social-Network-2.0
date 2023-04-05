import * as env from 'dotenv';
env.config();

if (process.env.JWT_SIGN_KEY == undefined) {
	console.log('[WARN] - no jwt key found, perhaps you are missing the env file?');
}

import express from 'express';
import apiRouter from './src/router/apiRouter.js';
import authRouter from './src/router/authRouter.js';

const app = express();
const port = 4050;

app.use(express.json());

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
	console.log('server is started');
});

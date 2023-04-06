import express from 'express';
import apiRouter from './src/router/apiRouter.js';
import authRouter from './src/router/authRouter.js';
import emergencyRouter from './src/router/emergencyRouter.js';

const app = express();
const port = 4050;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/api', apiRouter, emergencyRouter);

app.listen(port, () => {
	console.log('server is started');
});

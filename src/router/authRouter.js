import * as env from 'dotenv';
env.config();

if (process.env.JWT_SIGN_KEY == undefined) {
	console.log('[WARN] - no jwt key found, perhaps you are missing the env file?');
}

import express from 'express';
import jwt from 'jsonwebtoken';
import { fetchCollection } from '../mongo/mongoClient.js';
import { registerNewUser } from '../service/authService.js';

const authRouter = express.Router();

authRouter.post('/login', async (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const userDb = await fetchCollection('user-collection').find().toArray();
	let user = userDb.find((user) => user.username == username && user.password == password);

	if (user == undefined) {
		response.status(401).send('invalid authentication');
	} else {
		const payload = {
			username: user.username,
			role: user.role,
		};
		const token = jwt.sign(payload, process.env.JWT_SIGN_KEY);
		response.status(200).send(token);
	}
});

authRouter.post('/register', async (request, response) => {
	let user = {
		username: request.body.username,
		password: request.body.password,
		role: 'USER',
	};
	const result = await registerNewUser(user);
	const responseData = {
		content: user,
	};
	response.send(responseData);
});

authRouter.get('/admin', (request, response) => {
	const authHeader = request.headers.authorization;

	if (authHeader == undefined) {
		response.status(417).send('log in and try again');
	} else {
		const token = authHeader.replace('Bearer ', '');

		try {
			jwt.verify(token, process.env.JWT_SIGN_KEY);
			response.send('Sucess');
		} catch (error) {
			response.send('sign in before accessing this page');
		}
	}
});

export default authRouter;

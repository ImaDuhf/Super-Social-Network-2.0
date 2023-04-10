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

// Logga in användaren och skicka tillbaka en giltig JWT token
authRouter.post('/login', async (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
	// hämtar våran user collection och jämför användar namn och löserord
	const userDb = await fetchCollection('user-collection').find().toArray();
	let user = userDb.find((user) => user.username == username && user.password == password);

	if (user == undefined) {
		response.status(401).send('invalid authentication');
	} else {
		//skapa upp en JWT payload
		const payload = {
			username: user.username,
			role: user.role,
		};
		//skapar vi en JWT token och skickar med den till användaren
		const token = jwt.sign(payload, process.env.JWT_SIGN_KEY);
		response.status(200).send(token);
	}
});

// registrera en ny användare
authRouter.post('/register', async (request, response) => {
	// lägger vi namn och lösenord i ett user objekt
	let user = {
		username: request.body.username,
		password: request.body.password,
		role: 'USER',
	};
	// sparar vi användaren till databasen
	const result = await registerNewUser(user);
	const responseData = {
		content: user,
	};
	response.send(responseData);
});

// JWT CHECK PAGE
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

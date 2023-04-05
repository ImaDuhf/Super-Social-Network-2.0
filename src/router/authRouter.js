import express from 'express';
import { registerNewUser } from '../service/authService.js';

const authRouter = express.Router();

authRouter.post('/login', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;
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

export default authRouter;

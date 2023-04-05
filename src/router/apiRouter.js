import express from 'express';
import { verifyUser } from '../service/authService.js';
import { deleteMessage, fetchMessages, sendMessage } from '../service/messageService.js';
import jwtDecode from 'jwt-decode';

const apiRouter = express.Router();

apiRouter.get('/getMessages', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		const messageCollection = await fetchMessages();
		console.log(messageCollection.map((msg) => msg.message));

		response.send(messageCollection.map((msg) => msg));
	} else {
		response.status(417).send('Log in and try again');
	}
});

apiRouter.put('/sendMessage', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		let message = request.body.message;
		//console.log(request);
		let decoded = jwtDecode(request.headers.authorization.replace('Bearer ', ''));
		console.log(decoded);
		const result = await sendMessage(message, decoded.username);

		const responseData = {
			user: decoded.username,
			content: message,
		};

		if (result.upsertedId != null) {
			responseData.id = result.upsertedId;
		}

		response.send(responseData);
	}
});

apiRouter.delete('/deleteMessage', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		let messageToDelete = request.body;
		console.log(messageToDelete);
		const result = await deleteMessage(messageToDelete);
		response.send(result);
	}
});

export default apiRouter;

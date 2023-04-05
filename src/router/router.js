import express from 'express';
import { fetchMessages, sendMessage } from '../service/messageService.js';

const router = express.Router();

router.get('/getMessages', async (request, response) => {
	const messageCollection = await fetchMessages();
	console.log(messageCollection.map((msg) => msg.message));

	response.send(messageCollection.map((msg) => msg.message));
});

router.put('/sendMessage', async (request, response) => {
	let message = request.body;
	console.log(message);
	const result = await sendMessage(message);

	const responseData = {
		content: message,
	};

	if (result.upsertedId != null) {
		responseData.id = result.upsertedId;
	}

	response.send(responseData);
});

router.delete('/deleteMessage', (request, response) => {});

export default router;

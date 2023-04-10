import express from 'express';
import { createCollection, fetchCollections } from '../mongo/mongoClient.js';
import { fetchMessages, sendMessage } from '../service/messageService.js';
import { verifyUser } from '../service/authService.js';
import jwtDecode from 'jwt-decode';

const emergencyRouter = express.Router();

// Hämtar all meddelanden från nödkanalen, om nödkanalen inte finns så skapar vi en ny.
emergencyRouter.get('/broadcast', async (request, response) => {
	const result = await fetchCollections();
	const channels = result.map((room) => room.collectionName);
	let emergencyChannel = channels.indexOf('emergencyChannel');
	// Om emergencyChannel inte finns
	if (emergencyChannel <= -1) {
		await createCollection('emergencyChannel');
		response.send('Emergency Channel not found but created');
	}
	// Om emergencyChannel finns
	else {
		let emergencyMessages = await fetchMessages('emergencyChannel');
		response.send(emergencyMessages);
	}
});

// skickar vi meddelnade till nödkanalen
emergencyRouter.post('/broadcast', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		let message = request.body.message;
		//console.log(request);
		let decoded = jwtDecode(request.headers.authorization.replace('Bearer ', ''));
		console.log(decoded);
		const result = await sendMessage(message, decoded.username, 'emergencyChannel');

		response.send(result);
	} else {
		response.status(417).send('LOG IN');
	}
});

export default emergencyRouter;

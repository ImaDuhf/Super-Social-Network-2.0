import express from 'express';
import { verifyUser } from '../service/authService.js';
import { deleteMessage, fetchMessages, sendMessage, createRoom } from '../service/messageService.js';
import { fetchCollection, fetchCollections } from '../mongo/mongoClient.js';
import jwtDecode from 'jwt-decode';

const apiRouter = express.Router();

// Hämtar alla annonserade kanaler
apiRouter.get('/channel', async (request, response) => {
	// verifiera att användaren har en giltig JWT token
	if (verifyUser(request.headers.authorization)) {
		// hämtar alla collections
		const result = await fetchCollections();
		// tar ut bara namnen från alla collections
		const openRooms = result.map((room) => room.collectionName);
		// ta bort våran user collection med all user data
		const index = openRooms.indexOf('user-collection');
		if (index > -1) {
			openRooms.splice(index, 1);
		}
		response.send(openRooms);
	} else {
		response.status(417).send('Log in and try again');
	}
});

// Hämtar all innehåll i den indentifierade kanalen
apiRouter.get('/channel/:id', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		// hämtar alla meddelanden i en collection
		const messageCollection = await fetchMessages(request.params.id);
		// Vi skickar bara tillbaka alla meddelanded i en collection
		response.send(messageCollection.map((msg) => msg));
	} else {
		response.status(417).send('Log in and try again');
	}
});

// Skickar meddelande till en identifierad kanal
apiRouter.post('/channel/:id', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		// Tar ut meddelandet från bodyn
		let message = request.body.message;
		// Tar ut användarnamnet från användarens JWT token så den kan skickas med i meddelandet
		let decoded = jwtDecode(request.headers.authorization.replace('Bearer ', ''));
		console.log(decoded);
		//skickar vi meddelandet till kanalen som specifierats
		const result = await sendMessage(message, decoded.username, request.params.id);
		response.status(201).send(result);
	} else {
		response.status(400).send('Log in and try again');
	}
});

// skapar upp en ny kanal och skickar med kanal id:t
apiRouter.put('/channel', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		const result = await createRoom();
		// tar ut namnet från collectionen, ns ger "Chatt.84f40949-016f-4313-b751-58b00e54f304", vi tar bort Chatt. och skickar tillbaka namnet på chatt rummet
		const roomName = await result.stats().ns.split('.')[1]; // hämtar datan om collectionen och tar ut namnet med split för att ta ut databas namnet
		response.send(roomName);
	} else {
		response.status(417).send('Log in and try again');
	}
});

// Tar bort en identifierad kanal
apiRouter.delete('/channel/:id', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		// dubbel kollar så man inte kastar bort våran user-collection
		if (request.params.id != 'user-collection') {
			const result = await fetchCollection(request.params.id).drop();
			response.send(`Removed chatt room ${request.params.id}`);
		} else {
			response.status(400);
		}
	} else {
		response.status(417).send('Log in and try again');
	}
});

// tar vi bort innehåll från en identifierad kanal
apiRouter.delete('/channel/:id/:messageid', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		const result = await deleteMessage(request.params.messageid, request.params.id);
		response.send(result);
	} else {
		response.status(417).send('Log in and try again');
	}
});

export default apiRouter;

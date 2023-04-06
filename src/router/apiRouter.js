import express from 'express';
import { verifyUser } from '../service/authService.js';
import { deleteMessage, fetchMessages, sendMessage, fetchChattRooms, createRoom } from '../service/messageService.js';
import { fetchCollection } from '../mongo/mongoClient.js';
import jwtDecode from 'jwt-decode';

const apiRouter = express.Router();

// Hämtar alla annonserade kanaler
apiRouter.get('/channel', async (request, response) => { 
	if (verifyUser(request.headers.authorization)) {
		const result = await fetchChattRooms();
		const openRooms = result.map(room => room.collectionName);
		const index = openRooms.indexOf('user-collection');
		if(index > -1) {
			openRooms.splice(index, 1);
		}
		response.send(openRooms);
	} else {
		response.status(417).send('Log in and try again');
	}
})

// Hämtar all innehåll i den indentifierade kanalen
apiRouter.get('/channel/:id', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		const messageCollection = await fetchMessages(request.params.id);
		console.log(messageCollection.map((msg) => msg.message));
		response.send(messageCollection.map((msg) => msg));
	} else {
		response.status(417).send('Log in and try again');
	}
})

// Skickar meddelande till en identifierad kanal
apiRouter.post('/channel/:id', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		let message = request.body.message;
		//console.log(request);
		let decoded = jwtDecode(request.headers.authorization.replace('Bearer ', ''));
		console.log(decoded);
		const result = await sendMessage(message, decoded.username, request.params.id);

		response.send(result);
	}
});

// skapar upp en ny kanal och skickar med kanal id:t
apiRouter.put("/channel", async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
    const result = await createRoom();
    const roomName = (await result.stats()).ns.split(".")[1]; // hämtar datan om collectionen och tar ut namnet med split för att ta bort databas namnet
    response.send(roomName);
	}
});

// Tar bort en identifierad kanal
apiRouter.delete('/channel/:id', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		const result = await fetchCollection(request.params.id).drop();
		console.log(result);
		response.send(`Removed chatt room ${request.params.id}`);
	}
});

// tar vi bort innehåll från en identifierad kanal
apiRouter.delete('/channel/:id/:messageid', async (request, response) => {
	if (verifyUser(request.headers.authorization)) {
		const result = await deleteMessage(request.params.messageid, request.params.id);
		response.send(result);
	}
});


// apiRouter.get('/getMessages', async (request, response) => {
// 	if (verifyUser(request.headers.authorization)) {
// 		const messageCollection = await fetchMessages(request.body.roomId);
// 		console.log(messageCollection.map((msg) => msg.message));

// 		response.send(messageCollection.map((msg) => msg));
// 	} else {
// 		response.status(417).send('Log in and try again');
// 	}
// });

// apiRouter.put('/sendMessage', async (request, response) => {
// 	if (verifyUser(request.headers.authorization)) {
// 		let message = request.body.message;
// 		//console.log(request);
// 		let decoded = jwtDecode(request.headers.authorization.replace('Bearer ', ''));
// 		console.log(decoded);
// 		const result = await sendMessage(message, decoded.username, request.body.roomId);

// 		const responseData = {
// 			user: decoded.username,
// 			content: message,
// 		};

// 		if (result.upsertedId != null) {
// 			responseData.id = result.upsertedId;
// 		}

// 		response.send(responseData);
// 	}
// });

// apiRouter.delete('/deleteMessage', async (request, response) => {
// 	if (verifyUser(request.headers.authorization)) {
// 		let messageToDelete = request.body;
// 		console.log(messageToDelete);
// 		const result = await deleteMessage(messageToDelete, request.body.roomId);
// 		response.send(result);
// 	}
// });

// apiRouter.get('/getChattRooms', async (request, response) => {
// 	if (verifyUser(request.headers.authorization)) {
// 		const result = await fetchChattRooms();
// 		const openRooms = result.map(room => room.collectionName);
// 		const index = openRooms.indexOf('user-collection');
// 		if(index > -1) {
// 			openRooms.splice(index, 1);
// 		}
// 		response.send(openRooms);
// 	} else {
// 		response.status(417).send('Log in and try again');
// 	}
// })


export default apiRouter;

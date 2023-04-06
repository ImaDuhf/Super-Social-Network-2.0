import express from 'express';
import { createCollection, fetchCollections } from '../mongo/mongoClient.js';
import { fetchMessages, sendMessage } from '../service/messageService.js';
import { verifyUser } from '../service/authService.js';
import jwtDecode from 'jwt-decode';

const emergencyRouter = express.Router();

emergencyRouter.get("/broadcast", async (request, response) => {
    const result = await fetchCollections();
    const channels = result.map(room => room.collectionName);
    let emergencyChannel = channels.indexOf('emergencyChannel');
    if(emergencyChannel <= -1) {
        await createCollection('emergencyChannel');
        let emergencyMessages = await fetchMessages('emergencyChannel');
        response.send(emergencyMessages)
    } else {
        let emergencyMessages = await fetchMessages('emergencyChannel');
        response.send(emergencyMessages)
    }
})

emergencyRouter.post("/broadcast", async (request, response) => {
    if (verifyUser(request.headers.authorization)) {
		let message = request.body.message;
		//console.log(request);
		let decoded = jwtDecode(request.headers.authorization.replace('Bearer ', ''));
		console.log(decoded);
		const result = await sendMessage(message, decoded.username, 'emergencyChannel');

		response.send(result);
	} else {
        response.status(417).send("LOG IN");
    }
});

export default emergencyRouter;



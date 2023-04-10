import { fetchCollection, createCollection } from '../mongo/mongoClient.js';
import crypto from 'crypto';

// skickar meddelande
export function sendMessage(messageData, username, roomId) {
	let date = new Date();
	let data = {
		user: username,
		message: messageData,
		dateSent: date,
		messageId: crypto.randomUUID(),
	};
	return fetchCollection(roomId).insertOne(data);
}

// hämtar alla meddelanden i en collection
export function fetchMessages(roomId) {
	return fetchCollection(roomId).find().toArray();
}

// tar bort ett meddelande med ett givet messageId
export function deleteMessage(id, roomId) {
	return fetchCollection(roomId).deleteOne({ messageId: id });
}
// skapar en ny collection med ett random namn
export function createRoom() {
	return createCollection(crypto.randomUUID());
}

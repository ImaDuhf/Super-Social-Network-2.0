import { fetchCollection, fetchCollections, createCollection } from '../mongo/mongoClient.js';
import crypto from 'crypto';

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

export function fetchMessages(roomId) {
	return fetchCollection(roomId).find().toArray();
}

export function deleteMessage(id, roomId) {
	return fetchCollection(roomId).deleteOne({messageId: id});
}

export function fetchChattRooms() {
	return fetchCollections();
}

export function createRoom () {
    return createCollection(crypto.randomUUID());
}
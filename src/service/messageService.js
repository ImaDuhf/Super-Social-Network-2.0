import { ObjectId } from 'mongodb';
import { fetchCollection } from '../mongo/mongoClient.js';
import crypto from 'crypto';

export function sendMessage(messageData, username) {
	let date = new Date();
	let data = {
		user: username,
		message: messageData,
		dateSent: date,
		messageId: crypto.randomUUID(),
	};
	return fetchCollection('chatt-app').insertOne(data);
}

export function fetchMessages() {
	return fetchCollection('chatt-app').find().toArray();
}

export function deleteMessage(id) {
	return fetchCollection('chat-app').deleteOne({ messageId: '4d3e4175-6b50-4677-9259-5640de154244' });
}

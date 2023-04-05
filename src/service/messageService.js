import { fetchCollection } from '../mongo/mongoClient.js';

export function sendMessage(messageData) {
	const critera = { message: messageData.message };
	const data = { $set: messageData };

	return fetchCollection('chatt-app').updateOne(critera, data, { upsert: true });
}

export function fetchMessages() {
	return fetchCollection('chatt-app').find().toArray();
}

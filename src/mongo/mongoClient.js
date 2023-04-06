import { MongoClient } from 'mongodb';

const username = 'admin';
const password = 'YY46MQ5S1XsQNiHO';
const databaseName = 'Chatt';

let db = undefined;

export function fetchCollection(name) {
	return fetchDatabase().collection(name);
}

export function fetchCollections() {
	return fetchDatabase().collections();
}

export function createCollection(name) {
	return fetchDatabase().createCollection(name);
}

function fetchDatabase() {
	const url = `mongodb+srv://${username}:${password}@chatt.5cp6bfx.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(url);

	db = client.db(databaseName);

	return db;
}

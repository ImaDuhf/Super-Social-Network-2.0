import { MongoClient } from 'mongodb';

const username = 'admin';
const password = 'YY46MQ5S1XsQNiHO';
const databaseName = 'Chatt';

let db = undefined;

export function fetchCollection(name) {
	return fetchDatabase().collection(name);
}

function fetchDatabase() {
	const url = `mongodb+srv://${username}:${password}@chatt.5cp6bfx.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(url);

	db = client.db(databaseName);

	return db;
}
//https://prod.liveshare.vsengsaas.visualstudio.com/join?484541A3E90F0203075C8C58DA05E7CD038F

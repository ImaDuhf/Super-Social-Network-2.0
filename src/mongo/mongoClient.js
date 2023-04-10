import * as env from 'dotenv';
env.config();

if (process.env.JWT_SIGN_KEY == undefined) {
	console.log('[WARN] - no jwt key found, perhaps you are missing the env file?');
}

import { MongoClient } from 'mongodb';

const username = 'admin';
const password = process.env.MONGODB_PASSWORD;
const databaseName = 'Chatt';

let db = undefined;

// Hämtar vi datan innuti EN collection "Chatt rum" i databasen
export function fetchCollection(name) {
	return fetchDatabase().collection(name);
}
// hämtar alla collections
export function fetchCollections() {
	return fetchDatabase().collections();
}
// Vi skapar en ny collection, Collections är json filer som innehåller alla våra meddelanden
export function createCollection(name) {
	return fetchDatabase().createCollection(name);
}

// Hämtar vi en databas från det givna namnet
function fetchDatabase() {
	const url = `mongodb+srv://${username}:${password}@chatt.5cp6bfx.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(url);

	db = client.db(databaseName);
	// får tillbaka hela databasen, går inte att läsa från direkt
	return db;
}

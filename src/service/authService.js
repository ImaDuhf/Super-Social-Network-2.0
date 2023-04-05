import { fetchCollection } from '../mongo/mongoClient.js';

export function registerNewUser(user) {
	return fetchCollection('user-collection').insertOne(user);
}

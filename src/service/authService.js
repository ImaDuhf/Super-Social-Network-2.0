import { fetchCollection } from '../mongo/mongoClient.js';
import jwt from 'jsonwebtoken';

export function registerNewUser(user) {
	return fetchCollection('user-collection').insertOne(user);
}

export function verifyUser(authHeader) {
	if (authHeader == undefined) {
		return false;
	} else {
		const token = authHeader.replace('Bearer ', '');
		try {
			jwt.verify(token, process.env.JWT_SIGN_KEY);
			return true;
		} catch (error) {
			return false;
		}
	}
}

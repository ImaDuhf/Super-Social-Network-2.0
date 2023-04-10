import { fetchCollection } from '../mongo/mongoClient.js';
import jwt from 'jsonwebtoken';

export function registerNewUser(user) {
	return fetchCollection('user-collection').insertOne(user);
}

// verifierar JWT token från användaren
export function verifyUser(authHeader) {
	// finns authHeader? om den inte finns ger vi error direkt annars gå vidare
	if (authHeader == undefined) {
		return false;
	} else {
		// ta ut bara jwt token
		const token = authHeader.replace('Bearer ', '');
		try {
			// verifera att vi har en giltig JWT signatur och då får användaren göra det den ville göra
			jwt.verify(token, process.env.JWT_SIGN_KEY);
			return true;
		} catch (error) {
			return false;
		}
	}
}

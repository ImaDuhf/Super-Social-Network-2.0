import express from 'express';
import router from './src/router/router.js';
import { fetchCollection } from './src/mongo/mongoClient.js';
import cors from 'cors';

const app = express();
const port = 4050;

app.use(cors());
app.use(express.json());

app.use('/api', router);

console.log(fetchCollection('chatt-app'));

app.listen(port, () => {
	console.log('server is started');
});

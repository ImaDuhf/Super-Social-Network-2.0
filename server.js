import express from 'express';
import router from './src/router/router.js';

const app = express();
const port = 4050;

app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
	console.log('server is started');
});

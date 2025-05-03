import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Create __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
const clientDist = path.join(__dirname, '../../client/dist')
app.use(express.static(clientDist))
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// TODO: Implement middleware to connect the routes
app.use(cors())
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

import Fastify from 'fastify';
import Autoload from 'fastify-autoload';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import startDashboard from './output/admin';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const DB_URL = process.env.MONGO_DATABASE;

const fastify = Fastify({
    logger: false,
})

fastify.register(Autoload, {
    dir: join(__dirname, "plugins")
})

fastify.register(Autoload, {
    dir: join(__dirname, "routes")
})

fastify.listen(PORT,'0.0.0.0')
.then(
    (address) => {
        mongoose.connect(DB_URL).then(
            () => {
                console.log("App running on: " + address);
                //startDashboard()
            }
        )
        .catch(
            (err) => {
                console.error("Error in connecting to Database: " + err)
            })
    }
)
.catch(
    (error) => {
        console.log("Error: " + error);
    }
)



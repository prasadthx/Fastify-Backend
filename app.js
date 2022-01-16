import Fastify from 'fastify';
import Autoload from 'fastify-autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8000;

const fastify = Fastify({
    logger: false
})

fastify.register(Autoload, {
    dir: join(__dirname, "plugins")
})

fastify.register(Autoload, {
    dir: join(__dirname, "routes")
})

fastify.get("/", async function (request, reply){
    return {"Status" : "Working"};
})

fastify.listen(PORT, '0.0.0.0')
.then((address) => console.log(`Server listening on ${address}`))
.catch(err => {
    console.log('Error starting server:', err)
    process.exit(1)
})


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

// fastify.register(Autoload, {
//     dir: join(__dirname, "plugins")
// })

// fastify.register(Autoload, {
//     dir: join(__dirname, "routes")
// })

fastify.get("/", async function (request, reply){
    return {"Status" : "Working"};
})

const runServer = async () => {
    try {
        await fastify.listen(PORT)
        console.log("App running on PORT: " + PORT);
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

runServer();

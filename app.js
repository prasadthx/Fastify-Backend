import Fastify from 'fastify';
import Autoload from 'fastify-autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
    logger: false
})

fastify.register(Autoload, {
    dir: join(__dirname, "routes")
})

fastify.register(Autoload, {
    dir: join(__dirname, "plugins")
})

const runServer = async () => {
    try {
        await fastify.listen(3000)
        console.log("App running on PORT: " + 3000);
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

await runServer();

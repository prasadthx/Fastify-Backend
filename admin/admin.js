import Fastify from 'fastify';
import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import AdminJSMongoose from '@adminjs/mongoose';
import replace from '@rollup/plugin-replace';
import Vendor from '../models/Vendor';
import Image from '../models/Image';
import Place from '../models/Place';
import Transaction from '../models/Transaction';
import Request from '../models/Request';
import Customer from '../models/Customer';
import dotenv from 'dotenv';
import fastifyFavicon from 'fastify-favicon'

dotenv.config();

AdminJS.registerAdapter(AdminJSMongoose);

const PORT = 8000;

const app = Fastify({
    logger: false,
});

app.register(fastifyFavicon, { path: './admin', name: 'favicon.ico' })

const AdminJSOpts = new AdminJS({
    databases: [],
    rootPath: '/admin',
    resources: [Customer, Vendor, Transaction, Place, Image, Request],
    branding: {
        companyName: 'Alecado Systems',
        softwareBrothers : false,
        logo:'https://media-exp1.licdn.com/dms/image/C560BAQE29sJDHkypQQ/company-logo_200_200/0/1631134271377?e=1653523200&v=beta&t=cTgyRQDllHksanwYL0b0qBv75krJgxqEnuKN0fuLevw',
        favicon:'https://media-exp1.licdn.com/dms/image/C560BAQE29sJDHkypQQ/company-logo_200_200/0/1631134271377?e=1653523200&v=beta&t=cTgyRQDllHksanwYL0b0qBv75krJgxqEnuKN0fuLevw'
    },
    bundler: {
        rollup(config, opts) {
            config.plugins = config.plugins.map(p =>
              p.name === 'replace'
                ? replace({
                    preventAssignment: true,
                })
                : p
            );
            console.log(config);
            return config; // always return a config.
        }
    }
});

const ADMIN = {
   email: process.env.ADMIN_SECRET_EMAIL,
   password: process.env.ADMIN_SECRET_PASSWORD
};

AdminJSFastify.buildAuthenticatedRouter(AdminJSOpts,
    {
        authenticate: async (email, password) => {
             if (ADMIN.password === password && ADMIN.email === email) {
               return ADMIN
             }
             return null
           },
           cookieName: 'adminjs',
           cookiePassword: `${process.env.ADMIN_SECRET}`,
        }
, app);

async function startDashboard(){
    app.listen(PORT, '0.0.0.0')
    .then(
        (address) => {
            console.log(`AdminJS is under ${address}/admin`);
        }
    )
    .catch(
        (e) => console.log(e)
    );
}

export default startDashboard;

import Fastify from 'fastify';
import AdminJSFastify from '@adminjs/fastify';
import AdminJS from 'adminjs';
import AdminJSMongoose from '@adminjs/mongoose';
import mongoose from 'mongoose';
import 'fastify-session';
import replace from '@rollup/plugin-replace';
import Vendor from '../models/Vendor';
import Image from '../models/Image';
import Place from '../models/Place';
import Transaction from '../models/Transaction';
import Request from '../models/Request';
import Customer from '../models/Customer';


AdminJS.registerAdapter(AdminJSMongoose);

const PORT = 8000;

const app = Fastify({
    logger: false,
});

// app.decorateRequest('sessionStore', { getter: () => sessionStore });

const AdminJSOpts = new AdminJS({
    databases: [],
    rootPath: '/admin',
    resources: [Customer, Vendor, Transaction, Place, Image, Request],
    branding: {
        companyName: 'Alecado Systems',
        softwareBrothers : false
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
   email: 'test@example.com',
   password: 'password',
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
           cookiePassword: 'somepasswordgeneratedoflength32charactersisitenoughornot',
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

export { startDashboard as default };

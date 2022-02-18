'use strict';

var Fastify = require('fastify');
var Autoload = require('fastify-autoload');
var mongoose = require('mongoose');
var url = require('url');
var path = require('path');
var dotenv = require('dotenv');
var AdminJSFastify = require('@adminjs/fastify');
var AdminJS = require('adminjs');
var AdminJSMongoose = require('@adminjs/mongoose');
require('fastify-session');
var replace = require('@rollup/plugin-replace');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Fastify__default = /*#__PURE__*/_interopDefaultLegacy(Fastify);
var Autoload__default = /*#__PURE__*/_interopDefaultLegacy(Autoload);
var mongoose__default = /*#__PURE__*/_interopDefaultLegacy(mongoose);
var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);
var AdminJSFastify__default = /*#__PURE__*/_interopDefaultLegacy(AdminJSFastify);
var AdminJS__default = /*#__PURE__*/_interopDefaultLegacy(AdminJS);
var AdminJSMongoose__default = /*#__PURE__*/_interopDefaultLegacy(AdminJSMongoose);
var replace__default = /*#__PURE__*/_interopDefaultLegacy(replace);

const customerSchema = mongoose__default["default"].Schema({
    name : String,
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password : { 
        type : String,
        required : true
    },
    createdAt : {
        type: Date,
        default : Date.now()
    },
    updatedAt : {
        type: Date,
        default : Date.now()
    },
    verified : Boolean
});

var Customer = mongoose__default["default"].model('Customer', customerSchema);

const vendorSchema = mongoose__default["default"].Schema({
    name : String,
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password : { 
        type : String,
        required : true
    },
    createdAt : {
        type: Date,
        default : Date.now()
    },
    updatedAt : {
        type: Date,
        default : Date.now()
    },
    adhaarCard : { 
        type: String,
        immutable: true
    },
    photo : {
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Image'
    },
    verified : Boolean,
    phoneNumber : String
});

var Vendor = mongoose__default["default"].model("Vendor", vendorSchema);

const imageSchema = mongoose__default["default"].Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

var Image = mongoose__default["default"].model("Image", imageSchema);

const placeSchema = mongoose__default["default"].Schema({
    name : { 
        type: String,
        required: true
    },
    location : {
        type : Object,
        required : true
    },
    vendor : {
        type: mongoose__default["default"].Types.ObjectId, 
        ref: "Vendor", 
        required: true
    },
    photos :[{
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Image'
    }],
    requests :[{
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Request'
    }],
    categories : {
        type : [String],
        enum : ['venue', 'food', 'lookups', 'music/dj']
    },
    booked : { 
        type: Boolean,
        default: false
    }
});

placeSchema.index({ location: '2dsphere' });

var Place = mongoose__default["default"].model("Place", placeSchema);

const transactionSchema = mongoose__default["default"].Schema({
    customer: {
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    place: {
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Place',
        required: true
    },
    time : { 
        type: Date,
        default : Date.now()
    }
});

var Transaction = mongoose__default["default"].model("Transaction", transactionSchema);

const requestSchema = mongoose__default["default"].Schema({
    place: { 
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Place',
        required: true   
    },
    requested_by: {
        type: mongoose__default["default"].Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    requested_at: {
        type: Date,
        default : Date.now(),
        required: true
    },
    requested_for: {
        type: Date,
        required: true
    }
});

var Request = mongoose__default["default"].model("Request", requestSchema);

AdminJS__default["default"].registerAdapter(AdminJSMongoose__default["default"]);

const PORT$1 = 8000;

const app = Fastify__default["default"]({
    logger: false,
});

// app.decorateRequest('sessionStore', { getter: () => sessionStore });

const AdminJSOpts = new AdminJS__default["default"]({
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
                ? replace__default["default"]({
                    'process.env.NODE_ENV': JSON.stringify(opts.env),
                    true: true,
                  })
                : p
            );
            return config; // always return a config.
        }
    }
});

const ADMIN = {
   email: 'test@example.com',
   password: 'password',
};

AdminJSFastify__default["default"].buildAuthenticatedRouter(AdminJSOpts,
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
    app.listen(PORT$1, '0.0.0.0')
    .then(
        (address) => {
            console.log(`AdminJS is under ${address}/admin`);
        }
    )
    .catch(
        (e) => console.log(e)
    );
}

dotenv__default["default"].config();

const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('app.js', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);

const PORT = process.env.PORT || 3000;

const DB_URL = process.env.MONGO_DATABASE;

const fastify = Fastify__default["default"]({
    logger: false,
});

fastify.register(Autoload__default["default"], {
    dir: path.join(__dirname$1, "plugins")
});

fastify.register(Autoload__default["default"], {
    dir: path.join(__dirname$1, "routes")
});

fastify.listen(PORT,'0.0.0.0')
.then(
    (address) => {
        mongoose__default["default"].connect(DB_URL).then(
            () => {
                console.log("App running on: " + address);
                startDashboard();
            }
        )
        .catch(
            (err) => {
                console.error("Error in connecting to Database: " + err);
            });
    }
)
.catch(
    (error) => {
        console.log("Error: " + error);
    }
);

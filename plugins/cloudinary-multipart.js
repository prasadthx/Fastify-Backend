'use strict';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 } from 'cloudinary';
import multer from 'fastify-multer';
import fp from "fastify-plugin";

let cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'client-gallery',
        allowedFormats: [ 'jpg', 'png', 'jpeg' ],
        // transformation: [ { width: 800, height: 800, crop: 'limit' } ]
    }
});

const parser = multer({ storage });

export default fp(async function (fastify, opts) {
    fastify.decorate('multer', { parser });
})

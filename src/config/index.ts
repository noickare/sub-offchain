import "reflect-metadata";
import dotenv from "dotenv";
import { createClient } from "redis";

import { createTransport } from "nodemailer";

dotenv.config();

const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on('error', function(err){ 
  console.error('Redis error:', err); 
});

const smtp = {
  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USERNAME: process.env.SMTP_USERNAME,
  PASSWORD: process.env.SMTP_PASSWORD,
};

const transport = createTransport({
  host: smtp.HOST,
  port: parseInt(smtp.PORT),
  auth: {
    user: smtp.USERNAME,
    pass: smtp.PASSWORD,
  },
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  APP_NAME: process.env.APP_NAME,
  PORT: process.env.PORT,
  APP_DOMAIN: process.env.APP_DOMAIN,
  SMTP: {
    options: smtp,
    transporter: transport,
  },
  REDIS_CLIENT: redisClient,
};

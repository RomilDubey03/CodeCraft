import redis from "redis";
import dotenv from 'dotenv';

dotenv.config({ 
    path: "./.env"
}); // if giving prob try "./.env"


export const redisClient = redis.createClient({
    username: 'default',
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host: 'redis-15809.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15809
    }
});




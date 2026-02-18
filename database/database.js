import { DB_URI, NODE_ENV } from "../config/env.js";
import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);


const clientOptions = { serverApi
        : { version: '1', strict: true, deprecationErrors: true } };

if (!DB_URI) {
    throw new Error('Please provide a valid DB_URI, Inside .env<development/production>.local');
}
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI, clientOptions);
        console.log(`Connected to database in ${NODE_ENV} mode`);
    }
    catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
    }
}

export default connectToDatabase;



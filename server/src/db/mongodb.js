// Here we are fabricating connectDB for mongoose

// imports
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';


// defined
const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected on ${connectionInstance.connection.host}`);
    
        mongoose.connection.on('error', (err) => console.error("MongoDB runtime error: ", err));
        mongoose.connection.on('disconnected', () => console.warn("MongoDB disconnected "));
    } catch (error) {
        console.error("Initiaal MONGODB connection FAILED", error);
        process.exit(1);
    }
}


// main
export default connectDB


import { error } from "console";
import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        // mongoose.connect(process.env.MONGO_URI as string)

        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        })

        connection.on("error", (error) => {
            console.log("MongoDB connection error. Please make sure MongoDB is running."+ error);
            process.exit();
        })

    } catch (error) {
        console.log("Error connecting to database", error);
    }
    
}
import mongoose from "mongoose"; // to be able to connect to db

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error:", error);
        
    }
};

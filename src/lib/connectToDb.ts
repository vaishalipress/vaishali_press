import mongoose from "mongoose";

const CONNECT_TO_DB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.DATABASE_URL!
        );
        connectionInstance.Promise = globalThis.Promise;
        console.log(
            `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MongoDB connection failed");
        process.exit(1);
    }
};

export default CONNECT_TO_DB;

import mongoose from "mongoose";

interface dbIsConnected {
  isConnected?: number;
}

const dbisConnected: dbIsConnected = {};

const db = process.env.MONGODB_URI as string;

export const dbConnect = async (): Promise<void> => {
  if (dbisConnected.isConnected) {
    console.log("DB already connected");
    return; // ← prevent multiple connect
  }

  try {
    if (!db) throw new Error("MONGODB_URI not defined");

    const database = await mongoose.connect(db);
    dbisConnected.isConnected = database.connection.readyState;
    console.log("DB connected:", dbisConnected.isConnected);
  } catch (error) {
    console.error("DB connection failed:", error);
    throw error;
  }
};

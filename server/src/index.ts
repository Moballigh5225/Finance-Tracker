import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import financialRecordRouter from "./routes/financial-routers"; // Ensure this path is correct

// Load environment variables from .env file
dotenv.config();

const app: Express = express();

// Middleware setup
app.use(cors());
app.use(express.json());

const MONGO_URI: string | undefined = process.env.URI;
const PORT: string | number = process.env.PORT || 8001;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => {
    console.error("Failed to Connect to MongoDB", err);
    process.exit(1); // Exit process with failure
  });

// Routes setup
app.use("/financial-records", financialRecordRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

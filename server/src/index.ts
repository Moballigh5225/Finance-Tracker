import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import financialRecordRouter from "./routes/financial-routers";

dotenv.config();

const MONGO_URI: string | undefined = process.env.URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

const app: Express = express();
const port: string | number = process.env.PORT || 8001;

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => console.error("Failed to Connect to MongoDB", err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import mongoose from "mongoose";
import initializeRoutes from "./routers/index.js";
import cors from "cors";
import express from "express";

const initialize = (app) => {
  app.use(cors());
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  initializeRoutes(app);
};

export default initialize;

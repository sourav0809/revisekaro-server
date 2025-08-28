import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { notFound } from "./middleware/common.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { envConfig } from "./config/envConfig";
import logger from "./config/logger";
import { PrismaClient } from "@prisma/client";

config();

const app = express();
const PORT = envConfig.port;

// Database
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  logger.info("Database connected");
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Healthy",
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;

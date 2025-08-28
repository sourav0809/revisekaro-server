import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { notFound } from "./middleware/common.middleware";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes/index";

config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Health check
app.use("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Healthy",
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

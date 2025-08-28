/* eslint-disable @typescript-eslint/no-var-requires */
import { Server } from "http";

import app from "./app";
import { envConfig } from "./config/envConfig";
import Logger from "./config/logger";

const server: Server = app.listen(envConfig.server.port, () => {
  Logger.log(
    "info",
    `Server is running at port ${envConfig.server.port} in ${envConfig.server.env} mode`
  );
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      Logger.log("info", {
        message: "Server closed",
      });
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  Logger.log("error", {
    message: "Unexpected error occurred",
    error: error.message,
  });
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  Logger.log("info", {
    message: "SIGTERM received",
  });

  if (server) {
    server.close();
  }
});

process.on("exit", () => {
  Logger.log("info", {
    message: "Server Crashed, restarting...",
  });
  require("child_process").fork(__filename);
});

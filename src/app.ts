import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

const rootDir = path.join(process.cwd());

dotenv.config({ path: "./.env" });

import http, { Server } from "http";
import bodyParser from "body-parser";
// @ts-ignore
import helmet from "helmet";
import cookieParser from "cookie-parser"

import { env } from "./config";

env.ROOT_DIR = rootDir;

import initializeDB from "./utilities/database/sequelize";
import routes from "./routes";
import swagger from "./Swagger";
import LogService from "./services/Log/Log.service";


const app: Application = express();
const httpServer: Server = new http.Server(app);

/**
 * Middleware
 */
app.use(helmet());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(cookieParser());

// app.use(compression());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/profiles", express.static("profiles"));
app.use("/public", express.static("public"));

app.set("view engine", "pug");
app.set("views", "./views");

import ServerResponse from "./utilities/response/Response";

initializeDB().then(() => {});

/**
 * Routes
 */
routes(app);

/**
 * Swagger
 */

if (env.SWAGGER_ENABLED) {
  swagger(app);
}

/**
 * Global Error Handler
 */
// app.use(errorHandler);

app.use("/", (req, res) => {
  const startTime = new Date();
  try {
    ServerResponse(
      req,
      res,
      404,
      null,
      `Endpoint '${req.url}' not found`,
      startTime
    );
  } catch (e) {
    LogService.LogError(e, startTime);
  }
});

httpServer.listen(env.PORT, () => {
  LogService.LogInfo(`Server Running on port ${env.PORT}`);
});

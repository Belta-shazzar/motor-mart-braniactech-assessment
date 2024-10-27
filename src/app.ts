import "reflect-metadata";
import express from "express";
import { Routes } from "@/interfaces/routes.interface";
import config from "@/config";
import prisma from "@/config/prisma";
import morgan from "morgan";
import cors from "cors";
import { logger, stream } from "@utils/logger";
import { HttpException } from "@/exceptions/http.exception";
import hpp from "hpp";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import httpStatus from "http-status";
import ErrorMiddleware from "@/middlewares/error.middleware";
import ResponseInterceptor from "@/middlewares/transform-response.middleware";

export class App {
  private app: express.Application;
  private env: string;
  private port: number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = config.app.node_env;
    this.port = config.app.port;

    this.initializeMiddleware();
    this.initializeResponseTransform();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    prisma
      .$connect()
      .then(() => {
        logger.info("🟢 Database connection successful");
        this.app.listen(this.port, () => {
          logger.info(`======= ENV: ${this.env} ========`);
          logger.info(`🚀 App listening on the port ${this.port}`);
        });
      })
      .catch((error) => {
        logger.error("An error occurred: %s", error.message, { error });
      });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddleware() {
    this.app.use(morgan("common", { stream }));
    this.app.use(
      cors({ origin: config.cors.origin, credentials: config.cors.credentials })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next) => {
          next(
            new HttpException(
              httpStatus.TOO_MANY_REQUESTS,
              `Rate limit exceeded for IP: ${req.ip}`
            )
          );
        },
      })
    );
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });

    this.app.use((req, res, next) => {
      throw new HttpException(httpStatus.NOT_FOUND, "URL not Found");
    });
  }

  private initializeResponseTransform() {
    this.app.use(ResponseInterceptor);
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}

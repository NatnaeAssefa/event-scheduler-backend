import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import LogService from "../services/Log/Log.service";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Boingo",
    version: "0.1.0",
    description: "",
  },
  servers: [
    {
      url: "/",
      description: "Local Dev",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
};

export default (app: Application) => {
  const specs = swaggerJsdoc(options);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
      specs,
      {
        swaggerOptions: {
          docExpansion: "none",
          tagsSorter: (a: string, b: string) => a.localeCompare(b),
          tryItOutEnabled: true,
        },
      },
      {}
    )
  );
  LogService.LogInfo("Swagger Initialized");
};

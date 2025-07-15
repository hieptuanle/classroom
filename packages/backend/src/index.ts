import "dotenv/config";
import bodyParser from "body-parser";
import config from "config";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { setDefaultEnv } from "@backend/libs/config";
import logger, { stream } from "@backend/libs/logger";
import routes from "@backend/routes";

setDefaultEnv();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Classroom API",
    version: "1.0.0",
    description: "API documentation for the Classroom backend.",
  },
  servers: [
    {
      url: `http://localhost:${config.get("server.port") || 4000}`,
      description: "Development server",
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"], // Adjust as needed
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan("dev", { stream }));
app.use("/api/v1/", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = config.get("server.port") || 4000;
app.listen(port);
logger.info(`🚀 Node + Express REST API skeleton server started on port: ${port}`);

export default app;

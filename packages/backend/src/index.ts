import "dotenv/config";
import bodyParser from "body-parser";
import config from "config";
import express from "express";
import morgan from "morgan";

import { setDefaultEnv } from "@backend/libs/config";
import logger, { stream } from "@backend/libs/logger";
import routes from "@backend/routes";

setDefaultEnv();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev", { stream }));
app.use("/api/v1/", routes);

const port = config.get("server.port") || 4000;
app.listen(port);
logger.info(`🚀 Node + Express REST API skeleton server started on port: ${port}`);

export default app;

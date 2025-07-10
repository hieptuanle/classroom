import express from "express";

import { register, authenticate } from "@backend/controllers/auth/index.js";
import { sendSuccess } from "@backend/helpers/response.js";

const routes = express.Router();

routes.get("/", (_req, res) => {
  sendSuccess(res, { message: "Hello World auth" });
});

routes.route("/register").post(register);

routes.route("/login").post(authenticate);

export default routes;

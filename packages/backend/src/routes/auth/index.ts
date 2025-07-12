import express from "express";

import { login, register } from "@backend/controllers/auth/index";
import { sendSuccess } from "@backend/helpers/response";

const routes = express.Router();

routes.get("/", (_req, res) => {
  sendSuccess(res, { message: "Hello World auth" });
});

routes.route("/register").post(register);

routes.route("/login").post(login);

export default routes;

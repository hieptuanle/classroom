import express from "express";

import auth from "./auth/index.js";
// import users from './users';
import { setHeadersForCORS } from "../helpers/response";

const routes = express.Router();

routes.use(setHeadersForCORS);

routes.use("/auth", auth);
// routes.use('/users', users);

routes.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World" });
});

routes.use(function (_req, res) {
  res.status(404).json({ message: "Not Found" });
});

export default routes;

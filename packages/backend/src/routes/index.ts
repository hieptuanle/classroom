import express from "express";

// import users from './users';
import { setHeadersForCORS } from "../helpers/response";
import auth from "./auth/index.js";

const routes = express.Router();

routes.use(setHeadersForCORS);

routes.use("/auth", auth);
// routes.use('/users', users);

routes.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World" });
});

routes.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default routes;

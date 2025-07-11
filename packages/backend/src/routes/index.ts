import express from "express";

// import users from './users';
import { setHeadersForCORS } from "../helpers/response";
import assignmentRoutes from "./assignment/index";
import authRoutes from "./auth/index";
import classRoutes from "./class/index";

const routes = express.Router();

routes.use(setHeadersForCORS);

routes.use("/auth", authRoutes);
routes.use("/classes", classRoutes);
routes.use("/assignments", assignmentRoutes);
// routes.use('/users', users);

routes.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World" });
});

routes.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default routes;

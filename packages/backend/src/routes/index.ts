import express from "express";

import { setHeadersForCORS } from "@backend/helpers/response";
import assignmentRoutes from "@backend/routes/assignment/index";
import authRoutes from "@backend/routes/auth/index";
import classRoutes from "@backend/routes/class/index";
import userRoutes from "@backend/routes/user/index";

const routes = express.Router();

routes.use(setHeadersForCORS);

routes.use("/auth", authRoutes);
routes.use("/classes", classRoutes);
routes.use("/assignments", assignmentRoutes);
routes.use("/users", userRoutes);

routes.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World" });
});

routes.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default routes;

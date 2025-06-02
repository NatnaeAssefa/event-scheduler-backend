import express from "express";
import userRoutes from "./User.routes";

const routes = () => {
  const router = express.Router();

  router.use("/users", userRoutes());

  return router;
};

export default routes;

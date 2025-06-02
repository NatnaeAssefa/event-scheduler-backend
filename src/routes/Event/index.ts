import express from "express";
import eventRoutes from './Event.routes'

const routes = () => {
  const router = express.Router();


  router.use("/event", eventRoutes());

  return router;
};

export default routes;

import { Application } from "express";

import authRoutes from "./Auth";
import userRoutes from "./User";
import eventRoutes from "./Event";

let routes = (app: Application) => {
  app.use(authRoutes());
  app.use(userRoutes());
  app.use(eventRoutes());


  /**
   * @swagger
   * tags:
   *   name: Test
   *   description: Test APIs
   */

  app.get("/", (req, res) => {
    res.status(200).json({
      status: 200,
      data: { name: "Event Scheduler API", version: "1.0.0" },
      message: "Success",
    });
  });

};

export default routes;

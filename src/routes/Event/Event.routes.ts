import { AuthenticateUser } from "../../middleware/Auth/Auth";
import { EventController } from "../../controllers/Event";


import express from "express";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Event
   *   description: Event management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /Events/get:
   *   get:
   *     summary: Fetch a Event
   *     tags: [Event]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/get",
    AuthenticateUser,
    // AuthorizeAccess(["read_user"]),
    EventController.getEvent
  );


  /**
   * @swagger
   * /Events/{id}:
   *   get:
   *     summary: Fetch Event by ID
   *     tags: [Event]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Event ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: Event Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    // AuthorizeAccess(["read_user"]),
    EventController.getEvent
  );

  /**
   * @swagger
   * /Events:
   *   get:
   *     summary: Fetch Events
   *     tags: [Event]
   *     parameters:
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   */
  router.get(
    "/",
    AuthenticateUser,
    // AuthorizeAccess(["read_user"]),
    EventController.getEvents
  );

  /**
   * @swagger
   * /Events/create:
   *   post:
   *     summary: Create Event
   *     tags: [Event]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    // AuthorizeAccess(["write_user"]),
    EventController.createEvent
  );



  /**
   * @swagger
   * /Events:
   *   put:
   *     summary: Update Event
   *     tags: [Event]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    // AuthorizeAccess(["write_user"]),
    EventController.updateEvent
  );



  /**
   * @swagger
   * /Events:
   *   delete:
   *     summary: Delete Event
   *     tags: [Event]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Event Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    // AuthorizeAccess(["delete_user"]),
    EventController.deleteEvent
  );


  return router;
};

export default routes;

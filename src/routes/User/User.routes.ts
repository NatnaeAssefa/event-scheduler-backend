import express from "express";
import { UserController } from "../../controllers/User";
import { AuthenticateUser } from "../../middleware/Auth/Auth";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User management APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /users/get:
   *   get:
   *     summary: Fetch a User
   *     tags: [User]
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
    UserController.findOne
  );

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Fetch User by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID
   *       - in: query
   *         name: query
   *         description: query
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Input Validation Error
   *       404:
   *         description: User Not Found
   */
  router.get(
    "/:id",
    AuthenticateUser,
    UserController.findById
  );

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Fetch Users
   *     tags: [User]
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
    UserController.findMany
  );

  /**
   * @swagger
   * /users/create:
   *   post:
   *     summary: Create User
   *     tags: [User]
   *     responses:
   *       201:
   *         description: Success
   */
  router.post(
    "/",
    AuthenticateUser,
    UserController.create
  );

  /**
   * @swagger
   * /users/revoke_token:
   *   patch:
   *     summary: Revoke User Token
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   */
  router.patch(
    "/revoke_token",
    AuthenticateUser,
    UserController.revokeToken
  );

  /**
   * @swagger
   * /users/change_password:
   *   patch:
   *     summary: Change User Token
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   */
  router.patch(
    "/change_password",
    AuthenticateUser,
    UserController.changeUserPassword
  );

  /**
   * @swagger
   * /users:
   *   put:
   *     summary: Update User
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put(
    "/",
    AuthenticateUser,
    UserController.update
  );

  /**
   * @swagger
   * /users/me:
   *   put:
   *     summary: Update User (self)
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   */
  router.put("/me", AuthenticateUser, UserController.updateMe);

  /**
   * @swagger
   * /users/restore:
   *   patch:
   *     summary: Restore User
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: User Not Found
   */
  router.patch(
    "/restore",
    AuthenticateUser,
    UserController.restore
  );

  /**
   * @swagger
   * /users:
   *   delete:
   *     summary: Delete User
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: User Not Found
   */
  router.delete(
    "/",
    AuthenticateUser,
    UserController.delete
  );



  router.post(
    "/filter",
    AuthenticateUser,
    UserController.filterUsers
  );


  return router;
};

export default routes;

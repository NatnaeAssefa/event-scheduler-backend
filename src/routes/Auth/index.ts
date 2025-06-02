import express from "express";
import { UserController } from "../../controllers/User";
import { AuthenticateUser } from "../../middleware/Auth/Auth";
import passport from "passport";
import FacebookTokenStrategy from "passport-facebook-token";
import { FacebookUserProfile } from "../../utilities/constants/Constants";
import { env } from "../../config";

const routes = () => {
  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Auth APIs
   */

  const router = express.Router();

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: User Login
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   */
  router.post("/auth/login", UserController.login);

  /**
   * @swagger
   * /auth:
   *   get:
   *     summary: Get Token User
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   */
  router.get("/auth", AuthenticateUser, UserController.getMe);

  /**
   * @swagger
   * /auth/callback:
   *   post:
   *     summary: Get Token From Google Auth
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   *       400:
   *         description: Bad Request
   */
  router.post("/auth/callback", UserController.googleAuth);

  // Facebook Token Strategy
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: env.FACEBOOK_APP_ID,
        clientSecret: env.FACEBOOK_APP_SECRET,
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: FacebookUserProfile) => void
      ) => {
        console.log("User Profile:", profile);
        const user: FacebookUserProfile = {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
        };
        return done(null, user);
      }
    )
  );
  /**
   * @swagger
   * /auth/callback:
   *   post:
   *     summary: Get Token From Facebook Auth
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   *       400:
   *         description: Bad Request
   */
  router.post(
    "/auth/callback/facebook",
    passport.authenticate("code"),
    UserController.facebookAuth
  );

  /**
   * @swagger
   * /auth/change_password:
   *   post:
   *     summary: Change User Password
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   */
  router.post(
    "/auth/change_password",
    AuthenticateUser,
    UserController.changePassword
  );

  /**
   * @swagger
   * /auth/forgot_password:
   *   post:
   *     summary: Change User Password
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       401:
   *         description: Invalid Credentials
   */
  router.post("/auth/forgot_password", UserController.forgotPassword);

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad Request
   */
  router.post("/auth/register", UserController.register);

  /**
   * @swagger
   * /auth/verify:
   *   get:
   *     summary: Verify
   *     tags: [Auth]
   */
  router.get("/auth/verify", UserController.verify);

  /**
   * @swagger
   * /auth/recover:
   *   get:
   *     summary: Recover password
   *     tags: [Auth]
   */
  router.get("/auth/recover", UserController.recover);

  /**
   * @swagger
   * /auth/recover:
   *   get:
   *     summary: Recover password
   *     tags: [Auth]
   */
  router.post("/auth/recover-input", UserController.submitChangedPassword);

  return router;
};

export default routes;

import { Request, Response } from "express";
import { UserService } from "../../services/User";
import ServerResponse from "../../utilities/response/Response";
import { ParseQuery } from "../../utilities/pagination/Pagination";
import Joi from "joi";
import {
  EmailRegex,
  PasswordRegex,
  PasswordMessage,
  UserType,
  UserStatus,
  PREFERRED_CONTACT_METHOD,
} from "../../utilities/constants/Constants";
import { User } from "../../models/User";
import { Op } from "sequelize";
import { isValid, parse } from "date-fns";
import { env } from "../../config";

const ModelName = "User";

class UserController {
  static findMany(request: any, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query);

    UserService.findMany(request.user, parsedQuery.query, parsedQuery.paranoid)
      .then((result) => {
        ServerResponse(request, response, 200, result, "", startTime);
      })
      .catch((error) => {
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        );
      });
  }

  static findOne(request: any, response: Response) {
    const startTime = new Date();
    let parsedQuery: any = ParseQuery(request.query, ["F", "I", "O", "P"]);

    UserService.findOne(request.user, parsedQuery.query, parsedQuery.paranoid)
      .then((result) => {
        ServerResponse(request, response, 200, result, "", startTime);
      })
      .catch((error) => {
        ServerResponse(
          request,
          response,
          error.statusCode,
          error.payload,
          "Error",
          startTime
        );
      });
  }

  static findById(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
    });

    const { error } = schema.validate(request.params);

    if (!error) {
      let id: string = request.params.id;
      let parsedQuery: any = ParseQuery(request.query, ["I", "P"]);
      UserService.findById(
        request.user,
        id,
        parsedQuery.query,
        parsedQuery.paranoid
      )
        .then((result) => {
          if (result) {
            ServerResponse(request, response, 200, result, "", startTime);
          } else {
            ServerResponse(
              request,
              response,
              404,
              null,
              `${ModelName} Not Found`,
              startTime
            );
          }
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
      return;
    }
  }

  static async register(request: any, response: Response) {
    try {
      const startTime = new Date();
      const schema = Joi.object({
        first_name: Joi.string().required().trim(),
        last_name: Joi.string().required().trim(),
        email: Joi.string()
          .pattern(new RegExp(EmailRegex))
          .message("Invalid Email Address")
          .required(),
        phone_number: Joi.string()
          .pattern(/^\+[1-9]\d{7,14}$/)
          .message("Invalid Phone Number")
          .optional(),
        whatsapp_number: Joi.string()
          .pattern(/^\+[1-9]\d{7,14}$/)
          .message("Invalid Phone Number")
          .optional(),
        password: Joi.string()
          .regex(PasswordRegex)
          .message(PasswordMessage)
          .required(),
        code: Joi.string().optional(),
        role_id: Joi.string().guid().optional(),
        preferred_contact_method: Joi.string().trim().valid(...Object.values(PREFERRED_CONTACT_METHOD)).optional(),
      });

      const { error } = schema.validate(request.body, { abortEarly: false });

      if (error) {
        return ServerResponse(
          request, response, 400,
          { details: error.details },
          "Input validation error",
          startTime
        );
      }

      const data: any = request.body;
      const { code, ...rest } = data;

      // Check if referral code exists in cookies
      const referralCode = code;

      try {

        // Step 1: Register user
        const result = await UserService.register(rest);

        // Step 4: Send success response
        ServerResponse(request, response, 201, result, "Success", startTime);
      } catch (error) {
        // Handle user registration failure
        ServerResponse(request, response, 500, error, "Error", startTime);
      }
    } catch (error) {
      ServerResponse(request, response, 500, error, "Error", new Date());
    }
  }

  static create(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      first_name: Joi.string().required().trim(),
      last_name: Joi.string().required().trim(),
      email: Joi.string()
        .pattern(new RegExp(EmailRegex))
        .message("Invalid Email Address")
        .required(),
      phone_number: Joi.string().allow(null).optional(),
      password: Joi.string()
        .regex(PasswordRegex)
        .message(PasswordMessage)
        .required(),
      status: Joi.string()
        .valid(...Object.values(UserStatus))
        .optional(),
      type: Joi.string()
        .valid(...Object.values(UserType))
        .optional(),
      role_id: Joi.string().guid().allow(null).optional(),
      preferred_contact_method: Joi.string().trim().valid(...Object.values(PREFERRED_CONTACT_METHOD)).optional(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      const user: User = request.user;
      UserService.create(user, data)
        .then((result) => {
          ServerResponse(request, response, 201, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static getMe(request: any, response: Response) {
    const startTime = new Date();
    ServerResponse(request, response, 200, request.user, "Success", startTime);
  }

  static googleAuth(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      code: Joi.string().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      UserService.verifyGoogle(data.code)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static facebookAuth(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      code: Joi.string().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      UserService.verifyFacebook(request.user)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static verify(request: any, response: Response) {
    const startTime = new Date();
    let email = request.query.email || "test@email.com";
    let code = request.query.code || "test code";

    UserService.verify(email, code)
      .then((user) => {
        ServerResponse(
          request,
          response,
          200,
          {
            name: user.first_name,
            homeUrl: env.FRONTEND_URL,
          },
          "verify_success",
          startTime,
          "view"
        );
      })
      .catch((error) => {
        ServerResponse(
          request,
          response,
          error.statusCode,
          {
            messages: error.payload.errors ?? ["Failed To Verify"],
            homeUrl: env.FRONTEND_URL,
          },
          "error",
          startTime,
          "view"
        );
      });
  }

  static recover(request: any, response: Response) {
    const startTime = new Date();
    let email = request.query.email || "test@email.com";
    let code = request.query.code || "test code";

    UserService.recover(email, code)
      .then((result) => {
        ServerResponse(
          request,
          response,
          200,
          {
            email: result.email,
            code: result.code,
          },
          "recover_input",
          startTime,
          "view"
        );
      })
      .catch((error) => {
        ServerResponse(
          request,
          response,
          error.statusCode,
          {
            messages: error.payload.errors ?? ["Failed To Verify"],
            homeUrl: env.FRONTEND_URL,
          },
          "error",
          startTime,
          "view"
        );
      });
  }

  static submitChangedPassword(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      email: Joi.string().email().required(),
      code: Joi.string().required(),
      password: Joi.string()
        .regex(PasswordRegex)
        .message(PasswordMessage)
        .required(),
      confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;

      UserService.changePasswordOnRecovery(data.email, data.code, data.password)
        .then((user) => {
          ServerResponse(
            request,
            response,
            200,
            {
              name: user.first_name,
              homeUrl: env.FRONTEND_URL,
            },
            "recover_success",
            startTime,
            "view"
          );
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            {
              messages: error.payload.errors ?? ["Failed To Verify"],
            },
            "recover_input",
            startTime,
            "view"
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        {
          email: request.body.email ?? "",
          code: request.body.code ?? "",
          messages: error.details ?? ["Failed to perform action"],
        },
        "recover_input",
        startTime,
        "view"
      );
    }
  }

  static changeUserPassword(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      user_id: Joi.string().guid().required(),
      password: Joi.string()
        .regex(PasswordRegex)
        .message(PasswordMessage)
        .required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      const user: User = request.user;
      UserService.changeUserPassword(user, data.user_id, data.password)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static changePassword(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      previous_password: Joi.string().required(),
      new_password: Joi.string()
        .regex(PasswordRegex)
        .message(PasswordMessage)
        .required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      const user: User = request.user;
      UserService.changePassword(
        user.id,
        data.previous_password,
        data.new_password
      )
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static forgotPassword(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      UserService.forgotPassword(data.email)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static login(request: Request, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      email: Joi.string().email().required().trim(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      UserService.login(data.email, data.password)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static revokeToken(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      user_id: Joi.string().guid().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      const user: User = request.user;
      UserService.revokeTokens(user, data["user_id"])
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static update(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      first_name: Joi.string().trim().optional(),
      last_name: Joi.string().trim().optional(),
      email: Joi.string()
        .pattern(new RegExp(EmailRegex))
        .message("Invalid Email Address")
        .optional(),
      phone_number: Joi.string().allow(null).optional(),
      whatsapp_number: Joi.string().allow(null).optional(),
      status: Joi.string()
        .valid(...Object.values(UserStatus))
        .optional(),
      type: Joi.string()
        .valid(...Object.values(UserType))
        .optional(),
      role_id: Joi.string().guid().allow(null).optional(),
      preferred_contact_method: Joi.string().trim().valid(...Object.values(PREFERRED_CONTACT_METHOD)).optional(),
      pref_language: Joi.string().optional(),
      pref_currency: Joi.string().optional(),
      pref_unit: Joi.string().optional(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const id: string = request.body.id;
      const data: any = request.body;
      const user: User = request.user;
      UserService.update(user, id, data)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static updateMe(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      first_name: Joi.string().trim().optional(),
      last_name: Joi.string().trim().optional(),
      phone_number: Joi.string().allow(null).optional(),
      whatsapp_number: Joi.string().allow(null).optional(),
      preferred_contact_method: Joi.string().trim().valid(...Object.values(PREFERRED_CONTACT_METHOD)).optional(),
      pref_language: Joi.string().optional(),
      pref_currency: Joi.string().optional(),
      pref_unit: Joi.string().optional(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const data: any = request.body;
      const user: User = request.user;
      UserService.update(user, user.id, data)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static delete(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
      force: Joi.boolean(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const id: string = request.body.id;
      const force: boolean = request.body.force ?? false;
      const user: User = request.user;
      UserService.delete(user, id, null, force)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }

  static restore(request: any, response: Response) {
    const startTime = new Date();
    const schema = Joi.object({
      id: Joi.string().guid().required(),
    });

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (!error) {
      const id: string = request.body.id;
      const user: User = request.user;
      UserService.restore(user, id)
        .then((result) => {
          ServerResponse(request, response, 200, result, "Success", startTime);
        })
        .catch((error) => {
          ServerResponse(
            request,
            response,
            error.statusCode,
            error.payload,
            "Error",
            startTime
          );
        });
    } else {
      ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }
  }


  static async filterUsers(request: any, response: Response) {
    const startTime = new Date();

    // Joi schema for validation
    const schema = Joi.object({
      from: Joi.string().pattern(/^(\d{2} (\d{2}|\w+) \d{4})$/).optional(),
      to: Joi.string().pattern(/^(\d{2} (\d{2}|\w+) \d{4})$/).optional(),
      role_id: Joi.string().optional(), // Adjust roles as needed
      status: Joi.string().valid(...Object.values(UserStatus)).optional(), // Adjust statuses as needed
    });

    const { error } = schema.validate(request.body, { abortEarly: false });
    if (error) {
      return ServerResponse(
        request,
        response,
        400,
        { details: error.details },
        "Input validation error",
        startTime
      );
    }

    try {
      const { from, to, role_id, status } = request.body;
      const user: User = request.user;
      let parsedQuery: any = ParseQuery(request.query);

      // Function to parse date from different formats
      const parseDate = (dateString: string) => {
        const formats = ["dd MM yyyy", "dd MMMM yyyy"];
        for (const format of formats) {
          const parsedDate = parse(dateString, format, new Date());
          if (isValid(parsedDate)) return parsedDate;
        }
        return null;
      };

      let whereClause: any = {};

      const fromDate = from ? parseDate(from) : null;
      const toDate = to ? parseDate(to) : null;

      if ((from && !fromDate) || (to && !toDate)) {
        return ServerResponse(
          request,
          response,
          400,
          {
            message:
              "Invalid date format. Use 'dd MM yyyy' (e.g., '17 12 2024') or 'dd MMMM yyyy' (e.g., '17 December 2024').",
          },
          "Date parsing error",
          startTime
        );
      }

      if (fromDate && toDate) {
        whereClause.createdAt = { [Op.between]: [fromDate, toDate] };
      } else if (fromDate) {
        whereClause.createdAt = { [Op.gte]: fromDate };
      } else if (toDate) {
        whereClause.createdAt = { [Op.lte]: toDate };
      }

      if (role_id) whereClause.role_id = role_id;
      if (status) whereClause.status = status;

      parsedQuery.query.where = {
        ...parsedQuery.query.where,
        ...whereClause
      }

      const users = await UserService.findMany(user, parsedQuery.query, parsedQuery.paranoid);

      return ServerResponse(request, response, 200, users, "", startTime);
    } catch (error) {
      return ServerResponse(
        request,
        response,
        500,
        { details: error },
        "Internal Server Error!",
        startTime
      );
    }
  }
}

export default UserController;
import { UserDAL } from "../../dals/User";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { UserStatus, UserType } from "../../utilities/constants/Constants";
import { User } from "../../models/User";
import { UnauthorizedError } from "../../errors/Errors";
import ServerResponse from "../../utilities/response/Response";
import { Op } from "sequelize";

export const VerifyJWT = (auth: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!auth || auth.split(" ").length !== 2) {
      return reject(new UnauthorizedError("Invalid Authorization Header"));
    }
    const token = auth.split(" ")[1];
    jwt.verify(token, env.AUTH_KEY, function (err: any, decoded: any) {
      if (err) {
        reject(new UnauthorizedError("Invalid Token"));
      } else {
        resolve(decoded);
      }
    });
  });
};

export const AuthenticateUser = (req: any, res: any, next: any) => {
  try {
    const startTime = new Date();
    const token = req.headers["authorization"];
    VerifyJWT(token)
      .then((data) => {
        UserDAL.findOne({
          where: {
            id: data.id,
          },
        })
          .then((user) => {
            if (user) {
              if (user.status === UserStatus.ACTIVE) {
                if (user.last_used_key === data.key) {
                  let userData = user.toJSON();
                  delete userData.password; // TODO use attribute exclude
                  delete userData.last_used_key;
                  req.user = userData;
                  next();
                } else {
                  ServerResponse(
                    req,
                    res,
                    401,
                    ["Token has been revoked!"],
                    "Revoked Token",
                    startTime
                  );
                }
              } else {
                ServerResponse(
                  req,
                  res,
                  401,
                  [
                    "User account has been deactivated! Please contact System Administrators",
                  ],
                  "User Inactive",
                  startTime
                );
              }
            } else {
              ServerResponse(req, res, 401, null, "Invalid Token", startTime);
            }
          })
          .catch((error) => {
            ServerResponse(req, res, 401, error, "Invalid Token", startTime);
          });
      })
      .catch((error) => {
        ServerResponse(req, res, 401, error, "Authorization Error", startTime);
      });
  } catch (e) {
    res
      .status(500)
      .send({ status: 500, data: null, message: "Internal Server Error" });
  }
};

export const AuthenticatePossibleUser = (req: any, res: any, next: any) => {
  try {
    const startTime = new Date();
    const token = req.headers["authorization"];
    if (token) {
      VerifyJWT(token)
        .then((data) => {
          UserDAL.findOne({
            where: {
              id: data.id,
            },
          })
            .then((user) => {
              if (user) {
                if (user.status === UserStatus.ACTIVE) {
                  if (user.last_used_key === data.key) {
                    let userData = user.toJSON();
                    delete userData.password; // TODO use attribute exclude
                    delete userData.last_used_key;
                    req.user = userData;
                    next();
                  } else {
                    ServerResponse(
                      req,
                      res,
                      401,
                      ["Token has been revoked!"],
                      "Revoked Token",
                      startTime
                    );
                  }
                } else {
                  ServerResponse(
                    req,
                    res,
                    401,
                    [
                      "User account has been deactivated! Please contact System Administrators",
                    ],
                    "User Inactive",
                    startTime
                  );
                }
              } else {
                ServerResponse(req, res, 401, null, "Invalid Token", startTime);
              }
            })
            .catch((error) => {
              ServerResponse(req, res, 401, error, "Invalid Token", startTime);
            });
        })
        .catch((error) => {
          ServerResponse(
            req,
            res,
            401,
            error,
            "Authorization Error",
            startTime
          );
        });
    } else {
      next();
    }
  } catch (e) {
    res
      .status(500)
      .send({ status: 500, data: null, message: "Internal Server Error" });
  }
};

export const VerifyAccess = (access_rules: string[], role?: any): boolean => {
  try {
    if (!role) return false;
    
    for (let access_rule of access_rules) {
      if (role.access_rules.indexOf(access_rule) === -1) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const GlobalAuthOptions = (
  user: User,
  options: any,
  include: any,
  paranoid?: boolean
) => {
  include = user.type !== UserType.SYSTEM ? include : null;
  if (include) {
    options.include = options.include
      ? [...options.include, include]
      : [include];
  }

  if (include) {
    options.include = options.include
      ? [...options.include, include]
      : [include];
  }

  if (paranoid) {
    paranoid = VerifyAccess(["access_paranoid"]);
  }

  return { options: options, paranoid: paranoid ?? false };
};

export const GlobalAuthOptionsNew = (
  user: User,
  options: any,
  include: any,
  where?: any,
  paranoid?: boolean
) => {
  if (!options) {
    options = {};
  }

  if (!user) {
    if (!paranoid) {
      return { options: options, paranoid: false };
    }
    return { options: options, paranoid: true };
  }

  include = user.type !== UserType.SYSTEM ? include : null;
  if (include) {
    options.include = options.include
      ? [...options.include, include]
      : [include];
  }

  where = user.type !== UserType.SYSTEM ? where : null;
  if (where) {
    options.where = options.where
      ? {
        [Op.and]: [options.where, where],
      }
      : where;
  }

  if (!paranoid) {
    return { options: options, paranoid: !VerifyAccess(["access_paranoid"]) };
  }

  return { options: options, paranoid: true };
};

export const OptionalAuthenticateUser = (req: any, res: any, next: any) => {
  const startTime = new Date();
  const token = req.headers["authorization"];

  if (!token) {
    req.user = null;
    return next();
  }

  VerifyJWT(token)
    .then((data) => {
      UserDAL.findOne({
        where: { id: data.id },
      })
        .then((user) => {
          if (user && user.status === UserStatus.ACTIVE && user.last_used_key === data.key) {
            req.user = user.toJSON();
            delete req.user.password;
            delete req.user.last_used_key;
            return next();
          }

          const errorMsg = user ? "Token has been revoked!" : "User account is inactive!";
          return ServerResponse(req, res, 401, [errorMsg], "Unauthorized", startTime);
        })
        .catch(() => {
          req.user = null;
          return next();
        });
    })
    .catch(() => {
      req.user = null;
      return next();
    });
};

export default { AuthenticateUser };

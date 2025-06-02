import { Request, Response, NextFunction } from "express";
import LogService from "../services/Log/Log.service";

// Custom error handling middleware
function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  LogService.LogError(error, new Date());
  // Handle the error and send an appropriate response
  if (error["status"] && error["status"].toString().trim() === "401") {
    res.status(401).json(error);
  } else if (error["status"] && error["status"].toString().trim() === "403") {
    res.status(403).json(error);
  } else if (error.message) {
    res
      .status(400)
      .json({ statusCode: 400, error: error, message: error.message });
  } else {
    res.status(500).json({
      statusCode: 500,
      error: error,
      message: "Internal Server Error",
    });
  }
  // Call the next middleware
  next();
}

export default errorHandler;

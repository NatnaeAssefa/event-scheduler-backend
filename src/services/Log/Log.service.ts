import { LogTypes } from "../../utilities/constants/Constants";
import { logger } from "../../utilities/logger/logger";
import TelegramBot from "../../utilities/telegram/telegram";

export const RequestAttributes = [
  "url",
  "method",
  "headers",
  "params",
  "query",
  "body",
];
export const ResponseAttributes = ["statusCode", "statusMessage", "headers"];

export function filter(obj: any, attributes: string[]) {
  const data: any = {};
  for (const key of attributes) {
    if (obj[key]) {
      data[key] = obj[key];
    }
  }
  return data;
}

class LogService {
  public static Log = (type: string, payload: any) => {
    if (type === LogTypes.ERROR) {
      logger.error(JSON.stringify(payload));
    } else {
      logger.info(JSON.stringify(payload));
    }
  };

  public static LogRequest = (
    req: any,
    res: any,
    start_time: Date,
    end_time: Date
  ) => {
    LogService.Log(LogTypes.REQUEST, {
      request: filter(req, RequestAttributes),
      response: filter(res, ResponseAttributes),
      start_time,
      end_time,
    });
  };

  public static LogRequestError = (error: any, req: any, time = new Date()) => {
    LogService.Log(LogTypes.ERROR, {
      request: req,
      error: error,
      time,
    });
  };

  public static LogError = (error: any, time = new Date()) => {
    LogService.Log(LogTypes.ERROR, { error: error, time });
    (async () => {
      // Send the message using the static method
      await TelegramBot.sendJsonMessage({ error: error, time });
    })();
  };

  public static LogInfo = (info: any) => {
    LogService.Log(LogTypes.INFO, info);
  };

  public static LogAction = (
    action: any,
    model: string,
    payload: any,
    time: Date
  ) => {
    LogService.Log(LogTypes.ACTION, {
      action: action,
      payload,
      time,
    });
  };
}
export default LogService;

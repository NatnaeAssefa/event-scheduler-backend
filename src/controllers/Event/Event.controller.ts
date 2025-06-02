import { Request, Response } from "express";
import { EventService } from "../../services/Event";
import ServerResponse from "../../utilities/response/Response";
import LogService from "../../services/Log/Log.service";



export class EventController {
  static createEvent = async (req: any, res: Response) => {
    const startTime = new Date();
    try {
      const eventData: Partial<Event> = {
        ...req.body,
        user_id: req.user.id,
      };

      const event = await EventService.createEvent(eventData as any);
      ServerResponse(req, res, 201, event, "Event created successfully", startTime);
    } catch (error) {
      LogService.LogError(error, startTime);
      ServerResponse(req, res, 500, null, "Error creating event", startTime);
    }
  };

  static getEvent = async (req: any, res: Response) => {
    const startTime = new Date();
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);

      if (!event) {
        return ServerResponse(req, res, 404, null, "Event not found", startTime);
      }

      if (event.user_id !== req.user.id) {
        return ServerResponse(req, res, 403, null, "Access denied", startTime);
      }

      ServerResponse(req, res, 200, event, "Event retrieved successfully", startTime);
    } catch (error) {
      LogService.LogError(error, startTime);
      ServerResponse(req, res, 500, null, "Error retrieving event", startTime);
    }
  };

  static getEvents = async (req: any, res: Response) => {
    const startTime = new Date();
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return ServerResponse(
          req,
          res,
          400,
          null,
          "Start date and end date are required",
          startTime
        );
      }

      const events = await EventService.getEventsByUserId(
        req.user.id,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      ServerResponse(req, res, 200, events, "Events retrieved successfully", startTime);
    } catch (error) {
      LogService.LogError(error, startTime);
      ServerResponse(req, res, 500, null, "Error retrieving events", startTime);
    }
  };

  static updateEvent = async (req: any, res: Response) => {
    const startTime = new Date();
    try {
      const { id } = req.body;
      if (!id) {
        return ServerResponse(req, res, 400, null, "Event ID is required", startTime);
      }

      const event = await EventService.getEventById(id);

      if (!event) {
        return ServerResponse(req, res, 404, null, "Event not found", startTime);
      }

      if (event.user_id !== req.user.id) {
        return ServerResponse(req, res, 403, null, "Access denied", startTime);
      }

      const { id: _, ...updateData } = req.body;
      const updatedEvent = await EventService.updateEvent(id, updateData);
      ServerResponse(req, res, 200, updatedEvent, "Event updated successfully", startTime);
    } catch (error) {
      LogService.LogError(error, startTime);
      ServerResponse(req, res, 500, null, "Error updating event", startTime);
    }
  };

  static deleteEvent = async (req: any, res: Response) => {
    const startTime = new Date();
    try {
      const { id } = req.body;
      if (!id) {
        return ServerResponse(req, res, 400, null, "Event ID is required", startTime);
      }

      const event = await EventService.getEventById(id);

      if (!event) {
        return ServerResponse(req, res, 404, null, "Event not found", startTime);
      }

      if (event.user_id !== req.user.id) {
        return ServerResponse(req, res, 403, null, "Access denied", startTime);
      }

      await EventService.deleteEvent(id);
      ServerResponse(req, res, 200, null, "Event deleted successfully", startTime);
    } catch (error) {
      LogService.LogError(error, startTime);
      ServerResponse(req, res, 500, null, "Error deleting event", startTime);
    }
  };
} 
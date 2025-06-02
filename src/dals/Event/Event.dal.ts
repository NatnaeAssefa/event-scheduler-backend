import { Event, RecurrenceFrequency } from "../../models/Event/Event";
import { Op } from "sequelize";

/**
 * Event Data Access Layer (DAL)
 * Handles all database operations for events
 */
export class EventDAL {
  /**
   * Creates a new event in the database
   * @param eventData - The event data to create
   * @returns The created event
   */
  static async create(eventData: Partial<Event>): Promise<Event> {
    return await Event.create(eventData);
  }

  /**
   * Finds an event by its ID
   * @param id - The event ID
   * @returns The found event or null
   */
  static async findById(id: string): Promise<Event | null> {
    return await Event.findByPk(id);
  }

  /**
   * Finds events for a specific user within a date range
   * This method uses a special query to handle both one-time and recurring events:
   * 1. For one-time events: Only returns events that fall within the date range
   * 2. For recurring events: Returns ALL recurring events regardless of their start date
   *    (The service layer will handle expanding these into instances)
   * 
   * @param userId - The user ID to find events for
   * @param startDate - The start of the date range
   * @param endDate - The end of the date range
   * @returns Array of events
   */
  static async findByUserId(userId: string, startDate: Date, endDate: Date): Promise<Event[]> {
    return await Event.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          // One-time events within the date range
          {
            [Op.and]: [
              { recurrence_frequency: RecurrenceFrequency.NONE },
              {
                [Op.or]: [
                  // Events that start within the range
                  {
                    start_date: {
                      [Op.between]: [startDate, endDate],
                    },
                  },
                  // Events that end within the range
                  {
                    end_date: {
                      [Op.between]: [startDate, endDate],
                    },
                  },
                  // Events that span the entire range
                  {
                    [Op.and]: [
                      {
                        start_date: {
                          [Op.lte]: startDate,
                        },
                      },
                      {
                        end_date: {
                          [Op.gte]: endDate,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // All recurring events (they will be expanded in the service layer)
          {
            recurrence_frequency: {
              [Op.ne]: RecurrenceFrequency.NONE,
            },
          },
        ],
      },
      order: [["start_date", "ASC"]],
    });
  }

  /**
   * Updates an event in the database
   * @param id - The event ID to update
   * @param eventData - The new event data
   * @returns Tuple of [number of rows affected, updated events]
   */
  static async update(id: string, eventData: Partial<Event>): Promise<[number, Event[]]> {
    return await Event.update(eventData, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Deletes an event from the database
   * @param id - The event ID to delete
   * @returns Number of rows affected
   */
  static async delete(id: string): Promise<number> {
    return await Event.destroy({
      where: { id },
    });
  }
} 
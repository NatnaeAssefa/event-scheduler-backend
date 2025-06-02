import { Event, RecurrenceFrequency } from "../../models/Event/Event";
import { EventDAL } from "../../dals/Event/Event.dal";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

const MAX_OCCURRENCES = 1000;

export class EventService {
  static async createEvent(eventData: Partial<Event>): Promise<Event> {
    return await EventDAL.create(eventData);
  }

  static async getEventById(id: string): Promise<Event | null> {
    return await EventDAL.findById(id);
  }

  static async getEventsByUserId(userId: string, startDate: Date, endDate: Date): Promise<Event[]> {
    console.log('Fetching events for user:', userId);
    console.log('Date range:', startDate.toISOString(), 'to:', endDate.toISOString());
    
    const events = await EventDAL.findByUserId(userId, startDate, endDate);
    console.log('Found base events:', events.length);
    
    const expandedEvents = this.expandRecurringEvents(events, startDate, endDate);
    console.log('Expanded to recurring events:', expandedEvents.length);
    
    return expandedEvents;
  }

  static async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
    const [count, updatedEvents] = await EventDAL.update(id, eventData);
    return count > 0 ? updatedEvents[0] : null;
  }

  static async deleteEvent(id: string): Promise<void> {
    await EventDAL.delete(id);
  }

  private static expandRecurringEvents(events: Event[], startDate: Date, endDate: Date): Event[] {
    const expandedEvents: Event[] = [];

    for (const event of events) {
      if (event.recurrence_frequency === RecurrenceFrequency.NONE) {
        if (this.isEventInRange(event, startDate, endDate)) {
          expandedEvents.push(event);
        }
        continue;
      }

      console.log('Expanding recurring event:', event.id, event.title);
      const instances = this.generateRecurringInstances(event, startDate, endDate);
      console.log('Generated instances:', instances.length);
      expandedEvents.push(...instances);
    }

    return expandedEvents;
  }

  private static isEventInRange(event: Event, startDate: Date, endDate: Date): boolean {
    return (
      (event.start_date >= startDate && event.start_date <= endDate) ||
      (event.end_date >= startDate && event.end_date <= endDate) ||
      (event.start_date <= startDate && event.end_date >= endDate)
    );
  }

  private static generateRecurringInstances(event: Event, startDate: Date, endDate: Date): Event[] {
    const instances: Event[] = [];
    let currentDate = new Date(event.start_date);
    let count = 0;

    while (
      currentDate <= endDate &&
      (!event.recurrence_count || count < event.recurrence_count) &&
      count < MAX_OCCURRENCES
    ) {
      if (currentDate >= startDate) {
        const instance = this.createEventInstance(event, currentDate);
        instances.push(instance);
      }

      currentDate = this.getNextOccurrence(event, currentDate);
      count++;
    }

    return instances;
  }

  private static createEventInstance(event: Event, date: Date): Event {
    const duration = event.end_date.getTime() - event.start_date.getTime();
    const instance = { ...event.toJSON() };
    instance.start_date = new Date(date);
    instance.end_date = new Date(date.getTime() + duration);
    return instance as Event;
  }

  private static getNextOccurrence(event: Event, currentDate: Date): Date {
    switch (event.recurrence_frequency) {
      case RecurrenceFrequency.DAILY:
        return addDays(currentDate, event.recurrence_interval || 1);
      case RecurrenceFrequency.WEEKLY:
        return this.getNextWeeklyOccurrence(event, currentDate);
      case RecurrenceFrequency.MONTHLY:
        return this.getNextMonthlyOccurrence(event, currentDate);
      case RecurrenceFrequency.YEARLY:
        return addYears(currentDate, event.recurrence_interval || 1);
      default:
        return currentDate;
    }
  }

  private static getNextWeeklyOccurrence(event: Event, currentDate: Date): Date {
    if (!event.recurrence_days || event.recurrence_days.length === 0) {
      return addWeeks(currentDate, event.recurrence_interval || 1);
    }

    let nextDate = addDays(currentDate, 1);
    while (!event.recurrence_days.includes(nextDate.getDay())) {
      nextDate = addDays(nextDate, 1);
    }

    return nextDate;
  }

  private static getNextMonthlyOccurrence(event: Event, currentDate: Date): Date {
    if (event.recurrence_day_of_month) {
      return addMonths(currentDate, event.recurrence_interval || 1);
    }

    if (event.recurrence_week_of_month && event.recurrence_day_of_week !== undefined) {
      const nextMonth = addMonths(currentDate, event.recurrence_interval || 1);
      return this.getNthDayOfMonth(
        nextMonth,
        event.recurrence_week_of_month,
        event.recurrence_day_of_week
      );
    }

    return addMonths(currentDate, event.recurrence_interval || 1);
  }

  private static getNthDayOfMonth(date: Date, weekNumber: number, dayOfWeek: number): Date {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysToAdd = (dayOfWeek - firstDayWeekday + 7) % 7 + (weekNumber - 1) * 7;
    return addDays(firstDayOfMonth, daysToAdd);
  }
} 
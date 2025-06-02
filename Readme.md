# Event Scheduler Backend

A Node.js/Express backend for managing recurring events with a robust recurrence engine.

## Features

- **Event Management**
  - Create, read, update, and delete events
  - Support for one-time and recurring events
  - Flexible recurrence patterns (daily, weekly, monthly, yearly)

- **Recurrence Engine**
  - Handles complex recurrence patterns
  - Supports:
    - Daily recurrence with custom intervals
    - Weekly recurrence with specific days
    - Monthly recurrence with:
      - Specific day of month (e.g., 15th of every month)
      - Relative day of month (e.g., 1st Friday of every month)
    - Yearly recurrence
  - End conditions:
    - No end date (recur indefinitely)
    - End after X occurrences
    - End on specific date

## Architecture

### Data Access Layer (DAL)
- `EventDAL`: Handles database operations
  - Smart querying for both one-time and recurring events
  - Optimized for calendar view performance

### Service Layer
- `EventService`: Business logic for events
  - Expands recurring events into instances
  - Handles complex date calculations
  - Manages recurrence rules

### Models
- `Event`: Core event model with recurrence support
  - Flexible schema for different recurrence types
  - Type-safe enums for recurrence frequencies

## API Endpoints

### Events
- `GET /event`: Get events for a date range
- `POST /event`: Create a new event
- `PUT /event`: Update an event
- `DELETE /event`: Delete an event

## Recurrence Implementation

The system uses a two-step process for handling recurring events:

1. **Database Query**
   - Fetches all recurring events regardless of start date
   - Filters one-time events by date range

2. **Service Layer Expansion**
   - Takes recurring events and expands them into instances
   - Calculates all occurrences within the requested date range
   - Handles complex patterns like "1st Friday of every month"

## Development

### Prerequisites
- Node.js
- PostgreSQL
- TypeScript

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/event_scheduler
   JWT_SECRET=your_jwt_secret
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

CREATE EXTENSION postgis;

CREATE INDEX idx_location_geography ON properties USING GIST(location);
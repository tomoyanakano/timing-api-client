# Timing API Client - API Reference

This document provides a detailed explanation of all features and their usage in the Timing API Client.

## Table of Contents

- [Client Initialization](#client-initialization)
- [Time Entry Operations](#time-entry-operations)
  - [Starting a Timer](#starting-a-timer)
  - [Stopping a Timer](#stopping-a-timer)
  - [Creating a Time Entry](#creating-a-time-entry)
  - [Listing Time Entries](#listing-time-entries)
  - [Getting a Time Entry](#getting-a-time-entry)
  - [Updating a Time Entry](#updating-a-time-entry)
  - [Deleting a Time Entry](#deleting-a-time-entry)
- [Project Operations](#project-operations)
  - [Listing Projects](#listing-projects)
  - [Getting a Project](#getting-a-project)
  - [Creating a Project](#creating-a-project)
  - [Updating a Project](#updating-a-project)
  - [Deleting a Project](#deleting-a-project)
  - [Getting Project Time Entries](#getting-project-time-entries)
- [Error Handling](#error-handling)
- [Custom Requests](#custom-requests)

## Client Initialization

Before using any API functions, you need to initialize the client with your API key.

```typescript
import { TimingClient } from "timing-api-client";

// Basic initialization
const client = new TimingClient({
  apiKey: "YOUR_API_KEY", // Required
});

// Advanced initialization with options
const clientWithOptions = new TimingClient({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://web.timingapp.com/api/v1", // Optional, this is the default
  timeout: 30000, // Optional, timeout in milliseconds (default is 10000)
});
```

## Time Entry Operations

### Starting a Timer

Start a new running timer.

```typescript
const timer = await client.timeEntries.start({
  project: "/projects/123", // Required - reference to a project
  title: "Working on feature X", // Optional
  notes: "Implementing the login system", // Optional
  startDate: "2023-01-01T10:00:00+00:00", // Optional, defaults to now
  replaceExisting: false, // Optional, defaults to false
});
```

#### Parameters

| Name            | Type    | Required | Description                                                   |
| --------------- | ------- | -------- | ------------------------------------------------------------- |
| project         | string  | Yes      | Reference to a project (format: '/projects/{id}')             |
| title           | string  | No       | Title of the time entry                                       |
| notes           | string  | No       | Notes for the time entry                                      |
| startDate       | string  | No       | Start date in ISO 8601 format. Defaults to the current time   |
| replaceExisting | boolean | No       | If true, overlapping time entries will be adjusted or deleted |

#### Returns

A `TimeEntry` object with the newly created timer.

### Stopping a Timer

Stop the currently running timer.

```typescript
const stoppedTimer = await client.timeEntries.stop();
```

#### Returns

A `TimeEntry` object with the stopped timer.

### Creating a Time Entry

Create a new time entry for a specific time range.

```typescript
const timeEntry = await client.timeEntries.create({
  project: "/projects/123", // Required - reference to a project
  startDate: "2023-01-01T10:00:00+00:00", // Required
  endDate: "2023-01-01T12:00:00+00:00", // Required
  title: "Meeting with team", // Optional
  notes: "Weekly planning meeting", // Optional
  replaceExisting: false, // Optional, defaults to false
});
```

#### Parameters

| Name            | Type    | Required | Description                                                   |
| --------------- | ------- | -------- | ------------------------------------------------------------- |
| project         | string  | Yes      | Reference to a project (format: '/projects/{id}')             |
| startDate       | string  | Yes      | Start date in ISO 8601 format                                 |
| endDate         | string  | Yes      | End date in ISO 8601 format                                   |
| title           | string  | No       | Title of the time entry                                       |
| notes           | string  | No       | Notes for the time entry                                      |
| replaceExisting | boolean | No       | If true, overlapping time entries will be adjusted or deleted |

#### Returns

A `TimeEntry` object with the newly created time entry.

### Listing Time Entries

Get a list of time entries.

```typescript
// Get all time entries
const allEntries = await client.timeEntries.list();

// Get time entries with filter
const filteredEntries = await client.timeEntries.list({
  from: "2023-01-01",
  to: "2023-01-31",
  project: "/projects/123",
});
```

#### Parameters

| Name  | Type   | Required | Description                            |
| ----- | ------ | -------- | -------------------------------------- |
| query | object | No       | Query parameters to filter the results |

#### Returns

An array of `TimeEntry` objects.

### Getting a Time Entry

Get a specific time entry by ID.

```typescript
const timeEntry = await client.timeEntries.get("123");
```

#### Parameters

| Name | Type   | Required | Description                 |
| ---- | ------ | -------- | --------------------------- |
| id   | string | Yes      | ID of the time entry to get |

#### Returns

A `TimeEntry` object.

### Updating a Time Entry

Update a specific time entry.

```typescript
const updatedEntry = await client.timeEntries.update("123", {
  title: "Updated title",
  notes: "Updated notes",
});
```

#### Parameters

| Name | Type   | Required | Description                                                   |
| ---- | ------ | -------- | ------------------------------------------------------------- |
| id   | string | Yes      | ID of the time entry to update                                |
| data | object | Yes      | Data to update. You can update any properties of a time entry |

#### Returns

A `TimeEntry` object with the updated data.

### Deleting a Time Entry

Delete a specific time entry.

```typescript
await client.timeEntries.delete("123");
```

#### Parameters

| Name | Type   | Required | Description                    |
| ---- | ------ | -------- | ------------------------------ |
| id   | string | Yes      | ID of the time entry to delete |

#### Returns

Void.

## Project Operations

### Listing Projects

Get a list of projects.

```typescript
// Get all projects
const allProjects = await client.projects.list();

// Get projects with filter
const filteredProjects = await client.projects.list({
  parentId: "123",
});
```

#### Parameters

| Name  | Type   | Required | Description                            |
| ----- | ------ | -------- | -------------------------------------- |
| query | object | No       | Query parameters to filter the results |

#### Returns

An array of `Project` objects.

### Getting a Project

Get a specific project by ID.

```typescript
const project = await client.projects.get("123");
```

#### Parameters

| Name | Type   | Required | Description              |
| ---- | ------ | -------- | ------------------------ |
| id   | string | Yes      | ID of the project to get |

#### Returns

A `Project` object.

### Creating a Project

Create a new project.

```typescript
const project = await client.projects.create({
  title: "New Project", // Required
  color: "#FF0000", // Optional
  parent: "/projects/123", // Optional
  notes: "Project notes", // Optional
  customFields: {
    // Optional
    clientId: "456",
    department: "Engineering",
  },
});
```

#### Parameters

| Name         | Type   | Required | Description                    |
| ------------ | ------ | -------- | ------------------------------ |
| title        | string | Yes      | Project title                  |
| color        | string | No       | Hex color code for the project |
| parent       | string | No       | Reference to a parent project  |
| notes        | string | No       | Project notes                  |
| rate         | number | No       | Project billing rate           |
| customFields | object | No       | Custom fields for the project  |

#### Returns

A `Project` object with the newly created project.

### Updating a Project

Update a specific project.

```typescript
const updatedProject = await client.projects.update("123", {
  title: "Updated Project",
  notes: "Updated notes",
});
```

#### Parameters

| Name | Type   | Required | Description                                                |
| ---- | ------ | -------- | ---------------------------------------------------------- |
| id   | string | Yes      | ID of the project to update                                |
| data | object | Yes      | Data to update. You can update any properties of a project |

#### Returns

A `Project` object with the updated data.

### Deleting a Project

Delete a specific project.

```typescript
await client.projects.delete("123");
```

#### Parameters

| Name | Type   | Required | Description                 |
| ---- | ------ | -------- | --------------------------- |
| id   | string | Yes      | ID of the project to delete |

#### Returns

Void.

### Getting Project Time Entries

Get time entries for a specific project.

```typescript
// Get all time entries for a project
const projectEntries = await client.projects.getTimeEntries("123");

// Get time entries with filter
const filteredProjectEntries = await client.projects.getTimeEntries("123", {
  from: "2023-01-01",
  to: "2023-01-31",
});
```

#### Parameters

| Name  | Type   | Required | Description                            |
| ----- | ------ | -------- | -------------------------------------- |
| id    | string | Yes      | ID of the project                      |
| query | object | No       | Query parameters to filter the results |

#### Returns

An array of `TimeEntry` objects associated with the project.

## Error Handling

The client throws an `ApiError` for API-related errors. You can handle these errors to get more details about what went wrong.

```typescript
try {
  const projects = await client.projects.list();
} catch (error) {
  if (error.status === 401) {
    console.error("Authentication error:", error.message);
  } else if (error.status === 404) {
    console.error("Resource not found:", error.message);
  } else {
    console.error("An error occurred:", error.message);
  }
}
```

## Custom Requests

If you need to make a request that isn't covered by the provided resources, you can use the `request` method on the client directly.

```typescript
// Custom GET request
const data = await client.request({
  method: "get",
  url: "/custom-endpoint",
  params: { query: "value" },
});

// Custom POST request
const result = await client.request({
  method: "post",
  url: "/custom-endpoint",
  data: { key: "value" },
});
```

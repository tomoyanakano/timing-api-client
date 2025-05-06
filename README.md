# Timing API Client for Node.js

[![npm version](https://badge.fury.io/js/timing-api-client.svg)](https://badge.fury.io/js/timing-api-client) <!-- Replace 'timing-api-client' with your actual npm package name if different -->

A Node.js client library for interacting with the [Timing](https://timingapp.com/) time-tracking application's Web API.

This library provides convenient methods for managing projects and time entries through the Timing API.

## Features

- Easy initialization with your API key.
- Typed methods for interacting with API resources (Projects, Time Entries).
- Handles API requests and responses.
- Provides specific error types (`ApiError`) for better error handling.
- Supports TypeScript.

## Installation

```bash
npm install timing-api-client
# or
yarn add timing-api-client
```

_(Replace `timing-api-client` with the actual package name if it's different on npm)_

## Getting Started

First, you need your Timing API key. You can find it in the Timing Web App under **Settings -> Integrations -> API**. It's recommended to store your API key securely, for example, using environment variables.

```typescript
import { TimingClient, ApiError } from "timing-api-client"; // Use your actual package name if different

const apiKey = process.env.TIMING_API_KEY;

if (!apiKey) {
  throw new Error("TIMING_API_KEY environment variable is not set.");
}

const client = new TimingClient({ apiKey });

async function main() {
  try {
    // List projects
    console.log("Fetching projects...");
    const projects = await client.projects.list();
    console.log(`Found ${projects.length} projects.`);
    if (projects.length > 0) {
      console.log(`First project: ${projects[0].title} (${projects[0].self})`);

      // Start a timer for the first project
      const projectRef = projects[0].self; // e.g., '/projects/123'
      console.log(`\nStarting timer for project ${projectRef}...`);
      const startedEntry = await client.timeEntries.start({
        project: projectRef,
        title: "Working on SDK README",
      });
      console.log("Timer started:", startedEntry);

      // Wait a bit (e.g., 5 seconds) - in a real app, this would be user activity
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Stop the timer
      console.log("\nStopping timer...");
      const stoppedEntry = await client.timeEntries.stop();
      console.log("Timer stopped:", stoppedEntry);
    }

    // List recent time entries
    console.log("\nFetching recent time entries...");
    const timeEntries = await client.timeEntries.list({ limit: 5 });
    console.log(`Found ${timeEntries.length} recent time entries.`);
    timeEntries.forEach((entry) => {
      console.log(`  - ${entry.title || "(No title)"} (${entry.start_date})`);
    });
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API-specific errors
      console.error(`API Error (${error.status}): ${error.message}`);
      // You can inspect error.originalError for more details from Axios
    } else if (error instanceof Error) {
      // Handle other errors
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
}

main();
```

## API Documentation

For detailed information on all available methods, parameters, and types, please refer to the [API Reference documentation](./docs/API.md).

This includes operations for:

- **Time Entries:** Start, Stop, Create, List, Get, Update, Delete
- **Projects:** Create, List, Get, Update, Delete, Get Time Entries for a Project

## Error Handling

The client uses a custom `ApiError` class (exported from the package) for errors originating from the API or the request process. You can catch these errors and inspect their `status` and `message` properties. The `originalError` property may contain the underlying Axios error object for more details.

```typescript
import { TimingClient, ApiError } from "timing-api-client";

// ... client initialization ...

try {
  await client.projects.get("non-existent-id");
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Status: ${error.status}`); // e.g., 404
    console.error(`Message: ${error.message}`); // e.g., "Not Found"
    // console.error('Original Error:', error.originalError);
  } else {
    console.error("An unexpected error occurred:", error);
  }
}
```

## Development

- **Build:** `npm run build` (or configure your build script in `package.json`)
- **Test:** `npm test` (or configure your test script in `package.json`)

## License

[MIT](./LICENSE) <!-- Ensure you have a LICENSE file -->

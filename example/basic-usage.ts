import { TimingClient, Project, TimeEntry, ApiError } from '../src'; // Adjust the import path if needed (e.g., 'your-package-name' or '../dist')

// Main function to run the example
async function runExample() {
  // IMPORTANT: Set your Timing API key as an environment variable.
  // You can find your API key in the Timing Web App: https://web.timingapp.com/settings/integrations/api
  const apiKey = process.env.TIMING_API_KEY;

  if (!apiKey) {
    console.error(
      "Error: TIMING_API_KEY environment variable is not set.",
      "Please set it to your Timing API key before running the example.",
      "\nExample (in your terminal): export TIMING_API_KEY='your_actual_api_key_here'",
    );
    process.exit(1); // Exit if API key is missing
  }

  const timingClient = new TimingClient({ apiKey });

  try {
    console.log("Fetching projects...");
    // Using the list method from ProjectsResource
    const projects: Project[] = await timingClient.projects.list();
    console.log(`Successfully fetched ${projects.length} projects.`);

    if (projects.length > 0) {
      console.log("\nFirst 5 projects (or fewer if not available):");
      projects.slice(0, 5).forEach((project) => {
        // Accessing properties defined in the Project type
        console.log(`  - Title: "${project.title}", Self: ${project.self}`);
      });

      // Example: Get time entries for the first project
      const firstProject = projects[0];
      // Extract ID from self link (e.g., /projects/123 -> 123)
      const projectId = firstProject.self.split('/').pop();

      if (projectId) {
        console.log(`\nFetching up to 5 time entries for project: "${firstProject.title}" (ID: ${projectId})...`);
        // Using the getTimeEntries method from ProjectsResource
        // Passing query parameters as documented in docs/API.md
        const timeEntriesForProject: TimeEntry[] = await timingClient.projects.getTimeEntries(projectId, { limit: 5 });
        console.log(`Found ${timeEntriesForProject.length} time entries for "${firstProject.title}":`);
        timeEntriesForProject.forEach(entry => {
          // Accessing properties defined in the TimeEntry type
          console.log(`  - Title: "${entry.title || '(No title)'}", Start: ${entry.start_date}, End: ${entry.end_date || '(In progress)'}`);
        });
      }
    } else {
      console.log("No projects found. This might be expected if you have no projects, or it could indicate an issue with the API key or permissions.");
    }

    console.log("\nFetching up to 5 most recent time entries (globally)...");
    // Using the list method from TimeEntriesResource
    // Passing query parameters as documented in docs/API.md
    const recentTimeEntries: TimeEntry[] = await timingClient.timeEntries.list({
      limit: 5,
      // You might add sorting if the API supports it, e.g., sort: '-start_date'
    });
    console.log(`Found ${recentTimeEntries.length} recent time entries:`);
    recentTimeEntries.forEach(entry => {
      console.log(`  - Title: "${entry.title || '(No title)'}", Start: ${entry.start_date}, Project: ${entry.project}`);
    });

    // --- Example of creating/modifying data (use with caution) ---
    // The following section demonstrates how to start and stop a timer.
    // Uncomment it if you want to test these functionalities.
    // Be aware that this will create actual data in your Timing account.
    /*
    if (projects.length > 0) {
      const projectToUseForNewTimer = projects[0].self; // project.self is typically like '/projects/PROJECT_ID'
      console.log(`\nDemonstrating timer start/stop for project: ${projectToUseForNewTimer}`);

      try {
        console.log('Starting a new timer for "Example Task"...');
        // Using the start method from TimeEntriesResource
        const newTimer = await timingClient.timeEntries.start({
          project: projectToUseForNewTimer,
          title: "Example Task from API Client",
          // You can also specify 'start_date' if needed, otherwise it defaults to now.
        });
        console.log("Timer started successfully:", newTimer);

        console.log("Waiting for 5 seconds before stopping the timer...");
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        console.log("Stopping the timer...");
        // Using the stop method from TimeEntriesResource
        const stoppedTimer = await timingClient.timeEntries.stop(); // Stops the currently active timer
        console.log("Timer stopped successfully:", stoppedTimer);
      } catch (timerError) {
        console.error("Error during timer operations:", timerError);
        if (timerError instanceof ApiError) {
           console.error(`API Error Status: ${timerError.status}, Message: ${timerError.message}`);
        }
      }
    } else {
      console.log("\nSkipping timer start/stop example as no projects are available to associate the timer with.");
    }
    */

  } catch (error: unknown) {
    console.error("\n--- An error occurred during the API request ---");
    // Using the exported ApiError type for checking
    if (error instanceof ApiError) {
      console.error(`Status: ${error.status}`);
      console.error(`Message: ${error.message}`);
      if (error.originalError) {
        // Axios error details might be nested here
        const axiosResponse = (error.originalError as any)?.response;
        if (axiosResponse?.data) {
          console.error("API Response Data:", JSON.stringify(axiosResponse.data, null, 2));
        } else {
          console.error("Original Error:", error.originalError);
        }
      }
    } else if (error instanceof Error) { // Fallback for other error types
      console.error(`Error: ${error.message}`);
      if (error.stack) {
        console.error("Stacktrace:", error.stack);
      }
    } else {
      console.error("An unknown error object was thrown:", error);
    }
    console.error("--- End of error details ---");
  }
}

// Execute the main function and catch any top-level errors
runExample().catch(err => {
  console.error("Critical error in example script execution:", err);
  process.exit(1);
});

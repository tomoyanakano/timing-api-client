import "dotenv/config";
import { TimingClient } from "timing-api-client";

const client = new TimingClient({
  apiKey: process.env.TIMING_API_KEY || "",
});

const main = async () => {
  // Fetch all projects
  const projects = await client.projects.list();
  const project = projects[0];

  console.log("Fetched projects:", projects);

  // Start a time entry
  const timeEntry = await client.timeEntries.start({
    project: project.self,
    title: "Test Time Entry",
  });
  console.log("Started time entry:", timeEntry);

  await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

  // Stop the time entry
  const stoppedTimeEntry = await client.timeEntries.stop();
  console.log("Stopped time entry:", stoppedTimeEntry);

  // Get time entries for the project
  const timeEntries = await client.timeEntries.list({
    limit: 5,
    project: project.self,
  });
  console.log("Fetched time entries:", timeEntries);

  // Generate a report for the project
  const report = await client.reports.generate({
    projects: [project.self],
    startDateMin: "2023-01-01",
    startDateMax: "2023-12-31",
    columns: ["project", "title", "timespan"],
  });

  console.log("Generated report:", report);
};

main();

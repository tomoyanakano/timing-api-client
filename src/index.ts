// Main module exports
export { TimingClient, TimingClientOptions } from './client';

// Resource exports
export { TimeEntriesResource, StartTimerOptions, CreateTimeEntryOptions } from './resources/timeEntries';
export { ProjectsResource, CreateProjectOptions } from './resources/projects';

// Type definition exports
export { TimeEntry } from './types/timeEntry';
export { Project } from './types/project';

// Error-related exports
export { ApiError } from './utils/request';

// Version information
export const VERSION = '0.1.0';

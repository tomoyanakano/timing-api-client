// Main module exports
export { TimingClient, TimingClientOptions } from './client';

// Resource exports
export { TimeEntriesResource, StartTimerOptions, CreateTimeEntryOptions } from './resources/timeEntries';
export { ProjectsResource, CreateProjectOptions } from './resources/projects';
export { ReportsResource } from './resources/reports';

// Type definition exports
export { TimeEntry } from './types/timeEntry';
export { Project } from './types/project';
export { ReportRow, GenerateReportQuery, ReportUser } from './types/report';

// Error-related exports
export { ApiError } from './utils/request';

// Version information
export const VERSION = '0.1.0';

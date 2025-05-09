import { Project } from './project';

/**
 * Represents user information that might be part of a report row.
 */
export interface ReportUser {
  /**
   * Self-referential link to the API resource, e.g., '/users/1'
   */
  self: string;
  /**
   * User's email address.
   */
  email?: string;
  /**
   * User's name.
   */
  name?: string;
}

/**
 * Query parameters for generating a report.
 * All parameters are optional.
 *
 * @see {@link https://web.timingapp.com/docs/#reports-GETapi-v1-report}
 */
export interface GenerateReportQuery {
  /**
   * Whether to include app usage in the report. If false, only time entries are returned.
   * @default false
   */
  includeAppUsage?: boolean;

  /**
   * If true, the response will also contain time entries that belong to other team members,
   * provided the current user has permission to view them.
   * @default false
   */
  includeTeamMembers?: boolean;

  /**
   * Restricts the query to data associated with the given user(s).
   * User references, e.g., '/users/1'.
   * Example: ['/users/1']
   */
  teamMembers?: string[];

  /**
   * Restricts the query to data whose start date is equal to or later than this parameter.
   * Format: 'YYYY-MM-DD'.
   * Example: '2019-01-01'
   */
  startDateMin?: string;

  /**
   * Restricts the query to data whose start date is equal to or earlier than this parameter.
   * Format: 'YYYY-MM-DD'.
   * Example: '2019-01-01'
   */
  startDateMax?: string;

  /**
   * Restricts the query to data associated with the given project(s).
   * Project references, e.g., '/projects/1'.
   * To include time entries not assigned to any project, provide an empty string in the array.
   * Example: ['/projects/1', '']
   */
  projects?: string[];

  /**
   * If true, the response will also contain time entries that belong to any child projects
   * of the ones provided in `projects`.
   * @default false
   */
  includeChildProjects?: boolean;

  /**
   * Restricts the query to time entries whose title and/or notes contain all words in this parameter.
   * Case-insensitive but diacritic-sensitive.
   * Note: this parameter cannot be used when app usage is included.
   * Example: 'meeting'
   */
  searchQuery?: string;

  /**
   * Which columns to show. The `user` column is ignored if `includeTeamMembers` is false.
   * `start_date` and `end_date` are shown when `timespan` column is sent.
   * Possible values: 'project', 'title', 'notes', 'timespan', 'user'.
   * @default ['user', 'project', 'title'] (API default)
   */
  columns?: ('project' | 'title' | 'notes' | 'timespan' | 'user')[];

  /**
   * When this argument is provided, report lines for projects below the given level
   * will be aggregated by their parent project on the given level.
   * For example, when `projectGroupingLevel` is 0, all times in sub-projects will be
   * counted towards the corresponding project on the "root" level.
   * Can be a non-negative integer or -1.
   * Requires `columns` to contain 'project'.
   * @default -1 (no grouping)
   */
  projectGroupingLevel?: number;

  /**
   * If true, the properties of each line's project will be included in the response.
   * Requires `columns` to contain 'project'.
   * @default false
   */
  includeProjectData?: boolean;

  /**
   * When this argument is provided, report lines will be aggregated according to the given calendar unit.
   * Possible values: 'exact', 'day', 'week', 'month', 'year'.
   * @default 'exact'
   */
  timespanGroupingMode?: 'exact' | 'day' | 'week' | 'month' | 'year';

  /**
   * Sort the results ascending by the given column; for descending order prefix the column name with a minus sign.
   * Can be repeated to provide multiple sort columns.
   * Examples: ['-duration'], ['user', '-duration']
   * @default ['-duration'] (API default)
   */
  sort?: string[];
}

/**
 * Represents a single row in a generated report.
 * The exact fields present depend on the `columns` and `includeProjectData` query parameters used for generation.
 * Field names match the API response.
 */
export interface ReportRow {
  /**
   * Total duration in seconds for this report row.
   */
  duration: number;

  /**
   * Project data, if 'project' was requested in columns and `includeProjectData` was true.
   * The structure of this project object will match the `Project` type.
   */
  project?: Project;

  /**
   * Title, if 'title' was requested in columns.
   */
  title?: string;

  /**
   * Notes, if 'notes' was requested in columns.
   */
  notes?: string;

  /**
   * Start date of the timespan, if 'timespan' was requested in columns.
   * ISO 8601 format string.
   */
  start_date?: string;

  /**
   * End date of the timespan, if 'timespan' was requested in columns.
   * ISO 8601 format string.
   */
  end_date?: string;

  /**
   * User data, if 'user' was requested in columns.
   * Can be a string (e.g. user reference) or a ReportUser object.
   */
  user?: ReportUser | string;
}

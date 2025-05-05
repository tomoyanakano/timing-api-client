/**
 * Time entry object from the Timing API
 */
export interface TimeEntry {
  /**
   * Self-referential link to the API resource
   * Example: '/time-entries/1'
   */
  self: string;

  /**
   * Start date of the time entry (ISO 8601 format)
   * Example: '2023-01-01T10:00:00+00:00'
   */
  start_date: string;

  /**
   * End date of the time entry (ISO 8601 format)
   * null for running timers
   * Example: '2023-01-01T12:00:00+00:00'
   */
  end_date: string | null;

  /**
   * Title of the time entry
   */
  title?: string;

  /**
   * Notes for the time entry
   */
  notes?: string;

  /**
   * Reference to the associated project
   * Example: '/projects/1'
   */
  project?: string;

  /**
   * Whether the time entry is currently running
   */
  is_running?: boolean;

  /**
   * Duration of the time entry in seconds
   * For running timers, this is the time elapsed so far
   */
  duration?: number;

  /**
   * Creation date of the time entry (ISO 8601 format)
   * Example: '2023-01-01T10:00:00+00:00'
   */
  created_at?: string;

  /**
   * Last update date of the time entry (ISO 8601 format)
   * Example: '2023-01-01T10:00:00+00:00'
   */
  updated_at?: string;

  /**
   * Custom fields
   * Only accessible through the API
   */
  custom_fields?: Record<string, string>;
}

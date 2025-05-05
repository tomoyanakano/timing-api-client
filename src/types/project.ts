/**
 * Project object from the Timing API
 */
export interface Project {
  /**
   * Self-referential link to the API resource
   * Example: '/projects/1'
   */
  self: string;

  /**
   * Project title
   */
  title: string;

  /**
   * Project color (hex code)
   * Example: '#FF0000'
   */
  color?: string;

  /**
   * Reference to the parent project
   * Example: '/projects/1'
   */
  parent?: string;

  /**
   * Project notes
   */
  notes?: string;

  /**
   * Project billing rate
   */
  rate?: number;

  /**
   * Total time for the project (in seconds)
   */
  total_duration?: number;

  /**
   * Whether the project is currently aggregating
   */
  is_aggregating?: boolean;

  /**
   * Creation date of the project (ISO 8601 format)
   * Example: '2023-01-01T10:00:00+00:00'
   */
  created_at?: string;

  /**
   * Last update date of the project (ISO 8601 format)
   * Example: '2023-01-01T10:00:00+00:00'
   */
  updated_at?: string;

  /**
   * Custom fields
   * Only accessible through the API
   */
  custom_fields?: Record<string, string>;

  /**
   * List of references to sub-projects
   * Example: ['/projects/2', '/projects/3']
   */
  children?: string[];
}

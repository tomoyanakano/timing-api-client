import { AxiosInstance } from 'axios';
import { ApiResponse } from '../types/apiResponse';
import { ReportRow, GenerateReportQuery } from '../types/report';
import { toSnakeCase } from '../utils/toSnakeCase';

/**
 * API resources for generating reports.
 */
export class ReportsResource {
  /**
   * @param axios The Axios instance for making API requests.
   */
  constructor(private readonly axios: AxiosInstance) {}

  /**
   * Generate a report that can contain both time entries and app usage.
   *
   * The response is a JSON array with several rows; each row includes the total
   * duration (in seconds) belonging to the corresponding other (configurable) columns.
   *
   * @param query Optional query parameters to filter and configure the report.
   * @returns A promise that resolves to an array of report rows.
   * @see {@link https://web.timingapp.com/docs/#reports-GETapi-v1-report}
   */
  public async generate(query?: GenerateReportQuery): Promise<ReportRow[]> {
    const response = await this.axios.get<ApiResponse<ReportRow[]>>('/report', {
      params: query ? toSnakeCase(query) : undefined,
    });
    return response.data.data;
  }
}

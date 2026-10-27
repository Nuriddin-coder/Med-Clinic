export class ClinicApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ClinicApiError";
    this.status = status;
  }
}

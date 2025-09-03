class ApiResponse<responseObj = object> {
  statusCode: number;
  data: responseObj;
  message: string;
  success: boolean;

  constructor({
    statusCode,
    data,
    message = "Success",
  }: {
    statusCode: number;
    data: responseObj;
    message?: string;
  }) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };

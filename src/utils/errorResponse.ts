class ErrorResponse extends Error {
  message: string
  statusCode: number
  constructor(message: string | any, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export default ErrorResponse

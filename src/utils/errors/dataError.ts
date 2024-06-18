export default class dataError extends Error {
  statusCode: number;
  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }
}

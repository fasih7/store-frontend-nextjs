export class HttpError extends Error {
  status: number;
  url: string;
  body: any;

  constructor(message: string, status: number, url: string, body: any) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

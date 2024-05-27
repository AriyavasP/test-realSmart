import { HttpStatus } from '@nestjs/common';

export class HttpResponse {
  private status: number;
  private code: string;
  private message: any;
  private data: any;

  CustomResponse(status: number, code: string, message: any) {
    this.status = status;
    this.code = code;
    this.message = message;
    return this;
  }

  BadRequestResponse(error: any) {
    this.status = HttpStatus.BAD_REQUEST;
    this.code = '400';
    this.message = error;
    return this;
  }
}

export class ResponseUtils {
  static CustomResponse(status: number, code: string, message: any) {
    return new HttpResponse().CustomResponse(status, code, message);
  }

  static BadRequestResponse(error: string) {
    return new HttpResponse().BadRequestResponse(error);
  }
}

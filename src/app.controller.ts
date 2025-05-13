import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getStatus(): string {
    return this.appService.getStatus();
  }

  @Get('debug-sentry')
  getError() {
    return this.appService.getError();
  }
}

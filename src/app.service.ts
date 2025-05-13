import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getStatus(): string {
    this.logger.log('getStatus() called');
    return 'iWebHub is running!';
  }

  getError(): string {
    this.logger.log('getError() called');
    throw new Error('My first Sentry error!');
  }
}

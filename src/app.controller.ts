import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MailServiceService } from './mail_service/mail_service.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly mailServiceService: MailServiceService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-email')
  sendEmail(@Body() body: { to: string, subject: string, text: string }) {
    return this.mailServiceService.sendEmail(body.to, body.subject, body.text);
  }
}

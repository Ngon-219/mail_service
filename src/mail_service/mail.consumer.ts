import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailServiceService } from './mail_service.service';

interface SendEmailPayload {
  to: string;
  subject: string;
  text: string;
}

@Controller()
export class MailConsumer {
  private readonly logger = new Logger(MailConsumer.name);

  constructor(private readonly mailService: MailServiceService) {}

  @EventPattern('send-email')
  async handleSendEmail(@Payload() data: SendEmailPayload) {
    this.logger.log(`Received send-email event: ${JSON.stringify(data)}`);
    
    try {
      await this.mailService.sendEmail(data.to, data.subject, data.text);
      this.logger.log(`Email sent successfully to: ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }
}


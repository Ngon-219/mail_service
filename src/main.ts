import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: configService.get<string>('RABBITMQ_QUEUE_NAME', 'mail_queue'),
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`RabbitMQ consumer is listening on queue: ${configService.get<string>('RABBITMQ_QUEUE_NAME', 'mail_queue')}`);
}
bootstrap();

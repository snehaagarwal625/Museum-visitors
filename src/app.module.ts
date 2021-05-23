import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitorsModule } from './visitors/visitors.module';

@Module({
  imports: [VisitorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

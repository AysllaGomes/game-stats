import { Module } from '@nestjs/common';

import { AppService } from './app.service';

import { GameModule } from './game/game.module';

import { AppController } from './app.controller';

@Module({
  imports: [GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

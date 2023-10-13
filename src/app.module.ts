import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';

import configuration from './config/configuration';

import { AppUpdate } from './app.update';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('telegram.token'),
      }),
    }),
  ],
  providers: [AppUpdate],
})
export class AppModule {}

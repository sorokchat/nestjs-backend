import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './configurations/validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, expandVariables: true }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}

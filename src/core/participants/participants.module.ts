import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantEntity } from './participant.entity';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  imports: [TypeOrmModule.forFeature([ParticipantEntity])],
})
export class ParticipantsModule { }

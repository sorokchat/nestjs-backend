import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipantEntity } from './participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(ParticipantEntity)
    private readonly repository: Repository<ParticipantEntity>,
  ) { }
}

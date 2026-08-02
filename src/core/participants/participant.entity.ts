import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { ChatEntity } from '../chats/chat.entity';
import { ChatRole } from '../authorization/chat-role.enum';

@Entity({ name: 'participants' })
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  public user!: UserEntity;

  @OneToOne(() => ChatEntity)
  @JoinColumn()
  public chat!: ChatEntity;

  @Column()
  public role!: ChatRole;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from '../users/user.entity';
import { ChatRole } from './chat-role';

@Entity({ name: 'members' })
export class MemberEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => ChatEntity, (chat) => chat.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  public chat!: ChatEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity;

  @Column({ type: 'enum', enum: ChatRole, default: ChatRole.MEMBER })
  public role!: ChatRole;
}

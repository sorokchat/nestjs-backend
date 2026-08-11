import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from './member.entity';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({ nullable: true, type: 'varchar' })
  public description: string | undefined = undefined;

  @OneToMany(() => MemberEntity, (member) => member.chat, { cascade: true })
  public members!: MemberEntity[];
}

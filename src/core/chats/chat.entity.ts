import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public description?: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  login: string;
  @Column()
  password: string;
  @Column({ name: 'display_name' })
  displayName: string;
}

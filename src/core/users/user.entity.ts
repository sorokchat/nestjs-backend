import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column({ unique: true })
  public login!: string;
  @Column()
  public password!: string;
  @Column({ name: 'display_name' })
  public displayName!: string;
}

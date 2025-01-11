import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  date: Date;
  @Column()
  name: string;
  @Column()
  phone: string;
  @Column()
  time: string;
}

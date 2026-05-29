import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamStatus } from '../../../common/enums/team-status.enum';
import { Member } from '../../member/entities/member.entity';
import { Match } from '../../match/entities/match.entity';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  name!: string;

  @Column({ type: 'uuid' })
  coach!: string;

  @Column({ type: 'uuid', nullable: true })
  captain?: string | null;

  @Column({ type: 'enum', enum: TeamStatus, default: TeamStatus.ACTIVE })
  status!: TeamStatus;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'coach' })
  coachMember?: Member;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'captain' })
  captainMember?: Member | null;

  @OneToMany(() => Member, (member) => member.team)
  members?: Member[];

  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches?: Match[];

  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches?: Match[];
}

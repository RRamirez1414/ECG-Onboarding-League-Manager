import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from '../../team/entities/team.entity';

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  home!: string;

  @Column({ type: 'uuid' })
  away!: string;

  @Column({ name: 'home_score', type: 'int', default: 0 })
  homeScore!: number;

  @Column({ name: 'away_score', type: 'int', default: 0 })
  awayScore!: number;

  @Column({ type: 'timestamptz' })
  played!: Date;

  @Column({ type: 'varchar', length: 200 })
  location!: string;

  @ManyToOne(() => Team, (team) => team.homeMatches, { nullable: false })
  @JoinColumn({ name: 'home' })
  homeTeam?: Team;

  @ManyToOne(() => Team, (team) => team.awayMatches, { nullable: false })
  @JoinColumn({ name: 'away' })
  awayTeam?: Team;
}

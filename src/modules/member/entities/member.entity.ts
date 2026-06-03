import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Person } from '../../person/entities/person.entity';
import { Team } from '../../team/entities/team.entity';

@ChildEntity('member')
export class Member extends Person {
  @ApiPropertyOptional({
    description: 'Foreign key to team',
    type: String,
    nullable: true,
  })
  @Column({ name: 'team_id', type: 'uuid', nullable: true })
  teamId?: string | null;

  @ApiProperty({
    description: 'Member stats as JSON',
    example: { shots_on_goal: 56, total_shots_on_goal: 80 },
    type: 'object',
    additionalProperties: true,
  })
  @Column({ type: 'jsonb', default: () => "'{}'" })
  stats!: Record<string, unknown>;

  @ManyToOne(() => Team, (team) => team.members, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team?: Team | null;
}

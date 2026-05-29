import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { TeamStatus } from '../../../common/enums/team-status.enum';

export class UpdateTeamStatusDto {
  @ApiProperty({ enum: TeamStatus })
  @IsEnum(TeamStatus)
  status!: TeamStatus;
}

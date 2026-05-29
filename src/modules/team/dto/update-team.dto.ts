import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { TeamStatus } from '../../../common/enums/team-status.enum';

export class UpdateTeamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  coach?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsUUID()
  captain?: string;

  @ApiPropertyOptional({ enum: TeamStatus })
  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;
}

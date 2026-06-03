import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class UpdateMatchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  home?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  away?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  home_score?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  away_score?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  played?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ description: 'Staff member assigned as referee' })
  @IsOptional()
  @IsUUID()
  referee?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsUUID()
  home!: string;

  @ApiProperty()
  @IsUUID()
  away!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  home_score!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  away_score!: number;

  @ApiProperty({ description: 'Date-time string' })
  @IsDateString()
  played!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  location!: string;
}

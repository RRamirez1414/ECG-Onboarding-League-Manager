import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PersonRole } from '../../../common/enums/person-role.enum';
import { HasContact } from '../../../common/validators/has-contact.validator';
import { MinimumAge } from '../../../common/validators/minimum-age.validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ name: 'last_name' })
  @IsString()
  @MaxLength(120)
  last_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsEmail()
  @HasContact()
  email?: string;

  @ApiProperty()
  @IsDateString()
  @MinimumAge()
  dob!: string;

  @ApiProperty({ enum: PersonRole })
  @IsEnum(PersonRole)
  role!: PersonRole;

  @ApiPropertyOptional({ description: 'Initial registration fee (defaults to league minimum if omitted)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  fee?: number;
}

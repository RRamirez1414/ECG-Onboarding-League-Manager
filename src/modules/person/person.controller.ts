import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PersonResponseDto } from './dto/person-response.dto';
import { PersonService } from './person.service';

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get person by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: PersonResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.personService.findById(id);
  }
}

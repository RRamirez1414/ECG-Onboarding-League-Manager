import { Controller, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed person, team, and match tables with sample data' })
  @ApiQuery({
    name: 'clear',
    required: false,
    type: Boolean,
    description: 'Clear existing data before seeding (default: true)',
  })
  @ApiOkResponse({
    schema: {
      example: {
        cleared: true,
        members: 52,
        staff: 3,
        teams: 4,
        matches: 10,
        freeAgents: 4,
        audits: 120,
      },
    },
  })
  seed(@Query('clear') clear?: string) {
    const shouldClear = clear !== 'false';
    return this.seedService.seed(shouldClear);
  }
}

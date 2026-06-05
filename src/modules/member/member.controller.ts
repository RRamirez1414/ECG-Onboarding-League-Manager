import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  memberCreateValidationPipe,
  memberUpdateValidationPipe,
} from '../../common/pipes/dto-validation.pipe';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { MemberService } from './member.service';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @UsePipes(memberCreateValidationPipe)
  @ApiOperation({ summary: 'Create a member (person + member STI row)' })
  @ApiCreatedResponse({ type: Member })
  create(@Body() payload: CreateMemberDto) {
    return this.memberService.create(payload);
  }

  @Get('free-agent')
  @ApiOperation({ summary: 'Get all members without a team' })
  @ApiOkResponse({ type: [Member] })
  getFreeAgents() {
    return this.memberService.findFreeAgents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: Member })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.memberService.findById(id);
  }

  @Patch(':id')
  @UsePipes(memberUpdateValidationPipe)
  @ApiOperation({ summary: 'Update member profile data' })
  @ApiOkResponse({ type: Member })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateMemberDto) {
    return this.memberService.update(id, payload);
  }

  @Patch(':id/status')
  @UsePipes(memberUpdateValidationPipe)
  @ApiOperation({ summary: 'Update member status' })
  @ApiOkResponse({ type: Member })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateMemberStatusDto) {
    return this.memberService.updateStatus(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete member' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.memberService.remove(id);
    return { deleted: true };
  }
}

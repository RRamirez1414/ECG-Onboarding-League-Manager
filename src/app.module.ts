import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuditSubscriber } from './database/subscribers/audit.subscriber';
import { MatchModule } from './modules/match/match.module';
import { MemberModule } from './modules/member/member.module';
import { PersonModule } from './modules/person/person.module';
import { SeedModule } from './modules/seed/seed.module';
import { StaffModule } from './modules/staff/staff.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5435),
      username: process.env.DB_USERNAME ?? 'apiuser',
      password: process.env.DB_PASSWORD ?? 'dbuser123',
      database: process.env.DB_NAME ?? 'league_manager',
      autoLoadEntities: true,
      synchronize: false,
      subscribers: [AuditSubscriber],
    }),
    PersonModule,
    MemberModule,
    StaffModule,
    TeamModule,
    MatchModule,
    SeedModule,
  ],
})
export class AppModule {}

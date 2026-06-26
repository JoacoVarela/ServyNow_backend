import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { ProfessionalsModule } from 'src/professionals/professional.module';
import { UserRepository } from 'src/user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';

@Module({
    controllers: [AccountController],
    imports: [ProfessionalsModule, JwtModule],
    providers: [AccountService, AccountRepository, UserRepository, AccessTokenGuard],
})
export class AccountModule { }
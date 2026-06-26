import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post('register')
    async register(@Body() data: CreateAccountDto) {
        return this.accountService.register(data);
    }

    @Post('login')
    async login(@Body() data: LoginAccountDto) {
        return this.accountService.login(data);
    }

    @Post('refresh')
    async refresh(@Body() data: RefreshTokenDto) {
        return this.accountService.refreshTokens(data);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(@CurrentAccount('sub') accountId: string) {
        return this.accountService.logout(accountId);
    }
}
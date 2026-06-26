import { Injectable, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './account.repository';
import { AccountRole, CreateAccountDto } from './dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ProfessionalRepository } from 'src/professionals/professional.repository';
import { UserRepository } from 'src/user/user.repository';
import slugify from 'slugify';
import { account_role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

type TokenPair = {
    accessToken: string;
    refreshToken: string;
};

@Injectable()
export class AccountService {
    private readonly validRoles = [AccountRole.CLIENT, AccountRole.USER, AccountRole.PROFESSIONAL];

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly professionalRepository: ProfessionalRepository,
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    private get accessSecret() {
        return process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me';
    }

    private get refreshSecret() {
        return process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
    }

    private toClientRole(role: string) {
        return role === 'USER' ? 'CLIENT' : role;
    }

    private toDbRole(role: AccountRole): account_role {
        return role === AccountRole.PROFESSIONAL ? account_role.PROFESSIONAL : account_role.USER;
    }

    private toPublicProfileLink(slug: string) {
        return `/api/professionals/${slug}`;
    }

    async register(data: CreateAccountDto) {
        this.validateCreateAccountDto(data);
        
        const emailExists = await this.accountRepository.findByEmailOrNull(data.email);
        if (emailExists) {
            throw new ConflictException('Email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const account = await this.accountRepository.create({
            email: data.email,
            password: hashedPassword,
            role: this.toDbRole(data.role),
        });

        if (this.toDbRole(data.role) === account_role.PROFESSIONAL) {
            const professionalData = data.professional!;

            const slug = await this.generateUniqueProfessionalSlug(professionalData.firstName!, professionalData.lastName!);
            const professional = await this.professionalRepository.create({
                ...professionalData,
                slug,
                account_id: account.id,
            });

            const tokens = await this.generateTokens(account.id, account.email, account.role);
            await this.persistRefreshTokenHash(account.id, tokens.refreshToken);

            return {
                account: {
                    id: account.id,
                    email: account.email,
                    role: this.toClientRole(account.role),
                },
                profile: professional,
                profileLink: this.toPublicProfileLink(professional.slug),
                tokens,
            };
        }

        const userData = data.user!;

        const userSlug = await this.generateUniqueUserSlug(userData.firstName!, userData.lastName!);
        const user = await this.userRepository.create(account.id, {
            ...userData,
            slug: userSlug,
        });

        const tokens = await this.generateTokens(account.id, account.email, account.role);
        await this.persistRefreshTokenHash(account.id, tokens.refreshToken);

        return {
            account: {
                id: account.id,
                email: account.email,
                role: this.toClientRole(account.role),
            },
            profile: user,
            tokens,
        };
    }

    async login(data: LoginAccountDto) {
        this.validateLoginDto(data);

        const account = await this.accountRepository.findByEmailOrNull(data.email);
        if (!account) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, account.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (account.role === account_role.PROFESSIONAL) {
            const professionalProfile = await this.professionalRepository.findByAccountId(account.id);
            const tokens = await this.generateTokens(account.id, account.email, account.role);
            await this.persistRefreshTokenHash(account.id, tokens.refreshToken);

            return {
                id: account.id,
                email: account.email,
                role: this.toClientRole(account.role),
                professional: professionalProfile,
                profileLink: professionalProfile ? this.toPublicProfileLink(professionalProfile.slug) : null,
                tokens,
            };
        }

        const clientProfile = await this.userRepository.findByAccountId(account.id);
        const tokens = await this.generateTokens(account.id, account.email, account.role);
        await this.persistRefreshTokenHash(account.id, tokens.refreshToken);

        return {
            id: account.id,
            email: account.email,
            role: this.toClientRole(account.role),
            client: clientProfile,
            tokens,
        };
    }

    async refreshTokens(data: RefreshTokenDto) {
        let payload: { sub: string; email: string; role: account_role };
        try {
            payload = await this.jwtService.verifyAsync(data.refreshToken, { secret: this.refreshSecret });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const account = await this.accountRepository.findByIdOrNull(payload.sub);
        if (!account || !account.refreshTokenHash) {
            throw new UnauthorizedException('Session not found');
        }

        const refreshTokenMatches = await bcrypt.compare(data.refreshToken, account.refreshTokenHash);
        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Refresh token revoked');
        }

        const tokens = await this.generateTokens(account.id, account.email, account.role);
        await this.persistRefreshTokenHash(account.id, tokens.refreshToken);

        return {
            id: account.id,
            email: account.email,
            role: this.toClientRole(account.role),
            tokens,
        };
    }

    async logout(accountId: string) {
        const account = await this.accountRepository.findByIdOrNull(accountId);
        if (!account) {
            throw new NotFoundException('Account not found');
        }

        await this.accountRepository.setRefreshTokenHash(accountId, null);
        return { success: true };
    }

    private validateCreateAccountDto(data: CreateAccountDto) {
        if (!data.email || !data.password || !data.role) {
            throw new BadRequestException('Email, password and role are required');
        }

        if (!this.validRoles.includes(data.role)) {
            throw new BadRequestException(`Role must be one of: ${this.validRoles.join(', ')}`);
        }

        if (data.password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new BadRequestException('Invalid email format');
        }

        const dbRole = this.toDbRole(data.role);
        if (dbRole === account_role.PROFESSIONAL) {
            if (!data.professional) {
                throw new BadRequestException('Professional profile data is required for PROFESSIONAL role');
            }
            if (!data.professional.firstName || !data.professional.lastName) {
                throw new BadRequestException('firstName and lastName are required for professional profile');
            }
        }

        if (dbRole === account_role.USER) {
            if (!data.user) {
                throw new BadRequestException('User profile data is required for CLIENT role');
            }
            if (!data.user.firstName || !data.user.lastName) {
                throw new BadRequestException('firstName and lastName are required for user profile');
            }
        }
    }

    private validateLoginDto(data: LoginAccountDto) {
        if (!data.email || !data.password) {
            throw new BadRequestException('Email and password are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new BadRequestException('Invalid email format');
        }
    }

    private async generateTokens(accountId: string, email: string, role: account_role): Promise<TokenPair> {
        const payload = { sub: accountId, email, role: this.toClientRole(role) };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.accessSecret,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.refreshSecret,
                expiresIn: '7d',
            }),
        ]);

        return { accessToken, refreshToken };
    }

    private async persistRefreshTokenHash(accountId: string, refreshToken: string) {
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await this.accountRepository.setRefreshTokenHash(accountId, refreshTokenHash);
    }

    private async generateUniqueProfessionalSlug(firstName: string, lastName: string): Promise<string> {
        const baseSlug = slugify(`${firstName}-${lastName}`, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await this.professionalRepository.slugExists(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    private async generateUniqueUserSlug(firstName: string, lastName: string): Promise<string> {
        const baseSlug = slugify(`${firstName}-${lastName}`, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await this.userRepository.slugExists(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }
}
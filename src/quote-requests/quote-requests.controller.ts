import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QuoteRequestsService } from './quote-requests.service';
import { CreateQuoteRequestDto } from './dtos/create-quote-request.dto';
import { CreateQuoteOfferDto } from './dtos/create-quote-offer.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@Controller('quote-requests')
export class QuoteRequestsController {
    constructor(private readonly quoteRequestsService: QuoteRequestsService) {}

    // Cliente crea solicitud de presupuesto
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('CLIENT')
    @Post()
    create(
        @CurrentAccount('sub') accountId: string,
        @Body() data: CreateQuoteRequestDto,
    ) {
        return this.quoteRequestsService.create(accountId, data);
    }

    // Todos pueden ver solicitudes abiertas
    @Get()
    findAll(
        @Query('city') city?: string,
        @Query('categoryId') categoryId?: string,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.quoteRequestsService.findAll({ city, categoryId, status, page, pageSize });
    }

    // Cliente ve sus propias solicitudes
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('CLIENT')
    @Get('my')
    findMine(@CurrentAccount('sub') accountId: string) {
        return this.quoteRequestsService.findMineAsClient(accountId);
    }

    // Ver detalle de una solicitud
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quoteRequestsService.findById(id);
    }

    // Profesional envía oferta de presupuesto
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post(':id/offers')
    sendOffer(
        @Param('id') quoteRequestId: string,
        @CurrentAccount('sub') accountId: string,
        @Body() data: CreateQuoteOfferDto,
    ) {
        return this.quoteRequestsService.sendOffer(quoteRequestId, accountId, data);
    }

    // Cliente acepta una oferta
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('CLIENT')
    @Patch(':id/offers/:offerId/accept')
    acceptOffer(
        @Param('id') quoteRequestId: string,
        @Param('offerId') offerId: string,
        @CurrentAccount('sub') accountId: string,
    ) {
        return this.quoteRequestsService.acceptOffer(quoteRequestId, offerId, accountId);
    }

    // Cliente cierra su solicitud
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('CLIENT')
    @Patch(':id/close')
    close(@Param('id') id: string, @CurrentAccount('sub') accountId: string) {
        return this.quoteRequestsService.closeRequest(id, accountId);
    }
}

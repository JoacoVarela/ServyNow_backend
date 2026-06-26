import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@UseGuards(AccessTokenGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    // Obtener o crear conversación con un profesional/cliente
    @Post('conversations')
    startConversation(
        @CurrentAccount('sub') accountId: string,
        @CurrentAccount('role') role: string,
        @Query('professionalAccountId') professionalAccountId: string,
        @Query('clientAccountId') clientAccountId: string,
    ) {
        const clientId = role === 'CLIENT' ? accountId : clientAccountId;
        const professionalId = role === 'PROFESSIONAL' ? accountId : professionalAccountId;
        return this.chatService.getOrCreateConversation(clientId, professionalId);
    }

    // Listar mis conversaciones
    @Get('conversations')
    getMyConversations(@CurrentAccount('sub') accountId: string) {
        return this.chatService.getMyConversations(accountId);
    }

    // Mensajes de una conversación
    @Get('conversations/:id/messages')
    getMessages(
        @Param('id') conversationId: string,
        @CurrentAccount('sub') accountId: string,
        @Query('page') page?: string | number,
        @Query('pageSize') pageSize?: string | number,
    ) {
        const pageNum = page ? Number(page) : 1;
        const pageSizeNum = pageSize ? Number(pageSize) : 30;
        return this.chatService.getMessages(conversationId, accountId, pageNum, pageSizeNum);
    }

    // Enviar mensaje
    @Post('conversations/:id/messages')
    sendMessage(
        @Param('id') conversationId: string,
        @CurrentAccount('sub') accountId: string,
        @Body() data: SendMessageDto,
    ) {
        return this.chatService.sendMessage(conversationId, accountId, data);
    }

    // Contar mensajes no leídos
    @Get('unread-count')
    countUnread(@CurrentAccount('sub') accountId: string) {
        return this.chatService.countUnread(accountId).then(count => ({ count }));
    }
}

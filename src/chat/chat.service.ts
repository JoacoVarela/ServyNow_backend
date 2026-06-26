import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { SendMessageDto } from './dtos/send-message.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService,
    ) {}

    async getOrCreateConversation(clientAccountId: string, professionalAccountId: string) {
        const existing = await this.prisma.chat_conversation.findUnique({
            where: {
                clientAccountId_professionalAccountId: {
                    clientAccountId,
                    professionalAccountId,
                },
            },
        });
        if (existing) return existing;

        return this.prisma.chat_conversation.create({
            data: { id: uuidv4(), clientAccountId, professionalAccountId },
        });
    }

    async getMyConversations(accountId: string) {
        const conversations = await this.prisma.chat_conversation.findMany({
            where: {
                OR: [{ clientAccountId: accountId }, { professionalAccountId: accountId }],
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        // Fetch client and professional names separately
        const enriched = await Promise.all(conversations.map(async (conv) => {
            const clientUser = await this.prisma.user.findFirst({ where: { account_id: conv.clientAccountId } });
            const professionalUser = await this.prisma.professional.findFirst({ where: { account_id: conv.professionalAccountId } });
            
            return {
                ...conv,
                clientName: clientUser ? `${clientUser.firstName} ${clientUser.lastName}` : 'Cliente',
                professionalName: professionalUser ? `${professionalUser.firstName} ${professionalUser.lastName}` : 'Profesional',
            };
        }));

        return enriched;
    }

    async getMessages(conversationId: string, accountId: string, page = 1, pageSize = 30) {
        try {
            // Sanitize inputs
            page = Math.max(1, Number(page) || 1);
            pageSize = Math.min(100, Math.max(1, Number(pageSize) || 30));
            const skip = (page - 1) * pageSize;

            const conversation = await this.prisma.chat_conversation.findUnique({ where: { id: conversationId } });
            if (!conversation) throw new NotFoundException('Conversación no encontrada');
            if (conversation.clientAccountId !== accountId && conversation.professionalAccountId !== accountId) {
                throw new ForbiddenException('No autorizado');
            }

            // Mark messages from other party as read
            await this.prisma.chat_message.updateMany({
                where: {
                    conversationId,
                    senderAccountId: { not: accountId },
                    isRead: false,
                },
                data: { isRead: true },
            });

            const messages = await this.prisma.chat_message.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            });

            return messages.reverse();
        } catch (error) {
            console.error('Error in getMessages:', error);
            throw error;
        }
    }

    async sendMessage(conversationId: string, senderAccountId: string, data: SendMessageDto) {
        const conversation = await this.prisma.chat_conversation.findUnique({ where: { id: conversationId } });
        if (!conversation) throw new NotFoundException('Conversación no encontrada');
        if (conversation.clientAccountId !== senderAccountId && conversation.professionalAccountId !== senderAccountId) {
            throw new ForbiddenException('No autorizado');
        }

        const message = await this.prisma.chat_message.create({
            data: {
                id: uuidv4(),
                conversationId,
                senderAccountId,
                content: data.content,
                type: data.type ?? 'TEXT',
            },
        });

        await this.prisma.chat_conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        const recipientId =
            conversation.clientAccountId === senderAccountId
                ? conversation.professionalAccountId
                : conversation.clientAccountId;

        await this.notificationsService.create(
            recipientId,
            'NEW_MESSAGE',
            'Nuevo mensaje',
            data.content.length > 80 ? data.content.slice(0, 80) + '...' : data.content,
            { conversationId, messageId: message.id },
        );

        return message;
    }

    async countUnread(accountId: string): Promise<number> {
        const conversations = await this.prisma.chat_conversation.findMany({
            where: { OR: [{ clientAccountId: accountId }, { professionalAccountId: accountId }] },
            select: { id: true },
        });
        const ids = conversations.map(c => c.id);
        if (!ids.length) return 0;

        return this.prisma.chat_message.count({
            where: {
                conversationId: { in: ids },
                senderAccountId: { not: accountId },
                isRead: false,
            },
        });
    }
}

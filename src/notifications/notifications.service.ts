import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';

type NotificationType =
    | 'JOB_REQUEST'
    | 'JOB_STATUS_UPDATE'
    | 'NEW_MESSAGE'
    | 'QUOTE_RECEIVED'
    | 'QUOTE_ACCEPTED'
    | 'APPOINTMENT_SCHEDULED'
    | 'APPOINTMENT_REMINDER'
    | 'REVIEW_RECEIVED'
    | 'SYSTEM';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(accountId: string, type: NotificationType, title: string, body: string, data?: object) {
        return this.prisma.notification.create({
            data: {
                id: uuidv4(),
                accountId,
                type,
                title,
                body,
                data: data ? JSON.stringify(data) : null,
            },
        });
    }

    async findMine(accountId: string, onlyUnread = false) {
        return this.prisma.notification.findMany({
            where: {
                accountId,
                ...(onlyUnread ? { isRead: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async markRead(id: string, accountId: string) {
        return this.prisma.notification.updateMany({
            where: { id, accountId },
            data: { isRead: true },
        });
    }

    async markAllRead(accountId: string) {
        return this.prisma.notification.updateMany({
            where: { accountId, isRead: false },
            data: { isRead: true },
        });
    }

    async countUnread(accountId: string): Promise<number> {
        return this.prisma.notification.count({
            where: { accountId, isRead: false },
        });
    }
}

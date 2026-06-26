-- CreateTable
CREATE TABLE `account` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `refreshTokenHash` VARCHAR(255) NULL,
    `role` ENUM('USER', 'PROFESSIONAL', 'ADMIN') NOT NULL,
    `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerifyToken` VARCHAR(255) NULL,
    `resetPasswordToken` VARCHAR(255) NULL,
    `resetPasswordExpires` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(36) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(50) NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `address` VARCHAR(500) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `slug` VARCHAR(100) NOT NULL,
    `account_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `user_unique`(`slug`),
    UNIQUE INDEX `user_unique_1`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional` (
    `id` CHAR(36) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(50) NULL,
    `bio` TEXT NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `coverPhotoUrl` VARCHAR(500) NULL,
    `rating` FLOAT NOT NULL DEFAULT 0,
    `city` VARCHAR(120) NULL,
    `zone` VARCHAR(120) NULL,
    `minPrice` FLOAT NULL,
    `maxPrice` FLOAT NULL,
    `yearsExperience` INTEGER NULL DEFAULT 0,
    `availability` ENUM('AVAILABLE', 'BUSY', 'OFFLINE') NOT NULL DEFAULT 'AVAILABLE',
    `status` ENUM('ACTIVE', 'PAUSED', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    `verificationStatus` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `isProfilePublic` BOOLEAN NOT NULL DEFAULT true,
    `profileViews` INTEGER NOT NULL DEFAULT 0,
    `contactCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `slug` VARCHAR(100) NOT NULL,
    `account_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `professional_unique`(`slug`),
    UNIQUE INDEX `professional_unique_1`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional_photo` (
    `id` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `type` ENUM('PORTFOLIO', 'BEFORE_AFTER') NOT NULL DEFAULT 'PORTFOLIO',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_photo_professional`(`professionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional_certification` (
    `id` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `issuer` VARCHAR(255) NULL,
    `issuedAt` DATETIME(0) NULL,
    `expiresAt` DATETIME(0) NULL,
    `documentUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_cert_professional`(`professionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional_service` (
    `id` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` FLOAT NULL,
    `durationMinutes` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_service_professional`(`professionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional_schedule` (
    `id` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `startTime` VARCHAR(5) NOT NULL,
    `endTime` VARCHAR(5) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,

    INDEX `idx_schedule_professional`(`professionalId`),
    UNIQUE INDEX `uniq_schedule_day`(`professionalId`, `dayOfWeek`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `category_name_key`(`name`),
    UNIQUE INDEX `category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional_category` (
    `professionalId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NOT NULL,

    INDEX `idx_prof_category_category`(`categoryId`),
    PRIMARY KEY (`professionalId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_job` (
    `id` CHAR(36) NOT NULL,
    `clientAccountId` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `address` VARCHAR(500) NULL,
    `budget` FLOAT NULL,
    `scheduledAt` DATETIME(0) NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `completedAt` DATETIME(0) NULL,

    INDEX `idx_job_professional`(`professionalId`),
    INDEX `idx_job_client`(`clientAccountId`),
    INDEX `idx_job_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `reviewerAccountId` CHAR(36) NULL,
    `serviceJobId` CHAR(36) NULL,
    `reviewerName` VARCHAR(255) NOT NULL,
    `rating` FLOAT NOT NULL,
    `comment` TEXT NULL,
    `status` ENUM('VISIBLE', 'HIDDEN') NOT NULL DEFAULT 'VISIBLE',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `review_serviceJobId_key`(`serviceJobId`),
    INDEX `fk_professional`(`professionalId`),
    INDEX `idx_review_reviewer`(`reviewerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_report` (
    `id` CHAR(36) NOT NULL,
    `reviewId` CHAR(36) NOT NULL,
    `reporterAccountId` CHAR(36) NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('OPEN', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_report_status`(`status`),
    UNIQUE INDEX `uniq_review_reporter`(`reviewId`, `reporterAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_photo` (
    `id` CHAR(36) NOT NULL,
    `reviewId` CHAR(36) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_review_photo_review`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quote_request` (
    `id` CHAR(36) NOT NULL,
    `clientAccountId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `city` VARCHAR(120) NULL,
    `budget` FLOAT NULL,
    `status` ENUM('OPEN', 'ASSIGNED', 'CLOSED', 'EXPIRED') NOT NULL DEFAULT 'OPEN',
    `expiresAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_quote_client`(`clientAccountId`),
    INDEX `idx_quote_category`(`categoryId`),
    INDEX `idx_quote_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quote_offer` (
    `id` CHAR(36) NOT NULL,
    `quoteRequestId` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `price` FLOAT NOT NULL,
    `description` TEXT NULL,
    `estimatedDays` INTEGER NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_offer_request`(`quoteRequestId`),
    INDEX `idx_offer_professional`(`professionalId`),
    UNIQUE INDEX `uniq_quote_offer`(`quoteRequestId`, `professionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_conversation` (
    `id` CHAR(36) NOT NULL,
    `clientAccountId` CHAR(36) NOT NULL,
    `professionalAccountId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_conv_client`(`clientAccountId`),
    INDEX `idx_conv_professional`(`professionalAccountId`),
    UNIQUE INDEX `uniq_conversation`(`clientAccountId`, `professionalAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_message` (
    `id` CHAR(36) NOT NULL,
    `conversationId` CHAR(36) NOT NULL,
    `senderAccountId` CHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('TEXT', 'IMAGE', 'LOCATION') NOT NULL DEFAULT 'TEXT',
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_msg_conversation`(`conversationId`),
    INDEX `idx_msg_sender`(`senderAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `id` CHAR(36) NOT NULL,
    `clientAccountId` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `serviceJobId` CHAR(36) NULL,
    `scheduledAt` DATETIME(0) NOT NULL,
    `durationMinutes` INTEGER NOT NULL DEFAULT 60,
    `address` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'RESCHEDULED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `appointment_serviceJobId_key`(`serviceJobId`),
    INDEX `idx_appt_client`(`clientAccountId`),
    INDEX `idx_appt_professional`(`professionalId`),
    INDEX `idx_appt_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` CHAR(36) NOT NULL,
    `accountId` CHAR(36) NOT NULL,
    `type` ENUM('JOB_REQUEST', 'JOB_STATUS_UPDATE', 'NEW_MESSAGE', 'QUOTE_RECEIVED', 'QUOTE_ACCEPTED', 'APPOINTMENT_SCHEDULED', 'APPOINTMENT_REMINDER', 'REVIEW_RECEIVED', 'SYSTEM') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `data` TEXT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_notif_account`(`accountId`),
    INDEX `idx_notif_read`(`isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_plan` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` FLOAT NOT NULL,
    `maxContactsPerMonth` INTEGER NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `hasAdvancedStats` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `subscription_plan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription` (
    `id` CHAR(36) NOT NULL,
    `professionalId` CHAR(36) NOT NULL,
    `planId` CHAR(36) NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(0) NOT NULL,
    `endDate` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_sub_professional`(`professionalId`),
    INDEX `idx_sub_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` CHAR(36) NOT NULL,
    `subscriptionId` CHAR(36) NULL,
    `accountId` CHAR(36) NOT NULL,
    `amount` FLOAT NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'UYU',
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `method` ENUM('CARD', 'MERCADO_PAGO', 'TRANSFER') NOT NULL DEFAULT 'CARD',
    `externalReference` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_payment_account`(`accountId`),
    INDEX `idx_payment_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `professional_photo` ADD CONSTRAINT `professional_photo_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_certification` ADD CONSTRAINT `professional_certification_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_service` ADD CONSTRAINT `professional_service_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_schedule` ADD CONSTRAINT `professional_schedule_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_category` ADD CONSTRAINT `professional_category_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_category` ADD CONSTRAINT `professional_category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_job` ADD CONSTRAINT `service_job_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_professional` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_review_service_job` FOREIGN KEY (`serviceJobId`) REFERENCES `service_job`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review_report` ADD CONSTRAINT `review_report_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_photo` ADD CONSTRAINT `review_photo_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_request` ADD CONSTRAINT `quote_request_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_offer` ADD CONSTRAINT `quote_offer_quoteRequestId_fkey` FOREIGN KEY (`quoteRequestId`) REFERENCES `quote_request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_offer` ADD CONSTRAINT `quote_offer_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_message` ADD CONSTRAINT `chat_message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `chat_conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscription_plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

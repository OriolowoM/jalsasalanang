CREATE TABLE `User` (
    `id` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `passwordHash` VARCHAR(100) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(100) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `attendeeCategory` VARCHAR(100) NULL DEFAULT 'MEMBER',
    `travelOrigin` VARCHAR(100) NULL,
    `assignedGate` VARCHAR(100) NULL,
    `roleId` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Role` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NULL,
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    UNIQUE INDEX `Role_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Permission` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `module` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NULL,

    UNIQUE INDEX `Permission_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `RolePermission` (
    `roleId` VARCHAR(100) NOT NULL,
    `permissionId` VARCHAR(100) NOT NULL,

    INDEX `RolePermission_permissionId_idx`(`permissionId`),
    PRIMARY KEY (`roleId`, `permissionId`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Author` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NULL,
    `bio` TEXT NULL,
    `avatar` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `twitter` VARCHAR(100) NULL,
    `linkedin` VARCHAR(100) NULL,
    `userId` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Author_slug_key`(`slug`),
    UNIQUE INDEX `Author_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Article` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `subtitle` TEXT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,
    `featuredImage` VARCHAR(512) NULL,
    `imageCredit` VARCHAR(255) NULL,
    `readingTime` INTEGER NOT NULL DEFAULT 3,
    `featuredType` ENUM('NONE', 'HERO', 'SECONDARY', 'EDITORS_PICK') NOT NULL DEFAULT 'NONE',
    `status` ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `scheduledAt` DATETIME(3) NULL,
    `viewsCount` INTEGER NOT NULL DEFAULT 0,
    `authorId` VARCHAR(100) NOT NULL,
    `createdById` VARCHAR(100) NULL,
    `editionId` VARCHAR(100) NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` TEXT NULL,
    `canonicalUrl` VARCHAR(512) NULL,
    `ogImage` VARCHAR(512) NULL,
    `wpId` INTEGER NULL,
    `sourceSite` VARCHAR(100) NULL,
    `originalUrl` VARCHAR(512) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Article_slug_key`(`slug`),
    INDEX `Article_authorId_idx`(`authorId`),
    INDEX `Article_editionId_idx`(`editionId`),
    INDEX `Article_status_idx`(`status`),
    INDEX `Article_featuredType_idx`(`featuredType`),
    INDEX `Article_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ArticleRevision` (
    `id` VARCHAR(100) NOT NULL,
    `articleId` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` TEXT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,
    `changedById` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ArticleRevision_articleId_idx`(`articleId`),
    INDEX `ArticleRevision_changedById_idx`(`changedById`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Category` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(512) NULL,
    `color` VARCHAR(30) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ArticleCategory` (
    `articleId` VARCHAR(100) NOT NULL,
    `categoryId` VARCHAR(100) NOT NULL,

    INDEX `ArticleCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`articleId`, `categoryId`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Tag` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Tag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ArticleTag` (
    `articleId` VARCHAR(100) NOT NULL,
    `tagId` VARCHAR(100) NOT NULL,

    INDEX `ArticleTag_tagId_idx`(`tagId`),
    PRIMARY KEY (`articleId`, `tagId`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `JalsaEdition` (
    `id` VARCHAR(100) NOT NULL,
    `year` INTEGER NOT NULL,
    `editionNumber` VARCHAR(100) NOT NULL,
    `themeEnglish` VARCHAR(255) NOT NULL,
    `themeArabic` VARCHAR(255) NULL,
    `venue` VARCHAR(255) NOT NULL,
    `dates` VARCHAR(100) NOT NULL,
    `attendance` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `history` LONGTEXT NULL,
    `featuredImage` VARCHAR(512) NULL,
    `liveStreamUrl` VARCHAR(512) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `schedule` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JalsaEdition_year_key`(`year`),
    INDEX `JalsaEdition_year_idx`(`year`),
    INDEX `JalsaEdition_isCurrent_idx`(`isCurrent`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Speech` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `speakerName` VARCHAR(100) NOT NULL,
    `speakerTitle` VARCHAR(255) NULL,
    `speechType` VARCHAR(100) NOT NULL,
    `session` VARCHAR(100) NULL,
    `audioUrl` VARCHAR(512) NULL,
    `videoUrl` VARCHAR(512) NULL,
    `transcript` LONGTEXT NULL,
    `downloadPdfUrl` VARCHAR(512) NULL,
    `summary` TEXT NULL,
    `editionId` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Speech_slug_key`(`slug`),
    INDEX `Speech_editionId_idx`(`editionId`),
    INDEX `Speech_speechType_idx`(`speechType`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Media` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `caption` TEXT NULL,
    `credit` VARCHAR(255) NULL,
    `fileUrl` VARCHAR(512) NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `fileSize` INTEGER NOT NULL DEFAULT 0,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `editionId` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Media_editionId_idx`(`editionId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Gallery` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `coverImage` VARCHAR(512) NULL,
    `photographer` VARCHAR(255) NULL,
    `eventDay` VARCHAR(100) NULL,
    `videoUrl` VARCHAR(512) NULL,
    `editionId` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Gallery_slug_key`(`slug`),
    INDEX `Gallery_editionId_idx`(`editionId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `GalleryItem` (
    `id` VARCHAR(100) NOT NULL,
    `galleryId` VARCHAR(100) NOT NULL,
    `mediaId` VARCHAR(100) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `captionOverride` TEXT NULL,

    INDEX `GalleryItem_galleryId_idx`(`galleryId`),
    INDEX `GalleryItem_mediaId_idx`(`mediaId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Page` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` TEXT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `wpId` INTEGER NULL,
    `sourceSite` VARCHAR(100) NULL,
    `originalUrl` VARCHAR(512) NULL,
    `featuredImage` VARCHAR(512) NULL,
    `excerpt` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Page_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `NavigationMenu` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `location` ENUM('HEADER_PRIMARY', 'HEADER_TOP', 'FOOTER_EXPLORE', 'FOOTER_LEGAL', 'FOOTER_EDITIONS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NavigationMenu_location_key`(`location`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `NavigationItem` (
    `id` VARCHAR(100) NOT NULL,
    `menuId` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `parentId` VARCHAR(100) NULL,
    `target` VARCHAR(20) NOT NULL DEFAULT '_self',

    INDEX `NavigationItem_menuId_idx`(`menuId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `fullName` VARCHAR(100) NULL,
    `status` ENUM('ACTIVE', 'UNSUBSCRIBED') NOT NULL DEFAULT 'ACTIVE',
    `token` VARCHAR(64) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unsubscribedAt` DATETIME(3) NULL,

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    UNIQUE INDEX `NewsletterSubscriber_token_key`(`token`),
    INDEX `NewsletterSubscriber_status_idx`(`status`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SiteSetting` (
    `id` VARCHAR(100) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `value` LONGTEXT NOT NULL,
    `group` VARCHAR(50) NOT NULL DEFAULT 'general',
    `description` VARCHAR(255) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SiteSetting_key_key`(`key`),
    INDEX `SiteSetting_group_idx`(`group`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ArticleView` (
    `id` VARCHAR(100) NOT NULL,
    `articleId` VARCHAR(100) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(255) NULL,
    `referrer` VARCHAR(512) NULL,
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ArticleView_articleId_idx`(`articleId`),
    INDEX `ArticleView_viewedAt_idx`(`viewedAt`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AuditLog` (
    `id` VARCHAR(100) NOT NULL,
    `userId` VARCHAR(100) NULL,
    `action` VARCHAR(100) NOT NULL,
    `entityType` VARCHAR(50) NOT NULL,
    `entityId` VARCHAR(100) NULL,
    `details` JSON NULL,
    `ipAddress` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `wordpress_migration_record` (
    `id` VARCHAR(100) NOT NULL,
    `wpId` INTEGER NOT NULL,
    `sourceSite` VARCHAR(100) NOT NULL,
    `postType` VARCHAR(50) NOT NULL,
    `title` VARCHAR(512) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `date` DATETIME(3) NULL,
    `originalUrl` VARCHAR(512) NULL,
    `cleanContent` LONGTEXT NOT NULL,
    `rawContent` LONGTEXT NOT NULL,
    `excerpt` TEXT NULL,
    `featuredImage` VARCHAR(512) NULL,
    `associatedType` VARCHAR(50) NOT NULL,
    `associatedId` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `wordpress_migration_record_sourceSite_idx`(`sourceSite`),
    INDEX `wordpress_migration_record_postType_idx`(`postType`),
    INDEX `wordpress_migration_record_slug_idx`(`slug`),
    UNIQUE INDEX `wordpress_migration_record_sourceSite_wpId_postType_key`(`sourceSite`, `wpId`, `postType`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `wordpress_asset` (
    `id` VARCHAR(100) NOT NULL,
    `originalUrl` VARCHAR(512) NOT NULL,
    `localPath` VARCHAR(512) NULL,
    `sourceSite` VARCHAR(100) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `mimeType` VARCHAR(100) NULL,
    `postOrPageTitle` VARCHAR(255) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DISCOVERED',
    `referenceCount` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `wordpress_asset_originalUrl_key`(`originalUrl`),
    INDEX `wordpress_asset_sourceSite_idx`(`sourceSite`),
    INDEX `wordpress_asset_status_idx`(`status`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `zone_traffic` (
    `id` VARCHAR(100) NOT NULL,
    `zoneKey` VARCHAR(100) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `type` ENUM('DINING', 'SANITARY', 'PRAYER', 'PARKING', 'ENTRANCE', 'CLINIC') NOT NULL,
    `status` ENUM('GREEN', 'ORANGE', 'RED') NOT NULL DEFAULT 'GREEN',
    `currentOccupancy` INTEGER NOT NULL DEFAULT 0,
    `maxCapacity` INTEGER NOT NULL DEFAULT 1000,
    `alternateZoneId` VARCHAR(100) NULL,
    `alternateNote` VARCHAR(255) NULL,
    `mapCoordinates` JSON NULL,
    `lastUpdatedBy` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `zone_traffic_zoneKey_key`(`zoneKey`),
    INDEX `zone_traffic_type_idx`(`type`),
    INDEX `zone_traffic_status_idx`(`status`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `article_translations` (
    `id` VARCHAR(100) NOT NULL,
    `articleId` VARCHAR(100) NOT NULL,
    `locale` ENUM('YO', 'HA', 'IG', 'AR') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` TEXT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,
    `status` ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING_REVIEW',
    `reviewedBy` VARCHAR(100) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `translatedBy` VARCHAR(50) NOT NULL DEFAULT 'GEMINI_AI',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `article_translations_articleId_idx`(`articleId`),
    INDEX `article_translations_locale_idx`(`locale`),
    INDEX `article_translations_status_idx`(`status`),
    UNIQUE INDEX `article_translations_articleId_locale_key`(`articleId`, `locale`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `concierge_queries` (
    `id` VARCHAR(100) NOT NULL,
    `sessionId` VARCHAR(100) NULL,
    `userQuery` TEXT NOT NULL,
    `aiResponse` LONGTEXT NOT NULL,
    `category` VARCHAR(100) NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT true,
    `clientIp` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `concierge_queries_sessionId_idx`(`sessionId`),
    INDEX `concierge_queries_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Author` ADD CONSTRAINT `Author_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Article` ADD CONSTRAINT `Article_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Article` ADD CONSTRAINT `Article_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Article` ADD CONSTRAINT `Article_editionId_fkey` FOREIGN KEY (`editionId`) REFERENCES `JalsaEdition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ArticleRevision` ADD CONSTRAINT `ArticleRevision_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ArticleRevision` ADD CONSTRAINT `ArticleRevision_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ArticleCategory` ADD CONSTRAINT `ArticleCategory_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ArticleCategory` ADD CONSTRAINT `ArticleCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ArticleTag` ADD CONSTRAINT `ArticleTag_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ArticleTag` ADD CONSTRAINT `ArticleTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Speech` ADD CONSTRAINT `Speech_editionId_fkey` FOREIGN KEY (`editionId`) REFERENCES `JalsaEdition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Media` ADD CONSTRAINT `Media_editionId_fkey` FOREIGN KEY (`editionId`) REFERENCES `JalsaEdition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_editionId_fkey` FOREIGN KEY (`editionId`) REFERENCES `JalsaEdition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `GalleryItem` ADD CONSTRAINT `GalleryItem_galleryId_fkey` FOREIGN KEY (`galleryId`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GalleryItem` ADD CONSTRAINT `GalleryItem_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `NavigationItem` ADD CONSTRAINT `NavigationItem_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `NavigationMenu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ArticleView` ADD CONSTRAINT `ArticleView_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `zone_traffic` ADD CONSTRAINT `zone_traffic_alternateZoneId_fkey` FOREIGN KEY (`alternateZoneId`) REFERENCES `zone_traffic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `article_translations` ADD CONSTRAINT `article_translations_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

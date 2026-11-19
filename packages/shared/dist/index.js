"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteSettingSchema = exports.newsletterSubscribeSchema = exports.speechSchema = exports.editionSchema = exports.categorySchema = exports.updateArticleSchema = exports.createArticleSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Auth Schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
// Article Schemas
exports.createArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title is required').max(255),
    slug: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    excerpt: zod_1.z.string().optional(),
    content: zod_1.z.string().min(1, 'Content is required'),
    featuredImage: zod_1.z.string().optional(),
    imageCredit: zod_1.z.string().optional(),
    readingTime: zod_1.z.number().int().min(1).default(3),
    featuredType: zod_1.z.enum(['NONE', 'HERO', 'SECONDARY', 'EDITORS_PICK']).default('NONE'),
    status: zod_1.z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    publishedAt: zod_1.z.string().datetime().optional().nullable(),
    scheduledAt: zod_1.z.string().datetime().optional().nullable(),
    authorId: zod_1.z.string().min(1, 'Author is required'),
    editionId: zod_1.z.string().optional().nullable(),
    categoryIds: zod_1.z.array(zod_1.z.string()).default([]),
    tagNames: zod_1.z.array(zod_1.z.string()).default([]),
    metaTitle: zod_1.z.string().max(255).optional(),
    metaDescription: zod_1.z.string().optional(),
    canonicalUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    ogImage: zod_1.z.string().optional(),
});
exports.updateArticleSchema = exports.createArticleSchema.partial();
// Category Schemas
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().default(0),
});
// Edition Schemas
exports.editionSchema = zod_1.z.object({
    year: zod_1.z.number().int().min(1900).max(2100),
    editionNumber: zod_1.z.string().min(1),
    themeEnglish: zod_1.z.string().min(1),
    themeArabic: zod_1.z.string().optional(),
    venue: zod_1.z.string().min(1),
    dates: zod_1.z.string().min(1),
    attendance: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    history: zod_1.z.string().optional(),
    featuredImage: zod_1.z.string().optional(),
    liveStreamUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    isCurrent: zod_1.z.boolean().default(false),
    schedule: zod_1.z.any().optional(),
});
// Speech Schemas
exports.speechSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(255),
    slug: zod_1.z.string().optional(),
    speakerName: zod_1.z.string().min(2),
    speakerTitle: zod_1.z.string().optional(),
    speechType: zod_1.z.string().min(2),
    session: zod_1.z.string().optional(),
    audioUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    videoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    transcript: zod_1.z.string().optional(),
    downloadPdfUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    summary: zod_1.z.string().optional(),
    editionId: zod_1.z.string().optional().nullable(),
});
// Newsletter Schema
exports.newsletterSubscribeSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    fullName: zod_1.z.string().optional(),
    websiteHp: zod_1.z.string().optional(), // Honeypot field
});
// Site Settings Schema
exports.siteSettingSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    value: zod_1.z.string(),
    group: zod_1.z.string().default('general'),
    description: zod_1.z.string().optional(),
});
__exportStar(require("./programme-2026"), exports);
__exportStar(require("./jingles-2026"), exports);
__exportStar(require("./article-images"), exports);

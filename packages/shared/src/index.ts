import { z } from 'zod';

export type ArticleStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
export type FeaturedType = 'NONE' | 'HERO' | 'SECONDARY' | 'EDITORS_PICK';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type SubscriberStatus = 'ACTIVE' | 'UNSUBSCRIBED';
export type MenuLocation = 'HEADER_PRIMARY' | 'HEADER_TOP' | 'FOOTER_EXPLORE' | 'FOOTER_LEGAL' | 'FOOTER_EDITIONS';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Article Schemas
export const createArticleSchema = z.object({
  title: z.string().min(3, 'Title is required').max(255),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  imageCredit: z.string().optional(),
  readingTime: z.number().int().min(1).default(3),
  featuredType: z.enum(['NONE', 'HERO', 'SECONDARY', 'EDITORS_PICK']).default('NONE'),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  authorId: z.string().min(1, 'Author is required'),
  editionId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
  tagNames: z.array(z.string()).default([]),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  ogImage: z.string().optional(),
});
export type CreateArticleInput = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = createArticleSchema.partial();
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

// Category Schemas
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// Edition Schemas
export const editionSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  editionNumber: z.string().min(1),
  themeEnglish: z.string().min(1),
  themeArabic: z.string().optional(),
  venue: z.string().min(1),
  dates: z.string().min(1),
  attendance: z.string().optional(),
  description: z.string().optional(),
  history: z.string().optional(),
  featuredImage: z.string().optional(),
  liveStreamUrl: z.string().url().optional().or(z.literal('')),
  isCurrent: z.boolean().default(false),
  schedule: z.any().optional(),
});
export type EditionInput = z.infer<typeof editionSchema>;

// Speech Schemas
export const speechSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().optional(),
  speakerName: z.string().min(2),
  speakerTitle: z.string().optional(),
  speechType: z.string().min(2),
  session: z.string().optional(),
  audioUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  transcript: z.string().optional(),
  downloadPdfUrl: z.string().url().optional().or(z.literal('')),
  summary: z.string().optional(),
  editionId: z.string().optional().nullable(),
});
export type SpeechInput = z.infer<typeof speechSchema>;

// Newsletter Schema
export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().optional(),
  websiteHp: z.string().optional(), // Honeypot field
});
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

// Site Settings Schema
export const siteSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  group: z.string().default('general'),
  description: z.string().optional(),
});
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;

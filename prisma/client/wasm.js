
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  avatar: 'avatar',
  status: 'status',
  attendeeCategory: 'attendeeCategory',
  travelOrigin: 'travelOrigin',
  assignedGate: 'assignedGate',
  roleId: 'roleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  isSystem: 'isSystem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  module: 'module',
  description: 'description'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  roleId: 'roleId',
  permissionId: 'permissionId'
};

exports.Prisma.AuthorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  title: 'title',
  bio: 'bio',
  avatar: 'avatar',
  email: 'email',
  twitter: 'twitter',
  linkedin: 'linkedin',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArticleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  subtitle: 'subtitle',
  excerpt: 'excerpt',
  content: 'content',
  featuredImage: 'featuredImage',
  imageCredit: 'imageCredit',
  readingTime: 'readingTime',
  featuredType: 'featuredType',
  status: 'status',
  publishedAt: 'publishedAt',
  scheduledAt: 'scheduledAt',
  viewsCount: 'viewsCount',
  authorId: 'authorId',
  createdById: 'createdById',
  editionId: 'editionId',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  canonicalUrl: 'canonicalUrl',
  ogImage: 'ogImage',
  wpId: 'wpId',
  sourceSite: 'sourceSite',
  originalUrl: 'originalUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArticleRevisionScalarFieldEnum = {
  id: 'id',
  articleId: 'articleId',
  title: 'title',
  subtitle: 'subtitle',
  excerpt: 'excerpt',
  content: 'content',
  changedById: 'changedById',
  createdAt: 'createdAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  color: 'color',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArticleCategoryScalarFieldEnum = {
  articleId: 'articleId',
  categoryId: 'categoryId'
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt'
};

exports.Prisma.ArticleTagScalarFieldEnum = {
  articleId: 'articleId',
  tagId: 'tagId'
};

exports.Prisma.JalsaEditionScalarFieldEnum = {
  id: 'id',
  year: 'year',
  editionNumber: 'editionNumber',
  themeEnglish: 'themeEnglish',
  themeArabic: 'themeArabic',
  venue: 'venue',
  dates: 'dates',
  attendance: 'attendance',
  description: 'description',
  history: 'history',
  featuredImage: 'featuredImage',
  liveStreamUrl: 'liveStreamUrl',
  isCurrent: 'isCurrent',
  schedule: 'schedule',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SpeechScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  speakerName: 'speakerName',
  speakerTitle: 'speakerTitle',
  speechType: 'speechType',
  session: 'session',
  audioUrl: 'audioUrl',
  videoUrl: 'videoUrl',
  transcript: 'transcript',
  downloadPdfUrl: 'downloadPdfUrl',
  summary: 'summary',
  editionId: 'editionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MediaScalarFieldEnum = {
  id: 'id',
  title: 'title',
  caption: 'caption',
  credit: 'credit',
  fileUrl: 'fileUrl',
  mimeType: 'mimeType',
  fileSize: 'fileSize',
  width: 'width',
  height: 'height',
  editionId: 'editionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GalleryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  description: 'description',
  coverImage: 'coverImage',
  photographer: 'photographer',
  eventDay: 'eventDay',
  videoUrl: 'videoUrl',
  editionId: 'editionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GalleryItemScalarFieldEnum = {
  id: 'id',
  galleryId: 'galleryId',
  mediaId: 'mediaId',
  sortOrder: 'sortOrder',
  captionOverride: 'captionOverride'
};

exports.Prisma.PageScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  isPublished: 'isPublished',
  wpId: 'wpId',
  sourceSite: 'sourceSite',
  originalUrl: 'originalUrl',
  featuredImage: 'featuredImage',
  excerpt: 'excerpt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NavigationMenuScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location: 'location',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NavigationItemScalarFieldEnum = {
  id: 'id',
  menuId: 'menuId',
  title: 'title',
  url: 'url',
  sortOrder: 'sortOrder',
  parentId: 'parentId',
  target: 'target'
};

exports.Prisma.NewsletterSubscriberScalarFieldEnum = {
  id: 'id',
  email: 'email',
  fullName: 'fullName',
  status: 'status',
  token: 'token',
  ipAddress: 'ipAddress',
  subscribedAt: 'subscribedAt',
  unsubscribedAt: 'unsubscribedAt'
};

exports.Prisma.SiteSettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  group: 'group',
  description: 'description',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArticleViewScalarFieldEnum = {
  id: 'id',
  articleId: 'articleId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  referrer: 'referrer',
  viewedAt: 'viewedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  details: 'details',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.WordPressMigrationRecordScalarFieldEnum = {
  id: 'id',
  wpId: 'wpId',
  sourceSite: 'sourceSite',
  postType: 'postType',
  title: 'title',
  slug: 'slug',
  date: 'date',
  originalUrl: 'originalUrl',
  cleanContent: 'cleanContent',
  rawContent: 'rawContent',
  excerpt: 'excerpt',
  featuredImage: 'featuredImage',
  associatedType: 'associatedType',
  associatedId: 'associatedId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WordPressAssetScalarFieldEnum = {
  id: 'id',
  originalUrl: 'originalUrl',
  localPath: 'localPath',
  sourceSite: 'sourceSite',
  fileName: 'fileName',
  mimeType: 'mimeType',
  postOrPageTitle: 'postOrPageTitle',
  status: 'status',
  referenceCount: 'referenceCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ZoneTrafficScalarFieldEnum = {
  id: 'id',
  zoneKey: 'zoneKey',
  name: 'name',
  type: 'type',
  status: 'status',
  currentOccupancy: 'currentOccupancy',
  maxCapacity: 'maxCapacity',
  alternateZoneId: 'alternateZoneId',
  alternateNote: 'alternateNote',
  mapCoordinates: 'mapCoordinates',
  lastUpdatedBy: 'lastUpdatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ArticleTranslationScalarFieldEnum = {
  id: 'id',
  articleId: 'articleId',
  locale: 'locale',
  title: 'title',
  subtitle: 'subtitle',
  excerpt: 'excerpt',
  content: 'content',
  status: 'status',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  translatedBy: 'translatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConciergeQueryScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  userQuery: 'userQuery',
  aiResponse: 'aiResponse',
  category: 'category',
  resolved: 'resolved',
  clientIp: 'clientIp',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserStatus = exports.$Enums.UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED'
};

exports.FeaturedType = exports.$Enums.FeaturedType = {
  NONE: 'NONE',
  HERO: 'HERO',
  SECONDARY: 'SECONDARY',
  EDITORS_PICK: 'EDITORS_PICK'
};

exports.ArticleStatus = exports.$Enums.ArticleStatus = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  SCHEDULED: 'SCHEDULED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.MenuLocation = exports.$Enums.MenuLocation = {
  HEADER_PRIMARY: 'HEADER_PRIMARY',
  HEADER_TOP: 'HEADER_TOP',
  FOOTER_EXPLORE: 'FOOTER_EXPLORE',
  FOOTER_LEGAL: 'FOOTER_LEGAL',
  FOOTER_EDITIONS: 'FOOTER_EDITIONS'
};

exports.SubscriberStatus = exports.$Enums.SubscriberStatus = {
  ACTIVE: 'ACTIVE',
  UNSUBSCRIBED: 'UNSUBSCRIBED'
};

exports.ZoneType = exports.$Enums.ZoneType = {
  DINING: 'DINING',
  SANITARY: 'SANITARY',
  PRAYER: 'PRAYER',
  PARKING: 'PARKING',
  ENTRANCE: 'ENTRANCE',
  CLINIC: 'CLINIC'
};

exports.ZoneStatus = exports.$Enums.ZoneStatus = {
  GREEN: 'GREEN',
  ORANGE: 'ORANGE',
  RED: 'RED'
};

exports.TranslationLocale = exports.$Enums.TranslationLocale = {
  YO: 'YO',
  HA: 'HA',
  IG: 'IG',
  AR: 'AR'
};

exports.TranslationStatus = exports.$Enums.TranslationStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Role: 'Role',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  Author: 'Author',
  Article: 'Article',
  ArticleRevision: 'ArticleRevision',
  Category: 'Category',
  ArticleCategory: 'ArticleCategory',
  Tag: 'Tag',
  ArticleTag: 'ArticleTag',
  JalsaEdition: 'JalsaEdition',
  Speech: 'Speech',
  Media: 'Media',
  Gallery: 'Gallery',
  GalleryItem: 'GalleryItem',
  Page: 'Page',
  NavigationMenu: 'NavigationMenu',
  NavigationItem: 'NavigationItem',
  NewsletterSubscriber: 'NewsletterSubscriber',
  SiteSetting: 'SiteSetting',
  ArticleView: 'ArticleView',
  AuditLog: 'AuditLog',
  WordPressMigrationRecord: 'WordPressMigrationRecord',
  WordPressAsset: 'WordPressAsset',
  ZoneTraffic: 'ZoneTraffic',
  ArticleTranslation: 'ArticleTranslation',
  ConciergeQuery: 'ConciergeQuery'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

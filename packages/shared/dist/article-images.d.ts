/**
 * Real Jalsa Salana Nigeria Photographic Archives
 * Authentic photography catalog and deterministic image mapping for articles.
 */
export declare const JALSA_AUTHENTIC_GALLERY_IMAGES: readonly string[];
export declare function getArticleFeaturedImage(article?: {
    featuredImage?: string | null;
    slug?: string;
    id?: string;
    title?: string;
} | null, fallbackIndex?: number): string;

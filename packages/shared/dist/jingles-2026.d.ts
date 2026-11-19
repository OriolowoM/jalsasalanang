export type JingleLanguageId = 'en' | 'yo' | 'ha' | 'ar';
export interface JalsaJingleTrack {
    id: JingleLanguageId;
    label: string;
    nativeLabel: string;
    subtitle: string;
    audioUrl: string;
    hash: string;
    dir: 'ltr' | 'rtl';
    statusVideoUrl?: string;
    lyrics: string;
    badge?: string;
    downloadFilename: string;
}
export interface JinglesConfig {
    eventTitle: string;
    theme: string;
    dates: string;
    venue: string;
    promoPackZipUrl?: string;
    tracks: JalsaJingleTrack[];
}
export declare const JALSA_JINGLES_2026: JinglesConfig;
export declare function getTrackById(id: JingleLanguageId): JalsaJingleTrack;
export declare function getTrackByHash(hash: string): JalsaJingleTrack | undefined;

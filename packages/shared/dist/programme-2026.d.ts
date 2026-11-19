export type Category = "All" | "Lecture" | "Prayer" | "Recitation & Poem" | "Ceremony & Awards" | "Meal" | "Translation & Q&A";
export interface ProgrammeItem {
    id: string;
    time: string;
    session: string;
    category: Exclude<Category, "All">;
    title: string;
    titleSuffix?: string;
    inlineArabicSup?: string;
    arabic?: string;
    topic?: string;
    facilitator?: string;
    panel?: string[];
    highlight?: boolean;
}
export interface ProgrammeDay {
    id: string;
    shortLabel: string;
    fullLabel: string;
    dateISO: string;
    subtitle: string;
    items: ProgrammeItem[];
}
export declare const JALSA_2026_META: {
    readonly organization: "Ahmadiyya Muslim Jama’at of Nigeria";
    readonly eventTitle: "72nd Jalsa Salana";
    readonly datesDisplay: "18th, 19th & 20th December 2026";
    readonly venue: "Jamia Ahmadiyya Ilaro, Ogun State";
    readonly theme: "Observing Justice and Human Rights: The foundation for true Global Peace";
    readonly pdfDownloadUrl: "/downloads/72nd-jalsa-salana-nigeria-2026-programme.pdf";
    readonly closingBenediction: "FI ‘AMANILLAH; MAY ALLAH THE ALMIGHTY GRANT EVERYBODY HIS JOURNEY MERCIES";
};
export declare const PROGRAMME_DAYS: ProgrammeDay[];

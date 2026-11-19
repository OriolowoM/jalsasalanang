"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JALSA_JINGLES_2026 = void 0;
exports.getTrackById = getTrackById;
exports.getTrackByHash = getTrackByHash;
exports.JALSA_JINGLES_2026 = {
    eventTitle: "72nd Jalsa Salana Nigeria 2026",
    theme: "Observing Justice and Human Rights: The foundation for true Global Peace",
    dates: "18th–20th December 2026",
    venue: "Jamia Ahmadiyya Ilaro, Ogun State, Nigeria",
    promoPackZipUrl: "/audio/jalsa-2026-jingles-pack.zip",
    tracks: [
        {
            id: "en",
            label: "English",
            nativeLabel: "English",
            subtitle: "Official Convention Theme Jingle",
            audioUrl: "/audio/jalsa-2026-en.mp3",
            hash: "#jingle-en",
            dir: "ltr",
            downloadFilename: "72nd-Jalsa-Salana-Nigeria-2026-Jingle-English.mp3",
            badge: "National Broadcast",
            lyrics: `[OFFICIAL JINGLE SCRIPT — ENGLISH]
Theme: Observing Justice and Human Rights: The foundation for true Global Peace

Come one, come all to the blessed gathering,
The 72nd Jalsa Salana Nigeria 2026!
Under the divine guidance of Khilafat-e-Ahmadiyya,
We stand for justice, equality, and universal dignity.

Dates: Friday 18th to Sunday 20th December 2026
Venue: Jamia Ahmadiyya Ilaro, Ogun State, Nigeria
"Love for All, Hatred for None" — Be a part of the spiritual revival!`,
        },
        {
            id: "yo",
            label: "Yoruba",
            nativeLabel: "Èdè Yorùbá",
            subtitle: "Orin Ipe Jalsa Salana 2026",
            audioUrl: "/audio/jalsa-2026-yo.mp3",
            hash: "#jingle-yo",
            dir: "ltr",
            downloadFilename: "72nd-Jalsa-Salana-Nigeria-2026-Jingle-Yoruba.mp3",
            badge: "South-West Broadcast",
            lyrics: `[OFFICIAL JINGLE SCRIPT — YORUBA]
Akori: Eto Idajo ati Eto Omoniyan: Ipilẹ Otito fun Alaafia Agbaye

Gbogbo eniyan, e je ka pejo si ibi ibukun,
Apejo Odoodun ti o k'okanlelaadorin (72nd Jalsa Salana Nigeria 2026)!
Labe amojuto ati itosona Khilafat-e-Ahmadiyya,
A n pe gbogbo agbaye si idajo ododo ati alaafia.

Ojo: Jimoh 18th si Sunday 20th December 2026
Ibi Ipade: Jamia Ahmadiyya Ilaro, Ipinle Ogun
"Ife fun Gbogbo Eniyan, Ikoriira fun Enikankan" — E ma se ku sile!`,
        },
        {
            id: "ha",
            label: "Hausa",
            nativeLabel: "Harshen Hausa",
            subtitle: "Kiran Taron Jalsa Salana 2026",
            audioUrl: "/audio/jalsa-2026-ha.mp3",
            hash: "#jingle-ha",
            dir: "ltr",
            downloadFilename: "72nd-Jalsa-Salana-Nigeria-2026-Jingle-Hausa.mp3",
            badge: "Northern Broadcast",
            lyrics: `[OFFICIAL JINGLE SCRIPT — HAUSA]
Taken Taro: Kula da Adalci da Hakkokin Dan Adam: Ginshikin Zaman Lafiya na Gaskiya a Duniya

Maraba da ku zuwa babban taron albarka,
Taron Jalsa Salana na 72 a Najeriya 2026!
Karkashin jagorancin Khilafat-e-Ahmadiyya mai albarka,
Muna kira ga tabbatar da adalci da zaman lafiya a tsakanin al'umma.

Kwanaki: Juma'a 18 zuwa Lahadi 20 ga Disamba 2026
Wurin Taro: Jamia Ahmadiyya Ilaro, Jihar Ogun, Najeriya
"Kauna ga Kowa, Kiyayya ba ga Kowa ba" — Kar ku bari a ba ku labari!`,
        },
        {
            id: "ar",
            label: "Arabic",
            nativeLabel: "العربية",
            subtitle: "النشيد الرسمي للجلسة السنوية ٢٠٢٦",
            audioUrl: "/audio/jalsa-2026-ar.mp3",
            hash: "#jingle-ar",
            dir: "rtl",
            downloadFilename: "72nd-Jalsa-Salana-Nigeria-2026-Jingle-Arabic.mp3",
            badge: "International & Spiritual",
            lyrics: `[OFFICIAL JINGLE SCRIPT — ARABIC / النص الرسمي للنشيد]
الشعار الرسمي: إقامة العدل وحقوق الإنسان: الأساس الحقيقي للسلام العالمي

مرحباً بكم يا ضيوف الرحمن في رحاب البركة والإيمان،
في الجلسة السنوية الثانية والسبعين للجماعة الإسلامية الأحمدية في نيجيريا ٢٠٢٦!
تحت القيادة الروحية المباركة للخلافة الأحمدية،
ندعو العالم أجمع إلى العدل والإنصاف والسلام الشامل.

الموعد: من الجمعة ١٨ إلى الأحد ٢٠ ديسمبر ٢٠٢٦
المكان: جامعة الأحمدية، إيلارو، ولاية أوغون، نيجيريا
"الحب للجميع ولا كراهية لأحد" — شاركونا هذا الملتقى الروحاني العظيم!`,
        },
    ],
};
function getTrackById(id) {
    return (exports.JALSA_JINGLES_2026.tracks.find((t) => t.id === id) ??
        exports.JALSA_JINGLES_2026.tracks[0]);
}
function getTrackByHash(hash) {
    const clean = hash.startsWith('#') ? hash : `#${hash}`;
    return exports.JALSA_JINGLES_2026.tracks.find((t) => t.hash === clean);
}

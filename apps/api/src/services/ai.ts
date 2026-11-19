import https from 'https';
import { prisma } from '../lib/prisma';

// Grounded Jalsa knowledge context for RAG and fallback
const JALSA_KNOWLEDGE_BASE = `
JALSA SALANA NIGERIA OFFICIAL CONVENTION & LOGISTICS KNOWLEDGE BASE:
- About: Jalsa Salana is the annual convention of the Ahmadiyya Muslim Jama'at Nigeria. First introduced to Nigeria in 1916.
- Purpose & Ethos: Founded in 1891 by Hazrat Mirza Ghulam Ahmad (as), the Promised Messiah and Mahdi, in Qadian, India, to enhance religious knowledge, promote God-consciousness (Taqwa), cultivate mutual affection, and foster spiritual brotherhood.
- Universal Motto: "Love for All, Hatred for None".
- Global Head & Khilafat: Under the spiritual direction of Hazrat Mirza Masroor Ahmad (aba), the Fifth Caliph and worldwide Head of the Ahmadiyya Muslim Community. MTA International broadcasts the convention live worldwide.
- 72nd Jalsa Salana Nigeria (Upcoming Milestone):
  * Dates: Friday, December 18 to Sunday, December 20, 2026.
  * Venue: Jamia Ahmadiyya Ilaro, Ogun State, Nigeria (GPS: 6.8872° N, 3.0142° E).
  * Theme: "Observing Justice and Human Rights: The foundation for true Global Peace".
  * Quranic Foundation: Surah An-Nahl (16:91) and Surah An-Nisa (4:136).
  * Expected Attendance: 45,000+ delegates from all 36 Nigerian states and international delegations (Ghana, Benin, UK, Canada).
  * National Amir: Alhaji Barrister Alatoye Folorunso Azeez (National Amir, Ahmadiyya Muslim Jama'at Nigeria).
- Logistics, Facilities & Ground Layout at Jamia Ilaro:
  * Gate 1 (North Expressway Gate): Primary vehicle drop-off and express VIP/conveyance entrance.
  * Gate 2 (West Registration Hub): Biometric badge scan, household registration support, digital tag verification.
  * Main Prayer Marquee (Men): Capacity 15,000 delegates. High-definition audio and MTA video screens.
  * Lajna Prayer Pavilion (Women): Capacity 12,000 delegates with dedicated creche and mother-care facilities.
  * Main Dining Hall (Men) & Auxiliary Dining B: Traditional convention meals served 3 times daily without cost to delegates.
  * Lajna Main Dining & Annex: Dedicated dining marquees for female delegates and children.
  * Central Ahmadiyya Medical Clinic: 24/7 volunteer doctors, paramedical staff, emergency ambulance service.
  * Sanitation & Ablution Complexes: Multiple running-water ablution facilities across men's and women's sectors.
- Official Registration Portal: jalsa.ahmadiyyanigeria.net (Online pre-registration with downloadable digital wallet pass).
- Info & Emergency Hotline: Phone: +234-803-JALSA-NG (+234 803 525 7264) | Email: info@jalsasalana.ng
`;

// Dedicated Official Travel Advisory Knowledge Base for Jalsa Salana Nigeria 2026
const JALSA_TRAVEL_ADVISORY_KNOWLEDGE_BASE = `
# ASK JALSA AI – OFFICIAL TRAVEL ADVISORY KNOWLEDGE BASE
## Jalsa Salana Nigeria 2026 – Routes to Ilaro

### 1. GENERAL TRAVEL INFORMATION
- Event: 72nd Jalsa Salana Nigeria 2026
- Dates: Friday, 18th – Sunday, 20th December 2026
- Destination: Jalsa Salana Conference Ground, Jamia Ahmadiyya, Ilaro, Ogun State, Nigeria (GPS: 6.8872° N, 3.0142° E).
- Google Maps Navigation Link: https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142
- Travel Advisory Title: Alternative Routes to Avoid Possible Congestion on Papalanto Road.
- Notice: Attendees travelling to Ilaro for Jalsa Salana Nigeria 2026 are advised to consider the alternative routes outlined below to avoid possible congestion on Papalanto Road.
- Three Recommended Travel Routes by Departure Location:
  1. Lagos to Ilaro through Atan-Owode and Owode.
  2. Ibadan to Ilaro through Abeokuta and Itori.
  3. Alternative route from Ibadan through Abeokuta, Ita-Oshin, Ijoga-Orile and Imasayi.

---

### 2. RECOMMENDED ROUTES (STRICTLY SEPARATED)

#### ROUTE A: LAGOS TO ILARO
- Recommended route:
  Lagos → Meran or Kola Road → Ota Road → Atan-Owode → Owode → Ilaro.
- Travel instructions:
  1. Follow Meran Road or Kola Road.
  2. Connect to Ota Road.
  3. Proceed through Atan-Owode.
  4. Link to Owode.
  5. Continue towards Ilaro.
- Route summary:
  LAGOS → ATAN-OWODE → OWODE → ILARO.
- Standard chatbot response for Lagos travelers:
  "Assalamu Alaikum! Welcome to Jalsa Salana Nigeria 2026.
  If you are travelling from Lagos to Ilaro, the recommended alternative route is through Meran or Kola Road to connect to Ota Road. Proceed through Atan-Owode, link to Owode and continue to Ilaro.
  Please avoid travelling at night and plan your journey accordingly.
  We look forward to welcoming you to Jalsa Salana Nigeria 2026. Safe journey!"

#### ROUTE B: IBADAN TO ILARO THROUGH ITORI
- Recommended route:
  Ibadan → Abeokuta → Itori → Ibese → Ilaro.
- Travel instructions:
  1. Travel towards Abeokuta.
  2. From Abeokuta, proceed through Itori.
  3. Connect to Ibese Road.
  4. Follow the route through Ibese towards Ilaro.
- Route summary:
  IBADAN → ABEOKUTA → ITORI → IBESE → ILARO.
- Standard chatbot response for Ibadan via Itori:
  "Assalamu Alaikum!
  For travellers coming from Ibadan, one recommended route to Jalsa Salana Nigeria 2026 is:
  Ibadan → Abeokuta → Itori → Ibese → Ilaro.
  From Abeokuta, proceed through Itori to connect to Ibese Road, then continue towards Ilaro.
  Please observe the travel safety advisory and avoid night journeys. Safe travels!"

#### ROUTE C: ALTERNATIVE ROUTE FROM IBADAN THROUGH ITA-OSHIN
- Recommended alternative route:
  Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro.
- Travel instructions:
  1. Travel from Ibadan towards Abeokuta.
  2. Proceed through Abeokuta towards Ita-Oshin.
  3. At Ita-Oshin, take a right turn.
  4. Continue through Ijoga-Orile.
  5. Proceed through Imasayi.
  6. Connect to Ibese Road.
  7. Continue towards Ilaro.
- Route summary:
  IBADAN → ABEOKUTA → ITA-OSHIN → IJOGA-ORILE → IMASAYI → IBESE → ILARO.
- Standard chatbot response for Ibadan alternative route:
  "Assalamu Alaikum!
  There is an alternative route from Ibadan to Ilaro that may help travellers avoid possible congestion on Papalanto Road.
  The route is:
  Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro.
  At Ita-Oshin, take a right turn and proceed through Ijoga-Orile and Imasayi before connecting to Ibese Road and continuing to Ilaro.
  This is an alternative route recommended in the official Jalsa travel advisory.
  Safe journey!"

---

### 3. IMPORTANT TRAVEL SAFETY ADVISORY
- A. Avoid Night Travel: All Jalsa attendees are strongly advised to avoid travelling at night. Attendees should plan their journeys to arrive at their destinations during daylight hours.
- B. Special Overnight Advice for Travellers Passing Through Abeokuta:
  "If you reach Abeokuta by 7:00 p.m., please find a place to sleep until the following morning."
  Travellers arriving in Abeokuta by this time should arrange a place to stay and continue their journey to Ilaro the following morning.
- C. Contact for Travel Assistance in Abeokuta:
  * Name: Dr. Nasir Bello
  * Position: Abeokuta Circuit President
  * Telephone: +234 803 207 4441
  Provide this contact when a visitor requests assistance with the Abeokuta route or the travel advisory.

---

### 4. FREQUENTLY ASKED QUESTIONS (FAQS)
Q1. Which route should I take from Lagos to Ilaro?
A: Take Meran or Kola Road to connect to Ota Road. Proceed through Atan-Owode, link to Owode and continue to Ilaro.

Q2. How can I get to Ilaro from Ibadan?
A: There are two recommended routes:
   - Option 1 (via Itori): Ibadan → Abeokuta → Itori → Ibese → Ilaro.
   - Option 2 (via Ita-Oshin): Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro.

Q3. Which alternative route is available from Ibadan?
A: You can travel through Abeokuta, Ita-Oshin, Ijoga-Orile, Imasayi and Ibese before proceeding to Ilaro. At Ita-Oshin, take a right turn.

Q4. Why are alternative routes being recommended?
A: The routes are provided as alternatives to possible congestion on Papalanto Road during the Jalsa Salana period.

Q5. Is Papalanto Road closed?
A: No. The travel advisory does NOT state that Papalanto Road is closed. It only warns about possible congestion and recommends alternative routes.

Q6. Can I travel at night?
A: No. Attendees are strictly advised to avoid travelling at night.

Q7. What should I do if I arrive in Abeokuta by 7 p.m.?
A: The advisory recommends finding a place to sleep until the following morning before continuing the journey to Ilaro.

Q8. Who can I contact for travel assistance in Abeokuta?
A: Contact Dr. Nasir Bello, Abeokuta Circuit President, on +234 803 207 4441.

Q9. How do I travel from Lagos through Atan-Owode?
A: Follow Meran or Kola Road to connect to Ota Road. Proceed through Atan-Owode, link to Owode and continue towards Ilaro.

Q10. How do I get to Ilaro through Itori?
A: From Ibadan, travel towards Abeokuta. From there, proceed through Itori to connect to Ibese Road and continue to Ilaro.

Q11. Can you provide the exact distance or estimated driving time to Ilaro?
A: The official travel advisory does not provide distances or estimated journey times. Travellers should consult a current navigation service such as Google Maps for distance, travel time and traffic information.

Q12. Are there accommodation facilities in Abeokuta?
A: The travel advisory recommends finding a place to sleep in Abeokuta when arriving by 7 p.m. However, it does not provide a list of approved hotels or accommodation facilities. Contact Dr. Nasir Bello on +234 803 207 4441 for assistance.
`;

// Dedicated Official 72nd Jalsa Salana Nigeria 2026 Programme of Events Knowledge Base
const JALSA_PROGRAMME_2026_KNOWLEDGE_BASE = `
# 72ND JALSA SALANA NIGERIA 2026 – OFFICIAL PROGRAMME OF EVENTS KNOWLEDGE BASE
Dates: Friday 18th, Saturday 19th & Sunday 20th December 2026
Venue: Jamia Ahmadiyya Ilaro, Ogun State, Nigeria
Official Theme: "Observing Justice and Human Rights: The foundation for true Global Peace"
Full Programme Page: https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026
Download PDF: https://jalsasalana.ng/downloads/72nd-jalsa-salana-nigeria-2026-programme.pdf
Closing Benediction: "FI ‘AMANILLAH; MAY ALLAH THE ALMIGHTY GRANT EVERYBODY HIS JOURNEY MERCIES"

DAY 1: FRIDAY 18TH DECEMBER 2026
- 4:30 AM – 5:25 AM: Salatul Tahajjud (Imam: Respected Hafiz AbdutTawwab Bello sahib, Ilaro)
- 5:30 AM: Salatul Fajr Adhan (Respected Mustapha Ibrahim Aya Sahib)
- 5:45 AM: Salatul Fajr (Imam: To be announced by Officer Sahib Jalsa Gah)
- 6:00 AM – 6:15 AM: Morning Dars: "Love for All, Hatred for None: Championing Universal Human Rights and Dignity" (Respected Nabeel-Ahmad Oyekola Sahib, Muballigh Silsila, Ilaro)
- 8:00 AM: Breakfast
- 10:00 AM – 12:00 PM: Tabligh Seminar
- 12:30 PM: Preparation for Salatul Jumu’ah & First Adhan (Respected Hafiz Rufai Saleem Ahmad Sahib)
- 1:00 PM: Second Adhan (Respected Hafiz Rufai Saleem Ahmad Sahib)
- 1:05 PM – 1:50 PM: Jumu’at Services and Asr Prayer
- 2:00 PM: Live Huzur’s Sermon (MTA Broadcast - Naazim Sahib Audio Visual Department)
- 3:00 PM: Lunch
- 5:00 PM: Hoisting of Flags with Silent Prayers (Liwa-i-Ahmadiyya & Nigeria National Flag) (Officials: To be announced by Officer Sahib Jalsa Gah)
- 5:10 PM: First Session - Introduction of Guests (Officer Sahib Jalsa Gah)
- 5:20 PM – 5:30 PM: Recitation from the Holy Qur’an with Translation (Respected Hafiz Sharafadeen Adeleke Sahib)
- 5:30 PM – 5:40 PM: Arabic Qaseedah with Translation (Respected Hafiz AbdurRoqeeb Alaka Sahib)
- 5:40 PM – 6:20 PM: Lecture One: Message from Hazrat Khalifatul Masih V (ايده الله تعلى بنصره العزيز) / Inaugural Address (Delivered by Respected Amir Sahib Alhaji Alatoye Folorunso Azeez Sahib)
- 6:20 PM – 6:35 PM: Yoruba Translation
- 6:35 PM – 6:50 PM: Hausa Translation
- 6:50 PM: Announcements (Officer Sahib Jalsa Gah)
- 7:00 PM: Adhan for Maghrib and Ishaa Prayers (Respected Hafiz Makinde Hussain Sahib)
- 7:10 PM: Maghrib and Ishaa Prayers
- 7:30 PM: Dinner

DAY 2: SATURDAY 19TH DECEMBER 2026
- 4:30 AM: Salatul Tahajjud (Imam: Respected Hafiz Faruq Ademoye Sahib, Ilorin Circuit)
- 5:30 AM: Adhan (Respected Hafiz Hasbiyallah Gbadegeshin Sahib)
- 5:45 AM: Salatul Fajr (Imam: To be announced by Officer Sahib Jalsa Gah)
- 6:00 AM – 6:15 AM: Morning Dars: "The True Nature of Divine Justice and Brotherhood" (Maulvi Ahmad-Tahir Adam Sahib)
- 8:00 AM: Breakfast
- 10:00 AM – 10:20 AM: Second Session - Recitation & Qaseedah; Announcements by Officer Sahib Jalsa Gah
- 10:20 AM – 10:30 AM: Opening Address by Session Chairman
- 10:30 AM – 10:40 AM: Interval
- 10:40 AM – 11:30 AM: Lecture Two (Keynote): "Observing Justice and Human Rights: The foundation for true Global Peace" (Respected Hafiz Yunus Omotayo Sahib)
- 11:30 AM – 11:35 AM: Yoruba Translation
- 11:35 AM – 11:45 AM: Urdu Poem
- 11:45 AM – 12:25 PM: Lecture Three: "The Role of Prayer and Devotion in World Reform" (Maulvi Qasim Oyekola Sahib)
- 12:25 PM – 12:35 PM: Yoruba Translation
- 12:35 PM – 1:00 PM: Annual Progress Report (Respected Amir Sahib Alhaji Alatoye Folorunso Azeez Sahib)
- 1:00 PM – 1:15 PM: Islamic Nikaah Announcements
- 1:15 PM: Adhan for Salatuz Zuhr and Asr (Respected Hafiz Ismail Akindele Sahib)
- 1:25 PM: Salatuz Zuhr and Asr Prayers
- 1:45 PM: Lunch
- 4:30 PM – 6:30 PM: Third Session - Dignitary Addresses & Jama'at Academic Merit Awards
- 7:00 PM: Adhan (Respected Hafiz Ismail Adedokun Sahib)
- 7:10 PM: Maghrib and Ishaa Prayers
- 7:30 PM: Dinner
- 8:30 PM – 10:00 PM: General Q&A / Faith & Science Symposium

DAY 3: SUNDAY 20TH DECEMBER 2026
- 4:30 AM: Salatul Tahajjud (Imam: Respected Hafiz Luqman Popoola Sahib)
- 5:30 AM: Adhan (Respected Hafiz AbdulGhafar Adekunle Sahib)
- 5:45 AM: Salatul Fajr (Imam: To be announced by Officer Sahib Jalsa Gah)
- 6:00 AM – 6:15 AM: Morning Dars: "Sacrifice and Financial Devotion in the Cause of Allah" (Dr. Sa'eed Olurode Sahib)
- 6:30 AM – 7:40 AM: Fourth & Concluding Session:
  * 6:30 AM: Tilawat with translation (Respected Hafiz Muslihudeen Ajani Sahib)
  * 6:35 AM: Urdu Poem with translation (Respected Musbaudeen Adeleke Sahib)
  * 6:40 AM – 7:10 AM: Lecture Five: "“...And when you judge between mankind, judge with justice...”" (Respected Dr. AbdulHakeem Babatunde Sahib)
  * 7:10 AM – 7:15 AM: Yoruba Translation
  * 7:15 AM – 7:20 AM: Hausa Translation
  * 7:20 AM – 7:40 AM: Concluding Address & Silent Prayers (The Respected Amir Sahib, Alhaji Alatoye Folorunso Azeez Sahib)
- 7:40 AM – 9:00 AM: Breakfast and General Cleaning / Departure

STRICT RULE ON UNANNOUNCED OFFICIALS:
If a user asks who the Fajr Imam or Flag Hoisting official is for Friday, Saturday, or Sunday, ALWAYS answer:
"The assigned official has not been announced in the current programme yet; please check announcements from Officer Sahib Jalsa Gah." Never invent or guess names!
`;

// Dedicated Official Jalsa Salana 2026 Market Booking & Vendor Knowledge Base
const JALSA_MARKET_2026_KNOWLEDGE_BASE = `
# JALSA SALANA 2026 MARKET BOOKING & VENDOR KNOWLEDGE BASE
Page URL: https://jalsasalana.ng/market

1. KEY DATES & TIMINGS:
- Form Return Deadline: December 1, 2026. All completed forms and payment evidence must be submitted on or before Dec 1, 2026 (first-come, first-served).
- Mandatory Vendor Briefing: Nazim Market will conduct a compulsory briefing on rules and safety 5 days before Jalsa Salana starts.
- Operating Hours: 7:00 AM to 10:00 PM daily.
- CRITICAL RESTRICTION: The market is strictly closed during all Jalsa programmes, keynote lectures, and congregational prayers.

2. PRICING & FEES:
- Standard Stall: ₦16,000 (Constructed covered space).
- Open Space: ₦11,000 (Open boundary plot).
- Form Fee: ₦1,000 (Non-refundable fee required to obtain the physical form and study market ethics).

3. PAYMENT ACCOUNTS (OFFICIAL):
- OPay: 6102498777 (Account Name: AOG 001 ENT.)
- OPay: 7063374914 (Account Name: Mahmoud Alaka)
- Access Bank: 0088449365 (Account Name: Ajayi Muizz Adeniyi)
- WhatsApp Payment Verification: Send receipt via WhatsApp to 08122715410, 07063374914, or 08067493314.

4. APPROVED SALES CATEGORIES (STRICT SINGLE-CATEGORY RULE):
Vendors must choose EXACTLY ONE category. Mixing categories in one space is strictly prohibited:
- Category A: Real / Solid Meals (Rice, swallow, cooked dishes)
- Category B: Soft Drinks, Snacks, Pap / Akara / Moimoi
- Category C: Clothes / Textile / Gift Items (Islamic Men, Islamic Women, Islamic Mix, Other Clothes)
- Category D: Fruit / Assorted Varieties
- Category E: Herbs & Traditional Remedies
- Category F: Pepper Grinder (Elero)
- Category G: Provisions & Toiletries
- Category H: Phone Charging & Calls

5. STRICT PROHIBITIONS & PENALTIES:
- NO ALCOHOL: All alcoholic beverages in any form are 100% prohibited.
- NO BOOKS OR MEDIA: Religious literature, books, CDs, and audio/video media are reserved solely for Jama'at Departments.
- NO FIREWOOD / CHARCOAL: Firewood or charcoal cooking is disallowed on safety grounds.
- WATER RESTRICTION: The ONLY brand of pure/sachet water permitted for sale is LIMAN BRAND.
- Defaulters Penalty: Immediate expulsion without compensation and a permanent ban from Jalsa Market now and in the future.
- Non-Members: Must provide an official guarantor from the Jama'at.

6. COLLECTION & RETURNING CENTRES:
- Ilaro: Jamia Ilaro | Bro. Alaka Mahmud | 07063374914
- Lagos: Amu Ojokoro | Bro. Olawale Utman | 08083127892
- Abeokuta: Bro. Muiz Ajayi | 08067493314
- Ibadan: Contact main WhatsApp numbers (08122715410 / 07063374914 / 08067493314) for details.
`;

// Direct HTTP helper for Google Gemini API
async function callGemini(contents: any[], systemInstruction?: string, maxTokens: number = 1000): Promise<string | null> {
  const rawKey = process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '').trim();
  if (!apiKey) return null;

  const payload: any = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3,
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const postData = JSON.stringify(payload);

  // Model cascade:
  // Automatically prioritizes Gemini Pro models, with seamless fallback to fast Flash
  // If user sets GEMINI_MODEL in env, that is prioritized first.
  const models = [
    process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : null,
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-pro-latest',
  ].filter(Boolean) as string[];

  for (const model of models) {
    try {
      const responseText = await new Promise<string>((resolve, reject) => {
        const cleanModel = encodeURIComponent(model.trim());
        const cleanKey = encodeURIComponent(apiKey);
        const req = https.request(
          {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${cleanModel}:generateContent?key=${cleanKey}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
            },
            timeout: 12000,
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(data);
              } else {
                reject(new Error(`API responded with status ${res.statusCode}: ${data}`));
              }
            });
          }
        );

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Gemini API request timed out'));
        });

        req.write(postData);
        req.end();
      });

      const parsed = JSON.parse(responseText);
      const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (err: any) {
      console.warn(`[Gemini API] Failed with ${model}:`, err.message);
    }
  }

  return null;
}

// -------------------------------------------------------------------
// Feature 1: The "Jalsa Companion" Smart Concierge
// -------------------------------------------------------------------
export async function askJalsaAI(
  query: string,
  sessionId?: string,
  history: Array<{ role: 'user' | 'model'; content: string }> = []
): Promise<{ answer: string; sources?: string[]; queryId?: string }> {
  // Context articles from DB
  let contextArticles: any[] = [];
  try {
    contextArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      orderBy: { viewsCount: 'desc' },
      select: { title: true, excerpt: true, slug: true },
    });
  } catch (err) {
    console.warn('DB query for articles failed:', err);
  }

  // Live zone status context
  let zoneOverview = '';
  try {
    const zones = await prisma.zoneTraffic.findMany({
      take: 8,
      select: { name: true, status: true, currentOccupancy: true, maxCapacity: true },
    });
    if (zones.length > 0) {
      zoneOverview = '\nLive Grounds Capacity:\n' + zones.map((z) => `- ${z.name}: ${z.status} (${z.currentOccupancy}/${z.maxCapacity} capacity)`).join('\n');
    }
  } catch (err) {
    // Ignore if zones not yet queried
  }

  const articlesContext = contextArticles.map((a) => `- Article: "${a.title}" (/articles/${a.slug}): ${a.excerpt}`).join('\n');

  const systemInstruction = `You are "Jalsa Companion", the official AI Smart Concierge for Jalsa Salana Nigeria (the annual convention of Ahmadiyya Muslim Jama'at Nigeria).
Your role: Provide immediate, polite, respectful, and accurate assistance regarding convention dates, schedules, prayer times, registration, lodging, gates, dining, site layout, official travel advisories, and market vendor guidelines for Jamia Ahmadiyya Ilaro.

OFFICIAL THEME (Strict & Authoritative):
"Observing Justice and Human Rights: The foundation for true Global Peace"

Islamic Etiquette:
- Maintain Islamic decorum. Use honorifics: (as) after Promised Messiah, (aba) after Hazrat Mirza Masroor Ahmad, (saw) after Prophet Muhammad, (ra) after companions.
- Universal Ahmadiyya motto: "Love for All, Hatred for None".
- Scope boundary: If a question is outside Jalsa Salana logistics, convention history, Ahmadiyya teachings, or attendee care, politely inform the attendee and provide the official Info-Hotline (+234-803-JALSA-NG / info@jalsasalana.ng).

### 1. 2026 PROGRAMME OF EVENTS RESPONSE PROTOCOL:
1. Always answer using the verified 2026 Programme of Events data. Never guess times, Imams, or speakers.
2. Confirm that Flag Hoisting and the Opening First Session begin at 5:00 PM on Friday 18th December 2026 (Liwa-i-Ahmadiyya & Nigeria National Flag).
3. Friday Lecture One (5:40 PM – 6:20 PM) is: "Message from Hazrat Khalifatul Masih V (aba) / Inaugural Address" delivered by Respected Amir Sahib Alhaji Alatoye Folorunso Azeez Sahib, followed by Yoruba and Hausa translations.
4. Saturday Keynote Lecture Two (10:40 AM – 11:30 AM) is on the Official Convention Theme: "Observing Justice and Human Rights: The foundation for true Global Peace" by Respected Hafiz Yunus Omotayo Sahib.
5. Sunday Concluding Address (7:20 AM – 7:40 AM) is delivered by Amir Sahib Alhaji Alatoye Folorunso Azeez Sahib.
6. STRICT RULE FOR UNANNOUNCED OFFICIALS: If asked who the Fajr Imam or Flag Hoisting official is for Friday, Saturday, or Sunday, or about the Saturday 10:30–10:40 AM interval, state clearly: "The assigned official has not been announced in the current programme yet; please check announcements from Officer Sahib Jalsa Gah." NEVER GUESS OR INVENT NAMES.
7. Translations: Every major lecture/address is followed immediately by Yoruba and Hausa translations.
8. Point users to the full programme page (https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026) and downloadable PDF.

### 2. JALSA MARKET 2026 VENDOR RESPONSE PROTOCOL:
1. Stalls & Pricing: Standard Stall is ₦16,000; Open Space is ₦11,000; Form fee is ₦1,000 (non-refundable).
2. Deadline: Completed forms and payment evidence must be submitted on or before December 1, 2026 (first-come, first-served).
3. Operating Hours: 7:00 AM to 10:00 PM daily. The market is strictly closed during all Jalsa programmes, keynote lectures, and congregational prayers.
4. Strict Single Category Rule: Traders must select EXACTLY ONE category from A to H. Mixing categories in one stall is strictly prohibited.
5. Strict Prohibitions: No alcohol, no media/books/cassettes/CDs (reserved for Jama'at departments), no firewood or charcoal cooking, and ONLY LIMAN BRAND sachet/pure water is permitted for sale.
6. Non-Members: Must provide an official guarantor from the Jama'at.
7. Payment Accounts:
   - OPay: 6102498777 (AOG 001 ENT.)
   - OPay: 7063374914 (Mahmoud Alaka)
   - Access Bank: 0088449365 (Ajayi Muizz Adeniyi)
   Send payment proof via WhatsApp to 08122715410, 07063374914, or 08067493314.
8. Collection Centres: Ilaro (Bro. Alaka Mahmud 07063374914), Lagos (Bro. Olawale Utman 08083127892), Abeokuta (Bro. Muiz Ajayi 08067493314), Ibadan (contact main WhatsApp). Point users to https://jalsasalana.ng/market.

### 3. TRAVEL ADVISORY RESPONSE PROTOCOL:
When answering questions about travelling to the Jalsa venue in Ilaro, you MUST prioritise the official Jalsa Salana 2026 Travel Advisory Knowledge Base.
Your primary responsibility is to help visitors identify the appropriate recommended route based on their departure location.

Conversation behaviour:
1. If a visitor asks how to get to Jalsa without mentioning their departure location, politely ask: "Which city or location will you be travelling from?"
2. If the visitor says Lagos, provide Route A: Lagos → Meran or Kola Road → Ota Road → Atan-Owode → Owode → Ilaro.
3. If the visitor says Ibadan, explain both recommended routes:
   - Route B (via Itori): Ibadan → Abeokuta → Itori → Ibese → Ilaro.
   - Route C (Alternative via Ita-Oshin): Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro. (Highlight: At Ita-Oshin, take a right turn).
4. When someone asks for an alternative route from Ibadan, give particular attention to the Ita-Oshin route.
5. Always remind travellers to avoid travelling at night.
6. Always communicate the Abeokuta overnight advisory when relevant: "If you reach Abeokuta by 7:00 p.m., please find a place to sleep until the following morning."
7. Provide the Abeokuta Circuit President's contact details when travel assistance is requested: Dr. Nasir Bello, +234 803 207 4441.
8. If a visitor asks for live navigation, provide the Google Maps link (https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142) while explaining that the official travel advisory provides the recommended alternative routes to avoid Papalanto Road congestion.

Accuracy and limitations:
- Never fabricate directions, road conditions, travel distances, journey durations, fuel stations or accommodation recommendations.
- The advisory identifies possible congestion on Papalanto Road. DO NOT tell visitors that the road is closed.
- The official travel advisory is not a live traffic monitoring service. For current traffic information, direct visitors to Google Maps or another live navigation service.
- Distinguish strictly between the three routes. Do not mix the Lagos route with the Ibadan routes.
- When giving directions, use arrows (→) to make the route easy to understand.
- If the visitor is departing from a location not covered by these three recommended routes, explain that the official travel advisory does not provide a specific route for that location. Do not manufacture directions.
- Always remain courteous, helpful and welcoming.

Official Knowledge Bases:
${JALSA_PROGRAMME_2026_KNOWLEDGE_BASE}

${JALSA_MARKET_2026_KNOWLEDGE_BASE}

${JALSA_TRAVEL_ADVISORY_KNOWLEDGE_BASE}

${JALSA_KNOWLEDGE_BASE}
${zoneOverview}

Recent Editorial Articles:
${articlesContext}
`;

  // Build conversational contents
  const contents: any[] = [];
  if (history && history.length > 0) {
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: query }],
  });

  let answer: string | null = null;
  let sources = ['Jalsa Salana Nigeria Official Guide', 'Jamia Ilaro Grounds Management'];

  try {
    answer = await callGemini(contents, systemInstruction, 750);
  } catch (err) {
    console.warn('Gemini chat call failed:', err);
  }

  // Embedded intelligent fallback
  if (!answer) {
    const q = query.toLowerCase();
    // 1. Travel advisory checks
    if (
      q.includes('travel') ||
      q.includes('route') ||
      q.includes('road') ||
      q.includes('papalanto') ||
      q.includes('direction') ||
      q.includes('lagos') ||
      q.includes('ibadan') ||
      q.includes('abeokuta') ||
      q.includes('itori') ||
      q.includes('ita-oshin') ||
      q.includes('bello') ||
      q.includes('how do i get') ||
      q.includes('how to get')
    ) {
      if (q.includes('lagos') && !q.includes('ibadan')) {
        answer = `Assalamu Alaikum! Welcome to Jalsa Salana Nigeria 2026.

If you are travelling from **Lagos to Ilaro**, the recommended alternative route to avoid possible congestion on Papalanto Road is:

**Recommended Route:**
Lagos → Meran or Kola Road → Ota Road → Atan-Owode → Owode → Ilaro.

**Travel Instructions:**
1. Follow Meran Road or Kola Road.
2. Connect to Ota Road.
3. Proceed through Atan-Owode.
4. Link to Owode.
5. Continue towards Ilaro.

**Route Summary:**
LAGOS → ATAN-OWODE → OWODE → ILARO.

⚠️ **Important Safety Advice:**
Please avoid travelling at night and plan your journey accordingly to arrive during daylight hours.

📍 **Live Navigation:** You can also navigate directly to Jamia Ilaro via [Google Maps](https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142).

We look forward to welcoming you to Jalsa Salana Nigeria 2026. Safe journey!`;
        sources = ['Official Jalsa 2026 Travel Advisory', 'Lagos-Ilaro Routing Committee'];
      } else if (q.includes('ibadan') || q.includes('itori') || q.includes('ita-oshin')) {
        answer = `Assalamu Alaikum! Welcome to Jalsa Salana Nigeria 2026.

For travellers departing from **Ibadan**, there are two recommended alternative routes to avoid possible congestion on Papalanto Road:

**Route B: Ibadan to Ilaro Through Itori**
- **Sequence:** Ibadan → Abeokuta → Itori → Ibese → Ilaro.
- **Instructions:** From Abeokuta, proceed through Itori to connect to Ibese Road, then continue towards Ilaro.

**Route C: Alternative Route from Ibadan Through Ita-Oshin**
- **Sequence:** Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro.
- **Instructions:** At Ita-Oshin, take a right turn and proceed through Ijoga-Orile and Imasayi before connecting to Ibese Road and continuing to Ilaro.

⚠️ **Important Travel Safety Advisory:**
- **Avoid Night Travel:** Plan your journey to arrive during daylight hours.
- **Abeokuta Overnight Stay:** If you reach Abeokuta by **7:00 p.m.**, please find a place to sleep until the following morning before continuing your journey to Ilaro.
- **Assistance Contact:** For enquiries or assistance concerning Abeokuta travel arrangements, contact **Dr. Nasir Bello** (Abeokuta Circuit President) on **+234 803 207 4441**.

📍 **Live Navigation:** You can also navigate directly to Jamia Ilaro via [Google Maps](https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142).

Safe travels and JazakAllah Khairan!`;
        sources = ['Official Jalsa 2026 Travel Advisory', 'Abeokuta & Oyo Circuit Advisories'];
      } else if (q.includes('papalanto') || q.includes('closed') || q.includes('congestion')) {
        answer = `Assalamu Alaikum!

**Is Papalanto Road closed?**
No. The travel advisory does **not** state that Papalanto Road is closed. It only warns about **possible traffic congestion** and recommends alternative routes to ensure a smooth journey.

**Recommended Alternatives:**
- **From Lagos:** Lagos → Meran/Kola Road → Ota Road → Atan-Owode → Owode → Ilaro.
- **From Ibadan (Route 1):** Ibadan → Abeokuta → Itori → Ibese → Ilaro.
- **From Ibadan (Alternative Route):** Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro. *(At Ita-Oshin, take a right turn).*

⚠️ **Safety Reminder:** Avoid travelling at night. If arriving in Abeokuta by 7:00 p.m., please sleep until morning. Contact Dr. Nasir Bello on +234 803 207 4441 for assistance.`;
        sources = ['Official Jalsa 2026 Travel Advisory'];
      } else if (q.includes('bello') || q.includes('circuit president') || (q.includes('contact') && q.includes('abeokuta'))) {
        answer = `Assalamu Alaikum!

For enquiries or travel assistance concerning the Abeokuta route and overnight travel advisory:

**Name:** Dr. Nasir Bello  
**Position:** Abeokuta Circuit President  
**Telephone:** +234 803 207 4441  

The official travel advisory states: *"If you reach Abeokuta by 7:00 p.m., please find a place to sleep until the following morning before continuing your journey to Ilaro."*`;
        sources = ['Official Jalsa 2026 Travel Advisory', 'Abeokuta Circuit'];
      } else {
        answer = `Assalamu Alaikum! 

We warmly welcome you to the **72nd Jalsa Salana Nigeria 2026**.

To ensure a smooth journey to Ilaro and avoid possible congestion on Papalanto Road, please note the recommended alternative routes:

**1. From Lagos:**
Lagos → Meran/Kola Road → Ota Road → Atan-Owode → Owode → Ilaro.

**2. From Ibadan – Route 1 (Through Itori):**
Ibadan → Abeokuta → Itori → Ibese → Ilaro.

**3. From Ibadan – Alternative Route (Through Ita-Oshin):**
Ibadan → Abeokuta → Ita-Oshin → Ijoga-Orile → Imasayi → Ibese → Ilaro. *(At Ita-Oshin, take a right turn).*

⚠️ **Important Safety Advice:**
- Please avoid travelling at night.
- If you reach Abeokuta by **7:00 p.m.**, find a place to sleep until the following morning before continuing your journey.
- For travel assistance in Abeokuta, contact **Dr. Nasir Bello** on **+234 803 207 4441**.

📍 **Live Navigation:** You can also navigate directly to Jamia Ilaro via [Google Maps](https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142).

Which city or location will you be travelling from? We look forward to welcoming you! JazakAllah Khairan.`;
        sources = ['Official Jalsa 2026 Travel Advisory', 'Jamia Ilaro Grounds Management'];
      }
    } else if (
      q.includes('fajr imam') ||
      q.includes('who is the imam for fajr') ||
      q.includes('flag hoisting official') ||
      q.includes('who will hoist the flag') ||
      q.includes('who will raise the flag') ||
      (q.includes('fajr') && (q.includes('imam') || q.includes('lead')))
    ) {
      answer = `Assalamu Alaikum!\n\nThe assigned official for this session has **not been announced in the current programme yet**.\n\nPlease check official announcements from **Officer Sahib Jalsa Gah** upon arrival at the convention grounds.`;
      sources = ['Officer Sahib Jalsa Gah', '/programme-of-events-jalsa-salana-nigeria-2026'];
    } else if (
      q.includes('programme') ||
      q.includes('program') ||
      q.includes('schedule') ||
      q.includes('timetable') ||
      q.includes('flag hoisting') ||
      q.includes('opening session') ||
      q.includes('lecture') ||
      q.includes('friday') ||
      q.includes('saturday') ||
      q.includes('sunday')
    ) {
      answer = `Assalamu Alaikum! Here is the confirmed schedule overview for the **72nd Jalsa Salana Nigeria 2026** (Theme: *“Observing Justice and Human Rights: The foundation for true Global Peace”*):\n\n` +
        `**• Friday, 18th December 2026:**\n` +
        `- 1:05 PM – 1:50 PM: Jumu’at Services and Asr Prayer\n` +
        `- 2:00 PM: Live Huzur’s Sermon (MTA Broadcast)\n` +
        `- **5:00 PM: Hoisting of Flags with Silent Prayers** (Liwa-i-Ahmadiyya & Nigeria National Flag)\n` +
        `- **5:10 PM: First Session & Opening Address** by Amir Sahib Alhaji Alatoye Folorunso Azeez\n` +
        `- 5:40 PM – 6:20 PM: Lecture One: Message from Hazrat Khalifatul Masih V (aba) / Inaugural Address (followed by Yoruba & Hausa translations)\n` +
        `- 7:10 PM: Maghrib and Ishaa Prayers; 7:30 PM: Dinner\n\n` +
        `**• Saturday, 19th December 2026:**\n` +
        `- 4:30 AM: Tahajjud & 5:45 AM: Fajr\n` +
        `- 10:40 AM – 11:30 AM: **Keynote Lecture Two:** *“Observing Justice and Human Rights: The foundation for true Global Peace”* by Hafiz Yunus Omotayo Sahib\n` +
        `- 11:45 AM – 12:25 PM: Lecture Three: *“The Role of Prayer and Devotion in World Reform”* by Maulvi Qasim Oyekola Sahib\n` +
        `- 12:35 PM: Annual Progress Report; 1:00 PM: Nikaah Announcements\n` +
        `- 4:30 PM – 6:30 PM: Speeches to Dignitaries & Academic Merit Awards\n` +
        `- 8:30 PM: Special Q&A / Faith & Science Symposium\n\n` +
        `**• Sunday, 20th December 2026:**\n` +
        `- 6:30 AM – 7:40 AM: **Fourth & Concluding Session:** Tilawat, Poem, Lecture Five by Dr. AbdulHakeem Babatunde Sahib, Concluding Address & Silent Prayers by Amir Sahib\n` +
        `- 7:40 AM – 9:00 AM: Breakfast and General Cleaning / Safe Departure\n\n` +
        `📄 View the complete interactive timetable and download the official PDF at: **[72nd Jalsa Programme of Events](https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026)**.`;
      sources = ['Official 2026 Programme of Events', '/programme-of-events-jalsa-salana-nigeria-2026'];
    } else if (
      q.includes('market') ||
      q.includes('stall') ||
      q.includes('vendor') ||
      q.includes('trader') ||
      q.includes('open space') ||
      q.includes('booking') ||
      q.includes('liman')
    ) {
      answer = `Assalamu Alaikum! Here are the official details for the **Jalsa Salana 2026 Market**:\n\n` +
        `**1. Space Pricing & Fees:**\n` +
        `- Standard Stall: **₦16,000**\n` +
        `- Open Space: **₦11,000**\n` +
        `- Non-refundable Form Fee: **₦1,000**\n\n` +
        `**2. Important Dates & Rules:**\n` +
        `- Form Return Deadline: **1st December 2026** (First-come, first-served).\n` +
        `- Mandatory Briefing: Exactly 5 days before Jalsa begins.\n` +
        `- Operating Hours: **7:00 AM to 10:00 PM daily** *(strictly closed during all Jalsa programmes & prayers)*.\n` +
        `- Single Category Rule: Traders must choose **EXACTLY ONE** category (A to H). Mixing categories is strictly prohibited.\n` +
        `- Strict Prohibitions: No alcohol, no media/books/cassettes, no firewood or charcoal cooking, and **ONLY LIMAN BRAND** pure water is allowed for sale.\n` +
        `- Non-Members: Must provide an official Jama’at guarantor.\n\n` +
        `**3. Official Payment Accounts:**\n` +
        `- OPay: **6102498777** (AOG 001 ENT.)\n` +
        `- OPay: **7063374914** (Mahmoud Alaka)\n` +
        `- Access Bank: **0088449365** (Ajayi Muizz Adeniyi)\n` +
        `Send payment evidence via WhatsApp to **08122715410**, **07063374914**, or **08067493314**.\n\n` +
        `Detailed booking info and collection centres are available on the **[Jalsa Market Page](https://jalsasalana.ng/market)**.`;
      sources = ['Official Market Guidelines 2026', '/market'];
    } else if (q.includes('theme') || q.includes('topic')) {
      answer = `The official theme of the **72nd Jalsa Salana Nigeria 2026** is:\n\n**“Observing Justice and Human Rights: The foundation for true Global Peace”**\n\nConvening from Friday, December 18 to Sunday, December 20, 2026 at Jamia Ahmadiyya Ilaro, Ogun State.`;
      sources = ['Official 2026 Convention Theme', '/programme-of-events-jalsa-salana-nigeria-2026'];
    } else if (q.includes('date') || q.includes('when') || q.includes('2026') || q.includes('72')) {
      answer = `The **72nd Jalsa Salana Nigeria** will be held from **Friday, December 18 to Sunday, December 20, 2026** at **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria**.\n\nThe convention theme is **“Observing Justice and Human Rights: The foundation for true Global Peace”**. Over 45,000 delegates are expected.`;
      sources = ['Official 2026 Communique', '/programme-of-events-jalsa-salana-nigeria-2026'];
    } else if (q.includes('register') || q.includes('badge') || q.includes('tag') || q.includes('portal')) {
      answer = `Registration is open online at **[jalsa.ahmadiyyanigeria.net](https://jalsa.ahmadiyyanigeria.net)**. You can register your entire household, obtain your digital wallet tag, and bypass physical queues at Gate 2 (West Registration Hub).`;
      sources = ['Registration Portal Hub', '/registration'];
    } else if (q.includes('dining') || q.includes('food') || q.includes('meal')) {
      answer = `Delegates are provided breakfast, lunch, and dinner free of charge as traditional hospitality. Men's dining is located at Main Dining Hall and Auxiliary Marquee B. Ladies' dining is at Lajna Main Dining and Annex. For live queue updates, consult the Smart Crowd Map.`;
      sources = ['Food & Hospitality Committee'];
    } else if (q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('ilaro') || q.includes('maps') || q.includes('navigation')) {
      answer = `The convention grounds are at **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria** (GPS Coordinates: 6.8872° N, 3.0142° E).\n\n📍 **Live Navigation:** You can open directions directly in [Google Maps](https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142).\n\nDedicated buses and convoys arrive through Gate 1 (North Expressway Gate) and Gate 2 (West Registration Hub).`;
      sources = ['Travel & Venue Advisory', 'Google Maps Live Link', '/contact'];
    } else {
      answer = `Welcome to Jalsa Salana Nigeria. For specialized inquiries regarding lodging, transport, or medical assistance, please contact the convention secretariat at **+234-803-JALSA-NG** or **info@jalsasalana.ng**, or check our Live Crowd Map.`;
      sources = ['Convention Secretariat'];
    }
  }

  // Log query to database
  let queryId: string | undefined;
  try {
    const log = await prisma.conciergeQuery.create({
      data: {
        sessionId: sessionId || 'guest-session',
        userQuery: query,
        aiResponse: answer,
        category: 'concierge',
        resolved: true,
      },
    });
    queryId = log.id;
  } catch (logErr) {
    // Non-critical
  }

  return { answer, sources, queryId };
}

// -------------------------------------------------------------------
// Feature 2: Personalized Itinerary & Dashboard AI Engine
// -------------------------------------------------------------------
export async function generateItineraryAI(attendee: {
  role: string;
  travelOrigin?: string;
  category?: string;
  userName?: string;
}): Promise<{
  recommendedGate: string;
  welcomeMessage: string;
  itinerary: Array<{ day: string; time: string; session: string; location: string; highlight: string }>;
  practicalTips: string[];
}> {
  const systemInstruction = `You are the Itinerary Architect for Jalsa Salana Nigeria 2026.
Given an attendee's profile (Role: ${attendee.role}, Category: ${attendee.category || 'Delegate'}, Origin: ${attendee.travelOrigin || 'Nigeria'}),
generate a personalized 3-day spiritual schedule, assigned gate recommendations, and logistical advice for their visit to Jamia Ahmadiyya Ilaro.
Return valid JSON adhering strictly to this schema:
{
  "recommendedGate": "Gate 1 (North) or Gate 2 (West)",
  "welcomeMessage": "Personalized 2-sentence welcome",
  "itinerary": [
    { "day": "Day 1 (Friday)", "time": "13:00 - 15:00", "session": "Jumu'ah Prayer & Flag Hoisting", "location": "Main Prayer Grounds", "highlight": "National Amir addresses delegates" }
  ],
  "practicalTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

  const prompt = `Generate customized Jalsa 2026 itinerary for:
Name: ${attendee.userName || 'Delegate'}
Role: ${attendee.role}
Origin: ${attendee.travelOrigin || 'Lagos / Interstate'}
Category: ${attendee.category || 'Member'}`;

  const responseText = await callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction,
    1200
  );

  if (responseText) {
    try {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Failed to parse itinerary JSON from Gemini:', e);
    }
  }

  // Fallback itinerary
  const isLagosOrSouthWest = (attendee.travelOrigin || '').toLowerCase().includes('lagos') || (attendee.travelOrigin || '').toLowerCase().includes('ogun');
  return {
    recommendedGate: isLagosOrSouthWest ? 'Gate 2 (West Registration Hub)' : 'Gate 1 (North Expressway Entry)',
    welcomeMessage: `Welcome to Jalsa Salana Nigeria 2026. We pray your journey to Jamia Ahmadiyya Ilaro is blessed and filled with divine peace.`,
    itinerary: [
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '1:05 PM – 1:50 PM',
        session: "Jumu'at Services and Asr Prayer",
        location: 'Main Convention Arena',
        highlight: 'Congregational Jumu’ah followed by Live Huzur’s Sermon broadcast at 2:00 PM.',
      },
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '5:00 PM',
        session: 'Hoisting of Flags & Opening First Session',
        location: 'Main Convention Grounds',
        highlight: 'Official flag hoisting (Liwa-i-Ahmadiyya & Nigeria National Flag) followed by Inaugural Address and Lecture One.',
      },
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '5:40 PM – 6:20 PM',
        session: 'Lecture One: Message from Hazrat Khalifatul Masih V (aba)',
        location: 'Main Convention Marquee',
        highlight: 'Inaugural Address delivered by Amir Sahib Alhaji Alatoye Folorunso Azeez with Yoruba & Hausa translations.',
      },
      {
        day: 'Day 2 (Saturday, Dec 19)',
        time: '10:40 AM – 11:30 AM',
        session: 'Lecture Two: Official Convention Theme',
        location: 'Main Convention Arena',
        highlight: '“Observing Justice and Human Rights: The foundation for true Global Peace” by Hafiz Yunus Omotayo Sahib.',
      },
      {
        day: 'Day 2 (Saturday, Dec 19)',
        time: '4:30 PM – 6:30 PM',
        session: 'Third Session: Speeches to Dignitaries & Academic Awards',
        location: 'Main Convention Marquee',
        highlight: 'Addresses by royal fathers, special guest dignitaries, and Jama’at academic merit awards.',
      },
      {
        day: 'Day 3 (Sunday, Dec 20)',
        time: '6:30 AM – 7:40 AM',
        session: 'Closing Session & Final Concluding Address',
        location: 'Main Convention Arena',
        highlight: 'Concluding address and silent prayers led by Amir Sahib, followed by breakfast and safe departure.',
      },
    ],
    practicalTips: [
      'Download your Digital ID Pass beforehand on jalsa.ahmadiyyanigeria.net for instant gate access.',
      'Check the Live Crowd Map before proceeding to dining halls during meal hours.',
      'Ablution Complex B (behind the Minaret) generally has faster queues than Front Courtyard Complex A.',
    ],
  };
}

// -------------------------------------------------------------------
// Feature 4: Automated Multilingual Content Localization (EN -> YO, HA, IG)
// -------------------------------------------------------------------
export async function translateContentAI(
  title: string,
  excerpt: string,
  content: string,
  targetLocale: 'YO' | 'HA' | 'IG'
): Promise<{ title: string; excerpt: string; content: string }> {
  const languageNames: Record<string, string> = {
    YO: 'Yoruba (Èdè Yorùbá)',
    HA: 'Hausa (Harshen Hausa)',
    IG: 'Igbo (Asụsụ Igbo)',
  };

  const targetLang = languageNames[targetLocale] || 'Yoruba';

  const systemInstruction = `You are a professional literary and theological translator specializing in Nigerian languages (Yoruba, Hausa, Igbo) and Islamic Ahmadiyya literature.
Translate the provided English article into fluent, authentic, dignified ${targetLang}.
Adhere strictly to:
- Preserve all HTML/Markdown formatting tags (e.g. <h2>, <p>, <blockquote>, <strong>).
- Preserve Islamic honorifics: (saw), (as), (aba), (ra).
- Maintain spiritual eloquence appropriate for Jalsa Salana publications.
Return strictly valid JSON with this format:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated full content with all HTML/markdown preserved"
}`;

  const prompt = `Title: ${title}
Excerpt: ${excerpt}
Content:
${content.substring(0, 3500)}`;

  const responseText = await callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction,
    2500
  );

  if (responseText) {
    try {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.title && parsed.content) {
        return parsed;
      }
    } catch (e) {
      console.warn(`Failed to parse translation JSON for ${targetLocale}:`, e);
    }
  }

  // Graceful fallback
  return {
    title: `[${targetLocale}] ${title}`,
    excerpt: `[${targetLocale}] ${excerpt}`,
    content: `<div class="translation-pending"><p><em>(${targetLang} translation in review)</em></p>${content}</div>`,
  };
}

// -------------------------------------------------------------------
// Feature 5: Semantic "Thematic" Search Intent & Summary
// -------------------------------------------------------------------
export async function semanticSearchAI(userQuery: string): Promise<{
  thematicSummary: string;
  extractedThemes: string[];
  searchTerms: string[];
}> {
  const systemInstruction = `You are an expert thematic search analyzer for an Islamic editorial platform (Jalsa Salana Nigeria).
Given a user's search query (which may be conceptual or emotional, e.g. "coping with hardship through prayer" or "justice in society"),
analyze the intent, extract 3-5 core theological themes, generate keyword search terms for database lookup, and write a 2-sentence executive summary addressing that theme from an Islamic/Ahmadiyya perspective.
Return strictly JSON in this format:
{
  "thematicSummary": "2-sentence scholarly summary of the theme",
  "extractedThemes": ["Theme 1", "Theme 2", "Theme 3"],
  "searchTerms": ["keyword1", "keyword2", "keyword3"]
}`;

  const responseText = await callGemini(
    [{ role: 'user', parts: [{ text: `Analyze query: "${userQuery}"` }] }],
    systemInstruction,
    500
  );

  if (responseText) {
    try {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.thematicSummary && Array.isArray(parsed.searchTerms)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse semantic search JSON:', e);
    }
  }

  // Fallback
  return {
    thematicSummary: `Exploring "${userQuery}" within the spiritual archives of Jalsa Salana Nigeria highlights divine justice, righteous conduct, and continuous self-reformation. These teachings inspire believers to manifest equity in daily life.`,
    extractedThemes: ['Spiritual Growth', 'Justice & Equity', 'Jalsa Guidance'],
    searchTerms: userQuery.split(/\s+/).filter((w) => w.length > 2),
  };
}

// CMS Editorial Helpers
export async function generateArticleSEO(title: string, content: string): Promise<{ metaTitle: string; metaDescription: string; excerpt: string }> {
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  let metaTitle = `${title} | Jalsa Salana Nigeria`;
  if (metaTitle.length > 60) metaTitle = title.length <= 60 ? title : `${title.substring(0, 57)}...`;

  const sentences = plainText.split(/[.?!]/).map((s) => s.trim()).filter((s) => s.length > 20);
  let metaDescription = sentences[0] || plainText.substring(0, 150);
  if (metaDescription.length > 155) metaDescription = `${metaDescription.substring(0, 152)}...`;

  let excerpt = sentences.slice(0, 2).join('. ');
  if (!excerpt.endsWith('.')) excerpt += '.';
  if (excerpt.length > 260) excerpt = `${excerpt.substring(0, 255)}...`;

  return { metaTitle, metaDescription, excerpt };
}

export async function checkEditorialPolish(content: string): Promise<{ score: number; suggestions: string[] }> {
  const suggestions: string[] = [];
  const text = content.toLowerCase();

  if (text.includes('mirza ghulam ahmad') && !text.includes('(as)')) {
    suggestions.push('Add the Islamic honorific (as) after the Promised Messiah: "Hazrat Mirza Ghulam Ahmad (as)".');
  }
  if (text.includes('mirza masroor ahmad') && !text.includes('(aba)')) {
    suggestions.push('Add the Caliphal honorific (aba) after His Holiness: "Hazrat Mirza Masroor Ahmad (aba)".');
  }
  if (text.includes('holy prophet') && !text.includes('(saw)') && !text.includes('(sa)')) {
    suggestions.push('Add (saw) after the Holy Prophet Muhammad.');
  }
  if (!text.includes('<h2>') && content.length > 500) {
    suggestions.push('Consider adding H2 subheadings to improve reader engagement.');
  }
  if (content.length > 1000 && !text.includes('<blockquote>')) {
    suggestions.push('Consider incorporating a pull-quote citation from the Holy Quran or Promised Messiah (as).');
  }

  const score = Math.max(70, 100 - suggestions.length * 10);
  return { score, suggestions };
}

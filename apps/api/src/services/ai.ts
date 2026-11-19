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
  * Theme: "Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony".
  * Quranic Foundation: "Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony" (Surah An-Nahl 16:91).
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
Your role: Provide immediate, polite, respectful, and accurate assistance regarding convention dates, schedules, prayer times, registration, lodging, gates, dining, site layout, and official travel advisories to Jamia Ahmadiyya Ilaro.

Islamic Etiquette:
- Maintain Islamic decorum. Use honorifics: (as) after Promised Messiah, (aba) after Hazrat Mirza Masroor Ahmad, (saw) after Prophet Muhammad, (ra) after companions.
- Universal Ahmadiyya motto: "Love for All, Hatred for None".
- Scope boundary: If a question is outside Jalsa Salana logistics, convention history, Ahmadiyya teachings, or attendee care, politely inform the attendee and provide the official Info-Hotline (+234-803-JALSA-NG / info@jalsasalana.ng).

### TRAVEL ADVISORY RESPONSE PROTOCOL:
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
    } else if (q.includes('date') || q.includes('when') || q.includes('2026') || q.includes('72')) {
      answer = `The **72nd Jalsa Salana Nigeria** will be held from **Friday, December 18 to Sunday, December 20, 2026** at **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria**.\n\nThe convention theme is *"Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony"*. Over 45,000 delegates are expected.`;
      sources = ['Official 2026 Communique', '/editions/2026'];
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
        time: '13:00 - 15:00',
        session: "Jumu'ah Prayers & Flag Hoisting Ceremony",
        location: 'Main Convention Grounds',
        highlight: 'Official flag hoisting and opening address by National Amir Alhaji Barr. Alatoye Folorunso Azeez.',
      },
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '16:30 - 19:00',
        session: 'Opening Session & Keynote Speeches',
        location: 'Main Prayer Marquee / Lajna Pavilion',
        highlight: 'Scholarly discourse on "Justice and Equality: Prerequisites for Global Peace".',
      },
      {
        day: 'Day 2 (Saturday, Dec 19)',
        time: '10:00 - 13:00',
        session: 'Academic Awards & Parallel Auxiliary Sessions',
        location: 'Main Hall / Lajna Auditorium',
        highlight: 'Recognition of academic excellence and distinguished Jamaat service.',
      },
      {
        day: 'Day 2 (Saturday, Dec 19)',
        time: '16:00 - 18:30',
        session: 'Speeches to Dignitaries & Inter-Faith Guests',
        location: 'Main Marquee',
        highlight: 'Addresses by royal fathers, community elders, and foreign guest speakers.',
      },
      {
        day: 'Day 3 (Sunday, Dec 20)',
        time: '10:00 - 13:30',
        session: 'Concluding Session & Global Live Telecast',
        location: 'Main Convention Arena',
        highlight: 'Special address, concluding prayers, and worldwide MTA broadcast.',
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

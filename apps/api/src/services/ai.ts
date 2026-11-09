import { prisma } from '../lib/prisma';

// Grounded Jalsa knowledge context for RAG and fallback
const JALSA_KNOWLEDGE_CONTEXT = `
JALSA SALANA NIGERIA KNOWLEDGE BASE:
- About: Jalsa Salana is the annual convention of the Ahmadiyya Muslim Jama'at Nigeria. First introduced to Nigeria in 1916.
- Founder & Purpose: Founded in 1891 by Hazrat Mirza Ghulam Ahmad (as), the Promised Messiah and Mahdi, in Qadian, India, to enhance religious knowledge, promote God-consciousness (Taqwa), and cultivate mutual affection among believers.
- Global Head & Khilafat: Under the spiritual direction of Hazrat Mirza Masroor Ahmad (aba), the Fifth Caliph and worldwide Head of the Ahmadiyya Muslim Community.
- Universal Motto: "Love for All, Hatred for None".
- 72nd Jalsa Salana Nigeria (Upcoming Milestone):
  * Dates: December 18–20, 2026.
  * Venue: Jamia Ahmadiyya Ilaro, Ogun State, Nigeria.
  * Theme: "Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony".
  * Arabic Theme: العدل والإحسان وإيتاء ذي القربى (Surah An-Nahl 16:91).
  * Expected Attendance: 45,000+ delegates from Nigeria, Ghana, Benin Republic, UK, Canada, and across the globe.
- National Leadership: Alhaji Barrister Alatoye Folorunso Azeez (National Amir, Ahmadiyya Muslim Jama'at Nigeria).
- 70th Platinum Jubilee (2024):
  * Theme: "Seven Decades of Spiritual Illumination and Humanitarian Service in Nigeria".
  * Venue: Jamia Ahmadiyya Ilaro. Attended by former Interior Minister Rauf Aregbesola and royal dignitaries.
- Broadcast: Broadcast live worldwide via MTA International (Muslim Television Ahmadiyya) and YouTube.
- Official Resources: Official digital magazine domain: jalsasalana.ng. Holy Quran commentary and books: alislam.org.
`;

export async function askJalsaAI(query: string): Promise<{ answer: string; sources?: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Retrieve relevant articles & speeches from MySQL database to ground the response
  let contextArticles: any[] = [];
  try {
    contextArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { viewsCount: 'desc' },
      select: { title: true, excerpt: true, slug: true },
    });
  } catch (err) {
    console.warn('Database query for AI context failed, falling back to static knowledge:', err);
  }

  const articlesContext = contextArticles
    .map((a) => `- Article: "${a.title}" (Link: /articles/${a.slug}): ${a.excerpt}`)
    .join('\n');

  const systemPrompt = `You are "Ask Jalsa AI", an intelligent, respectful, scholarly assistant for the Jalsa Salana Nigeria Digital Publishing Platform (jalsasalana.ng).
You represent the Ahmadiyya Muslim Community Nigeria. Always adhere to the Islamic ethos of humility, truthfulness, and hospitality.
Honorifics: Always use (as) after Promised Messiah, (aba) after Hazrat Mirza Masroor Ahmad, (ra) after companions, and (saw) after the Holy Prophet Muhammad.
Provide concise, elegant, informative answers with accurate references to Jalsa Salana Nigeria conventions, themes, and Ahmadiyya teachings.

Knowledge Base:
${JALSA_KNOWLEDGE_CONTEXT}

Recent Published Editorial Articles:
${articlesContext}
`;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `User Question: ${query}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return {
            answer: candidate.trim(),
            sources: ['Jalsa Salana Nigeria Archives', 'alislam.org'],
          };
        }
      }
    } catch (apiErr) {
      console.warn('Gemini API call failed, falling back to embedded reasoning engine:', apiErr);
    }
  }

  // Embedded Intelligent Fallback Knowledge Matcher
  const q = query.toLowerCase();

  if (q.includes('72') || q.includes('2026') || q.includes('when') || q.includes('date') || q.includes('upcoming')) {
    return {
      answer: `The **72nd Jalsa Salana Nigeria** is scheduled to take place from **December 18 to 20, 2026** at the grand grounds of **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria**.\n\nThe official theme is *"Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony"* based on Surah An-Nahl (16:91). Over 45,000 delegates are anticipated to attend.`,
      sources: ['72nd Jalsa Salana 2026 Hub', '/editions/2026'],
    };
  }

  if (q.includes('theme') || q.includes('justice') || q.includes('equality')) {
    return {
      answer: `The official theme for the upcoming 72nd Jalsa Salana Nigeria 2026 is:\n\n**"Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony"** (Arabic: *العدل والإحسان وإيتاء ذي القربى*).\n\nNational Amir Alhaji Barr. Alatoye Folorunso Azeez has underscored that genuine societal peace is unattainable without God-consciousness (Taqwa) and equity for all citizens.`,
      sources: ['National Amir Official Communique', '/articles/justice-equality-prerequisites-global-peace-jalsa-2026'],
    };
  }

  if (q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('ilaro')) {
    return {
      answer: `Jalsa Salana Nigeria is convened at **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria** (GPS Coordinates: 6.8872° N, 3.0142° E).\n\nThe permanent venue features dedicated marquees for male and female delegates, prayer grounds, dining marquees, medical clinics, and MTA broadcast suites.`,
      sources: ['Venue Guide & Travel Advisory', '/contact'],
    };
  }

  if (q.includes('amir') || q.includes('alatoye') || q.includes('leader')) {
    return {
      answer: `The National Amir (President) of the Ahmadiyya Muslim Jama'at Nigeria is **Alhaji Barrister Alatoye Folorunso Azeez**. He is a distinguished legal practitioner and scholar leading the community's spiritual, educational, and humanitarian initiatives across Nigeria.`,
      sources: ['Scholars & Editorial Contributors', '/admin/authors'],
    };
  }

  if (q.includes('caliph') || q.includes('masroor') || q.includes('khilafat') || q.includes('huzoor')) {
    return {
      answer: `The Ahmadiyya Muslim Community worldwide is guided by the Fifth Caliph, **Hazrat Mirza Masroor Ahmad (aba)**. Under his blessed leadership, Jalsa Salana conventions receive special guidance, prayers, and addresses broadcast live globally via MTA International.`,
      sources: ['Khilafat Guidance Archive', '/speeches'],
    };
  }

  if (q.includes('quran') || q.includes('alislam') || q.includes('commentary')) {
    return {
      answer: `Ahmadiyya Holy Quran resources, translations in over 70 languages, and the renowned 5-Volume English Commentary by Hazrat Mirza Bashir-ud-Din Mahmud Ahmad (ra) are officially available at **[alislam.org/quran](https://www.alislam.org/quran/)**.`,
      sources: ['AlIslam.org Holy Quran Registry'],
    };
  }

  if (q.includes('purpose') || q.includes('why') || q.includes('history')) {
    return {
      answer: `Jalsa Salana was founded in 1891 by Hazrat Mirza Ghulam Ahmad (as) of Qadian, the Promised Messiah. He established it not as a worldly carnival, but as a three-day sanctuary where believers assemble solely to remember Allah, purify their morals, enhance religious knowledge, and foster brotherly affection. In Nigeria, conventions have been held since 1916.`,
      sources: ['Historical Conventions Archive', '/about'],
    };
  }

  return {
    answer: `Welcome to Jalsa Salana Nigeria Digital Publication. Jalsa Salana is the premier spiritual, intellectual, and educational annual convention of the Ahmadiyya Muslim Jama'at Nigeria. You can explore our archives, read scholarly articles, listen to keynote addresses, or learn about the upcoming 72nd convention in December 2026.`,
    sources: ['jalsasalana.ng Digital Editorial Platform'],
  };
}

export async function generateArticleSEO(title: string, content: string): Promise<{ metaTitle: string; metaDescription: string; excerpt: string }> {
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Create crisp meta title (< 60 chars)
  let metaTitle = `${title} | Jalsa Salana Nigeria`;
  if (metaTitle.length > 60) {
    metaTitle = title.length <= 60 ? title : `${title.substring(0, 57)}...`;
  }

  // Create meta description (< 160 chars)
  const sentences = plainText.split(/[.?!]/).map((s) => s.trim()).filter((s) => s.length > 20);
  let metaDescription = sentences[0] || plainText.substring(0, 150);
  if (metaDescription.length > 155) {
    metaDescription = `${metaDescription.substring(0, 152)}...`;
  }

  // Create excerpt (1-2 sentences, ~200 chars)
  let excerpt = sentences.slice(0, 2).join('. ');
  if (!excerpt.endsWith('.')) excerpt += '.';
  if (excerpt.length > 260) {
    excerpt = `${excerpt.substring(0, 255)}...`;
  }

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
    suggestions.push('Consider adding H2 subheadings to improve reader engagement and enable automatic Table of Contents parsing.');
  }
  if (content.length > 1000 && !text.includes('<blockquote>')) {
    suggestions.push('Consider incorporating a pull-quote or blockquote citation from the Holy Quran or Promised Messiah (as).');
  }

  const score = Math.max(70, 100 - suggestions.length * 10);
  return { score, suggestions };
}

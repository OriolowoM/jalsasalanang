const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Seeding Jalsa Salana Nigeria platform database...');

  // 1. Roles
  const rolesData = [
    { name: 'Super Administrator', slug: 'super_administrator', description: 'Full system control and architecture access', isSystem: true },
    { name: 'Editor-in-Chief', slug: 'editor_in_chief', description: 'Editorial oversight, approvals and publication control', isSystem: true },
    { name: 'Editor', slug: 'editor', description: 'Review, edit and publish authorised content', isSystem: true },
    { name: 'Author', slug: 'author', description: 'Create and manage own articles', isSystem: true },
    { name: 'Contributor', slug: 'contributor', description: 'Draft and submit articles for review', isSystem: true },
    { name: 'Media Editor', slug: 'media_editor', description: 'Manage photo galleries, videos and media assets', isSystem: true },
    { name: 'SEO Editor', slug: 'seo_editor', description: 'Manage SEO metadata and discoverability', isSystem: true },
  ];

  const rolesMap = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { slug: r.slug },
      create: r,
      update: r,
    });
    rolesMap[r.slug] = role;
  }
  console.log('[Seed] Roles created.');

  // 2. Super Administrator User
  const passwordHash = await bcrypt.hash('JalsaNigeria@2026!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jalsasalana.ng' },
    create: {
      email: 'admin@jalsasalana.ng',
      passwordHash,
      firstName: 'Alhaji Barrister',
      lastName: 'Folorunso Alatoye',
      roleId: rolesMap['super_administrator'].id,
      status: 'ACTIVE',
      avatar: '/images/jalsa-crest.png',
    },
    update: {
      passwordHash,
      roleId: rolesMap['super_administrator'].id,
    },
  });
  console.log('[Seed] Admin user created: admin@jalsasalana.ng / JalsaNigeria@2026!');

  // 3. Authors
  const authorsData = [
    {
      name: 'Hazrat Mirza Masroor Ahmad (aba)',
      slug: 'hazrat-mirza-masroor-ahmad',
      title: 'Worldwide Head of the Ahmadiyya Muslim Community, Fifth Caliph',
      bio: 'His Holiness Hazrat Mirza Masroor Ahmad is the spiritual leader of tens of millions of Ahmadi Muslims worldwide, advocating global peace, justice, and spiritual enlightenment.',
      avatar: '/images/jalsa-crest.png',
      email: 'caliphate@jalsasalana.ng',
    },
    {
      name: 'Alhaji Barr. Alatoye Folorunso Azeez',
      slug: 'alatoye-folorunso-azeez',
      title: 'National Amir, Ahmadiyya Muslim Jama\'at Nigeria',
      bio: 'Distinguished legal practitioner, scholar, and National Amir overseeing the spiritual, educational, and welfare affairs of the Ahmadiyya Muslim Jama\'at across the Federal Republic of Nigeria.',
      avatar: '/images/guest-aregbesola.jpg',
      email: 'amir@jalsasalana.ng',
    },
    {
      name: 'Dr. Saheed Timehin',
      slug: 'dr-saheed-timehin',
      title: 'Professor of Arabic & Religious Studies, Editorial Board',
      bio: 'Renowned academic, translator of Islamic classical texts, and keynote speaker on interfaith harmony, jurisprudence, and African Islamic history.',
      avatar: '/images/jalsa-scholars.jpg',
      email: 'timehin@jalsasalana.ng',
    },
    {
      name: 'Maulvi Abdul Azeez',
      slug: 'maulvi-abdul-azeez',
      title: 'Central Missionary & Head of Tarbiyya',
      bio: 'Senior theologian and missionary dedicated to Islamic moral upbringing, youth education, and theological defense of Islamic orthodoxy.',
      avatar: '/images/jalsa-prayer.jpg',
      email: 'tarbiyya@jalsasalana.ng',
    },
    {
      name: 'Jalsa Salana Editorial Board',
      slug: 'editorial-board',
      title: 'Central Research & Publications Directorate',
      bio: 'The official digital editorial board of Jalsa Salana Nigeria, curating historical records, press releases, interviews, and convention reflections.',
      avatar: '/images/jalsa-logo.png',
      email: 'editor@jalsasalana.ng',
    },
  ];

  const authorsMap = {};
  for (const a of authorsData) {
    const author = await prisma.author.upsert({
      where: { slug: a.slug },
      create: a,
      update: a,
    });
    authorsMap[a.slug] = author;
  }
  console.log('[Seed] Authors created.');

  // 4. Categories
  const categoriesData = [
    { name: 'Faith & Spirituality', slug: 'faith-spirituality', description: 'Theological treatises, commentary on the Holy Quran, and reflections on spiritual purification.', color: '#064e3b', sortOrder: 1 },
    { name: 'Social Justice & Peace', slug: 'social-justice-peace', description: 'Islamic prescriptions for equitable governance, poverty alleviation, and peaceful coexistence.', color: '#b45309', sortOrder: 2 },
    { name: 'Khilafat & Guidance', slug: 'khilafat-guidance', description: 'Divine leadership, guidance of the Khalifatul Masih, and the unity of the global community.', color: '#1d4ed8', sortOrder: 3 },
    { name: 'Tarbiyya & Youth', slug: 'tarbiyya-youth', description: 'Moral training, character development, and empowering the next generation of leadership.', color: '#047857', sortOrder: 4 },
    { name: 'Press Conferences', slug: 'press-conference', description: 'Official communiques, media briefings, and public declarations issued at Jalsa Salana.', color: '#6b21a8', sortOrder: 5 },
    { name: 'History & Heritage', slug: 'history-heritage', description: 'Over a century of Ahmadiyya history in Nigeria and documentary records of past Jalsa editions.', color: '#991b1b', sortOrder: 6 },
    { name: 'Guest Impressions', slug: 'guest-impressions', description: 'Reflections and testimonies from national dignitaries, traditional rulers, and interfaith guests.', color: '#0e7490', sortOrder: 7 },
  ];

  const categoriesMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
    categoriesMap[c.slug] = cat;
  }
  console.log('[Seed] Categories created.');

  // 5. Jalsa Editions (Historical & Upcoming 2026)
  const editionsData = [
    {
      year: 2026,
      editionNumber: '72nd Annual Convention',
      themeEnglish: 'Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony',
      themeArabic: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ',
      venue: 'Jamia Ahmadiyya Ilaro, Ogun State, Nigeria',
      dates: 'December 18–20, 2026',
      attendance: '45,000+ Delegates Anticipated',
      description: 'The 72nd Jalsa Salana Nigeria convenes spiritual delegates, international diplomats, and scholars to address pressing issues of justice, good governance, and moral revitalisation.',
      history: 'Anticipated as the largest spiritual gathering of the Ahmadiyya Muslim Jama\'at in West Africa in 2026.',
      featuredImage: '/images/jalsa2026-badge.png',
      liveStreamUrl: 'https://youtube.com',
      isCurrent: true,
    },
    {
      year: 2025,
      editionNumber: '71st Annual Convention',
      themeEnglish: 'Taqwa: The Foundation for Social Cohesion, Moral Integrity and National Rebirth',
      themeArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ',
      venue: 'Jamia Ahmadiyya Ilaro, Ogun State, Nigeria',
      dates: 'December 19–21, 2025',
      attendance: '41,500 Delegates',
      description: 'The 71st convention focused on cultivating righteousness and integrity across all sectors of public and private life.',
      history: 'Recorded an attendance of delegates representing all 36 Nigerian states and delegates from Ghana, Benin, UK, and Canada.',
      featuredImage: '/images/jalsa2025-poster.png',
      isCurrent: false,
    },
    {
      year: 2024,
      editionNumber: '70th Platinum Jubilee Convention',
      themeEnglish: 'Seven Decades of Spiritual Illumination and Humanitarian Service in Nigeria',
      themeArabic: 'الْحَمْدُ لِلَّهِ الَّذِي هَدَانَا لِهَٰذَا',
      venue: 'Jamia Ahmadiyya Ilaro, Ogun State, Nigeria',
      dates: 'December 20–22, 2024',
      attendance: '39,850 Delegates',
      description: 'Historic Platinum Jubilee commemorating 70 conventions of uninterrupted spiritual education, youth engagement, and charitable initiatives in Nigeria.',
      history: 'Featured special exhibitions, commemorative documentary screenings, and goodwill messages from federal ministers and governors.',
      featuredImage: '/images/70th-jalsa-hero.jpg',
      isCurrent: false,
    },
    {
      year: 2023,
      editionNumber: '69th Annual Convention',
      themeEnglish: 'Khilafat-e-Ahmadiyya: The Harbinger of Justice and Divine Peace in the Latter Days',
      themeArabic: 'وَعَدَ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَعَمِلُوا الصَّالِحَاتِ لَيَسْتَخْلِفَنَّهُمْ',
      venue: 'Jamia Ahmadiyya Ilaro, Ogun State',
      dates: 'December 22–24, 2023',
      attendance: '37,200 Delegates',
      description: 'Celebrated the peaceful guidance of Khilafat and launched major nationwide volunteer community service projects.',
      featuredImage: '/images/jalsa-convention-a.jpg',
      isCurrent: false,
    },
    {
      year: 2022,
      editionNumber: '68th Annual Convention',
      themeEnglish: 'Recognizing the Divine Creator in an Age of Materialism and Uncertainty',
      venue: 'Jamia Ahmadiyya Ilaro, Ogun State',
      dates: 'December 23–25, 2022',
      attendance: '34,900 Delegates',
      description: 'Focused on counteracting moral decay and reaffirming devotion to God Almighty.',
      featuredImage: '/images/jalsa-convention-b.jpg',
      isCurrent: false,
    },
  ];

  const editionsMap = {};
  for (const e of editionsData) {
    const ed = await prisma.jalsaEdition.upsert({
      where: { year: e.year },
      create: e,
      update: e,
    });
    editionsMap[e.year] = ed;
  }
  console.log('[Seed] Jalsa Editions created (2022-2026).');

  // 6. Editorial Articles
  const articlesData = [
    {
      title: 'Justice and Equality: Indispensable Prerequisites for Global Peace — Jalsa Salana Nigeria 2026 Theme Unveiled',
      slug: 'justice-equality-prerequisites-global-peace-jalsa-2026',
      subtitle: 'As delegates across Nigeria prepare for the 72nd Annual Convention in Ilaro, National Amir Alatoye Folorunso delivers a clarion call on ethical leadership and spiritual revitalisation.',
      excerpt: 'The theme for the 72nd Jalsa Salana Nigeria addresses the root causes of socio-economic volatility in Nigeria and advocates for genuine justice as taught by Islam.',
      content: `
<h2>The Foundation of Global and National Harmony</h2>
<p>In a world fractured by socioeconomic disparity, geopolitical conflict, and systemic inequality, the eternal teachings of the Holy Quran stand as an infallible beacon. The 72nd Jalsa Salana Nigeria has adopted a theme of paramount urgency: <em>"Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony."</em></p>

<blockquote>
  "God commands justice and the doing of good to others, and giving like kindred, and forbids indecency, and evil, and rebellion." (Surah An-Nahl, Verse 91)
</blockquote>

<p>Speaking at the national headquarters, the National Amir of the Ahmadiyya Muslim Jama'at Nigeria, <strong>Alhaji Barrister Alatoye Folorunso Azeez</strong>, highlighted that peace cannot exist in an environment where the vulnerable are marginalised and national wealth is monopolised by a few.</p>

<h2>Beyond Passive Tolerance: Active Equity</h2>
<p>True justice, as elucidated by Hazrat Mirza Ghulam Ahmad (as), the Promised Messiah and Mahdi, requires individuals and state actors to transcend mere legal reciprocity. It demands benevolence (<em>Ihsan</em>) and compassion akin to familial love (<em>Ita'i Dhil-Qurba</em>).</p>

<p>During the upcoming 72nd convention at Jamia Ahmadiyya Ilaro, distinguished scholars, judicial figures, and community leaders will engage in dedicated symposiums dissecting:</p>
<ul>
  <li>The eradication of corruption through genuine God-consciousness (<em>Taqwa</em>).</li>
  <li>Equitable educational access for Nigerian youth.</li>
  <li>The divine mandate of Khilafat in fostering global brotherhood.</li>
</ul>

<p>As thousands prepare their journey towards Ilaro in December 2026, the convention calls upon all citizens to evaluate their personal accountability before the Creator.</p>
      `,
      featuredImage: '/images/jalsa-convention-c.jpg',
      imageCredit: 'Photo: Jalsa Media Nigeria / Jamia Ilaro Grounds',
      readingTime: 6,
      featuredType: 'HERO',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-10-15T10:00:00Z'),
      viewsCount: 1420,
      authorSlug: 'alatoye-folorunso-azeez',
      categorySlugs: ['faith-spirituality', 'social-justice-peace'],
      year: 2026,
    },
    {
      title: 'TAQWA: A Divine Recipe for Social Justice and Peace in Nigeria',
      slug: 'taqwa-recipe-social-justice-peace-nigeria',
      subtitle: 'In an impassioned address, the National Amir explains how genuine fear of Allah eradicates political corruption and heals societal discord.',
      excerpt: 'Exploring how personal spiritual reform directly translates into collective societal transformation.',
      content: `
<h2>The Indispensable Role of God-Consciousness</h2>
<p>Speaking at the press conference preceding the Annual Convention, the National Amir emphasized that socioeconomic policies and constitutional amendments alone cannot cure societal ailments if hearts remain devoid of <strong>Taqwa</strong> (righteous God-fearing).</p>

<blockquote>
  "The most honorable among you in the sight of Allah is he who is the most righteous among you." (Surah Al-Hujurat, Verse 14)
</blockquote>

<p>When an official recognizes that every hidden penny and every abuse of public trust is under the scrutiny of the Omniscient Creator, external enforcement mechanisms become secondary to internal moral conviction.</p>
      `,
      featuredImage: '/images/jalsa-scholars.jpg',
      imageCredit: 'Photo: Central Tarbiyya Department',
      readingTime: 5,
      featuredType: 'SECONDARY',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-20T12:00:00Z'),
      viewsCount: 980,
      authorSlug: 'alatoye-folorunso-azeez',
      categorySlugs: ['social-justice-peace', 'tarbiyya-youth'],
      year: 2025,
    },
    {
      title: 'The 70th Platinum Jubilee: Reflecting on Seven Decades of Faith, Service, and National Impact',
      slug: '70th-platinum-jubilee-seven-decades-faith-service',
      subtitle: 'From humble beginnings in Lagos in the early 1950s to an internationally renowned spiritual assembly at Jamia Ilaro.',
      excerpt: 'A comprehensive historical retrospection of seven decades of Jalsa Salana Nigeria and its humanitarian contributions.',
      content: `
<h2>A Blessed Seed Planted in African Soil</h2>
<p>The 70th Jalsa Salana Nigeria represented a milestone of historic proportions. From the first gatherings attended by dozens of faithful members to today's sprawling assembly of over 40,000 delegates, the divine hand behind this gathering is unmistakable.</p>

<p>Over these seven decades, the Jama'at in Nigeria has established hundreds of primary and secondary schools, hospitals, and rural healthcare dispensaries serving millions of Nigerians regardless of creed or ethnicity.</p>
      `,
      featuredImage: '/images/70th-jalsa-hero.jpg',
      imageCredit: 'Archive: Ahmadiyya Historical Society Nigeria',
      readingTime: 8,
      featuredType: 'SECONDARY',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-12-25T15:00:00Z'),
      viewsCount: 1850,
      authorSlug: 'dr-saheed-timehin',
      categorySlugs: ['history-heritage'],
      year: 2024,
    },
    {
      title: 'Avoid Vagrant Display of Wealth, Amir Urges Nigerian Leaders Ahead of Jalsa',
      slug: 'avoid-vagrant-display-wealth-amir-urges-leaders',
      subtitle: 'Addressing national media editors, Jama\'at leadership calls for empathy, modest living, and policy interventions prioritizing poverty eradication.',
      excerpt: 'A strong moral rebuke against political ostentation in the face of widespread public austerity.',
      content: `
<h2>The Moral Duty of Leadership</h2>
<p>In his press conference address in Lagos, Amir Alatoye Folorunso urged Nigerian political dignitaries and public office holders to lead by personal example, cautioning that ostentatious displays of affluence alienate citizens and fuel social unrest.</p>
      `,
      featuredImage: '/images/guest-aregbesola.jpg',
      imageCredit: 'Photo: Jalsa Press Unit',
      readingTime: 4,
      featuredType: 'SECONDARY',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-12-08T09:30:00Z'),
      viewsCount: 1120,
      authorSlug: 'alatoye-folorunso-azeez',
      categorySlugs: ['press-conference', 'social-justice-peace'],
      year: 2024,
    },
    {
      title: 'Khilafat-e-Ahmadiyya: The Harbinger of Justice and Divine Peace in the Latter Days',
      slug: 'khilafat-e-ahmadiyya-harbinger-justice-peace',
      subtitle: 'An intellectual examination of the divinely guided leadership of Hazrat Mirza Masroor Ahmad (aba) amidst unprecedented global unrest.',
      excerpt: 'Exploring how the institution of Khilafat provides continuous moral direction to heads of state and ordinary believers alike.',
      content: `
<h2>The Divine Fortress of the Believers</h2>
<p>The Holy Prophet Muhammad (sa) prophesied that following a period of trial and monarchical tyranny, there would return <em>"Khilafat on the precept of Prophethood."</em> Today, Khilafat-e-Ahmadiyya represents the only spiritual leadership actively convening international peace symposiums and warning global superpowers of the catastrophe of nuclear war.</p>
      `,
      featuredImage: '/images/jalsa-international.jpg',
      imageCredit: 'Photo: Makhzan-e-Tasaweer International',
      readingTime: 9,
      featuredType: 'EDITORS_PICK',
      status: 'PUBLISHED',
      publishedAt: new Date('2023-12-21T18:00:00Z'),
      viewsCount: 2240,
      authorSlug: 'dr-saheed-timehin',
      categorySlugs: ['khilafat-guidance', 'faith-spirituality'],
      year: 2023,
    },
    {
      title: 'Hadhrat Khadija and Hadhrat Nusrat Jahan Begum: Two Pious Ladies of Extraordinary Sacrifice',
      slug: 'hadhrat-khadija-and-hadhrat-nusrat-jahan-begum',
      subtitle: 'Examining the timeless contributions of holy women whose steadfastness, intellect, and financial sacrifice sustained the mission of the prophets.',
      excerpt: 'Delving into the heroic sacrifices of the Mother of the Believers and the noble wife of the Promised Messiah.',
      content: `
<h2>The Backbone of Divine Missions</h2>
<p>No historical narrative of religious revival is complete without recognizing the indispensable devotion of pious women. Hadhrat Khadijatul Kubra (ra) stood by the Holy Prophet (sa) during the terrifying moments of the first revelation, placing her entire fortune at the service of Islam.</p>
<p>Centuries later, Hadhrat Nusrat Jahan Begum, affectionately known as Amma Jan (ra), mirrored this sublime sacrifice during the renaissance of Islam under the Promised Messiah (as).</p>
      `,
      featuredImage: '/images/jalsa-audience.jpg',
      imageCredit: 'Photo: Lajna Imaillah Media Wing',
      readingTime: 7,
      featuredType: 'EDITORS_PICK',
      status: 'PUBLISHED',
      publishedAt: new Date('2023-12-20T14:15:00Z'),
      viewsCount: 1670,
      authorSlug: 'dr-saheed-timehin',
      categorySlugs: ['faith-spirituality', 'history-heritage'],
      year: 2023,
    },
    {
      title: 'Discharge Your Duties with a Smile — National Amir to 3,500 Jalsa Volunteers',
      slug: 'discharge-duties-with-smile-amir-to-volunteers',
      subtitle: 'The spiritual ethos of serving guests of the Promised Messiah (as) without expectation of worldly reward.',
      excerpt: 'Instilling the spirit of selfless service, patience, and hospitality among young volunteer teams.',
      content: `
<p>Addressing thousands of Khuddam (youth) and Ansar (elders) assembled on the Ilaro grounds days before the commencement of Jalsa, Amir Alatoye reminded the volunteers that the attendees of Jalsa Salana are not ordinary guests; they are the guests of God and His Prophet.</p>
      `,
      featuredImage: '/images/jalsa-convention-b.jpg',
      imageCredit: 'Photo: Majlis Khuddamul Ahmadiyya Nigeria',
      readingTime: 4,
      featuredType: 'NONE',
      status: 'PUBLISHED',
      publishedAt: new Date('2023-12-22T08:00:00Z'),
      viewsCount: 840,
      authorSlug: 'alatoye-folorunso-azeez',
      categorySlugs: ['tarbiyya-youth'],
      year: 2023,
    },
  ];

  for (const art of articlesData) {
    const author = authorsMap[art.authorSlug];
    const edition = editionsMap[art.year];

    const article = await prisma.article.upsert({
      where: { slug: art.slug },
      create: {
        title: art.title,
        slug: art.slug,
        subtitle: art.subtitle,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        imageCredit: art.imageCredit,
        readingTime: art.readingTime,
        featuredType: art.featuredType,
        status: art.status,
        publishedAt: art.publishedAt,
        viewsCount: art.viewsCount,
        authorId: author.id,
        editionId: edition.id,
        metaTitle: art.title,
        metaDescription: art.excerpt,
        categories: {
          create: art.categorySlugs.map((s) => ({
            categoryId: categoriesMap[s].id,
          })),
        },
      },
      update: {
        title: art.title,
        subtitle: art.subtitle,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        imageCredit: art.imageCredit,
        readingTime: art.readingTime,
        featuredType: art.featuredType,
        status: art.status,
        publishedAt: art.publishedAt,
        authorId: author.id,
        editionId: edition.id,
      },
    });
  }
  console.log('[Seed] Editorial articles seeded.');

  // 7. Speeches & Keynotes
  const speechesData = [
    {
      title: 'Special Message to the Delegates of Jalsa Salana Nigeria 2024',
      slug: 'special-message-delegates-jalsa-nigeria-2024',
      speakerName: 'Hazrat Mirza Masroor Ahmad (aba)',
      speakerTitle: 'Worldwide Head of the Ahmadiyya Muslim Community, Fifth Caliph',
      speechType: 'Special Caliphal Address',
      session: 'Concluding Session - Day 3',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      summary: 'His Holiness delivers profound guidance on maintaining the spiritual heights achieved during the 70th Platinum Jubilee convention.',
      transcript: `In his blessed message sent to the 70th Jalsa Salana Nigeria, His Holiness Hazrat Mirza Masroor Ahmad (aba) stated:\n\n"May Allah the Almighty bless this gathering in every respect and enable all participants to imbibe true Taqwa. Remember that Jalsa Salana was instituted by the Promised Messiah (as) not as a worldly festival, but as a gathering dedicated entirely to the remembrance of Allah and spiritual rejuvenation."`,
      year: 2024,
    },
    {
      title: 'Social Justice, Moral Rectitude, and National Rebirth in Nigeria',
      slug: 'social-justice-moral-rectitude-national-rebirth',
      speakerName: 'Alhaji Barr. Alatoye Folorunso Azeez',
      speakerTitle: 'National Amir, Ahmadiyya Muslim Jama\'at Nigeria',
      speechType: 'Presidential Address',
      session: 'Opening Session - Day 1',
      summary: 'A comprehensive legal and theological analysis of Nigeria\'s socio-political challenges and the Islamic remedy.',
      transcript: `The National Amir emphasised that true justice cannot be realized in any nation where the judiciary is compromised and the wealthy enjoy immunity while ordinary citizens struggle for survival. He urged political leaders to draw inspiration from the exemplary leadership of Hadhrat Umar ibn al-Khattab (ra).`,
      year: 2024,
    },
    {
      title: 'Khilafat: The Shield of the Muslim Ummah Against Division and Discord',
      slug: 'khilafat-shield-muslim-ummah',
      speakerName: 'Maulvi Abdul Azeez',
      speakerTitle: 'Central Missionary & Head of Tarbiyya',
      speechType: 'Scholarly Lecture',
      session: 'Saturday Morning Session - Day 2',
      summary: 'Tracing the divine institution of Khilafat and how unity under one leader protects believers from confusion in the latter days.',
      transcript: `Maulvi Abdul Azeez delivered an eloquent exposition on the prophetic traditions detailing the coming of Khilafat on the precept of prophethood.`,
      year: 2023,
    },
  ];

  for (const sp of speechesData) {
    const edition = editionsMap[sp.year];
    await prisma.speech.upsert({
      where: { slug: sp.slug },
      create: {
        title: sp.title,
        slug: sp.slug,
        speakerName: sp.speakerName,
        speakerTitle: sp.speakerTitle,
        speechType: sp.speechType,
        session: sp.session,
        videoUrl: sp.videoUrl,
        summary: sp.summary,
        transcript: sp.transcript,
        editionId: edition.id,
      },
      update: {
        title: sp.title,
        speakerName: sp.speakerName,
        speakerTitle: sp.speakerTitle,
        summary: sp.summary,
        editionId: edition.id,
      },
    });
  }
  console.log('[Seed] Speeches and keynote records seeded.');

  // 8. Media & Galleries
  const gallery = await prisma.gallery.upsert({
    where: { slug: '70th-platinum-jubilee-highlights' },
    create: {
      title: '70th Platinum Jubilee Highlights — Jalsa Salana Nigeria',
      slug: '70th-platinum-jubilee-highlights',
      description: 'Stunning visual moments capturing the 70th Annual Convention at Jamia Ahmadiyya Ilaro, featuring prayer sessions, scholarly addresses, and international delegates.',
      coverImage: '/images/70th-jalsa-hero.jpg',
      photographer: 'Jalsa Media Nigeria Photojournalism Unit',
      eventDay: 'December 20–22, 2024',
      editionId: editionsMap[2024].id,
    },
    update: {},
  });

  const photoFiles = [
    { title: 'The Platinum Jubilee Grand Marquee', url: '/images/70th-jalsa-hero.jpg', caption: 'The main assembly marquee packed with thousands of delegates.' },
    { title: 'Arrival of State Dignitaries', url: '/images/guest-aregbesola.jpg', caption: 'Former Minister of Interior received by National Amir.' },
    { title: 'Delegates in Silent Supplication', url: '/images/jalsa-prayer.jpg', caption: 'Thousands joining in congregational Tahajjud and morning prayers.' },
    { title: 'Scholars on the Main Dais', url: '/images/jalsa-scholars.jpg', caption: 'Central missionaries and guest scholars addressing the assembly.' },
    { title: 'International Guests and Delegates', url: '/images/jalsa-international.jpg', caption: 'Foreign visitors from across West Africa and Europe.' },
    { title: 'Women\'s Convention Marquee', url: '/images/jalsa-audience.jpg', caption: 'Lajna Imaillah delegates during their dedicated Saturday session.' },
  ];

  for (let idx = 0; idx < photoFiles.length; idx++) {
    const pf = photoFiles[idx];
    const media = await prisma.media.create({
      data: {
        title: pf.title,
        caption: pf.caption,
        credit: 'Jalsa Media Nigeria',
        fileUrl: pf.url,
        mimeType: 'image/jpeg',
        editionId: editionsMap[2024].id,
      },
    });

    await prisma.galleryItem.create({
      data: {
        galleryId: gallery.id,
        mediaId: media.id,
        sortOrder: idx,
      },
    });
  }
  console.log('[Seed] Media gallery and photos seeded.');

  // 9. Site Settings
  const settingsData = [
    { key: 'site_title', value: 'Jalsa Salana Nigeria', group: 'general' },
    { key: 'site_tagline', value: 'Digital Editorial & Publishing Platform', group: 'general' },
    { key: 'ticker_text', value: 'REGISTRATION NOW OPEN: 72nd Jalsa Salana Nigeria — December 18–20, 2026 at Jamia Ilaro, Ogun State', group: 'announcements' },
    { key: 'ticker_link', value: '/editions/2026', group: 'announcements' },
    { key: 'contact_email', value: 'info@jalsasalana.ng', group: 'contact' },
    { key: 'contact_phone', value: '+234 803 000 0000', group: 'contact' },
    { key: 'contact_address', value: 'Ahmadiyya Muslim Jama\'at Nigeria Headquarters, Ojokoro, Lagos State', group: 'contact' },
    { key: 'social_x', value: 'https://x.com/Ahmadiyya_NG', group: 'social' },
    { key: 'social_facebook', value: 'https://facebook.com/ahmadiyyang', group: 'social' },
    { key: 'social_youtube', value: 'https://youtube.com/mta_international', group: 'social' },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: s,
      update: s,
    });
  }
  console.log('[Seed] Site settings populated.');

  // 10. Navigation Menus
  const primaryMenu = await prisma.navigationMenu.upsert({
    where: { location: 'HEADER_PRIMARY' },
    create: {
      name: 'Primary Header Navigation',
      location: 'HEADER_PRIMARY',
      items: {
        create: [
          { title: 'Articles', url: '/articles', sortOrder: 1 },
          { title: 'Speeches', url: '/speeches', sortOrder: 2 },
          { title: 'Jalsa 2026', url: '/editions/2026', sortOrder: 3 },
          { title: 'Historical Archives', url: '/editions', sortOrder: 4 },
          { title: 'Photo Galleries', url: '/galleries', sortOrder: 5 },
          { title: 'About Jalsa', url: '/about', sortOrder: 6 },
          { title: 'Contact', url: '/contact', sortOrder: 7 },
        ],
      },
    },
    update: {},
  });
  console.log('[Seed] Navigation menus configured.');

  console.log('[Seed] Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

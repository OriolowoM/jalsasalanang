const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Pool of authentic images classified by topic
const imagePool = {
  cycling: [
    '/images/jalsa_gallery/jalsa-cycling-association-arrival.jpg',
  ],
  prayer: [
    '/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg',
    '/images/jalsa_gallery/jalsa-night-prayer-sujud.jpg',
    '/images/jalsa_gallery/jalsa-congregational-sujud-green-carpet.jpg',
    '/images/jalsa_gallery/jalsa-prayer-volunteers-salat.jpg',
    '/images/jalsa_gallery/jalsa-outdoor-prayer-lawn.jpg',
    '/images/jalsa_gallery/jalsa-silent-prayer-dua.jpg',
  ],
  leadership: [
    '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg',
    '/images/jalsa_gallery/jalsa-amir-stage-address.jpg',
    '/images/jalsa_gallery/jalsa-amir-ground-inspection.jpg',
    '/images/jalsa_gallery/jalsa-amir-gift-presentation.jpg',
  ],
  dignitaries: [
    '/images/jalsa_gallery/jalsa-governor-abiodun-amir-handshake.jpg',
    '/images/jalsa_gallery/jalsa-vp-osinbajo-convention-visit.jpg',
    '/images/jalsa_gallery/jalsa-traditional-rulers-obas.jpg',
    '/images/jalsa_gallery/jalsa-royal-oba-coronation-amir.jpg',
    '/images/jalsa_gallery/jalsa-stage-dignitaries-flowers.jpg',
    '/images/jalsa_gallery/jalsa-female-dignitary-reception.jpg',
  ],
  volunteers: [
    '/images/jalsa_gallery/jalsa-khuddam-security-discipline.jpg',
    '/images/jalsa_gallery/jalsa-prayer-volunteers-salat.jpg',
    '/images/jalsa_gallery/jalsa-amir-ground-inspection.jpg',
  ],
  community: [
    '/images/jalsa_gallery/jalsa-crowd-marquee-gathering.jpg',
    '/images/jalsa_gallery/jalsa-delegates-overview-marquee.jpg',
    '/images/jalsa_gallery/jalsa-brotherhood-attendees.jpg',
    '/images/jalsa_gallery/jalsa-congregation-listening.jpg',
    '/images/jalsa_gallery/jalsa-elders-traditional-attire.jpg',
    '/images/jalsa_gallery/jalsa-delegates-accreditation-cards.jpg',
    '/images/jalsa_gallery/jalsa-delegates-media-wall-banner.jpg',
  ],
  lectures: [
    '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg',
    '/images/jalsa_gallery/jalsa-podium-tilawat-recitation.jpg',
    '/images/jalsa_gallery/jalsa-interfaith-archbishop-interview.jpg',
    '/images/jalsa_gallery/jalsa-amir-gift-presentation.jpg',
  ],
};

function pickImageForArticle(article, index) {
  const text = `${article.title} ${article.slug} ${article.excerpt || ''}`.toLowerCase();

  if (/cycl|ride|bicycle|wheel|road|journey.*resilience|travel/i.test(text)) {
    return imagePool.cycling[0];
  }

  if (/salat|prayer|sujud|tahajjud|fajr|dua|supplication|answered prayer|spiritual|faithfulness|ameen|praise/i.test(text)) {
    const list = imagePool.prayer;
    return list[index % list.length];
  }

  if (/volunteer|khuddam|security|duty|service|clinic|health|hygiene|water supply|duty|tajneed|raqeem|traffic/i.test(text)) {
    const list = imagePool.volunteers;
    return list[index % list.length];
  }

  if (/governor|politician|dignitary|oba|royal|peace|justice|communique|conference|ambassador|leader|injustice|terror|world affairs|palliatives|wealth/i.test(text)) {
    const list = imagePool.dignitaries;
    return list[index % list.length];
  }

  if (/amir|inspection|presid|speech|lecture|talk|address|keynote|theme|knowledge|press/i.test(text)) {
    const list = imagePool.leadership;
    return list[index % list.length];
  }

  if (/lecture|book|interfaith|interview|scholar|hadhrat|khilafat|prophet|media|education/i.test(text)) {
    const list = imagePool.lectures;
    return list[index % list.length];
  }

  // Default to community & congregation pool
  const list = imagePool.community;
  return list[index % list.length];
}

async function run() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  console.log(`Updating images for ${articles.length} articles...`);

  let count = 0;
  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    const newImage = pickImageForArticle(art, i);
    await prisma.article.update({
      where: { id: art.id },
      data: {
        featuredImage: newImage,
        imageCredit: 'Official Jalsa Salana Nigeria Photo',
      },
    });
    count++;
  }

  console.log(`Successfully updated ${count} articles with authentic Jalsa photos!`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

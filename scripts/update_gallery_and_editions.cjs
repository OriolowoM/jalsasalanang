const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('=== Step 1: Update Jalsa Editions with Authentic Photos ===');
  await prisma.jalsaEdition.updateMany({
    where: { year: 2024 },
    data: { featuredImage: '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg' },
  });
  await prisma.jalsaEdition.updateMany({
    where: { year: 2023 },
    data: { featuredImage: '/images/jalsa_gallery/jalsa-amir-gift-presentation.jpg' },
  });
  await prisma.jalsaEdition.updateMany({
    where: { year: 2022 },
    data: { featuredImage: '/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg' },
  });
  console.log('Updated JalsaEdition featured images.');

  console.log('\n=== Step 2: Update Gallery & Media ===');
  const gallery = await prisma.gallery.findFirst();
  if (gallery) {
    await prisma.gallery.update({
      where: { id: gallery.id },
      data: {
        coverImage: '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg',
      },
    });

    await prisma.galleryItem.deleteMany({
      where: { galleryId: gallery.id },
    });

    await prisma.media.deleteMany();

    const mediaList = [
      {
        title: 'Keynote Address & Main Stage Dais',
        caption: 'Keynote presentation delivered from the floral podium of the 70th Platinum Jubilee.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg',
        fileSize: 191675,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Night Tahajjud Prayer in Grand Marquee',
        caption: 'Tahajjud and Fajr prayers illuminated under the grand convention marquee.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg',
        fileSize: 192931,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Executive State Reception with Governor',
        caption: 'His Excellency Prince Dapo Abiodun, Governor of Ogun State, received by National Amir.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-governor-abiodun-amir-handshake.jpg',
        fileSize: 158777,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Discipline & Volunteer Security Corps',
        caption: 'Majlis Khuddamul Ahmadiyya discipline and security corps in uniform.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-khuddam-security-discipline.jpg',
        fileSize: 189916,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Ride to Jalsa — Cycling Caravan Arrival',
        caption: 'Ahmadiyya Cycling Association riders arriving in team kits on convention grounds.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-cycling-association-arrival.jpg',
        fileSize: 145463,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Royal Obas & Traditional Custodians',
        caption: 'Traditional Royal Obas in beaded crowns seated in the VIP gallery.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-traditional-rulers-obas.jpg',
        fileSize: 190877,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Volunteers and Attendees in Salat',
        caption: 'Duty volunteers and delegates joined in prayer rows.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-prayer-volunteers-salat.jpg',
        fileSize: 128359,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Gathering of Faithful Hearts',
        caption: 'Delegates and attendees listening attentively under the convention canopy.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-crowd-marquee-gathering.jpg',
        fileSize: 169097,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Interfaith Goodwill Interview',
        caption: 'Christian Archbishop sharing message of peace during MTA interview at Jalsa.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-interfaith-archbishop-interview.jpg',
        fileSize: 89756,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Royal Oba on Dais with Amir',
        caption: 'Royal Oba with royal staff of office and coral regalia received on stage.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-royal-oba-coronation-amir.jpg',
        fileSize: 65439,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Silent Supplication & Dua',
        caption: 'Deep collective contemplation and tearful prayer with hands raised.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-silent-prayer-dua.jpg',
        fileSize: 138158,
        mimeType: 'image/jpeg',
      },
      {
        title: 'Outdoor Prayer on Convention Lawn',
        caption: 'Congregational prayer rows spread out on the green lawn.',
        credit: 'Official Jalsa Media',
        fileUrl: '/images/jalsa_gallery/jalsa-outdoor-prayer-lawn.jpg',
        fileSize: 212056,
        mimeType: 'image/jpeg',
      },
    ];

    for (let i = 0; i < mediaList.length; i++) {
      const m = mediaList[i];
      const createdMedia = await prisma.media.create({
        data: {
          title: m.title,
          caption: m.caption,
          credit: m.credit,
          fileUrl: m.fileUrl,
          fileSize: m.fileSize,
          mimeType: m.mimeType,
        },
      });

      await prisma.galleryItem.create({
        data: {
          galleryId: gallery.id,
          mediaId: createdMedia.id,
          sortOrder: i,
        },
      });
    }

    console.log(`Created ${mediaList.length} authentic Media records and attached to gallery!`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- PURGING DUMMY PAGES & HERITAGE PAGES ---');

  const pagesToDelete = [
    'services',
    'about',
    'about-us',
    'press24-contact-2',
    'press24-about-us-2',
    'press24-worldwide-team-2',
    'press24-categories',
    'press24-home',
    'press24-contact',
    'press24-about-us',
    'press24-worldwide-team',
    'home',
    'live-feed',
    'jalsa-ng-categories',
    'blog-page-155',
    'blog',
    'news',
    'khilafat',
    'ahmadiyya',
    'jalsa-salana'
  ];

  for (const slug of pagesToDelete) {
    const deleted = await prisma.page.deleteMany({ where: { slug } });
    if (deleted.count > 0) {
      console.log(`Deleted page: ${slug} (${deleted.count} record)`);
    }
  }

  // Also clean WordPressMigrationRecord for those pages so no orphaned pointers exist
  for (const slug of pagesToDelete) {
    await prisma.wordPressMigrationRecord.deleteMany({ where: { slug, postType: 'page' } });
  }

  console.log('\n--- CLEANING SECURITY PAGE ---');
  const security = await prisma.page.findUnique({ where: { slug: 'security' } });
  if (security) {
    let content = security.content;
    // Strip from "<h3>Our Mission</h3>" or "Our Mission" onwards
    const missionIdx = content.indexOf('Our Mission');
    if (missionIdx !== -1) {
      // Find previous tag start or slice at missionIdx
      const cutIdx = content.lastIndexOf('<', missionIdx);
      content = content.substring(0, cutIdx !== -1 ? cutIdx : missionIdx).trim();
    }
    // Remove any remaining raw SVGs or checkmarks
    content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
    await prisma.page.update({
      where: { slug: 'security' },
      data: { content, updatedAt: new Date() }
    });
    console.log('Updated security page. New length:', content.length);
  }

  console.log('\n--- CLEANING INFO-EMERGENCIES PAGE ---');
  const info = await prisma.page.findUnique({ where: { slug: 'info-emergencies' } });
  if (info) {
    let content = info.content;
    // Extract the genuine parts:
    // 1. Health Tips section
    // 2. Weather Forecast section
    // 3. Openness and Transparency + Hotline
    // Remove the plumbing mission, core values with checkmark SVGs, and Sed ut perspiciatis with Bryan Cirius
    
    // Remove the plumbing mission and core values
    content = content.replace(/<h3>Our Mission<\/h3>[\s\S]*?<\/ul>/gi, '');
    content = content.replace(/We strive to provide the most reliable and efficient plumbing services[\s\S]*?<\/ul>/gi, '');
    
    // Remove the customer testimonials (Sed ut perspiciatis, Bryan Cirius, Jane Dowser, Martin Foster)
    content = content.replace(/<i>&#xE934;<\/i>[\s\S]*?Jane Dowser/gi, '');
    content = content.replace(/Sed ut pers[\s\S]*?Jane Dowser/gi, '');
    
    // Remove any stock image tags
    content = content.replace(/<img[^>]*customer-[^>]*>/gi, '');
    content = content.replace(/<img[^>]*360_F_[^>]*>/gi, '');
    content = content.replace(/<img[^>]*images\.svg[^>]*>/gi, '');
    
    // Remove all raw SVGs
    content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');

    await prisma.page.update({
      where: { slug: 'info-emergencies' },
      data: { content, updatedAt: new Date() }
    });
    console.log('Updated info-emergencies page. New length:', content.length);
  }

  console.log('\n--- CLEANING PROGRAMME, PRESS-CONFERENCE, CONTACT PAGES ---');
  for (const slug of ['programme-of-events-jalsa-salana-nigeria-2024', 'press-conference', 'contact']) {
    const p = await prisma.page.findUnique({ where: { slug } });
    if (p) {
      let content = p.content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
      await prisma.page.update({
        where: { slug },
        data: { content, updatedAt: new Date() }
      });
      console.log(`Cleaned SVGs from ${slug}. New length:`, content.length);
    }
  }

  console.log('\n--- DELETING UNRELATED IMAGE FILES FROM DISK ---');
  const filesToDelete = [
    'customer-1-150x150.jpg',
    'customer-3-150x150.jpg',
    'customer-4-150x150.jpg',
    'emergency-p6fj1dvjr0y6g68d6x2m6mdowd49kr4gh2egt4vh1c.jpg',
    'emergency-qh0f5lrshlefp64nmnag3hsarjjubysgkuj1s458u8.jpg',
    'plumbing-about-p6f4oydpn17ug438u4vhh1papz33wcaqnyuths3k5c.jpg',
    'plumbing-about-qh0f5ktx2wl64tvpu2ym8luhfw87h81yfpoo3doxj4.jpg',
    'plumbing-about.jpg',
    'why-choose-us-p6dpqrzat55gttaj9e4rjuc5rm6x4qczldnifi683g.jpg',
    '360_F_335870116_0ODNCQ3eRXwiIXCEFDQ6mKrKWCid8uay.jpg'
  ];

  const dirs = [
    path.resolve('apps/web/public/uploads/migrated/jalsasalana.ng'),
    path.resolve('apps/api/uploads/migrated/jalsasalana.ng')
  ];

  let deletedFiles = 0;
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      for (const f of filesToDelete) {
        const fullPath = path.join(dir, f);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${path.relative(process.cwd(), fullPath)}`);
          deletedFiles++;
        }
      }
    }
  }
  console.log(`Deleted ${deletedFiles} dummy/unrelated image files.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

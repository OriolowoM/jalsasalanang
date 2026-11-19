/**
 * Real Jalsa Salana Nigeria Photographic Archives
 * Authentic photography catalog and deterministic image mapping for articles.
 */

export const JALSA_AUTHENTIC_GALLERY_IMAGES: readonly string[] = [
  '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg',
  '/images/jalsa_gallery/jalsa-congregation-listening.jpg',
  '/images/jalsa_gallery/jalsa-amir-stage-address.jpg',
  '/images/jalsa_gallery/jalsa-brotherhood-attendees.jpg',
  '/images/jalsa_gallery/jalsa-congregational-sujud-green-carpet.jpg',
  '/images/jalsa_gallery/jalsa-elders-traditional-attire.jpg',
  '/images/jalsa_gallery/jalsa-governor-abiodun-amir-handshake.jpg',
  '/images/jalsa_gallery/jalsa-podium-tilawat-recitation.jpg',
  '/images/jalsa_gallery/jalsa-delegates-overview-marquee.jpg',
  '/images/jalsa_gallery/jalsa-khuddam-security-discipline.jpg',
  '/images/jalsa_gallery/jalsa-outdoor-prayer-lawn.jpg',
  '/images/jalsa_gallery/jalsa-female-dignitary-reception.jpg',
  '/images/jalsa_gallery/jalsa-amir-ground-inspection.jpg',
  '/images/jalsa_gallery/jalsa-royal-oba-coronation-amir.jpg',
  '/images/jalsa_gallery/jalsa-silent-prayer-dua.jpg',
  '/images/jalsa_gallery/jalsa-traditional-rulers-obas.jpg',
  '/images/jalsa_gallery/jalsa-vp-osinbajo-convention-visit.jpg',
  '/images/jalsa_gallery/jalsa-cycling-association-arrival.jpg',
  '/images/jalsa_gallery/jalsa-delegates-accreditation-cards.jpg',
  '/images/jalsa_gallery/jalsa-delegates-media-wall-banner.jpg',
  '/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg',
  '/images/jalsa_gallery/jalsa-night-prayer-sujud.jpg',
  '/images/jalsa_gallery/jalsa-stage-dignitaries-flowers.jpg',
  '/images/jalsa_gallery/jalsa-prayer-volunteers-salat.jpg',
  '/images/jalsa_gallery/jalsa-real-scene-1.jpg',
  '/images/jalsa_gallery/jalsa-real-scene-2.jpg',
  '/images/jalsa_gallery/jalsa-real-scene-3.jpg',
  '/images/jalsa_gallery/jalsa-real-scene-4.jpg',
  '/images/jalsa_gallery/487537026_3218536311617566_2557852990953382313_n.jpg',
  '/images/jalsa_gallery/487550863_3218536281617569_1476018305873326816_n.jpg',
  '/images/jalsa_gallery/481048141_931829335781472_8921215896975165324_n.jpg',
  '/images/jalsa_gallery/480581103_931827925781613_4877421652256995875_n.jpg',
  '/images/jalsa_gallery/480753383_931824749115264_364284512862625166_n.jpg',
  '/images/jalsa_gallery/481468292_931827905781615_5677564982836741052_n.jpg',
  '/images/jalsa_gallery/482003831_931827879114951_4765142800405033179_n.jpg',
  '/images/jalsa_gallery/48414511_1253830758088141_6218937564561145856_n.jpg',
  '/images/jalsa_gallery/487154724_3217599525044578_1552444627192011315_n.jpg',
  '/images/jalsa_gallery/604844364_1164003322564071_5896281659450529332_n.jpg',
  '/images/jalsa_gallery/480824456_931827785781627_2829115088479867588_n.jpg',
  '/images/jalsa_gallery/480925409_931828052448267_7807471025647654084_n.jpg',
  '/images/jalsa_gallery/481154279_931829272448145_4070777054893083928_n.jpg',
  '/images/jalsa_gallery/481252119_931829362448136_3656886171990226348_n.jpg',
  '/images/jalsa_gallery/481284652_931826982448374_7116264240156850282_n.jpg',
  '/images/jalsa_gallery/481452035_931827782448294_7112395107260545288_n.jpg',
  '/images/jalsa_gallery/481667903_931827805781625_8116669082968283709_n.jpg',
  '/images/jalsa_gallery/481903083_931827819114957_1812725693663419773_n.jpg',
  '/images/jalsa_gallery/48370798_1253834751421075_7301023328901267456_n.jpg',
  '/images/jalsa_gallery/48373376_1253810324756851_9215906039369564160_n.jpg',
  '/images/jalsa_gallery/48396521_1253633821441168_2633941376340852736_n.jpg',
  '/images/jalsa_gallery/486790361_3217593718378492_6641158950147947182_n.jpg',
  '/images/jalsa_gallery/487808348_3217602118377652_1820709941462913707_n.jpg',
  '/images/jalsa_gallery/605131797_1161345596163177_1053491977148167865_n.jpg',
  '/images/jalsa_gallery/605197387_1161345586163178_8565920679338062884_n.jpg',
  '/images/jalsa_gallery/79876731_1556880227783191_2052757538696331264_n.jpg',
  '/images/jalsa_gallery/80187202_1556880504449830_3947302797334020096_n.jpg',
  '/images/jalsa_gallery/81206194_1556880331116514_8893665968979443712_n.jpg',
  '/images/jalsa_gallery/81265149_1556873634450517_6241235772041592832_n.jpg',
  '/images/jalsa_gallery/81487819_1556880441116503_8678054904163467264_n.jpg',
];

/**
 * Returns an authentic real Jalsa image for an article.
 * If the article does not have an explicit featuredImage, deterministically computes
 * a high-quality photo index based on slug, id, title or index.
 */
export function getArticleFeaturedImage(
  article?: {
    featuredImage?: string | null;
    slug?: string;
    id?: string;
    title?: string;
  } | null,
  fallbackIndex?: number
): string {
  if (
    article?.featuredImage &&
    typeof article.featuredImage === 'string' &&
    article.featuredImage.trim() !== '' &&
    !article.featuredImage.includes('default') &&
    !article.featuredImage.includes('placeholder')
  ) {
    return article.featuredImage;
  }

  const seed =
    article?.slug ||
    article?.id ||
    article?.title ||
    `article-index-${fallbackIndex ?? 0}`;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const idx = Math.abs(hash) % JALSA_AUTHENTIC_GALLERY_IMAGES.length;
  return JALSA_AUTHENTIC_GALLERY_IMAGES[idx];
}

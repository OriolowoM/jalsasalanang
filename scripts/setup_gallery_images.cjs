const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'apps', 'web', 'public', 'images', 'jalsa_gallery');

const mapping = {
  '480401158_926464289651310_1026323174552525813_n.jpg': 'jalsa-prayer-volunteers-salat.jpg',
  '480581103_931827925781613_4877421652256995875_n.jpg': 'jalsa-night-marquee-tahajjud.jpg',
  '480611249_926478279649911_1174432071804473897_n.jpg': 'jalsa-amir-gift-presentation.jpg',
  '480679058_926464439651295_4936158119834826163_n.jpg': 'jalsa-podium-tilawat-recitation.jpg',
  '480753383_931824749115264_364284512862625166_n.jpg': 'jalsa-amir-ground-inspection.jpg',
  '480775794_931828085781597_395215908815294908_n.jpg': 'jalsa-amir-stage-address.jpg',
  '480801981_931827922448280_1875683126877886266_n.jpg': 'jalsa-elders-traditional-attire.jpg',
  '480824456_931827785781627_2829115088479867588_n.jpg': 'jalsa-delegates-accreditation-cards.jpg',
  '480925409_931828052448267_7807471025647654084_n.jpg': 'jalsa-crowd-marquee-gathering.jpg',
  '481048141_931829335781472_8921215896975165324_n.jpg': 'jalsa-khuddam-security-discipline.jpg',
  '481154279_931829272448145_4070777054893083928_n.jpg': 'jalsa-congregation-listening.jpg',
  '481252119_931829362448136_3656886171990226348_n.jpg': 'jalsa-delegates-overview-marquee.jpg',
  '481259740_931827699114969_1505453337265964498_n.jpg': 'jalsa-brotherhood-attendees.jpg',
  '481284652_931826982448374_7116264240156850282_n.jpg': 'jalsa-cycling-association-arrival.jpg',
  '481452035_931827782448294_7112395107260545288_n.jpg': 'jalsa-night-prayer-sujud.jpg',
  '481468292_931827905781615_5677564982836741052_n.jpg': 'jalsa-main-stage-keynote-podium.jpg',
  '481667903_931827805781625_8116669082968283709_n.jpg': 'jalsa-congregational-sujud-green-carpet.jpg',
  '48370798_1253834751421075_7301023328901267456_n.jpg': 'jalsa-vp-osinbajo-convention-visit.jpg',
  '48373376_1253810324756851_9215906039369564160_n.jpg': 'jalsa-traditional-rulers-obas.jpg',
  '48396521_1253633821441168_2633941376340852736_n.jpg': 'jalsa-silent-prayer-dua.jpg',
  '48414511_1253830758088141_6218937564561145856_n.jpg': 'jalsa-outdoor-prayer-lawn.jpg',
  '487808348_3217602118377652_1820709941462913707_n.jpg': 'jalsa-governor-abiodun-amir-handshake.jpg',
  '79876731_1556880227783191_2052757538696331264_n.jpg': 'jalsa-delegates-media-wall-banner.jpg',
  '80187202_1556880504449830_3947302797334020096_n.jpg': 'jalsa-stage-dignitaries-flowers.jpg',
  '81206194_1556880331116514_8893665968979443712_n.jpg': 'jalsa-royal-oba-coronation-amir.jpg',
  '81265149_1556873634450517_6241235772041592832_n.jpg': 'jalsa-interfaith-archbishop-interview.jpg',
  '81487819_1556880441116503_8678054904163467264_n.jpg': 'jalsa-female-dignitary-reception.jpg',
};

// Also remove 487154724 (white diplomat) to strictly obey user's mandate
const prohibited = '487154724_3217599525044578_1552444627192011315_n.jpg';
const prohibitedPath = path.join(galleryDir, prohibited);
if (fs.existsSync(prohibitedPath)) {
  fs.unlinkSync(prohibitedPath);
  console.log('Removed prohibited image:', prohibited);
}

for (const [srcName, destName] of Object.entries(mapping)) {
  const srcPath = path.join(galleryDir, srcName);
  const destPath = path.join(galleryDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  } else {
    console.warn(`File not found: ${srcName}`);
  }
}
console.log('Done!');

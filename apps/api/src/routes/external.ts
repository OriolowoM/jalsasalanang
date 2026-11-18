import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notifications';

export const externalRouter = Router();

// GET /api/v1/external/calendar/jalsa-2026.ics — Dynamic RFC 5545 iCalendar download
externalRouter.get('/calendar/jalsa-2026.ics', (_req: Request, res: Response) => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jalsa Salana Nigeria//Official Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:72nd Jalsa Salana Nigeria 2026',
    'X-WR-TIMEZONE:Africa/Lagos',
    'BEGIN:VEVENT',
    'UID:72nd-jalsa-salana-nigeria-2026@jalsasalana.ng',
    'DTSTAMP:20261108T000000Z',
    'DTSTART;VALUE=DATE:20261218',
    'DTEND;VALUE=DATE:20261221',
    'SUMMARY:72nd Jalsa Salana Nigeria 2026 (Annual Convention)',
    'DESCRIPTION:Theme: Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony.\\n\\nVenue: Jamia Ahmadiyya Ilaro\\, Ogun State\\, Nigeria.\\n\\nLive broadcasts on MTA International and YouTube.\\nWebsite: https://jalsasalana.ng/editions/2026',
    'LOCATION:Jamia Ahmadiyya Ilaro\\, Ogun State\\, Nigeria',
    'GEO:6.8872;3.0142',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'URL:https://jalsasalana.ng/editions/2026',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="jalsa-salana-nigeria-2026.ics"');
  res.send(icsContent);
});

// GET /api/v1/external/quran/:surah/:verse — AlIslam Holy Quran reference resolver
externalRouter.get('/quran/:surah/:verse', (req: Request, res: Response) => {
  const surah = parseInt(req.params.surah, 10);
  const verse = parseInt(req.params.verse, 10);

  if (isNaN(surah) || isNaN(verse)) {
    res.status(400).json({ success: false, message: 'Invalid Surah or Verse numbers.' });
    return;
  }

  // Curated prominent citations for Jalsa themes
  const curatedVerses: Record<string, any> = {
    '16:91': {
      surahName: 'An-Nahl (The Bee)',
      english: 'Verily, Allah enjoins justice, and the doing of good to others; and giving like kindred; and forbids indecency, and evil, and rebellion. He admonishes you that you may take heed.',
      alislamUrl: 'https://www.alislam.org/quran/16:91',
      themeNote: 'Official theme anchor verse for the 72nd Jalsa Salana Nigeria 2026.',
    },
    '49:14': {
      surahName: 'Al-Hujurat (The Chambers)',
      english: 'O mankind, We have created you from a male and a female; and We have made you into clans and tribes that you may recognise one another. Verily, the most honourable among you, in the sight of Allah, is he who is the most righteous.',
      alislamUrl: 'https://www.alislam.org/quran/49:14',
      themeNote: 'Foundation of universal human equality in Islam.',
    },
    '5:9': {
      surahName: 'Al-Ma\'idah (The Table Spread)',
      english: 'O ye who believe! be steadfast in the cause of Allah, bearing witness in equity; and let not a people\'s enmity incite you to act otherwise than with justice. Be always just, that is nearer to righteousness.',
      alislamUrl: 'https://www.alislam.org/quran/5:9',
      themeNote: 'Absolute justice even towards adversaries.',
    },
  };

  const key = `${surah}:${verse}`;
  const data = curatedVerses[key] || {
    surah,
    verse,
    alislamUrl: `https://www.alislam.org/quran/app/${surah}:${verse}`,
    alislamSearchUrl: `https://www.alislam.org/quran/search/?q=${surah}:${verse}`,
  };

  res.json({
    success: true,
    data,
  });
});

// GET /api/v1/external/venue — Jamia Ahmadiyya Ilaro GPS & navigation
externalRouter.get('/venue', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'Jamia Ahmadiyya Ilaro',
      state: 'Ogun State',
      country: 'Nigeria',
      coordinates: {
        latitude: 6.8872,
        longitude: 3.0142,
      },
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jamia+Ahmadiyya+Ilaro+Ogun+State',
      googleDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142',
      travelGuidelines: [
        'From Lagos Airport (MMIA): Approximately 2.5 hours via Abeokuta Expressway or Papalanto corridor.',
        'From Ibadan: Approximately 2 hours via Abeokuta-Ilaro road.',
        'From Benin Republic: Approximately 45 minutes from Owode border post.',
      ],
      helplinePhone: '+234 803 000 0000',
      whatsappSupportUrl: 'https://wa.me/2348030000000?text=Salam%2C+I+need+directions+to+Jalsa+Salana+Nigeria+Ilaro',
    },
  });
});

// POST /api/v1/external/sms/test — Test SMS / Notification Delivery
externalRouter.post('/sms/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      res.status(400).json({ success: false, message: 'Phone and message are required.' });
      return;
    }

    const result = await notificationService.sendSMS(phone, message);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

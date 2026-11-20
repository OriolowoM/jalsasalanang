import { ProgrammeItem, PROGRAMME_DAYS, JALSA_2026_META } from './programme-2026';

/**
 * Parses time string like "5:40 PM – 6:20 PM" or "8:00 AM" for a specific date (YYYY-MM-DD)
 * Convention time is West Africa Time (WAT / UTC+1).
 */
export function parseSessionTimes(
  timeStr: string,
  dateISO: string
): { startDate: Date; endDate: Date } {
  const parts = timeStr.split('–').map((s) => s.trim());
  const startStr = parts[0];
  const endStr = parts[1] || null;

  const parseSingle = (s: string): { hours: number; minutes: number } => {
    const match = s.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
    if (!match) return { hours: 9, minutes: 0 };
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const meridian = match[3].toUpperCase();

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const startParsed = parseSingle(startStr);
  const endParsed = endStr
    ? parseSingle(endStr)
    : { hours: (startParsed.hours + 1) % 24, minutes: startParsed.minutes };

  // Note: WAT is UTC+1. Format as ISO strings with +01:00 offset
  const pad = (n: number) => n.toString().padStart(2, '0');
  const startISO = `${dateISO}T${pad(startParsed.hours)}:${pad(startParsed.minutes)}:00+01:00`;
  const endISO = `${dateISO}T${pad(endParsed.hours)}:${pad(endParsed.minutes)}:00+01:00`;

  return {
    startDate: new Date(startISO),
    endDate: new Date(endISO),
  };
}

/**
 * Format a Date object into iCalendar UTC timestamp: YYYYMMDDTHHMMSSZ
 */
function toICalDate(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Generate standard .ics (iCalendar) file string for starred programme items
 */
export function generateICalendar(items: { item: ProgrammeItem; dateISO: string }[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jalsa Salana Nigeria//Programme 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:My Jalsa 2026 Schedule',
    'X-WR-TIMEZONE:Africa/Lagos',
  ];

  for (const { item, dateISO } of items) {
    const { startDate, endDate } = parseSessionTimes(item.time, dateISO);
    const summary = `${item.title}${item.titleSuffix ? ` ${item.titleSuffix}` : ''}`;
    const description = [
      `72nd Jalsa Salana Nigeria 2026 (${JALSA_2026_META.theme})`,
      item.topic ? `Topic: “${item.topic}”` : '',
      item.facilitator ? `Facilitator: ${item.facilitator}` : '',
      `Session: ${item.session} (${item.time})`,
      'Venue: Jamia Ahmadiyya Ilaro, Ogun State, Nigeria',
      'Official Portal: https://jalsasalana.ng',
    ]
      .filter(Boolean)
      .join('\\n');

    lines.push(
      'BEGIN:VEVENT',
      `UID:jalsa2026-${item.id}-${dateISO}@jalsasalana.ng`,
      `DTSTAMP:${toICalDate(new Date())}`,
      `DTSTART:${toICalDate(startDate)}`,
      `DTEND:${toICalDate(endDate)}`,
      `SUMMARY:${summary.replace(/,/g, '\\,')}`,
      `DESCRIPTION:${description.replace(/,/g, '\\,')}`,
      `LOCATION:Jalsa Salana Conference Ground\\, Jamia Ahmadiyya\\, Ilaro\\, Ogun State\\, Nigeria`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary.replace(/,/g, '\\,')} begins in 15 minutes`,
      'END:VALARM',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers client-side browser download of generated .ics file
 */
export function downloadICalendarFile(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates direct Google Calendar Web link
 */
export function getGoogleCalendarUrl(item: ProgrammeItem, dateISO: string): string {
  const { startDate, endDate } = parseSessionTimes(item.time, dateISO);
  const formatGDate = (d: Date) => toICalDate(d);

  const title = `${item.title}${item.titleSuffix ? ` ${item.titleSuffix}` : ''} — Jalsa Salana 2026`;
  const details = [
    `Official Theme: “${JALSA_2026_META.theme}”`,
    item.topic ? `Topic: “${item.topic}”` : '',
    item.facilitator ? `Facilitator: ${item.facilitator}` : '',
    `Session: ${item.session} (${item.time})`,
    'Full Programme: https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026',
  ]
    .filter(Boolean)
    .join('\n');

  const location = 'Jalsa Salana Conference Ground, Jamia Ahmadiyya, Ilaro, Ogun State, Nigeria';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${formatGDate(startDate)}/${formatGDate(endDate)}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;
}

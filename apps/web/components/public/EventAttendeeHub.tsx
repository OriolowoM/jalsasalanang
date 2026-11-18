import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Home as HomeIcon, 
  Truck, 
  Shield, 
  PhoneCall, 
  ArrowRight, 
  Sparkles, 
  Calendar 
} from 'lucide-react';

export default function EventAttendeeHub() {
  const hubs = [
    {
      title: 'Programme of Events',
      subtitle: 'Daily Convention Timetable',
      desc: 'Complete schedule of opening sessions, keynote addresses, parallel symposiums, sports, and concluding prayers.',
      link: '/programme-of-events-jalsa-salana-nigeria-2024',
      icon: FileText,
      badge: 'Official Schedule',
      badgeColor: 'bg-teal-50 text-teal border-teal-200',
      actionText: 'View Session Schedule',
    },
    {
      title: 'Accommodation Guide',
      subtitle: 'Lodging & Delegate Tents',
      desc: 'Arrangements for national delegates, international guests, families, ladies marquee, and sanitised dormitory facilities.',
      link: '/accommodation',
      icon: HomeIcon,
      badge: 'Logistics',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      actionText: 'Explore Accommodation',
    },
    {
      title: 'Transportation & Routes',
      subtitle: 'Convoy Schedules & Travel',
      desc: 'Designated convoy routes from Lagos, Ibadan, Abeokuta, and northern hubs directly to Jamia Ahmadiyya Ilaro.',
      link: '/transportation',
      icon: Truck,
      badge: 'Travel Directions',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      actionText: 'Check Route Maps',
    },
    {
      title: 'Security & Protocol',
      subtitle: 'Safety, Tags & Entry Rules',
      desc: 'Security checks, photo ID tag requirements, parking arrangements, and health post locations for all convention attendees.',
      link: '/security',
      icon: Shield,
      badge: 'Safety Guidelines',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      actionText: 'Review Guidelines',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-surface-bg border-y border-surface-border/60 relative overflow-hidden">
      {/* Background Soft Mesh Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/60 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-50/60 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-surface-border/60 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-forest text-xs font-display font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal" />
              <span>Attendee Services &amp; Logistics Hub</span>
            </div>
            <h2 className="font-display font-extrabold text-display-md text-forest leading-tight">
              Essential Convention Logistics
            </h2>
            <p className="text-base text-ink-muted mt-2">
              Official information, guidelines, and facilities for all delegates attending the Annual Convention of Ahmadiyya Muslim Jama&apos;at Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/registration"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal hover:bg-teal-600 text-white font-bold text-xs shadow-glow-teal transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Register for 2026</span>
            </Link>
            <Link
              href="/info-emergency"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-red-200 hover:border-red-300 bg-red-50 text-red-700 font-bold text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergencies Desk</span>
            </Link>
          </div>
        </div>

        {/* 4-Card Logistics Grid: Asymmetrical feel with generous whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubs.map((hub, idx) => {
            const Icon = hub.icon;
            return (
              <div 
                key={hub.title}
                className={`bg-white rounded-3xl border border-surface-border/60 p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group hover:border-teal/30 hover:-translate-y-1 ${
                  idx % 2 === 1 ? 'lg:translate-y-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${hub.badgeColor}`}>
                      {hub.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink-heading group-hover:text-teal transition-colors mb-1">
                    {hub.title}
                  </h3>
                  <div className="text-xs font-semibold text-teal mb-3">
                    {hub.subtitle}
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    {hub.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-surface-border/40">
                  <Link
                    href={hub.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest group-hover:text-teal transition-colors"
                  >
                    <span>{hub.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Delegate Action Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-4xl bg-forest text-white shadow-soft-lg border border-teal/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-teal/20 border border-teal/30 flex items-center justify-center flex-shrink-0 text-lime">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-white">
                Preparing for the 72nd Jalsa Salana Nigeria 2026
              </h4>
              <p className="text-sm text-white/70 mt-1 max-w-xl">
                Review delegate arrival advisories, security guidelines, and register early for guaranteed lodging.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              href="/registration"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-teal"
            >
              Register for Jalsa 2026 &rarr;
            </Link>
            <Link
              href="/programme-of-events-jalsa-salana-nigeria-2024"
              className="w-full sm:w-auto text-center px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-white/15"
            >
              Session Timetable
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

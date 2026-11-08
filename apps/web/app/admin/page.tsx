'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Calendar,
  Mic,
  Mail,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/analytics/dashboard', { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 text-sm">
        <span className="inline-block animate-spin mr-2">⟳</span> Loading editorial dashboard...
      </div>
    );
  }

  const counts = data?.counts || {};

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
            Editorial CMS Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Publishing workflow overview, content metrics, and recent administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Main Publishing Workflow Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-primary" /> Total Articles
          </div>
          <div className="font-serif font-black text-2xl text-charcoal">{counts.totalArticles || 0}</div>
          <div className="text-[11px] text-gray-400 mt-1">All editorial entries</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm bg-green-50/20">
          <div className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Published
          </div>
          <div className="font-serif font-black text-2xl text-green-700">{counts.publishedArticles || 0}</div>
          <div className="text-[11px] text-green-600/80 mt-1">Live on publication</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/20">
          <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
          </div>
          <div className="font-serif font-black text-2xl text-amber-700">{counts.pendingArticles || 0}</div>
          <div className="text-[11px] text-amber-600/80 mt-1">Awaiting approval</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm bg-blue-50/20">
          <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Approved
          </div>
          <div className="font-serif font-black text-2xl text-blue-700">{counts.approvedArticles || 0}</div>
          <div className="text-[11px] text-blue-600/80 mt-1">Ready to schedule</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Drafts
          </div>
          <div className="font-serif font-black text-2xl text-gray-700">{counts.draftArticles || 0}</div>
          <div className="text-[11px] text-gray-400 mt-1">In preparation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-purple-600" /> Total Views
          </div>
          <div className="font-serif font-black text-2xl text-purple-800">{counts.totalViews?.toLocaleString() || 0}</div>
          <div className="text-[11px] text-purple-600/80 mt-1">Tracked impressions</div>
        </div>
      </div>

      {/* Auxiliary Metrics (Editions, Speeches, Subscribers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jalsa Editions Registry</div>
            <div className="font-serif font-bold text-2xl text-charcoal mt-1">{counts.totalEditions || 5} Editions</div>
            <div className="text-xs text-primary font-semibold mt-1">Milestone: 2026 (72nd) Active</div>
          </div>
          <Link href="/admin/editions" className="p-2.5 rounded-lg bg-primary-subtle text-primary hover:bg-primary hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Speeches &amp; Sermons</div>
            <div className="font-serif font-bold text-2xl text-charcoal mt-1">{counts.totalSpeeches || 3} Transcripts</div>
            <div className="text-xs text-gold-dark font-semibold mt-1">Caliphal &amp; Keynote Addresses</div>
          </div>
          <Link href="/admin/speeches" className="p-2.5 rounded-lg bg-gold-subtle text-gold-dark hover:bg-gold hover:text-primary-950 transition-colors">
            <Mic className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Newsletter Subscribers</div>
            <div className="font-serif font-bold text-2xl text-charcoal mt-1">{counts.totalSubscribers || 0} Readers</div>
            <div className="text-xs text-green-700 font-semibold mt-1">Active distribution list</div>
          </div>
          <Link href="/admin/newsletter" className="p-2.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Grid: Popular Articles & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most Viewed Articles (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <h2 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Most Read Articles
            </h2>
            <Link href="/admin/articles" className="text-xs font-bold text-primary hover:underline">
              View All Articles &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {data?.mostViewed?.map((art: any, idx: number) => (
              <div key={art.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <Link
                    href={`/articles/${art.slug}`}
                    target="_blank"
                    className="text-xs sm:text-sm font-serif font-bold text-charcoal hover:text-primary transition-colors truncate"
                  >
                    {art.title}
                  </Link>
                </div>

                <div className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded flex-shrink-0">
                  {art.viewsCount?.toLocaleString()} views
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Audit Logs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <h2 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Editorial Activity Log
            </h2>
          </div>

          <div className="space-y-3">
            {data?.recentActivity?.map((act: any) => (
              <div key={act.id} className="text-xs p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-charcoal">{act.action.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-gray-500">By {act.user}</div>
                </div>
                <time className="text-[10px] text-gray-400 whitespace-nowrap">
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

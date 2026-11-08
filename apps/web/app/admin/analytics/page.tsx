'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Eye,
  FileText,
  Users,
  Mail,
  Calendar,
  Mic,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/analytics/dashboard', { credentials: 'include' });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const counts = data?.counts || {};
  const mostViewed = data?.mostViewed || [];
  const categories = data?.categories || [];
  const recentActivity = data?.recentActivity || [];

  const maxViews = mostViewed.length > 0 ? Math.max(...mostViewed.map((a: any) => a.viewsCount || 0)) : 1;
  const maxCategoryCount = categories.length > 0 ? Math.max(...categories.map((c: any) => c.count || 0)) : 1;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal">
          Editorial Analytics & Publishing Insights
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time metrics on readership, editorial pipeline status, and archival growth.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Views</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal mt-2">
            {(counts.totalViews || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Across all published editorial essays</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Articles Published</span>
            <div className="p-2 bg-primary-50 text-primary rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal mt-2">
            {counts.publishedArticles || 0}{' '}
            <span className="text-xs font-normal text-gray-400">/ {counts.totalArticles || 0} total</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {counts.draftArticles || 0} in draft, {counts.pendingArticles || 0} awaiting review
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Subscribers</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal mt-2">
            {counts.totalSubscribers || 0}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-semibold">
            Active email readers
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Archived Speeches</span>
            <div className="p-2 bg-gold/15 text-gold-dark rounded-lg">
              <Mic className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal mt-2">
            {counts.totalSpeeches || 0}
          </div>
          <div className="text-[11px] text-gold-dark mt-1 font-semibold">
            Spanning {counts.totalEditions || 0} historical Jalsa editions
          </div>
        </div>
      </div>

      {/* Editorial Workflow Status Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span>Content Lifecycle & Editorial Workflow Status</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Drafts</span>
            <span className="text-xl font-bold text-gray-700">{counts.draftArticles || 0}</span>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
            <span className="text-[10px] uppercase font-bold text-yellow-700 block">Pending Review</span>
            <span className="text-xl font-bold text-yellow-800">{counts.pendingArticles || 0}</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Approved</span>
            <span className="text-xl font-bold text-blue-800">{counts.approvedArticles || 0}</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-700 block">Scheduled</span>
            <span className="text-xl font-bold text-purple-800">{counts.scheduledArticles || 0}</span>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
            <span className="text-[10px] uppercase font-bold text-green-700 block">Published</span>
            <span className="text-xl font-bold text-green-800">{counts.publishedArticles || 0}</span>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-600 block">Archived</span>
            <span className="text-xl font-bold text-gray-700">{counts.archivedArticles || 0}</span>
          </div>
        </div>
      </div>

      {/* Grid: Most Read vs Category Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most-Read Articles */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Top Read Stories
            </span>
            <Link href="/admin/articles" className="text-xs text-primary hover:underline font-semibold">
              All Articles →
            </Link>
          </h2>

          <div className="space-y-4">
            {mostViewed.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No reading data accumulated yet.</p>
            ) : (
              mostViewed.map((item: any, idx: number) => {
                const percentage = Math.round(((item.viewsCount || 0) / (maxViews || 1)) * 100);
                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        href={`/articles/${item.slug}`}
                        target="_blank"
                        className="font-semibold text-charcoal hover:text-primary truncate max-w-[80%] flex items-center gap-1.5"
                      >
                        <span className="text-gray-400 font-mono text-[11px]">#{idx + 1}</span>
                        <span className="truncate">{item.title}</span>
                      </Link>
                      <span className="font-mono text-gray-500 text-[11px] font-bold">
                        {item.viewsCount?.toLocaleString()} views
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold-dark" />
              Category Coverage Distribution
            </span>
            <Link href="/admin/categories" className="text-xs text-primary hover:underline font-semibold">
              Manage Topics →
            </Link>
          </h2>

          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No categories registered.</p>
            ) : (
              categories.map((cat: any) => {
                const percentage = Math.round(((cat.count || 0) / (maxCategoryCount || 1)) * 100);
                return (
                  <div key={cat.slug} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-charcoal">{cat.name}</span>
                      <span className="text-gray-500 text-[11px]">
                        <strong>{cat.count}</strong> essays
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Audit Log / Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Editorial Audit Trail & System Actions</span>
        </h2>
        <div className="divide-y divide-gray-100">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">No activity logged yet.</p>
          ) : (
            recentActivity.map((log: any) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <span className="font-bold text-charcoal">
                      {log.user?.firstName || 'System'} {log.user?.lastName || ''}
                    </span>
                    <span className="text-gray-500 ml-1.5 font-mono text-[11px]">
                      {log.action} {log.entityType}
                    </span>
                  </div>
                </div>
                <div className="text-gray-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

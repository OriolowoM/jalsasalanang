'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Download, CheckCircle, Search } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  const loadSubscribers = () => {
    setLoading(true);
    fetch('/api/v1/newsletter/subscribers', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setSubscribers(res.data);
          setMetrics(res.metrics);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/v1/newsletter/export', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Registered readers receiving editorial digests, caliphal messages, and Jalsa 2026 announcements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
        >
          <Download className="w-4 h-4 text-gold" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Subscribers</div>
            <div className="font-serif font-black text-3xl text-primary mt-1">{metrics.active}</div>
            <div className="text-[11px] text-gray-400">Opted in to communications</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Lifetime Subscriptions</div>
            <div className="font-serif font-black text-3xl text-charcoal mt-1">{metrics.total}</div>
            <div className="text-[11px] text-gray-400">Includes historical unsubscribes</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-bold uppercase text-gray-600">
            <tr>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Subscribed At</th>
              <th className="py-3 px-4">IP Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">
                  No subscribers recorded yet. Form submissions from the homepage will appear here instantly.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-charcoal">{sub.fullName || '—'}</td>
                  <td className="py-3 px-4 font-mono font-bold text-primary">{sub.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(sub.subscribedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400">
                    {sub.ipAddress || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

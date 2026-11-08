'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Archive,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadArticles = () => {
    setLoading(true);
    const query = new URLSearchParams({ adminView: 'true' });
    if (statusFilter) query.append('status', statusFilter);
    if (search) query.append('search', search);

    fetch(`/api/v1/articles?${query.toString()}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setArticles(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadArticles();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/articles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        loadArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      try {
        const res = await fetch(`/api/v1/articles/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          loadArticles();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-extrabold uppercase">Published</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">Approved</span>;
      case 'PENDING_REVIEW':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">Pending Review</span>;
      case 'DRAFT':
        return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-extrabold uppercase">Draft</span>;
      case 'ARCHIVED':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">Archived</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
            Articles &amp; Editorial Content
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Publishing workflow, editorial revisions, prominence tags, and author attributions.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
        >
          <PlusCircle className="w-4 h-4 text-gold" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { label: 'All', value: '' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Pending Review', value: 'PENDING_REVIEW' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Drafts', value: 'DRAFT' },
            { label: 'Archived', value: 'ARCHIVED' },
          ].map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === st.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-72">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal bg-gray-50"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
          >
            Find
          </button>
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Article Headline</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Prominence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <span className="inline-block animate-spin mr-2">⟳</span> Fetching article catalog...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No articles found matching the selected status or query.
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="font-serif font-bold text-sm text-charcoal hover:text-primary transition-colors line-clamp-1 block"
                      >
                        {art.title}
                      </Link>
                      {art.subtitle && (
                        <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {art.subtitle}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      {art.author?.name || 'Editorial Board'}
                    </td>

                    <td className="py-3.5 px-4">
                      {art.categories?.[0]?.name ? (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                          {art.categories[0].name}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {art.featuredType === 'HERO' && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                          ★ Hero
                        </span>
                      )}
                      {art.featuredType === 'SECONDARY' && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                          ◆ Featured
                        </span>
                      )}
                      {art.featuredType === 'EDITORS_PICK' && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                          ✦ Pick
                        </span>
                      )}
                      {art.featuredType === 'NONE' && <span className="text-gray-400">Standard</span>}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {statusBadge(art.status)}
                        {/* Quick status dropdown */}
                        <select
                          value={art.status}
                          onChange={(e) => handleStatusChange(art.id, e.target.value)}
                          className="text-[10px] bg-transparent border border-gray-200 rounded p-0.5 text-gray-600 outline-none"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PENDING_REVIEW">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-purple-700">
                      {art.viewsCount?.toLocaleString() || 0}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-GB') : 'Draft'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {art.status === 'PUBLISHED' && (
                          <Link
                            href={`/articles/${art.slug}`}
                            target="_blank"
                            className="p-1 text-gray-400 hover:text-primary rounded hover:bg-gray-100"
                            title="View on site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(art.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

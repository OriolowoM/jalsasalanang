'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, AlertCircle, Loader2, ExternalLink, History, Sparkles, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import TipTapEditor from '@/components/admin/TipTapEditor';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isFeaturedMediaModalOpen, setIsFeaturedMediaModalOpen] = useState(false);

  const [authors, setAuthors] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [editionId, setEditionId] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [featuredType, setFeaturedType] = useState('NONE');
  const [status, setStatus] = useState('DRAFT');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    // Fetch article and dropdown data
    Promise.all([
      fetch(`/api/v1/articles/${params.id}`, { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/v1/authors', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/v1/editions', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/v1/categories', { credentials: 'include' }).then((r) => r.json()),
      fetch(`/api/v1/articles/${params.id}/revisions`, { credentials: 'include' }).then((r) => r.json()).catch(() => ({ data: [] })),
    ])
      .then(([artRes, authRes, edRes, catRes, revRes]) => {
        if (artRes.success && artRes.data) {
          const a = artRes.data;
          setTitle(a.title || '');
          setSlug(a.slug || '');
          setSubtitle(a.subtitle || '');
          setExcerpt(a.excerpt || '');
          setContent(a.content || '');
          setFeaturedImage(a.featuredImage || '');
          setImageCredit(a.imageCredit || '');
          setAuthorId(a.authorId || '');
          setEditionId(a.editionId || '');
          setSelectedCategoryIds(a.categories?.map((c: any) => c.id) || []);
          setTagsInput(a.tags?.map((t: any) => t.name).join(', ') || '');
          setFeaturedType(a.featuredType || 'NONE');
          setStatus(a.status || 'DRAFT');
          setMetaTitle(a.metaTitle || '');
          setMetaDescription(a.metaDescription || '');
        }
        if (authRes.success) setAuthors(authRes.data);
        if (edRes.success) setEditions(edRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (revRes.success) setRevisions(revRes.data);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleSubmit = async (targetStatus?: string) => {
    if (!title.trim()) {
      setError('Article headline is required.');
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const tagNames = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content,
        featuredImage: featuredImage.trim() || undefined,
        imageCredit: imageCredit.trim() || undefined,
        authorId,
        editionId: editionId || null,
        categoryIds: selectedCategoryIds,
        tagNames,
        featuredType,
        status: targetStatus || status,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      };

      const res = await fetch(`/api/v1/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update article.');
      }

      setSuccess('Article updated and revision logged successfully.');
      if (targetStatus) setStatus(targetStatus);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the article.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (id: string) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((cid) => cid !== id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id]);
    }
  };

  const handleAIGenerateSEO = async () => {
    if (!title && !content) {
      alert('Please enter an article headline and content first.');
      return;
    }

    try {
      setAiLoading(true);
      const res = await fetch('/api/v1/ai/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content: content || title }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMetaTitle(data.data.metaTitle);
        setMetaDescription(data.data.metaDescription);
        if (!excerpt) setExcerpt(data.data.excerpt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 text-center text-gray-500 text-sm">
        <span className="inline-block animate-spin mr-2">⟳</span> Loading article content...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 text-gray-500 hover:text-charcoal rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-2xl text-charcoal">
                Edit Editorial Article
              </h1>
              {status === 'PUBLISHED' && (
                <Link
                  href={`/articles/${slug}`}
                  target="_blank"
                  className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold flex items-center gap-1 hover:bg-green-200"
                >
                  <ExternalLink className="w-3 h-3" /> Live
                </Link>
              )}
            </div>
            <p className="text-xs text-gray-500">Slug: /{slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit()}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gray-500" />
            <span>Update Article</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-gold" />}
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
          {success}
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base sm:text-lg font-serif font-bold text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Subtitle / Editorial Deck
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary transition-colors text-gray-700"
              />
            </div>
          </div>

          {/* TipTap Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
              Main Article Content *
            </label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-sm text-charcoal">
                Search Engine &amp; Social Discoverability (SEO)
              </h3>
              <button
                type="button"
                disabled={aiLoading}
                onClick={handleAIGenerateSEO}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>{aiLoading ? 'Analyzing...' : 'Auto-Generate SEO & Excerpt'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Meta Title Tag
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Custom title tag (defaults to headline if blank)..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Meta description for Google snippets (150-160 characters recommended)..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>

          {/* Revision History */}
          {revisions.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <History className="w-4 h-4 text-primary" /> Revision History ({revisions.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {revisions.map((rev) => (
                  <div key={rev.id} className="text-xs p-2 rounded bg-gray-50 flex items-center justify-between text-gray-600">
                    <div>
                      <strong className="text-charcoal block">{rev.title}</strong>
                      <span className="text-[10px] text-gray-400">
                        Edited by {rev.changedBy?.firstName || 'Editor'} • {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Settings Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Placement */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100">
              Publishing Workflow Status
            </h3>

            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none focus:border-primary text-charcoal bg-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Homepage Prominence
              </label>
              <select
                value={featuredType}
                onChange={(e) => setFeaturedType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none focus:border-primary text-charcoal bg-white"
              >
                <option value="NONE">Standard Feed</option>
                <option value="HERO">★ Lead Hero Story</option>
                <option value="SECONDARY">◆ Secondary Featured (3-Col Grid)</option>
                <option value="EDITORS_PICK">✦ Editor&apos;s Pick</option>
              </select>
            </div>
          </div>

          {/* Author & Convention Association */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100">
              Authorship &amp; Convention
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Author *
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none focus:border-primary text-charcoal bg-white"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Associated Jalsa Edition
              </label>
              <select
                value={editionId}
                onChange={(e) => setEditionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none focus:border-primary text-charcoal bg-white"
              >
                <option value="">No Specific Edition</option>
                {editions.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.year} — {ed.editionNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image & Credit (WordPress Style) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-sm text-charcoal">
                Featured Image
              </h3>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setIsFeaturedMediaModalOpen(true)}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                  <img
                    src={featuredImage}
                    alt="Featured article header"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => setIsFeaturedMediaModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-charcoal text-xs font-bold shadow"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFeaturedMediaModalOpen(true)}
                    className="w-full py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-bold text-charcoal hover:bg-gray-50 flex items-center justify-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Replace from Library</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
                    title="Remove featured image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsFeaturedMediaModalOpen(true)}
                className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-all bg-gray-50/50 hover:bg-emerald-50/20 group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-charcoal group-hover:text-primary">
                  Set Featured Image
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  Upload new or select from library
                </span>
              </button>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                Image URL / Direct Path
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="/images/jalsa_gallery/... or https://..."
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                Photographer / Image Credit
              </label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="e.g. Official Jalsa Press Photography"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100">
              Categories &amp; Tags
            </h3>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Article Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Media Modal */}
      <MediaPickerModal
        isOpen={isFeaturedMediaModalOpen}
        onClose={() => setIsFeaturedMediaModalOpen(false)}
        onSelect={(item) => {
          setFeaturedImage(item.url);
          if (item.caption && !imageCredit) setImageCredit(item.caption);
        }}
        mode="featuredImage"
        allowedTypes="image"
      />
    </div>
  );
}

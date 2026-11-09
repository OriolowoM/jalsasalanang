'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, AlertCircle, Loader2, Sparkles, Check, Info } from 'lucide-react';
import TipTapEditor from '@/components/admin/TipTapEditor';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<{ score: number; suggestions: string[] } | null>(null);

  const [authors, setAuthors] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/images/jalsa-convention-a.jpg');
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
    // Load metadata dependencies
    Promise.all([
      fetch('/api/v1/authors', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/v1/editions', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/v1/categories', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([authRes, edRes, catRes]) => {
        if (authRes.success && authRes.data.length > 0) {
          setAuthors(authRes.data);
          setAuthorId(authRes.data[0].id);
        }
        if (edRes.success) setEditions(edRes.data);
        if (catRes.success) setCategories(catRes.data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (submitStatus: string) => {
    if (!title.trim()) {
      setError('Article headline is required.');
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
      return;
    }
    if (!authorId) {
      setError('Please select an author for this article.');
      return;
    }

    setLoading(true);
    setError('');

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
        editionId: editionId || undefined,
        categoryIds: selectedCategoryIds,
        tagNames,
        featuredType,
        status: submitStatus,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      };

      const res = await fetch('/api/v1/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create article.');
      }

      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the article.');
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

  const handleAIPolish = async () => {
    if (!content) {
      alert('Please enter article content first.');
      return;
    }

    try {
      setAiLoading(true);
      const res = await fetch('/api/v1/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

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
            <h1 className="font-serif font-black text-2xl text-charcoal">
              Compose Editorial Article
            </h1>
            <p className="text-xs text-gray-500">Draft or publish a new article with rich typography and media.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={aiLoading}
            onClick={handleAIPolish}
            className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Analyze content with AI for editorial polish"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Polish</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('DRAFT')}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gray-500" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-gold" />}
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter compelling editorial headline..."
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
                placeholder="Explanatory deck expanding on the headline..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Short Excerpt (for social sharing &amp; search previews)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary used in cards and search results..."
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

          {/* AI Editorial Report Card */}
          {aiReport && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Editorial Polish Score: {aiReport.score}/100
                </span>
                <button
                  type="button"
                  onClick={() => setAiReport(null)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Dismiss
                </button>
              </div>
              {aiReport.suggestions.length === 0 ? (
                <p className="text-xs text-emerald-800">
                  Excellent! The article content adheres to editorial standards and honorific guidelines.
                </p>
              ) : (
                <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
                  {aiReport.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
        </div>

        {/* Sidebar Settings Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Placement */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100">
              Editorial Status &amp; Prominence
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Publishing Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none focus:border-primary text-charcoal bg-white"
              >
                <option value="DRAFT">Draft (Work in Progress)</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="APPROVED">Approved for Publication</option>
                <option value="PUBLISHED">Published (Live Online)</option>
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
                <option value="HERO">★ Lead Hero Story (Top Placement)</option>
                <option value="SECONDARY">◆ Secondary Featured (3-Col Grid)</option>
                <option value="EDITORS_PICK">✦ Editor&apos;s Pick (In-Depth Essay)</option>
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
                Author / Scholar *
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

          {/* Featured Image & Credit */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100">
              Featured Media
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Featured Image URL / Path
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="/images/70th-jalsa-hero.jpg"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Photographer / Image Credit
              </label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="e.g. Photo: Jalsa Media Nigeria"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-charcoal pb-2 border-b border-gray-100">
              Topics &amp; Categorization
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                Categories
              </label>
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
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Article Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Peace, Justice, Taqwa, Youth"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2, Edit, Check } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#064e3b');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/v1/categories', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, color }),
        credentials: 'include',
      });
      if (res.ok) {
        setName('');
        setDescription('');
        loadCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      try {
        await fetch(`/api/v1/categories/${id}`, { method: 'DELETE', credentials: 'include' });
        loadCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
          Topics &amp; Editorial Categories
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Organize editorial content, speeches, and reports into accessible thematic categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="font-serif font-bold text-base text-charcoal mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Add New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Science & Religion"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Scope and purpose of this topic..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Accent Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-500">{color}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Existing List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs uppercase text-gray-600 flex items-center justify-between">
            <span>Existing Categories ({categories.length})</span>
            <span>Articles</span>
          </div>

          <div className="divide-y divide-gray-100">
            {categories.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color || '#064e3b' }}
                  />
                  <div>
                    <div className="font-bold text-sm text-charcoal">{c.name}</div>
                    <div className="text-[11px] text-gray-400 font-mono">/{c.slug}</div>
                    {c.description && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{c.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                    {c.articlesCount || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

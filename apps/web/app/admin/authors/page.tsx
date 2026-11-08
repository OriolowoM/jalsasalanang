'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Plus, Edit2, Trash2, Mail, Twitter, Linkedin, BookOpen, ExternalLink } from 'lucide-react';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);

  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/authors', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setAuthors(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openNewModal = () => {
    setEditingAuthor(null);
    setName('');
    setTitle('');
    setBio('');
    setAvatar('');
    setEmail('');
    setTwitter('');
    setLinkedin('');
    setShowModal(true);
  };

  const openEditModal = (author: any) => {
    setEditingAuthor(author);
    setName(author.name || '');
    setTitle(author.title || '');
    setBio(author.bio || '');
    setAvatar(author.avatar || '');
    setEmail(author.email || '');
    setTwitter(author.twitter || '');
    setLinkedin(author.linkedin || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setSubmitting(true);
      const endpoint = editingAuthor
        ? `/api/v1/authors/${editingAuthor.id}`
        : '/api/v1/authors';
      const method = editingAuthor ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          title,
          bio,
          avatar: avatar || '/images/jalsa-scholars.jpg',
          email,
          twitter,
          linkedin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchAuthors();
      } else {
        alert(data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving author');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Scholars & Editorial Contributors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage author profiles, theological scholars, guest writers, and editorial credentials.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Author</span>
        </button>
      </div>

      {/* Authors List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : authors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-charcoal">No authors found</h3>
          <p className="text-xs text-gray-500 mt-1">Create an author profile to attribute articles and scholarly essays.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div
              key={author.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary/10 border-2 border-gold/40 flex-shrink-0">
                    {author.avatar ? (
                      <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-primary text-base">
                        {author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-serif font-bold text-base text-charcoal truncate" title={author.name}>
                      {author.name}
                    </h3>
                    {author.title && (
                      <p className="text-xs text-gold-dark font-medium line-clamp-1">
                        {author.title}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                      <BookOpen className="w-3 h-3 text-primary" />
                      {author.articlesCount || 0} published articles
                    </span>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {author.bio}
                  </p>
                )}
              </div>

              {/* Footer actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  {author.twitter && <Twitter className="w-3.5 h-3.5 text-blue-400" />}
                  {author.linkedin && <Linkedin className="w-3.5 h-3.5 text-blue-600" />}
                  {author.email && <Mail className="w-3.5 h-3.5 text-gray-500" />}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(author)}
                    className="p-1.5 text-gray-600 hover:text-primary rounded-md hover:bg-gray-50"
                    title="Edit Author"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-serif font-bold text-charcoal">
                {editingAuthor ? 'Edit Author Profile' : 'Add New Author / Scholar'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-charcoal text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name & Honors *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Saheed Timehin"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Professor of Arabic & Islamic Studies, LASU"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Biographical Note
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Scholarly background, academic credentials, and notable publications..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Avatar / Photo URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="/images/jalsa-scholars.jpg"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="author@jalsasalana.ng"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Twitter / X Handle</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@handle"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingAuthor ? 'Update Author' : 'Create Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

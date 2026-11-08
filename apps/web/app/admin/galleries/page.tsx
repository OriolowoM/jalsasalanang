'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Plus, Trash2, Calendar, User, Film, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [photographer, setPhotographer] = useState('Jalsa Nigeria Media Team');
  const [eventDay, setEventDay] = useState('Friday Session');
  const [videoUrl, setVideoUrl] = useState('');
  const [editionId, setEditionId] = useState('');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [galleriesRes, editionsRes, mediaRes] = await Promise.all([
        fetch('/api/v1/galleries', { credentials: 'include' }),
        fetch('/api/v1/editions', { credentials: 'include' }),
        fetch('/api/v1/media?limit=50', { credentials: 'include' }),
      ]);

      const [galleriesData, editionsData, mediaData] = await Promise.all([
        galleriesRes.json(),
        editionsRes.json(),
        mediaRes.json(),
      ]);

      if (galleriesData.success) setGalleries(galleriesData.data);
      if (editionsData.success) {
        setEditions(editionsData.data);
        if (editionsData.data.length > 0) setEditionId(editionsData.data[0].id);
      }
      if (mediaData.success) setMediaList(mediaData.data);
    } catch (err) {
      console.error('Failed to load gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/v1/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          coverImage: coverImage || (selectedMediaIds.length > 0 ? mediaList.find(m => m.id === selectedMediaIds[0])?.fileUrl : '/images/jalsa-prayer.jpg'),
          photographer,
          eventDay,
          videoUrl,
          editionId: editionId || undefined,
          mediaIds: selectedMediaIds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setCoverImage('');
        setSelectedMediaIds([]);
        fetchData();
      } else {
        alert(data.message || 'Failed to create gallery.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating gallery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;
    try {
      const res = await fetch(`/api/v1/galleries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setGalleries(galleries.filter((g) => g.id !== id));
      } else {
        alert('Failed to delete gallery.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMediaSelection = (id: string) => {
    if (selectedMediaIds.includes(id)) {
      setSelectedMediaIds(selectedMediaIds.filter((mId) => mId !== id));
    } else {
      setSelectedMediaIds([...selectedMediaIds, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Photo & Video Galleries</h1>
          <p className="text-sm text-gray-500 mt-1">
            Curate photo essays, convention proceedings, and documentary albums across Jalsa editions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Photo Album</span>
        </button>
      </div>

      {/* Galleries List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-charcoal">No photo galleries yet</h3>
          <p className="text-xs text-gray-500 mt-1">
            Create an album to showcase photography from Jalsa Salana Nigeria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {gallery.coverImage ? (
                    <img
                      src={gallery.coverImage}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  {gallery.edition && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                      {gallery.edition.year} Jalsa
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {gallery.photosCount || gallery.items?.length || 0} photos
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif font-bold text-base text-charcoal mb-2 leading-snug">
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {gallery.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                    {gallery.photographer && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gold" />
                        {gallery.photographer}
                      </span>
                    )}
                    {gallery.eventDay && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {gallery.eventDay}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`/galleries#${gallery.slug}`}
                  target="_blank"
                  className="text-xs text-primary hover:text-primary-dark font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Public Album</span>
                </a>
                <button
                  onClick={() => handleDelete(gallery.id)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Gallery */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-serif font-bold text-charcoal">
                Create New Photo Gallery
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-charcoal text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 70th Jalsa Salana Opening Flag Hoisting Ceremony"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Atmospheric narrative and highlights of the session..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Jalsa Edition
                  </label>
                  <select
                    value={editionId}
                    onChange={(e) => setEditionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">None / General</option>
                    {editions.map((ed) => (
                      <option key={ed.id} value={ed.id}>
                        {ed.year} ({ed.editionNumber}th Edition)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Event Day / Session
                  </label>
                  <input
                    type="text"
                    value={eventDay}
                    onChange={(e) => setEventDay(e.target.value)}
                    placeholder="e.g. Day 1: Opening & Juma'ah"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/images/70TH JALSA SALANA 1.jpg"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Photographer Credit
                  </label>
                  <input
                    type="text"
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    placeholder="Jalsa Salana Nigeria Media"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Attach Photos from Media Library */}
              {mediaList.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Attach Photos ({selectedMediaIds.length} selected)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {mediaList.map((m) => {
                      const isSelected = selectedMediaIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleMediaSelection(m.id)}
                          className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected ? 'border-primary ring-2 ring-primary/40' : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={m.fileUrl} alt={m.title} className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  {submitting ? 'Creating...' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

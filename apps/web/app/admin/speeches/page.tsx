'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, Plus, Trash2, Edit, ExternalLink, Video, FileText } from 'lucide-react';

export default function AdminSpeechesPage() {
  const [speeches, setSpeeches] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [speechType, setSpeechType] = useState('Keynote Address');
  const [session, setSession] = useState('');
  const [editionId, setEditionId] = useState('');
  const [summary, setSummary] = useState('');
  const [transcript, setTranscript] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const loadSpeeches = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/v1/speeches', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/v1/editions', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([spRes, edRes]) => {
        if (spRes.success) setSpeeches(spRes.data);
        if (edRes.success) setEditions(edRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSpeeches();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !speakerName.trim()) return;

    try {
      const payload = {
        title: title.trim(),
        speakerName: speakerName.trim(),
        speakerTitle: speakerTitle.trim() || undefined,
        speechType,
        session: session.trim() || undefined,
        editionId: editionId || undefined,
        summary: summary.trim() || undefined,
        transcript: transcript.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        audioUrl: audioUrl.trim() || undefined,
      };

      const res = await fetch('/api/v1/speeches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.ok) {
        setShowForm(false);
        setTitle('');
        setSpeakerName('');
        setSummary('');
        setTranscript('');
        loadSpeeches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this speech record?')) {
      try {
        await fetch(`/api/v1/speeches/${id}`, { method: 'DELETE', credentials: 'include' });
        loadSpeeches();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
            Speeches, Sermons &amp; Keynote Addresses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Authoritative caliphal transcripts, presidential addresses, audio broadcasts, and video recordings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>{showForm ? 'Cancel' : 'Add New Speech'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-200">
          <h2 className="font-serif font-bold text-base text-charcoal mb-4">
            Record Speech / Address
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Speech Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Social Justice, Moral Rectitude, and National Rebirth in Nigeria"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Speaker Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  placeholder="e.g. Hazrat Mirza Masroor Ahmad (aba)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Speaker Designation / Office
                </label>
                <input
                  type="text"
                  value={speakerTitle}
                  onChange={(e) => setSpeakerTitle(e.target.value)}
                  placeholder="e.g. Worldwide Head of the Ahmadiyya Muslim Community"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Speech Category
                </label>
                <select
                  value={speechType}
                  onChange={(e) => setSpeechType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal bg-white"
                >
                  <option value="Keynote Address">Keynote Address</option>
                  <option value="Special Caliphal Address">Special Caliphal Address</option>
                  <option value="Friday Sermon">Friday Sermon (Khutbah)</option>
                  <option value="Presidential Address">Presidential Address</option>
                  <option value="Scholarly Lecture">Scholarly Lecture</option>
                  <option value="Concluding Address">Concluding Address</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Convention Edition
                </label>
                <select
                  value={editionId}
                  onChange={(e) => setEditionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal bg-white"
                >
                  <option value="">Select Jalsa Edition...</option>
                  {editions.map((ed) => (
                    <option key={ed.id} value={ed.id}>
                      {ed.year} — {ed.editionNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Session / Day
                </label>
                <input
                  type="text"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="e.g. Day 1 - Opening Session"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Video Recording URL (YouTube)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Summary / Key Takeaways
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief synopsis of the address..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Full Written Transcript
                </label>
                <textarea
                  rows={6}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Full text transcript of the sermon or address..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono outline-none focus:border-primary text-charcoal"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              Save Speech Transcript
            </button>
          </form>
        </div>
      )}

      {/* Speeches Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-bold uppercase text-gray-600">
            <tr>
              <th className="py-3 px-4">Speech Title</th>
              <th className="py-3 px-4">Speaker</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Edition</th>
              <th className="py-3 px-4">Media</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {speeches.map((sp) => (
              <tr key={sp.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-serif font-bold text-charcoal">
                  <Link href={`/speeches/${sp.slug}`} target="_blank" className="hover:text-primary">
                    {sp.title}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold">{sp.speakerName}</div>
                  <div className="text-[10px] text-gray-400">{sp.speakerTitle}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-primary-subtle text-primary font-bold text-[10px]">
                    {sp.speechType}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-gold-dark">
                  {sp.edition ? `Jalsa ${sp.edition.year}` : 'General'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    {sp.videoUrl && <Video className="w-3.5 h-3.5 text-red-600" />}
                    {sp.audioUrl && <Mic className="w-3.5 h-3.5 text-primary" />}
                    {sp.transcript && <FileText className="w-3.5 h-3.5 text-gray-600" />}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(sp.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

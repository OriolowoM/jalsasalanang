'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Copy, Check, FileText, Image as ImageIcon, Search, RefreshCw } from 'lucide-react';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Form fields
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('Official Jalsa Media');

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/media?limit=50', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (title) formData.append('title', title);
      if (caption) formData.append('caption', caption);
      if (credit) formData.append('credit', credit);

      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        // Reset form
        setSelectedFile(null);
        setTitle('');
        setCaption('');
        fetchMedia();
      } else {
        alert(data.message || 'Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const res = await fetch(`/api/v1/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMedia(media.filter((m) => m.id !== id));
      } else {
        alert('Failed to delete media asset.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMedia = media.filter((m) =>
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.fileUrl?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload, organize and manage photographs, graphics and official documents.
          </p>
        </div>
        <button
          onClick={fetchMedia}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-charcoal"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Upload Zone Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          <span>Upload New Asset</span>
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              File (Max 20MB)
            </label>
            <input
              type="file"
              accept="image/*,video/mp4,application/pdf"
              required
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                  if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Asset Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Jamia Marquee Closing Session"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Caption / Credit</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Short description or photographer credit"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 h-[38px]"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Asset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by title, URL or caption..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing <strong>{filteredMedia.length}</strong> items
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-charcoal">No media files found</h3>
          <p className="text-xs text-gray-500 mt-1">Upload your first high-resolution photograph above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.mimeType?.startsWith('image/') || item.fileUrl?.match(/\.(jpg|jpeg|png|webp|avif)$/i);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={item.fileUrl}
                      alt={item.title || 'Media'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <FileText className="w-10 h-10 text-primary mx-auto mb-1" />
                      <span className="text-[10px] font-semibold text-gray-500 uppercase block truncate">
                        {item.mimeType || 'Document'}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => copyToClipboard(item.fileUrl, item.id)}
                      title="Copy URL"
                      className="p-2 bg-white/90 hover:bg-white text-charcoal rounded-md text-xs font-semibold flex items-center gap-1 shadow"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[10px] text-green-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy URL</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete asset"
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 bg-white border-t border-gray-100">
                  <p className="text-xs font-bold text-charcoal truncate" title={item.title}>
                    {item.title || 'Untitled'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                    {item.edition ? `${item.edition.year} Jalsa` : item.credit || 'General Asset'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

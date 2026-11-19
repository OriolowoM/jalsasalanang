'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Search,
  RefreshCw,
  X,
  Plus,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'audio' | 'document'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-file upload queue
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio preview state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const url = activeTab === 'all'
        ? '/api/v1/media?limit=100'
        : `/api/v1/media?limit=100&type=${activeTab}`;
      const res = await fetch(url, { credentials: 'include' });
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
  }, [activeTab]);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadQueueItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      status: 'pending',
    }));

    setUploadQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const processUploadQueue = async () => {
    const pendingItems = uploadQueue.filter((item) => item.status === 'pending');
    if (pendingItems.length === 0 || isUploading) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: pendingItems.length });

    // Use bulk endpoint if possible, or batch
    const formData = new FormData();
    pendingItems.forEach((item) => {
      formData.append('files', item.file);
    });
    formData.append('credit', 'Official Jalsa Media');

    try {
      // Mark all as uploading
      setUploadQueue((prev) =>
        prev.map((item) =>
          item.status === 'pending' ? { ...item, status: 'uploading' } : item
        )
      );

      const res = await fetch('/api/v1/media/upload-multiple', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.status === 'uploading' ? { ...item, status: 'done' } : item
          )
        );
        // Clean up successful uploads after 1.5 seconds
        setTimeout(() => {
          setUploadQueue((prev) => prev.filter((item) => item.status !== 'done'));
          fetchMedia();
        }, 1500);
      } else {
        // Fallback to individual uploads
        let completed = 0;
        for (const item of pendingItems) {
          try {
            const singleFormData = new FormData();
            singleFormData.append('file', item.file);
            singleFormData.append('title', item.file.name.replace(/\.[^/.]+$/, ''));
            singleFormData.append('credit', 'Official Jalsa Media');

            const singleRes = await fetch('/api/v1/media/upload', {
              method: 'POST',
              credentials: 'include',
              body: singleFormData,
            });
            const singleData = await singleRes.json();

            completed++;
            setUploadProgress({ current: completed, total: pendingItems.length });

            if (singleRes.ok && singleData.success) {
              setUploadQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, status: 'done' } : q))
              );
            } else {
              setUploadQueue((prev) =>
                prev.map((q) =>
                  q.id === item.id ? { ...q, status: 'error', error: singleData.message } : q
                )
              );
            }
          } catch (err: any) {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.id === item.id ? { ...q, status: 'error', error: err.message } : q
              )
            );
          }
        }
        setTimeout(() => {
          setUploadQueue((prev) => prev.filter((item) => item.status !== 'done'));
          fetchMedia();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/v1/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert('Failed to delete media asset.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleAudio = (fileUrl: string, id: string) => {
    if (playingAudioId === id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(fileUrl);
      audioPlayerRef.current = audio;
      audio.play();
      setPlayingAudioId(id);
      audio.onended = () => setPlayingAudioId(null);
    }
  };

  const filteredMedia = media.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.title?.toLowerCase().includes(term) ||
      m.caption?.toLowerCase().includes(term) ||
      m.fileUrl?.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-black text-charcoal">Media Library</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {media.length} Assets
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload, organize and manage photographs, audio recordings, jingles, and official documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow transition-colors"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add Files</span>
          </button>
          <button
            onClick={fetchMedia}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-charcoal transition-colors"
            title="Refresh library"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* WordPress-style Drag & Drop Multi-Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all bg-white shadow-sm ${
          isDragging
            ? 'border-primary bg-primary-50/40 ring-4 ring-primary/10'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/mp4,application/pdf"
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-primary mx-auto flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal">
              Drop files anywhere to upload, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline font-extrabold"
              >
                browse local files
              </button>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select multiple files simultaneously. Supported: JPEG, PNG, WebP, GIF, MP3, WAV, OGG, PDF, MP4 (Max 50MB per file).
            </p>
          </div>
        </div>

        {/* Selected Files Queue Preview */}
        {uploadQueue.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                Queue ({uploadQueue.length} {uploadQueue.length === 1 ? 'file' : 'files'} selected)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUploadQueue([])}
                  disabled={isUploading}
                  className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50"
                >
                  Clear Queue
                </button>
                <button
                  type="button"
                  onClick={processUploadQueue}
                  disabled={isUploading}
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        Uploading ({uploadProgress.current}/{uploadProgress.total})...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload All Files</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2 flex flex-col justify-between"
                >
                  {item.file.type.startsWith('image/') ? (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full aspect-square object-cover rounded mb-1"
                    />
                  ) : item.file.type.startsWith('audio/') ? (
                    <div className="w-full aspect-square bg-emerald-100/60 rounded flex flex-col items-center justify-center text-primary mb-1">
                      <Music className="w-8 h-8 mb-1" />
                      <span className="text-[9px] font-bold uppercase">Audio</span>
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded flex flex-col items-center justify-center text-gray-500 mb-1">
                      <FileText className="w-8 h-8 mb-1" />
                      <span className="text-[9px] font-bold uppercase">File</span>
                    </div>
                  )}

                  <p className="text-[11px] font-semibold text-charcoal truncate" title={item.file.name}>
                    {item.file.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {/* Status Indicator */}
                  {item.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                  {item.status === 'done' && (
                    <div className="absolute top-1 right-1 bg-green-600 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5" title={item.error}>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {!isUploading && item.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => removeFromQueue(item.id)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Media Type Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            All Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'image'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio &amp; Jingles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'document'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by title or file name..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary text-charcoal"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-charcoal">No media files found</h3>
          <p className="text-xs text-gray-500 mt-1">
            {searchTerm
              ? 'No assets match your search terms.'
              : 'Drop multiple files above to populate your media library.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isImage =
              item.mimeType?.startsWith('image/') ||
              item.fileUrl?.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i);
            const isAudio =
              item.mimeType?.startsWith('audio/') ||
              item.fileUrl?.match(/\.(mp3|wav|ogg|m4a|aac)$/i);
            const isVideo =
              item.mimeType?.startsWith('video/') ||
              item.fileUrl?.match(/\.(mp4|webm)$/i);
            const isCopied = copiedId === item.id;
            const isAudioPlaying = playingAudioId === item.id;

            return (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={item.fileUrl}
                      alt={item.title || 'Media asset'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : isAudio ? (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-[#003333] flex flex-col items-center justify-center p-3 text-white">
                      <button
                        type="button"
                        onClick={() => toggleAudio(item.fileUrl, item.id)}
                        className="w-12 h-12 rounded-full bg-gold/90 hover:bg-gold text-charcoal flex items-center justify-center shadow-lg transition-transform hover:scale-110 mb-2"
                        title={isAudioPlaying ? 'Pause' : 'Play audio preview'}
                      >
                        {isAudioPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1">
                        <Music className="w-3 h-3" /> Audio Track
                      </span>
                    </div>
                  ) : isVideo ? (
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white p-3">
                      <Video className="w-10 h-10 text-gray-400 mb-1" />
                      <span className="text-[10px] uppercase font-bold text-gray-400">Video</span>
                    </div>
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
                      type="button"
                      onClick={() => copyToClipboard(item.fileUrl, item.id)}
                      title="Copy absolute URL"
                      className="p-2 bg-white/95 hover:bg-white text-charcoal rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[10px] text-green-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Delete asset permanently"
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-colors"
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
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate flex items-center justify-between">
                    <span>{item.fileSize ? `${(item.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Search,
  Check,
  Music,
  Video,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react';

export interface SelectedMediaItem {
  url: string;
  title: string;
  caption?: string;
  mimeType: string;
  fileSize?: number;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SelectedMediaItem) => void;
  mode?: 'featuredImage' | 'editorMedia';
  title?: string;
  allowedTypes?: 'all' | 'image' | 'audio';
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mode = 'featuredImage',
  title = mode === 'featuredImage' ? 'Set Featured Image' : 'Add Media to Article',
  allowedTypes = mode === 'featuredImage' ? 'image' : 'all',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'audio'>(allowedTypes);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio preview in modal
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const url = filterType === 'all'
        ? '/api/v1/media?limit=100'
        : `/api/v1/media?limit=100&type=${filterType}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.data) {
        setMediaItems(data.data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    }
  }, [isOpen, filterType]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setUploading(true);
      setUploadError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('credit', 'Official Jalsa Media');

      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const newItem = data.data;
        setSelectedItem(newItem);
        setActiveTab('library');
        fetchMedia();
      } else {
        setUploadError(data.message || 'Upload failed.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedItem) return;
    onSelect({
      url: selectedItem.fileUrl,
      title: selectedItem.title || '',
      caption: selectedItem.caption || '',
      mimeType: selectedItem.mimeType || '',
      fileSize: selectedItem.fileSize,
    });
    onClose();
  };

  const toggleAudio = (fileUrl: string, id: string) => {
    if (playingId === id) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(fileUrl);
      audioRef.current = a;
      a.play();
      setPlayingId(id);
      a.onended = () => setPlayingId(null);
    }
  };

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(term) ||
      item.fileUrl?.toLowerCase().includes(term) ||
      item.caption?.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (allowedTypes === 'image') {
      const isImg =
        item.mimeType?.startsWith('image/') ||
        item.fileUrl?.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i);
      return isImg;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-serif font-black text-charcoal">{title}</h2>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-charcoal'
                }`}
              >
                Upload Files
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'library'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-charcoal'
                }`}
              >
                Media Library
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Area */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
            {activeTab === 'upload' ? (
              /* Upload Tab */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    allowedTypes === 'image'
                      ? 'image/*'
                      : 'image/*,audio/*,video/mp4,application/pdf'
                  }
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-charcoal mb-1">
                  Upload file from your device
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mb-6">
                  {allowedTypes === 'image'
                    ? 'Supported formats: JPEG, PNG, WebP, GIF (Max 50MB)'
                    : 'Supported formats: JPEG, PNG, WebP, MP3, WAV, PDF, MP4 (Max 50MB)'}
                </p>

                {uploadError && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg mb-4">
                    {uploadError}
                  </p>
                )}

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                      <span>Uploading Asset...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-gold" />
                      <span>Select Local File</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Media Library Tab */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-3 border-b border-gray-200 bg-gray-50/80 flex items-center justify-between gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    {allowedTypes !== 'image' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setFilterType('all')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            filterType === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType('image')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            filterType === 'image' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Images
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType('audio')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            filterType === 'audio' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Audio
                        </button>
                      </>
                    )}
                  </div>

                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search library..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary text-charcoal"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 animate-pulse">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                      ))}
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-600">No media items found</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="text-xs text-primary font-bold hover:underline mt-2"
                      >
                        Upload a file now
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {filteredItems.map((item) => {
                        const isSelected = selectedItem?.id === item.id;
                        const isImg =
                          item.mimeType?.startsWith('image/') ||
                          item.fileUrl?.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i);
                        const isAud =
                          item.mimeType?.startsWith('audio/') ||
                          item.fileUrl?.match(/\.(mp3|wav|ogg|m4a)$/i);

                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {isImg ? (
                              <img
                                src={item.fileUrl}
                                alt={item.title || ''}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : isAud ? (
                              <div className="w-full h-full bg-[#003333] flex flex-col items-center justify-center p-2 text-white">
                                <Music className="w-7 h-7 text-gold mb-1" />
                                <span className="text-[9px] font-bold uppercase truncate max-w-full text-emerald-200">
                                  Audio
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-2 text-gray-500">
                                <FileText className="w-7 h-7 mb-1 text-primary" />
                                <span className="text-[9px] font-bold uppercase truncate max-w-full">
                                  File
                                </span>
                              </div>
                            )}

                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-primary text-white p-1 rounded-full shadow">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] text-white font-medium truncate">
                                {item.title || 'Untitled'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Details Sidebar (300px) */}
          <div className="w-80 bg-gray-50 p-5 flex flex-col justify-between overflow-y-auto flex-shrink-0">
            {selectedItem ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal border-b border-gray-200 pb-2">
                  Attachment Details
                </h4>

                {/* Preview Thumbnail */}
                <div className="aspect-video rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center relative">
                  {selectedItem.mimeType?.startsWith('image/') ||
                  selectedItem.fileUrl?.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i) ? (
                    <img
                      src={selectedItem.fileUrl}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedItem.mimeType?.startsWith('audio/') ||
                    selectedItem.fileUrl?.match(/\.(mp3|wav|ogg|m4a)$/i) ? (
                    <div className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAudio(selectedItem.fileUrl, selectedItem.id)}
                        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow hover:scale-105 transition-transform"
                      >
                        {playingId === selectedItem.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        Preview Audio
                      </span>
                    </div>
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">File Title</span>
                    <strong className="text-charcoal block break-all">{selectedItem.title || 'Untitled'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">File URL</span>
                    <span className="text-gray-600 block break-all text-[11px] font-mono bg-white p-1.5 rounded border border-gray-200">
                      {selectedItem.fileUrl}
                    </span>
                  </div>
                  {selectedItem.fileSize && (
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">File Size</span>
                      <span className="text-gray-600">
                        {(selectedItem.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                  {selectedItem.createdAt && (
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Uploaded</span>
                      <span className="text-gray-600">
                        {new Date(selectedItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No media item selected.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Click an asset from the library or upload a new one.
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                disabled={!selectedItem}
                onClick={handleConfirmSelection}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-gold" />
                <span>
                  {mode === 'featuredImage' ? 'Set as Featured Image' : 'Insert into Article'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import YoutubeExtension from '@tiptap/extension-youtube';
import MediaPickerModal, { SelectedMediaItem } from '@/components/admin/MediaPickerModal';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Minus,
  Undo,
  Redo,
  Plus,
  Music,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ content, onChange, placeholder = 'Write rich editorial content here...' }: Props) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium',
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 shadow-sm',
        },
      }),
      YoutubeExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-xl aspect-video w-full my-6',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />;
  }

  const handleInsertMedia = (item: SelectedMediaItem) => {
    const isAudio =
      item.mimeType?.startsWith('audio/') ||
      item.url.match(/\.(mp3|wav|ogg|m4a|aac)$/i);

    if (isAudio) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<div class="my-6 p-4 rounded-xl bg-gray-50 border border-gray-200"><p class="text-xs font-bold text-gray-800 mb-2">🎵 ${item.title || 'Audio Recording'}</p><audio controls class="w-full" src="${item.url}"></audio></div><p></p>`
        )
        .run();
    } else {
      editor
        .chain()
        .focus()
        .setImage({ src: item.url, alt: item.title || '' })
        .run();
    }
  };

  const addImage = () => {
    setIsMediaModalOpen(true);
  };

  const addYoutube = () => {
    const url = window.prompt('Enter YouTube video URL:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const setLink = () => {
    const prevUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter Link URL:', prevUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const wordCount = editor.storage.characterCount
    ? editor.storage.characterCount.words()
    : editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-primary transition-colors">
      {/* Formatting Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 text-gray-700">
        {/* WordPress-style Add Media Button */}
        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-primary border border-primary/20 text-xs font-bold transition-colors mr-2 shadow-sm"
          title="Add media files from library or upload new"
        >
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          <span>Add Media</span>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1 mr-2" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-primary text-white hover:bg-primary' : ''}`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addYoutube}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-red-600"
          title="Embed YouTube Video"
        >
          <Youtube className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 sm:p-6 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Live Stats Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <div>
          <span>{wordCount} words</span>
          <span className="mx-2">•</span>
          <span>~{estimatedReadMinutes} min read</span>
        </div>
        <div className="text-[11px] text-gray-400">
          HTML format saved automatically on submission
        </div>
      </div>

      {/* WordPress-style Media Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleInsertMedia}
        mode="editorMedia"
        allowedTypes="all"
      />
    </div>
  );
}

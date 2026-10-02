import React, { useState, useRef } from 'react';
import { api } from '../services/api.ts';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage('');
    setIsUploading(true);

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 8 * 1024 * 1024) {
          setErrorMessage('Each image file must be under 8MB');
          continue;
        }

        // Convert to base64 for Cloudinary upload endpoint
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });

        const res = await api.uploadImage(base64);
        if (res.success && res.url) {
          newUrls.push(res.url);
        } else {
          setErrorMessage(res.message || 'Image upload failed');
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      setErrorMessage('Please enter a valid URL starting with http:// or https://');
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setErrorMessage('');
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          Listing Photos (Cloudinary Upload or Direct URLs)
        </label>
        <span className="text-[11px] text-slate-500 font-mono">
          {images.length} image{images.length !== 1 ? 's' : ''} added
        </span>
      </div>

      {errorMessage && (
        <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/20 p-2 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Upload Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* File Drag/Button */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/60 hover:bg-slate-900/60 transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              <span className="text-xs text-slate-300 font-medium">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Upload Screenshots</span>
              <span className="text-[10px] text-slate-500">PNG, JPG, WEBP up to 8MB</span>
            </div>
          )}
        </div>

        {/* Direct URL input */}
        <div className="border border-slate-800 rounded-xl p-3.5 bg-slate-950/60 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> Or Paste Image URL
            </span>
            <p className="text-[10px] text-slate-500">Add high-resolution Unsplash, CDN, or Cloudinary URL</p>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails preview list */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-950"
            >
              <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 rounded-md bg-slate-950/80 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

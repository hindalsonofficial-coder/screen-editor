'use client';

import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ImageElement } from '@/types/editor';

interface ImageControlProps {
    onAddImage: (element: ImageElement) => void;
}

export default function ImageControl({ onAddImage }: ImageControlProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                // Scale image to fit nicely in screenshot
                const maxSize = 300;
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    const ratio = Math.min(maxSize / width, maxSize / height);
                    width *= ratio;
                    height *= ratio;
                }

                const newImage: ImageElement = {
                    id: uuidv4(),
                    type: 'image',
                    src: event.target?.result as string,
                    position: { x: 150, y: 400 },
                    rotation: 0,
                    opacity: 1,
                    locked: false,
                    size: { width, height },
                };
                onAddImage(newImage);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="control-section">
            <h3 className="control-title">Images</h3>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden-input"
            />

            <button className="upload-btn" onClick={handleUploadClick}>
                <Upload size={20} />
                <span>Upload Image</span>
            </button>

            <div className="upload-hint">
                <ImageIcon size={14} />
                <span>Supports PNG, JPG, SVG</span>
            </div>
        </div>
    );
}

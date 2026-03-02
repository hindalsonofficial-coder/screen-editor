'use client';

import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Image as ImageIcon, Smartphone, X } from 'lucide-react';
import { ImageElement, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT } from '@/types/editor';

interface ImageControlProps {
    onAddImage: (element: ImageElement) => void;
    onUploadScreenshot: (imageUrl: string) => void;
    hasBackgroundImage: boolean;
    onRemoveBackgroundImage: () => void;
}

export default function ImageControl({ 
    onAddImage, 
    onUploadScreenshot, 
    hasBackgroundImage,
    onRemoveBackgroundImage 
}: ImageControlProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const screenshotInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isScreenshot: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            
            if (isScreenshot) {
                // Upload as base screenshot (full frame)
                onUploadScreenshot(imageUrl);
            } else {
                // Upload as element
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
                        src: imageUrl,
                        position: { x: 150, y: 400 },
                        rotation: 0,
                        opacity: 1,
                        locked: false,
                        size: { width, height },
                    };
                    onAddImage(newImage);
                };
                img.src = imageUrl;
            }
        };
        reader.readAsDataURL(file);

        // Reset inputs
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (screenshotInputRef.current) {
            screenshotInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleUploadScreenshotClick = () => {
        screenshotInputRef.current?.click();
    };

    return (
        <div className="control-section">
            <h3 className="control-title">Images</h3>

            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, false)}
                className="hidden-input"
            />
            <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, true)}
                className="hidden-input"
            />

            {/* Upload Screenshot as Base */}
            <div style={{ marginBottom: '12px' }}>
                <button 
                    className="upload-btn" 
                    onClick={handleUploadScreenshotClick}
                    style={{ 
                        background: hasBackgroundImage ? 'rgba(109, 40, 217, 0.1)' : undefined,
                        borderColor: hasBackgroundImage ? 'var(--accent-color)' : undefined
                    }}
                >
                    <Smartphone size={20} />
                    <span>Upload Screenshot</span>
                </button>
                {hasBackgroundImage && (
                    <button
                        onClick={onRemoveBackgroundImage}
                        className="upload-btn"
                        style={{
                            marginTop: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: '#ef4444',
                            color: '#ef4444'
                        }}
                    >
                        <X size={16} />
                        <span>Remove Screenshot</span>
                    </button>
                )}
            </div>

            {/* Upload Image as Element */}
            <button className="upload-btn" onClick={handleUploadClick}>
                <Upload size={20} />
                <span>Upload Image Element</span>
            </button>

            <div className="upload-hint">
                <ImageIcon size={14} />
                <span>Supports PNG, JPG, SVG</span>
            </div>
        </div>
    );
}

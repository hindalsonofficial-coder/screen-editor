'use client';

import { Screenshot, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT } from '@/types/editor';
import { Plus, X } from 'lucide-react';

interface ScreenshotListProps {
    screenshots: Screenshot[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
}

export default function ScreenshotList({
    screenshots,
    activeIndex,
    onSelect,
    onAdd,
    onDelete,
}: ScreenshotListProps) {
    const thumbWidth = 60;
    const thumbHeight = (SCREENSHOT_HEIGHT / SCREENSHOT_WIDTH) * thumbWidth;

    const handleDelete = (e: React.MouseEvent, screenshotId: string) => {
        e.stopPropagation(); // Prevent selecting the screenshot
        if (screenshots.length > 1) {
            onDelete(screenshotId);
        }
    };

    return (
        <div className="screenshot-list">
            <div className="screenshot-list-inner">
                {screenshots.map((screenshot, index) => (
                    <div
                        key={screenshot.id}
                        className={`screenshot-thumb-wrapper ${index === activeIndex ? 'active' : ''}`}
                    >
                        <button
                            className={`screenshot-thumb ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => onSelect(index)}
                            title={screenshot.name}
                        >
                            <div
                                className="thumb-preview"
                                style={{
                                    backgroundColor: screenshot.backgroundColor,
                                    width: thumbWidth,
                                    height: thumbHeight,
                                }}
                            >
                                <span className="thumb-number">{index + 1}</span>
                            </div>
                        </button>

                        {screenshots.length > 1 && (
                            <button
                                className="thumb-delete-btn"
                                onClick={(e) => handleDelete(e, screenshot.id)}
                                title="Delete screenshot"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                ))}

                <button className="add-screenshot-btn" onClick={onAdd} title="Add Screenshot">
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}

'use client';

import { Screenshot, SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT } from '@/types/editor';
import { Plus, X, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScreenshotListProps {
    screenshots: Screenshot[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onMoveLeft: (index: number) => void;
    onMoveRight: (index: number) => void;
}

export default function ScreenshotList({
    screenshots,
    activeIndex,
    onSelect,
    onAdd,
    onDelete,
    onDuplicate,
    onMoveLeft,
    onMoveRight,
}: ScreenshotListProps) {
    const thumbWidth = 60;
    const thumbHeight = (SCREENSHOT_HEIGHT / SCREENSHOT_WIDTH) * thumbWidth;

    const handleDelete = (e: React.MouseEvent, screenshotId: string) => {
        e.stopPropagation(); // Prevent selecting the screenshot
        if (screenshots.length > 1) {
            onDelete(screenshotId);
        }
    };

    const handleDuplicate = (e: React.MouseEvent, screenshotId: string) => {
        e.stopPropagation();
        onDuplicate(screenshotId);
    };

    const handleMoveLeft = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        onMoveLeft(index);
    };

    const handleMoveRight = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        onMoveRight(index);
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

                        <div className="thumb-actions">
                            {/* Move Left Button */}
                            {index > 0 && (
                                <button
                                    className="thumb-action-btn thumb-move-left-btn"
                                    onClick={(e) => handleMoveLeft(e, index)}
                                    title="Move left"
                                >
                                    <ChevronLeft size={10} />
                                </button>
                            )}

                            {/* Move Right Button */}
                            {index < screenshots.length - 1 && (
                                <button
                                    className="thumb-action-btn thumb-move-right-btn"
                                    onClick={(e) => handleMoveRight(e, index)}
                                    title="Move right"
                                >
                                    <ChevronRight size={10} />
                                </button>
                            )}

                            {/* Duplicate Button */}
                            <button
                                className="thumb-action-btn thumb-duplicate-btn"
                                onClick={(e) => handleDuplicate(e, screenshot.id)}
                                title="Duplicate screenshot"
                            >
                                <Copy size={10} />
                            </button>

                            {/* Delete Button */}
                            {screenshots.length > 1 && (
                                <button
                                    className="thumb-action-btn thumb-delete-btn"
                                    onClick={(e) => handleDelete(e, screenshot.id)}
                                    title="Delete screenshot"
                                >
                                    <X size={10} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button className="add-screenshot-btn" onClick={onAdd} title="Add Screenshot">
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}

'use client';

import {
    Palette,
    Type,
    Image as ImageIcon,
    Shapes,
    ChevronDown,
    ChevronRight,
    Trash2,
    Minus,
    Plus
} from 'lucide-react';
import { useState } from 'react';
import BackgroundControl from './BackgroundControl';
import TextControl from './TextControl';
import ImageControl from './ImageControl';
import ElementsControl from './ElementsControl';
import { TextElement, ImageElement, ShapeElement, EditorElement } from '@/types/editor';

interface SidebarProps {
    currentBackgroundColor: string;
    onBackgroundChange: (color: string) => void;
    onAddText: (element: TextElement) => void;
    onAddImage: (element: ImageElement) => void;
    onAddShape: (element: ShapeElement) => void;
    selectedElement: EditorElement | null;
    onDeleteElement: () => void;
    onUpdateSelectedElement: (updates: Partial<EditorElement>) => void;
}

type SectionKey = 'background' | 'text' | 'image' | 'elements';

export default function Sidebar({
    currentBackgroundColor,
    onBackgroundChange,
    onAddText,
    onAddImage,
    onAddShape,
    selectedElement,
    onDeleteElement,
    onUpdateSelectedElement,
}: SidebarProps) {
    const [openSections, setOpenSections] = useState<Set<SectionKey>>(
        new Set(['background', 'text', 'image', 'elements'])
    );

    const toggleSection = (section: SectionKey) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    const sections = [
        { key: 'background' as SectionKey, icon: Palette, label: 'Background' },
        { key: 'text' as SectionKey, icon: Type, label: 'Text' },
        { key: 'image' as SectionKey, icon: ImageIcon, label: 'Images' },
        { key: 'elements' as SectionKey, icon: Shapes, label: 'Elements' },
    ];

    const isTextSelected = selectedElement?.type === 'text';
    const textElement = isTextSelected ? (selectedElement as TextElement) : null;

    const handleFontSizeChange = (delta: number) => {
        if (textElement) {
            const newSize = Math.max(12, Math.min(200, textElement.fontSize + delta));
            onUpdateSelectedElement({ fontSize: newSize });
        }
    };

    const handleFontSizeInput = (value: string) => {
        const size = parseInt(value, 10);
        if (!isNaN(size) && size >= 12 && size <= 200 && textElement) {
            onUpdateSelectedElement({ fontSize: size });
        }
    };

    const handleTextColorChange = (color: string) => {
        if (textElement) {
            onUpdateSelectedElement({ fill: color });
        }
    };

    const handleFontWeightToggle = () => {
        if (textElement) {
            onUpdateSelectedElement({
                fontWeight: textElement.fontWeight === 'bold' ? 'normal' : 'bold'
            });
        }
    };

    const handleFontStyleToggle = () => {
        if (textElement) {
            onUpdateSelectedElement({
                fontStyle: textElement.fontStyle === 'italic' ? 'normal' : 'italic'
            });
        }
    };

    const handleAlignChange = (align: 'left' | 'center' | 'right') => {
        if (textElement) {
            onUpdateSelectedElement({ align });
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Editor</h2>
            </div>

            {/* Selected Element Actions */}
            {selectedElement && (
                <div className="selected-element-panel">
                    <div className="selected-element-header">
                        <span className="selected-type">
                            {selectedElement.type === 'text' && '📝 Text'}
                            {selectedElement.type === 'image' && '🖼️ Image'}
                            {selectedElement.type === 'shape' && '⬜ Shape'}
                        </span>
                        <button
                            className="delete-element-btn-small"
                            onClick={onDeleteElement}
                            title="Delete Element (Del)"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    {/* Text-specific controls */}
                    {isTextSelected && textElement && (
                        <div className="text-properties">
                            {/* Font Size */}
                            <div className="property-row">
                                <label className="property-label">Font Size</label>
                                <div className="font-size-control">
                                    <button
                                        className="size-btn"
                                        onClick={() => handleFontSizeChange(-4)}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <input
                                        type="number"
                                        className="size-input"
                                        value={textElement.fontSize}
                                        onChange={(e) => handleFontSizeInput(e.target.value)}
                                        min={12}
                                        max={200}
                                    />
                                    <button
                                        className="size-btn"
                                        onClick={() => handleFontSizeChange(4)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Font Style */}
                            <div className="property-row">
                                <label className="property-label">Style</label>
                                <div className="style-buttons">
                                    <button
                                        className={`style-btn ${textElement.fontWeight === 'bold' ? 'active' : ''}`}
                                        onClick={handleFontWeightToggle}
                                        title="Bold"
                                    >
                                        <strong>B</strong>
                                    </button>
                                    <button
                                        className={`style-btn ${textElement.fontStyle === 'italic' ? 'active' : ''}`}
                                        onClick={handleFontStyleToggle}
                                        title="Italic"
                                    >
                                        <em>I</em>
                                    </button>
                                </div>
                            </div>

                            {/* Text Alignment */}
                            <div className="property-row">
                                <label className="property-label">Align</label>
                                <div className="align-buttons-row">
                                    <button
                                        className={`align-btn-small ${textElement.align === 'left' ? 'active' : ''}`}
                                        onClick={() => handleAlignChange('left')}
                                        title="Align Left"
                                    >
                                        ≡
                                    </button>
                                    <button
                                        className={`align-btn-small ${textElement.align === 'center' ? 'active' : ''}`}
                                        onClick={() => handleAlignChange('center')}
                                        title="Align Center"
                                    >
                                        ≡
                                    </button>
                                    <button
                                        className={`align-btn-small ${textElement.align === 'right' ? 'active' : ''}`}
                                        onClick={() => handleAlignChange('right')}
                                        title="Align Right"
                                    >
                                        ≡
                                    </button>
                                </div>
                            </div>

                            {/* Text Color */}
                            <div className="property-row">
                                <label className="property-label">Color</label>
                                <div className="color-input-row">
                                    <input
                                        type="color"
                                        className="color-picker-small"
                                        value={textElement.fill}
                                        onChange={(e) => handleTextColorChange(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="color-hex-input"
                                        value={textElement.fill}
                                        onChange={(e) => handleTextColorChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            <p className="edit-hint">Double-click text to edit content</p>
                        </div>
                    )}
                </div>
            )}

            <div className="sidebar-content">
                {sections.map(({ key, icon: Icon, label }) => (
                    <div key={key} className="sidebar-section">
                        <button
                            className="section-header"
                            onClick={() => toggleSection(key)}
                        >
                            <div className="section-header-left">
                                <Icon size={18} />
                                <span>{label}</span>
                            </div>
                            {openSections.has(key) ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>

                        {openSections.has(key) && (
                            <div className="section-content">
                                {key === 'background' && (
                                    <BackgroundControl
                                        currentColor={currentBackgroundColor}
                                        onColorChange={onBackgroundChange}
                                    />
                                )}
                                {key === 'text' && (
                                    <TextControl onAddText={onAddText} />
                                )}
                                {key === 'image' && (
                                    <ImageControl onAddImage={onAddImage} />
                                )}
                                {key === 'elements' && (
                                    <ElementsControl onAddElement={onAddShape} />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}

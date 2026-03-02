'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { POPULAR_GOOGLE_FONTS, loadGoogleFont } from '@/utils/fonts';

interface FontPickerProps {
    currentFont: string;
    onFontChange: (font: string) => void;
}

export default function FontPicker({ currentFont, onFontChange }: FontPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredFonts = POPULAR_GOOGLE_FONTS.filter(font =>
        font.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFontSelect = (font: string) => {
        loadGoogleFont(font);
        onFontChange(font);
        setIsOpen(false);
    };

    return (
        <div className="font-picker-container" ref={containerRef}>
            <button
                className="font-picker-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={{ fontFamily: currentFont }}
            >
                <span className="truncate">{currentFont}</span>
                <ChevronDown size={14} className="opacity-50" />
            </button>

            {isOpen && (
                <div className="font-picker-dropdown">
                    <div className="font-search-wrapper">
                        <Search size={14} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search fonts..."
                            className="font-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="font-list">
                        {filteredFonts.map(font => (
                            <button
                                key={font}
                                className={`font-option ${currentFont === font ? 'active' : ''}`}
                                onClick={() => handleFontSelect(font)}
                                style={{ fontFamily: font }}
                                onMouseEnter={() => loadGoogleFont(font)} // Preload on hover for preview
                            >
                                <span className="font-name">{font}</span>
                                {currentFont === font && <Check size={14} className="check-icon" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

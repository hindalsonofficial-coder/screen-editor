'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, Check } from 'lucide-react';

export type ExportFormat = 'png' | 'jpg';
export type ExportPreset = 'custom' | 'app-store' | 'google-play';

export interface ExportOptions {
    format: ExportFormat;
    quality: number; // 0-1 for JPG
    preset: ExportPreset;
    exportAll: boolean;
}

interface ExportOptionsProps {
    onExport: (options: ExportOptions) => void;
    screenshotCount: number;
}

export default function ExportOptions({ onExport, screenshotCount }: ExportOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [format, setFormat] = useState<ExportFormat>('png');
    const [quality, setQuality] = useState<number>(0.92);
    const [preset, setPreset] = useState<ExportPreset>('custom');
    const [exportAll, setExportAll] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleExport = () => {
        onExport({
            format,
            quality,
            preset,
            exportAll,
        });
        setIsOpen(false);
    };

    const handlePresetChange = (newPreset: ExportPreset) => {
        setPreset(newPreset);
        if (newPreset === 'app-store' || newPreset === 'google-play') {
            setFormat('png');
            setQuality(1.0);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                className="export-btn"
                onClick={() => setIsOpen(!isOpen)}
                title="Export Options"
            >
                <Download size={18} />
                <span>Export</span>
                <ChevronDown size={14} className="ml-1" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
                    <h3 className="text-white font-semibold mb-4">Export Options</h3>

                    {/* Export Mode */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-2">Export Mode</label>
                        <div className="flex gap-2">
                            <button
                                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    !exportAll
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => setExportAll(false)}
                            >
                                Current Screenshot
                            </button>
                            <button
                                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    exportAll
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => setExportAll(true)}
                            >
                                All ({screenshotCount})
                            </button>
                        </div>
                    </div>

                    {/* Format Preset */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-2">Format Preset</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                                    preset === 'custom'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => handlePresetChange('custom')}
                            >
                                Custom
                            </button>
                            <button
                                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                                    preset === 'app-store'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => handlePresetChange('app-store')}
                            >
                                App Store
                            </button>
                            <button
                                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                                    preset === 'google-play'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => handlePresetChange('google-play')}
                            >
                                Google Play
                            </button>
                        </div>
                    </div>

                    {/* Format */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-2">Format</label>
                        <div className="flex gap-2">
                            <button
                                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    format === 'png'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => setFormat('png')}
                            >
                                PNG
                            </button>
                            <button
                                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    format === 'jpg'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => setFormat('jpg')}
                            >
                                JPG
                            </button>
                        </div>
                    </div>

                    {/* Quality (only for JPG) */}
                    {format === 'jpg' && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm text-gray-300">Quality</label>
                                <span className="text-sm text-gray-400">{Math.round(quality * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.01"
                                value={quality}
                                onChange={(e) => setQuality(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}

                    {/* Dimensions Info */}
                    {(preset === 'app-store' || preset === 'google-play') && (
                        <div className="mb-4 p-3 bg-gray-800 rounded text-xs text-gray-400">
                            {preset === 'app-store' && (
                                <div>
                                    <strong className="text-gray-300">App Store:</strong> 1290 × 2796px (6.5" display)
                                </div>
                            )}
                            {preset === 'google-play' && (
                                <div>
                                    <strong className="text-gray-300">Google Play:</strong> 1290 × 2796px (6.5" display)
                                </div>
                            )}
                        </div>
                    )}

                    {/* Export Button */}
                    <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        onClick={handleExport}
                    >
                        {exportAll ? `Export All (${screenshotCount})` : 'Export Screenshot'}
                    </button>
                </div>
            )}
        </div>
    );
}


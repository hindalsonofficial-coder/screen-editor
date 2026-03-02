'use client';

import { Minus, Plus, Maximize } from 'lucide-react';

interface ZoomControlsProps {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
}

export default function ZoomControls({
    zoom,
    onZoomIn,
    onZoomOut,
    onResetZoom
}: ZoomControlsProps) {
    return (
        <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-1.5 shadow-xl z-50">
            <button
                className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                onClick={onZoomOut}
                title="Zoom Out"
            >
                <Minus size={16} />
            </button>

            <button
                className="px-2 min-w-[60px] text-center text-xs font-medium text-gray-300 hover:text-white tabular-nums"
                onClick={onResetZoom}
                title="Reset Zoom"
            >
                {Math.round(zoom * 100)}%
            </button>

            <button
                className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                onClick={onZoomIn}
                title="Zoom In"
            >
                <Plus size={16} />
            </button>
        </div>
    );
}

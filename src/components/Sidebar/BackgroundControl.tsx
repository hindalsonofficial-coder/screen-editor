'use client';

import { PRESET_COLORS } from '@/types/editor';

interface BackgroundControlProps {
    currentColor: string;
    onColorChange: (color: string) => void;
}

export default function BackgroundControl({
    currentColor,
    onColorChange
}: BackgroundControlProps) {
    return (
        <div className="control-section">
            <h3 className="control-title">Background</h3>

            <div className="color-grid">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color}
                        className={`color-swatch ${currentColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onColorChange(color)}
                        title={color}
                    />
                ))}
            </div>

            <div className="custom-color">
                <label className="control-label">Custom Color</label>
                <div className="color-input-wrapper">
                    <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="color-picker"
                    />
                    <input
                        type="text"
                        value={currentColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="color-text-input"
                        placeholder="#FFFFFF"
                    />
                </div>
            </div>
        </div>
    );
}

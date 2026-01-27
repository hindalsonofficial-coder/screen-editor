'use client';

import { useState } from 'react';
import { Pen, Eraser, Minus, Plus } from 'lucide-react';

interface PenControlProps {
    penColor: string;
    penWeight: number;
    onColorChange: (color: string) => void;
    onWeightChange: (weight: number) => void;
    onPenModeChange: (enabled: boolean) => void;
    onEraserModeChange: (enabled: boolean) => void;
    isPenMode: boolean;
    isEraserMode: boolean;
}

export default function PenControl({
    penColor,
    penWeight,
    onColorChange,
    onWeightChange,
    onPenModeChange,
    onEraserModeChange,
    isPenMode,
    isEraserMode
}: PenControlProps) {
    const penColors = [
        '#0000FF', // Blue
        '#FF0000', // Red
        '#FFFF00', // Yellow
        '#000000', // Black
        '#FFFFFF', // White
        '#00FF00', // Green
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
    ];

    const handleWeightChange = (delta: number) => {
        const newWeight = Math.max(1, Math.min(100, penWeight + delta));
        onWeightChange(newWeight);
    };

    const handleWeightInput = (value: string) => {
        const weight = parseInt(value, 10);
        if (!isNaN(weight) && weight >= 1 && weight <= 100) {
            onWeightChange(weight);
        }
    };

    return (
        <div className="control-section">
            <h3 className="control-title">Pen</h3>

            {/* Pen & Eraser Mode Toggles */}
            <div className="pen-mode-toggle">
                <button
                    className={`pen-mode-btn ${isPenMode ? 'active' : ''}`}
                    onClick={() => {
                        onPenModeChange(!isPenMode);
                        if (!isPenMode && isEraserMode) {
                            onEraserModeChange(false);
                        }
                    }}
                >
                    <Pen size={20} />
                    <span>{isPenMode ? 'Drawing Mode' : 'Enable Drawing'}</span>
                </button>
                <button
                    className={`pen-mode-btn eraser-btn ${isEraserMode ? 'active' : ''}`}
                    onClick={() => {
                        onEraserModeChange(!isEraserMode);
                        if (!isEraserMode && isPenMode) {
                            onPenModeChange(false);
                        }
                    }}
                >
                    <Eraser size={20} />
                    <span>{isEraserMode ? 'Eraser Mode' : 'Enable Eraser'}</span>
                </button>
            </div>

            {(isPenMode || isEraserMode) && (
                <>
                    {/* Pen Colors */}
                    <div className="pen-colors-section">
                        <label className="control-label">Pen Colors</label>
                        <div className="pen-colors-grid">
                            {penColors.map((color) => (
                                <button
                                    key={color}
                                    className={`pen-color-btn ${penColor === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => onColorChange(color)}
                                    title={color}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={penColor}
                            onChange={(e) => onColorChange(e.target.value)}
                            className="pen-color-picker"
                        />
                    </div>

                    {/* Weight Slider */}
                    <div className="pen-weight-section">
                        <div className="weight-header">
                            <label className="control-label">Weight</label>
                            <div className="weight-value">{penWeight}</div>
                        </div>
                        <div className="weight-control">
                            <button
                                className="weight-btn"
                                onClick={() => handleWeightChange(-1)}
                            >
                                <Minus size={14} />
                            </button>
                            <div className="weight-slider-wrapper">
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={penWeight}
                                    onChange={(e) => onWeightChange(parseInt(e.target.value, 10))}
                                    className="weight-slider"
                                />
                            </div>
                            <button
                                className="weight-btn"
                                onClick={() => handleWeightChange(1)}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={penWeight}
                            onChange={(e) => handleWeightInput(e.target.value)}
                            className="weight-input"
                        />
                    </div>
                </>
            )}
        </div>
    );
}


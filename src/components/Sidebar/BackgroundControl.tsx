'use client';

import { useState, useRef, useEffect } from 'react';
import { PRESET_COLORS } from '@/types/editor';
import { Droplet, Eye } from 'lucide-react';

interface BackgroundControlProps {
    currentColor: string;
    onColorChange: (color: string) => void;
}

export default function BackgroundControl({
    currentColor,
    onColorChange
}: BackgroundControlProps) {
    const [activeTab, setActiveTab] = useState<'solid' | 'gradient'>('solid');
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(50);
    const [hexValue, setHexValue] = useState(currentColor);
    const [gradientColor1, setGradientColor1] = useState('#000000');
    const [gradientColor2, setGradientColor2] = useState('#808080');
    const [gradientStyle, setGradientStyle] = useState<'horizontal' | 'vertical' | 'diagonal' | 'radial' | 'diagonal-reverse'>('horizontal');
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const hueSliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHueDragging, setIsHueDragging] = useState(false);

    // Convert HSL to Hex
    const hslToHex = (h: number, s: number, l: number): string => {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    };

    // Convert Hex to HSL
    const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    // Generate gradient CSS string
    const generateGradientString = (color1: string, color2: string, style: string): string => {
        switch (style) {
            case 'horizontal':
                return `linear-gradient(to right, ${color1}, ${color2})`;
            case 'vertical':
                return `linear-gradient(to bottom, ${color1}, ${color2})`;
            case 'diagonal':
                return `linear-gradient(to bottom right, ${color1}, ${color2})`;
            case 'diagonal-reverse':
                return `linear-gradient(to top right, ${color1}, ${color2})`;
            case 'radial':
                return `radial-gradient(circle, ${color1}, ${color2})`;
            default:
                return `linear-gradient(to right, ${color1}, ${color2})`;
        }
    };

    // Update HSL from current color
    useEffect(() => {
        if (currentColor.startsWith('#')) {
            const hsl = hexToHsl(currentColor);
            setHue(hsl.h);
            setSaturation(hsl.s);
            setLightness(hsl.l);
            setHexValue(currentColor);
        } else if (currentColor.includes('gradient')) {
            // If it's already a gradient, parse it
            setActiveTab('gradient');
        }
    }, [currentColor]);

    // Handle gradient color change
    const handleGradientColorChange = (colorIndex: 1 | 2, color: string) => {
        if (colorIndex === 1) {
            setGradientColor1(color);
        } else {
            setGradientColor2(color);
        }
        const gradientString = generateGradientString(
            colorIndex === 1 ? color : gradientColor1,
            colorIndex === 2 ? color : gradientColor2,
            gradientStyle
        );
        onColorChange(gradientString);
    };

    // Handle gradient style change
    const handleGradientStyleChange = (style: 'horizontal' | 'vertical' | 'diagonal' | 'radial' | 'diagonal-reverse') => {
        setGradientStyle(style);
        const gradientString = generateGradientString(gradientColor1, gradientColor2, style);
        onColorChange(gradientString);
    };

    // Handle color picker click
    const handleColorPickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!colorPickerRef.current) return;
        const rect = colorPickerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        
        setSaturation(Math.round(x * 100));
        setLightness(Math.round((1 - y) * 100));
        
        const newColor = hslToHex(hue, x * 100, (1 - y) * 100);
        setHexValue(newColor);
        onColorChange(newColor);
    };

    // Handle hue slider
    const handleHueSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!hueSliderRef.current) return;
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newHue = Math.round(x * 360);
        setHue(newHue);
        
        const newColor = hslToHex(newHue, saturation, lightness);
        setHexValue(newColor);
        onColorChange(newColor);
    };

    // Handle hex input
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexValue(value);
        
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            const hsl = hexToHsl(value);
            setHue(hsl.h);
            setSaturation(hsl.s);
            setLightness(hsl.l);
            onColorChange(value);
        }
    };

    // Eyedropper (color picker API)
    const handleEyedropper = async () => {
        try {
            // @ts-ignore - EyeDropper API might not be in types
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            if (result.sRGBHex) {
                setHexValue(result.sRGBHex);
                const hsl = hexToHsl(result.sRGBHex);
                setHue(hsl.h);
                setSaturation(hsl.s);
                setLightness(hsl.l);
                onColorChange(result.sRGBHex);
            }
        } catch (err) {
            // User cancelled or API not supported
            console.log('Eyedropper cancelled or not supported');
        }
    };

    const currentHslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hueColor = `hsl(${hue}, 100%, 50%)`;

    // Default gradient colors
    const defaultGradients = [
        ['#000000', '#808080'],
        ['#808080', '#FFFFFF'],
        ['#006400', '#90EE90'],
        ['#8B4513', '#FFFF00'],
        ['#800080', '#0000FF'],
        ['#ADD8E6', '#FF0000'],
    ];

    return (
        <div className="control-section">
            <h3 className="control-title">Background</h3>

            {/* Tabs */}
            <div className="color-picker-tabs">
                <button
                    className={`color-tab ${activeTab === 'solid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('solid')}
                >
                    Solid colour
                </button>
                <button
                    className={`color-tab ${activeTab === 'gradient' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gradient')}
                >
                    Gradient
                </button>
            </div>

            {activeTab === 'solid' ? (
                <>
                    {/* Color Picker Square */}
                    <div
                        ref={colorPickerRef}
                        className="color-picker-square"
                        style={{
                            background: `linear-gradient(to top, hsl(${hue}, 100%, 0%), hsl(${hue}, 100%, 50%)), linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`
                        }}
                        onClick={handleColorPickerClick}
                    >
                        <div
                            className="color-picker-handle"
                            style={{
                                left: `${saturation}%`,
                                bottom: `${lightness}%`,
                                backgroundColor: currentHslColor
                            }}
                        />
                    </div>

                    {/* Hue Slider */}
                    <div
                        ref={hueSliderRef}
                        className="hue-slider"
                        onClick={handleHueSliderClick}
                    >
                        <div
                            className="hue-slider-handle"
                            style={{
                                left: `${(hue / 360) * 100}%`,
                                backgroundColor: hueColor
                            }}
                        />
                    </div>

                    {/* Hex Input & Eyedropper */}
                    <div className="color-input-row">
                        <div
                            className="current-color-swatch"
                            style={{ backgroundColor: hexValue }}
                        />
                        <input
                            type="text"
                            value={hexValue}
                            onChange={handleHexChange}
                            className="hex-input"
                            placeholder="#000000"
                            maxLength={7}
                        />
                        <button
                            className="eyedropper-btn"
                            onClick={handleEyedropper}
                            title="Pick color from screen"
                        >
                            <Eye size={16} />
                        </button>
                    </div>

                    {/* Preset Colors */}
                    <div className="preset-colors-section">
                        <label className="control-label">Preset Colors</label>
                        <div className="color-grid">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={`color-swatch ${currentColor === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        setHexValue(color);
                                        const hsl = hexToHsl(color);
                                        setHue(hsl.h);
                                        setSaturation(hsl.s);
                                        setLightness(hsl.l);
                                        onColorChange(color);
                                    }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Default Gradients Preview */}
                    <div className="default-gradients-section">
                        <div className="gradients-header">
                            <label className="control-label">Default gradient colours</label>
                            <button className="see-all-link">See all</button>
                        </div>
                        <div className="gradient-swatches">
                            {defaultGradients.map((gradient, index) => (
                                <button
                                    key={index}
                                    className="gradient-swatch"
                                    style={{
                                        background: `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})`
                                    }}
                                    onClick={() => {
                                        setGradientColor1(gradient[0]);
                                        setGradientColor2(gradient[1]);
                                        setGradientStyle('horizontal');
                                        const gradientString = generateGradientString(gradient[0], gradient[1], 'horizontal');
                                        onColorChange(gradientString);
                                        setActiveTab('gradient');
                                    }}
                                    title={`Gradient ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Gradient Tab Content */}
                    <div className="gradient-colors-section">
                        <label className="control-label">Gradient colours</label>
                        <div className="gradient-color-pickers">
                            <input
                                type="color"
                                value={gradientColor1}
                                onChange={(e) => handleGradientColorChange(1, e.target.value)}
                                className="gradient-color-input"
                            />
                            <input
                                type="color"
                                value={gradientColor2}
                                onChange={(e) => handleGradientColorChange(2, e.target.value)}
                                className="gradient-color-input"
                            />
                            <button className="gradient-color-btn add-color-btn" title="Add more colors (coming soon)">
                                <Droplet size={16} />
                            </button>
                        </div>
                        <div className="gradient-preview-large" style={{ background: generateGradientString(gradientColor1, gradientColor2, gradientStyle) }} />
                    </div>

                    <div className="gradient-styles-section">
                        <label className="control-label">Style</label>
                        <div className="gradient-styles-grid">
                            <button
                                className={`gradient-style-btn ${gradientStyle === 'horizontal' ? 'active' : ''}`}
                                onClick={() => handleGradientStyleChange('horizontal')}
                                title="Horizontal"
                            >
                                <div style={{ background: generateGradientString(gradientColor1, gradientColor2, 'horizontal') }} />
                            </button>
                            <button
                                className={`gradient-style-btn ${gradientStyle === 'vertical' ? 'active' : ''}`}
                                onClick={() => handleGradientStyleChange('vertical')}
                                title="Vertical"
                            >
                                <div style={{ background: generateGradientString(gradientColor1, gradientColor2, 'vertical') }} />
                            </button>
                            <button
                                className={`gradient-style-btn ${gradientStyle === 'diagonal' ? 'active' : ''}`}
                                onClick={() => handleGradientStyleChange('diagonal')}
                                title="Diagonal"
                            >
                                <div style={{ background: generateGradientString(gradientColor1, gradientColor2, 'diagonal') }} />
                            </button>
                            <button
                                className={`gradient-style-btn ${gradientStyle === 'radial' ? 'active' : ''}`}
                                onClick={() => handleGradientStyleChange('radial')}
                                title="Radial"
                            >
                                <div style={{ background: generateGradientString(gradientColor1, gradientColor2, 'radial') }} />
                            </button>
                            <button
                                className={`gradient-style-btn ${gradientStyle === 'diagonal-reverse' ? 'active' : ''}`}
                                onClick={() => handleGradientStyleChange('diagonal-reverse')}
                                title="Diagonal Reverse"
                            >
                                <div style={{ background: generateGradientString(gradientColor1, gradientColor2, 'diagonal-reverse') }} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

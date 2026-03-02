// Editor Element Types

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface BaseElement {
    id: string;
    type: 'text' | 'image' | 'shape' | 'pen';
    position: Position;
    rotation: number;
    opacity: number;
    locked: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}

export interface TextElement extends BaseElement {
    type: 'text';
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    fill: string;
    align: 'left' | 'center' | 'right';
    width: number;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    size: Size;
}

export interface ShapeElement extends BaseElement {
    type: 'shape';
    shapeType: 'rectangle' | 'circle' | 'rounded-rect' | 'triangle-up' | 'triangle-down' | 'diamond' | 'pentagon' |
    'hexagon' | 'octagon' | 'star-5' | 'star-10' | 'star-12' | 'arrow-right' | 'arrow-left' |
    'arrow-flag' | 'banner' | 'speech-bubble-rect' | 'speech-bubble-oval' | 'heart' |
    'parallelogram' | 'trapezoid-up' | 'trapezoid-down' | 'rounded-bottom' | 'rounded-top' | 'pill-vertical';
    size: Size;
    fill: string;
    stroke: string;
    strokeWidth: number;
    cornerRadius?: number;
}

export interface PenElement extends BaseElement {
    type: 'pen';
    points: number[];
    stroke: string;
    strokeWidth: number;
    tension?: number;
    lineCap?: 'butt' | 'round' | 'square';
    lineJoin?: 'miter' | 'round' | 'bevel';
}

export type EditorElement = TextElement | ImageElement | ShapeElement | PenElement;

export interface Screenshot {
    id: string;
    name: string;
    backgroundColor: string;
    backgroundImage?: string; // Base screenshot image (full frame)
    elements: EditorElement[];
}

export interface EditorState {
    projectName: string;
    screenshots: Screenshot[];
    activeScreenshotIndex: number;
    selectedElementId: string | null;
    zoom: number;
}

export interface EditorActions {
    setProjectName: (name: string) => void;
    addScreenshot: () => void;
    removeScreenshot: (id: string) => void;
    duplicateScreenshot: (id: string) => void;
    moveScreenshotLeft: (index: number) => void;
    moveScreenshotRight: (index: number) => void;
    setActiveScreenshot: (index: number) => void;
    updateScreenshotBackground: (id: string, color: string) => void;
    updateScreenshotBackgroundImage: (id: string, imageUrl: string | null) => void;
    addElement: (screenshotId: string, element: EditorElement) => void;
    updateElement: (screenshotId: string, elementId: string, updates: Partial<EditorElement>) => void;
    removeElement: (screenshotId: string, elementId: string) => void;
    replaceElementWithText: (screenshotId: string, elementId: string) => void;
    selectElement: (elementId: string | null) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    setZoom: (zoom: number) => void;
    applyTemplate: (template: { backgroundColor: string; elements: EditorElement[] }) => void;
}

// Preset colors for background picker
export const PRESET_COLORS = [
    '#D4FF4F', // Lime/Yellow-green (from reference)
    '#F5F5DC', // Beige
    '#1A1A1A', // Dark
    '#FFFFFF', // White
    '#FFB6C1', // Light pink
    '#87CEEB', // Sky blue
    '#98FB98', // Pale green
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#E6E6FA', // Lavender
];

// Gradient types
export type GradientType = 'linear' | 'radial';
export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse';

export interface Gradient {
    id: string;
    type: GradientType;
    direction: GradientDirection;
    colors: string[];
}

// Helper to check if string is gradient ID
export const isGradientId = (value: string): boolean => {
    return value.startsWith('gradient:');
};

// Helper to get gradient by ID (for now, we'll store gradients separately)
export const getGradientById = (id: string): Gradient | null => {
    // This will be implemented with proper gradient storage
    return null;
};

// Default screenshot dimensions (App Store 6.5" display)
export const SCREENSHOT_WIDTH = 1290;
export const SCREENSHOT_HEIGHT = 2796;
export const CANVAS_SCALE = 0.15; // Scale for preview display

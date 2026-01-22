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
    type: 'text' | 'image' | 'shape';
    position: Position;
    rotation: number;
    opacity: number;
    locked: boolean;
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
    shapeType: 'rectangle' | 'circle' | 'rounded-rect';
    size: Size;
    fill: string;
    stroke: string;
    strokeWidth: number;
    cornerRadius?: number;
}

export type EditorElement = TextElement | ImageElement | ShapeElement;

export interface Screenshot {
    id: string;
    name: string;
    backgroundColor: string;
    elements: EditorElement[];
}

export interface EditorState {
    projectName: string;
    screenshots: Screenshot[];
    activeScreenshotIndex: number;
    selectedElementId: string | null;
}

export interface EditorActions {
    setProjectName: (name: string) => void;
    addScreenshot: () => void;
    removeScreenshot: (id: string) => void;
    setActiveScreenshot: (index: number) => void;
    updateScreenshotBackground: (id: string, color: string) => void;
    addElement: (screenshotId: string, element: EditorElement) => void;
    updateElement: (screenshotId: string, elementId: string, updates: Partial<EditorElement>) => void;
    removeElement: (screenshotId: string, elementId: string) => void;
    selectElement: (elementId: string | null) => void;
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

// Default screenshot dimensions (App Store 6.5" display)
export const SCREENSHOT_WIDTH = 1290;
export const SCREENSHOT_HEIGHT = 2796;
export const CANVAS_SCALE = 0.15; // Scale for preview display

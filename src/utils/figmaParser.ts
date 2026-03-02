// import { TextElement, ShapeElement, ImageElement, EditorElement } from '@/types/editor';
// import { v4 as uuidv4 } from 'uuid';

// interface FigmaNode {
//     id: string;
//     name: string;
//     type: string;
//     children?: FigmaNode[];
//     fills?: any[];
//     characters?: string;
//     style?: any;
//     absoluteBoundingBox?: {
//         x: number;
//         y: number;
//         width: number;
//         height: number;
//     };
//     cornerRadius?: number;
//     strokes?: any[];
//     strokeWeight?: number;
// }

// export interface ParsedTemplate {
//     id: string;
//     name: string;
//     backgroundColor: string;
//     elements: EditorElement[];
// }

// export function parseFigmaTemplate(figmaFrame: FigmaNode): ParsedTemplate {
//     const elements: EditorElement[] = [];
//     const backgroundColor = extractBackgroundColor(figmaFrame);

//     // Get frame bounds for relative positioning
//     const frameBounds = figmaFrame.absoluteBoundingBox;

//     if (figmaFrame.children) {
//         // Check for Background Image
//         const bgFill = figmaFrame.fills?.[0];
//         if (bgFill?.type === 'IMAGE' && bgFill.imageUrl && frameBounds) {
//             // Calculate scale factors (same as parseNode)
//             const targetWidth = 1290;
//             const targetHeight = 2796;
//             const scaleX = targetWidth / frameBounds.width;
//             const scaleY = targetHeight / frameBounds.height;

//             elements.push({
//                 id: uuidv4(),
//                 type: 'image',
//                 src: bgFill.imageUrl,
//                 position: { x: 0, y: 0 },
//                 rotation: 0,
//                 opacity: 1,
//                 locked: true, // Lock background
//                 size: {
//                     width: targetWidth,
//                     height: targetHeight
//                 }
//             });
//         }

//         for (const child of figmaFrame.children) {
//             const childElements = parseNode(child, frameBounds);
//             elements.push(...childElements);
//         }
//     }

//     return {
//         id: figmaFrame.id,
//         name: figmaFrame.name,
//         backgroundColor,
//         elements,
//     };
// }

// function parseNode(node: FigmaNode, frameBounds: any): EditorElement[] {
//     const elements: EditorElement[] = [];

//     // Check if it's a container that should be flattened (GROUP, INSTANCE, COMPONENT, FRAME, etc.)
//     const isContainer = node.children && node.children.length > 0;

//     if (isContainer) {
//         // If the container (e.g. inner Frame) has a background fill, render it as a Rectangle first
//         // This ensures visual fidelity (e.g. cards, buttons, sections)
//         if (node.fills && node.fills.length > 0 && node.fills[0].visible !== false) {
//             const bounds = node.absoluteBoundingBox;
//             if (bounds && frameBounds) {
//                 // Calculate scale factors (need to be calculated here for the container)
//                 const targetWidth = 1290;
//                 const targetHeight = 2796;
//                 const scaleX = targetWidth / frameBounds.width;
//                 const scaleY = targetHeight / frameBounds.height;

//                 const position = {
//                     x: (bounds.x - frameBounds.x) * scaleX,
//                     y: (bounds.y - frameBounds.y) * scaleY,
//                 };

//                 // Reuse parseShapeNode logic but forced to rectangle
//                 const bgShape = parseShapeNode(node, position, bounds, scaleX, scaleY);
//                 // Force it to be a shape (if parseShapeNode returned ImageElement, that's fine too)
//                 if (bgShape) {
//                     elements.push(bgShape);
//                 }
//             }
//         }

//         for (const child of node.children!) {
//             const childElements = parseNode(child, frameBounds);
//             elements.push(...childElements);
//         }
//         return elements;
//     }

//     // Processing Leaf Nodes
//     const bounds = node.absoluteBoundingBox;
//     // If no bounds or outside logic, skip.
//     if (!bounds || !frameBounds) return [];

//     // Calculate scale factors
//     const targetWidth = 1290; // SCREENSHOT_WIDTH
//     const targetHeight = 2796; // SCREENSHOT_HEIGHT

//     const scaleX = targetWidth / frameBounds.width;
//     const scaleY = targetHeight / frameBounds.height;

//     // Calculate relative position within frame and apply scale
//     const position = {
//         x: (bounds.x - frameBounds.x) * scaleX,
//         y: (bounds.y - frameBounds.y) * scaleY,
//     };

//     let element: EditorElement | null = null;

//     // Any node with characters is editable text (TEXT type or e.g. text inside instance)
//     if (node.characters != null && String(node.characters).trim() !== '') {
//         element = parseTextNode(node, position, scaleX);
//     } else
//     switch (node.type) {
//         case 'TEXT':
//             element = parseTextNode(node, position, scaleX);
//             break;
//         case 'RECTANGLE':
//         case 'ELLIPSE':
//         case 'VECTOR':
//         case 'STAR':
//         case 'LINE':
//         case 'REGULAR_POLYGON':
//             element = parseShapeNode(node, position, bounds, scaleX, scaleY);
//             break;
//         default:
//             return [];
//     }

//     if (element) {
//         return [element];
//     }

//     return [];
// }

// function parseTextNode(node: FigmaNode, position: { x: number; y: number }, scale: number): TextElement {
//     const style = node.style || {};
//     const fill = node.fills?.[0];
//     const content = node.characters != null ? String(node.characters) : 'Text';
//     const width = (node.absoluteBoundingBox?.width || 200) * scale;

//     const textElement: TextElement = {
//         id: uuidv4(),
//         type: 'text',
//         content: content.trim() || 'Text',
//         position,
//         rotation: 0,
//         opacity: 1,
//         locked: false, // always editable when from template
//         fontSize: Math.max(12, (style.fontSize || 24) * scale),
//         fontFamily: style.fontFamily || 'Inter',
//         fontWeight: style.fontWeight != null && style.fontWeight > 600 ? 'bold' : 'normal',
//         fontStyle: style.italic ? 'italic' : 'normal',
//         fill: rgbaToHex(fill?.color) || '#000000',
//         align: (style.textAlignHorizontal?.toLowerCase() || 'left') as 'left' | 'center' | 'right',
//         width: Math.max(50, width),
//     };

//     applyEffects(node, textElement, scale);
//     return textElement;
// }

// function parseShapeNode(node: FigmaNode, position: { x: number; y: number }, bounds: any, scaleX: number, scaleY: number): ShapeElement | ImageElement {
//     const fill = node.fills?.[0];
//     const stroke = node.strokes?.[0];

//     // Check for Image Fill (injected by route.ts)
//     if (fill?.type === 'IMAGE' && fill.imageUrl) {
//         return {
//             id: uuidv4(),
//             type: 'image',
//             src: fill.imageUrl,
//             position,
//             rotation: 0,
//             opacity: fill.opacity || 1,
//             locked: false,
//             size: {
//                 width: bounds.width * scaleX,
//                 height: bounds.height * scaleY,
//             },
//         };
//     }

//     let shapeType: ShapeElement['shapeType'] = 'rectangle';
//     if (node.type === 'ELLIPSE') {
//         shapeType = 'circle';
//     } else if (node.cornerRadius && node.cornerRadius > 0) {
//         shapeType = 'rounded-rect';
//     }

//     const shapeElement: ShapeElement = {
//         id: uuidv4(),
//         type: 'shape',
//         shapeType,
//         position,
//         rotation: 0,
//         opacity: fill?.opacity || 1,
//         locked: false,
//         size: {
//             width: bounds.width * scaleX,
//             height: bounds.height * scaleY,
//         },
//         fill: rgbaToHex(fill?.color) || '#CCCCCC',
//         stroke: rgbaToHex(stroke?.color) || 'transparent',
//         strokeWidth: (node.strokeWeight || 0) * scaleX,
//         cornerRadius: (node.cornerRadius || 0) * scaleX,
//     };

//     applyEffects(node, shapeElement, scaleX);
//     return shapeElement;
// }

// function extractBackgroundColor(frame: FigmaNode): string {
//     const fill = frame.fills?.[0];
//     if (!fill) return '#FFFFFF';

//     if (fill.type === 'SOLID') {
//         return rgbaToHex(fill.color);
//     } else if (fill.type === 'GRADIENT_LINEAR') {
//         // Convert to CSS gradient
//         const stops = fill.gradientStops || [];
//         if (stops.length >= 2) {
//             const color1 = rgbaToHex(stops[0].color);
//             const color2 = rgbaToHex(stops[1].color);
//             return `linear-gradient(to bottom, ${color1}, ${color2})`;
//         }
//     }

//     return '#FFFFFF';
// }

// const applyEffects = (node: FigmaNode, element: any, scale: number) => {
//     if (node.children) return; // Don't apply effects to groups here

//     // Find first drop shadow
//     // Figma 'effects' array
//     const effects = (node as any).effects;
//     if (effects) {
//         const dropShadow = effects.find((e: any) => e.type === 'DROP_SHADOW' && e.visible !== false);
//         if (dropShadow) {
//             element.shadowColor = rgbaToHex(dropShadow.color);
//             element.shadowBlur = (dropShadow.radius || 0) * scale;
//             element.shadowOffsetX = (dropShadow.offset?.x || 0) * scale;
//             element.shadowOffsetY = (dropShadow.offset?.y || 0) * scale;
//             // Opacity is usually in color.a, handled by rgbaToHex if modified? 
//             // My rgbaToHex ignores alpha. Let's fix rgbaToHex or assume shadow is solid color for now.
//             // Actually, standard CSS shadow color can have alpha.
//             // I'll update rgbaToHex later if needed, but for now simple hex is safer.
//         }
//     }
// };

// function rgbaToHex(color: any): string {
//     if (!color) return '#000000';

//     // Check if alpha is present and significantly less than 1
//     // If so, we might want to return rgba(). But Editor uses hex usually.
//     // For shadows, rgba is better. But our types say string.
//     // Let's stick to Hex for now to avoid breaking other things.

//     const r = Math.round(color.r * 255);
//     const g = Math.round(color.g * 255);
//     const b = Math.round(color.b * 255);

//     // Add alpha if present
//     if (color.a !== undefined && color.a < 1) {
//         const a = Math.round(color.a * 255);
//         return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`;
//     }

//     return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
// }

import {
  TextElement,
  ShapeElement,
  ImageElement,
  EditorElement,
} from '@/types/editor';
import { v4 as uuidv4 } from 'uuid';

/* ===================================================== */
/* ===================== CONSTANTS ===================== */
/* ===================================================== */

const TARGET_WIDTH = 1290;
const TARGET_HEIGHT = 2796;

/* ===================================================== */
/* ====================== TYPES ======================== */
/* ===================================================== */

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: any[];
  characters?: string;
  style?: any;
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  cornerRadius?: number;
  strokes?: any[];
  strokeWeight?: number;
  effects?: any[];
}

export interface ParsedTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  elements: EditorElement[];
}

/* ===================================================== */
/* ================= MAIN PARSER ======================= */
/* ===================================================== */

export function parseFigmaTemplate(
  figmaFrame: FigmaNode
): ParsedTemplate {
  if (!figmaFrame.absoluteBoundingBox) {
    throw new Error('Invalid Figma frame: missing absoluteBoundingBox');
  }

  const elements: EditorElement[] = [];
  const backgroundColor = extractBackgroundColor(figmaFrame);
  const frameBounds = figmaFrame.absoluteBoundingBox;

  const scaleX = TARGET_WIDTH / frameBounds.width;
  const scaleY = TARGET_HEIGHT / frameBounds.height;

  if (figmaFrame.children) {
    for (const child of figmaFrame.children) {
      elements.push(...parseNode(child, frameBounds, scaleX, scaleY));
    }
  }

  return {
    id: figmaFrame.id,
    name: figmaFrame.name,
    backgroundColor,
    elements,
  };
}

/* ===================================================== */
/* ================= NODE PARSER ======================= */
/* ===================================================== */

function parseNode(
  node: FigmaNode,
  frameBounds: any,
  scaleX: number,
  scaleY: number
): EditorElement[] {
  if (!node.absoluteBoundingBox) return [];

  const elements: EditorElement[] = [];
  const bounds = node.absoluteBoundingBox;

  const position = {
    x: (bounds.x - frameBounds.x) * scaleX,
    y: (bounds.y - frameBounds.y) * scaleY,
  };

  /* ---------- CONTAINER (FRAME/GROUP) ---------- */
  if (node.children && node.children.length > 0) {
    // Render background shape if container has fill
    const fill = node.fills?.[0];
    if (fill?.type === 'SOLID') {
      elements.push({
        id: uuidv4(),
        type: 'shape',
        shapeType: node.cornerRadius ? 'rounded-rect' : 'rectangle',
        position,
        rotation: 0,
        opacity: fill.opacity ?? 1,
        locked: false,
        size: {
          width: bounds.width * scaleX,
          height: bounds.height * scaleY,
        },
        fill: rgbaToColor(fill.color),
        stroke: 'transparent',
        strokeWidth: 0,
        cornerRadius: (node.cornerRadius || 0) * scaleX,
      });
    }

    for (const child of node.children) {
      elements.push(...parseNode(child, frameBounds, scaleX, scaleY));
    }

    return elements;
  }

  /* ---------- TEXT ---------- */
  if (node.type === 'TEXT') {
    return [parseTextNode(node, position, scaleX)];
  }

  /* ---------- SHAPES ---------- */
  if (
    [
      'RECTANGLE',
      'ELLIPSE',
      'VECTOR',
      'STAR',
      'LINE',
      'REGULAR_POLYGON',
    ].includes(node.type)
  ) {
    const shape = parseShapeNode(node, position, bounds, scaleX, scaleY);
    return shape ? [shape] : [];
  }

  return [];
}

/* ===================================================== */
/* ================= TEXT PARSER ======================= */
/* ===================================================== */

function parseTextNode(
  node: FigmaNode,
  position: { x: number; y: number },
  scale: number
): TextElement {
  const style = node.style || {};
  const fill = node.fills?.[0];
  const bounds = node.absoluteBoundingBox;

  return {
    id: uuidv4(),
    type: 'text',
    content: node.characters?.trim() || 'Text',
    position,
    rotation: 0,
    opacity: 1,
    locked: false,
    fontSize: Math.max(12, (style.fontSize || 24) * scale),
    fontFamily: style.fontFamily || 'Inter',
    fontWeight: style.fontWeight > 600 ? 'bold' : 'normal',
    fontStyle: style.italic ? 'italic' : 'normal',
    fill: rgbaToColor(fill?.color),
    align:
      (style.textAlignHorizontal?.toLowerCase() as
        | 'left'
        | 'center'
        | 'right') || 'left',
    width: Math.max(50, (bounds?.width || 200) * scale),
  };
}

/* ===================================================== */
/* ================= SHAPE PARSER ====================== */
/* ===================================================== */

function parseShapeNode(
  node: FigmaNode,
  position: { x: number; y: number },
  bounds: any,
  scaleX: number,
  scaleY: number
): ShapeElement | null {
  const fill = node.fills?.[0];
  const stroke = node.strokes?.[0];

  let shapeType: ShapeElement['shapeType'] = 'rectangle';

  if (node.type === 'ELLIPSE') {
    shapeType = 'circle';
  } else if (node.cornerRadius && node.cornerRadius > 0) {
    shapeType = 'rounded-rect';
  }

  return {
    id: uuidv4(),
    type: 'shape',
    shapeType,
    position,
    rotation: 0,
    opacity: fill?.opacity ?? 1,
    locked: false,
    size: {
      width: bounds.width * scaleX,
      height: bounds.height * scaleY,
    },
    fill: rgbaToColor(fill?.color),
    stroke: rgbaToColor(stroke?.color) || 'transparent',
    strokeWidth: (node.strokeWeight || 0) * scaleX,
    cornerRadius: (node.cornerRadius || 0) * scaleX,
  };
}

/* ===================================================== */
/* ================= BACKGROUND ======================== */
/* ===================================================== */

function extractBackgroundColor(frame: FigmaNode): string {
  const fill = frame.fills?.[0];

  if (!fill) return '#FFFFFF';

  if (fill.type === 'SOLID') {
    return rgbaToColor(fill.color);
  }

  return '#FFFFFF';
}

/* ===================================================== */
/* ================= COLOR UTILS ======================= */
/* ===================================================== */

function rgbaToColor(color: any): string {
  if (!color) return '#000000';

  const r = Math.round((color.r || 0) * 255);
  const g = Math.round((color.g || 0) * 255);
  const b = Math.round((color.b || 0) * 255);

  if (color.a !== undefined && color.a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  }

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
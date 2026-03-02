'use client';

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Text, Image, Circle, Group, Transformer, Line } from 'react-konva';
import GridLayer from './GridLayer';
import { v4 as uuidv4 } from 'uuid';
import {
    Screenshot,
    EditorElement,
    TextElement,
    ImageElement,
    ShapeElement,
    PenElement,
    SCREENSHOT_WIDTH,
    SCREENSHOT_HEIGHT,
    CANVAS_SCALE
} from '@/types/editor';
import Konva from 'konva';

interface EditorCanvasProps {
    screenshots: Screenshot[];
    activeScreenshotIndex: number;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (screenshotId: string, elementId: string, updates: Partial<EditorElement>) => void;
    isPenMode?: boolean;
    isEraserMode?: boolean;
    penColor?: string;
    penWeight?: number;
    onAddPenElement?: (element: PenElement) => void;
    onRemoveElement?: (elementId: string) => void;
    zoom?: number;
    isPreviewMode?: boolean;
}

export interface EditorCanvasRef {
    exportImage: (screenshotIndex: number, format?: 'png' | 'jpg', quality?: number) => string | null;
    exportAllImages: (format?: 'png' | 'jpg', quality?: number) => Array<{ index: number; dataUri: string }>;
}

// Text Element with advanced resizing and editing
function TextCanvasElement({
    element,
    isSelected,
    onSelect,
    onUpdate,
}: {
    element: TextElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<TextElement>) => void;
}) {
    const textRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isSelected && trRef.current && textRef.current && !isEditing) {
            trRef.current.nodes([textRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected, isEditing]);

    // Update alignment when it changes
    useEffect(() => {
        if (textRef.current) {
            textRef.current.align(element.align);
            textRef.current.getLayer()?.batchDraw();
        }
    }, [element.align]);

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        onUpdate({
            position: { x: e.target.x(), y: e.target.y() }
        });
    };

    const handleTransformEnd = () => {
        const node = textRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale and apply to width/fontSize
        node.scaleX(1);
        node.scaleY(1);

        const newWidth = Math.max(50, node.width() * scaleX);
        const newFontSize = Math.max(12, Math.round(element.fontSize * scaleY));

        onUpdate({
            position: { x: node.x(), y: node.y() },
            width: newWidth,
            fontSize: newFontSize,
        });
    };

    const openEditor = useCallback((cursorIndex: number, lineIndexForScroll = 0) => {
        const textNode = textRef.current;
        if (!textNode) return;

        setIsEditing(true);
        if (trRef.current) trRef.current.nodes([]);

        const stage = textNode.getStage();
        if (!stage) return;

        const stageContainer = stage.container();
        const textPosition = textNode.getAbsolutePosition();
        const stageBox = stageContainer.getBoundingClientRect();
        const stageScale = stage.scaleX();
        const stageX = stage.x();
        const stageY = stage.y();

        const screenX = stageBox.left + stageX + textPosition.x * stageScale;
        const screenY = stageBox.top + stageY + textPosition.y * stageScale;
        const textW = textNode.width() * textNode.scaleX();
        const textH = textNode.height() * textNode.scaleY();
        const screenW = (textW + 20) * stageScale;
        const screenH = Math.min((textH + 20) * stageScale, 450);

        const textarea = document.createElement('textarea');
        stageContainer.appendChild(textarea);

        textarea.value = element.content;
        textarea.style.position = 'fixed';
        textarea.style.left = `${screenX}px`;
        textarea.style.top = `${screenY}px`;
        textarea.style.width = `${screenW}px`;
        textarea.style.height = `${screenH}px`;
        textarea.style.maxHeight = '80vh';
        textarea.style.fontSize = `${element.fontSize * CANVAS_SCALE * stageScale}px`;
        textarea.style.fontFamily = element.fontFamily;
        textarea.style.fontWeight = element.fontWeight;
        textarea.style.border = '2px solid #3B82F6';
        textarea.style.borderRadius = '6px';
        textarea.style.padding = '8px 10px';
        textarea.style.margin = '0';
        textarea.style.overflow = 'auto';
        textarea.style.background = 'rgba(255,255,255,0.98)';
        textarea.style.color = '#000';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = '1.25';
        textarea.style.zIndex = '10000';
        textarea.style.boxSizing = 'border-box';

        textarea.focus();
        const safeIndex = Math.min(element.content.length, Math.max(0, cursorIndex));
        textarea.setSelectionRange(safeIndex, safeIndex);
        const lineHeightPx = element.fontSize * CANVAS_SCALE * stageScale * 1.25;
        textarea.scrollTop = Math.max(0, (lineIndexForScroll - 2) * lineHeightPx);

        // const removeTextarea = () => { (old code)
        //     if (textarea.parentNode) {
        //         textarea.parentNode.removeChild(textarea);
        //     }
        //     setIsEditing(false);

        //     // Re-attach transformer
        //     if (trRef.current && textRef.current) {
        //         trRef.current.nodes([textRef.current]);
        //         trRef.current.getLayer()?.batchDraw();
        //     }
        // };

        const removeTextarea = () => {
    textarea.remove(); // Safe — does nothing if already removed

    setIsEditing(false);

    if (trRef.current && textRef.current) {
        trRef.current.nodes([textRef.current]);
        trRef.current.getLayer()?.batchDraw();
    }
};

        const handleOutsideClick = (e: MouseEvent) => {
            if (e.target !== textarea) {
                onUpdate({ content: textarea.value });
                removeTextarea();
                window.removeEventListener('click', handleOutsideClick);
            }
        };

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onUpdate({ content: textarea.value });
                removeTextarea();
                window.removeEventListener('click', handleOutsideClick);
            }
            if (e.key === 'Escape') {
                removeTextarea();
                window.removeEventListener('click', handleOutsideClick);
            }
        });

        textarea.addEventListener('blur', () => {
            onUpdate({ content: textarea.value });
            removeTextarea();
            window.removeEventListener('click', handleOutsideClick);
        });

        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        }, 150);
    }, [element.content, element.fontSize, element.fontFamily, element.fontWeight, element.width, onUpdate]);

    const handleDoubleClick = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const relPos = (e.target as Konva.Text).getRelativePointerPosition();
        const localX = relPos ? relPos.x : 0;
        const localY = relPos ? relPos.y : 0;
        const lineHeight = element.fontSize * 1.2;
        const approxCharWidth = Math.max(8, element.fontSize * 0.5);
        const charsPerLine = Math.max(1, Math.floor(element.width / approxCharWidth));
        const lineIndex = Math.max(0, Math.floor(localY / lineHeight));
        const colIndex = Math.max(0, Math.floor(localX / approxCharWidth));
        const estimatedCursorIndex = Math.min(
            element.content.length,
            Math.max(0, lineIndex * charsPerLine + colIndex)
        );
        openEditor(estimatedCursorIndex, lineIndex);
    }, [element.content.length, element.fontSize, element.width, openEditor]);

    const handleClick = useCallback(() => {
        onSelect();
        openEditor(0);
    }, [onSelect, openEditor]);

    return (
        <>
            <Text
                ref={textRef}
                x={element.position.x}
                y={element.position.y}
                text={element.content}
                fontSize={element.fontSize}
                fontFamily={element.fontFamily}
                fontStyle={`${element.fontWeight === 'bold' ? 'bold ' : ''}${element.fontStyle === 'italic' ? 'italic' : ''}`}
                fill={element.fill}
                width={element.width}
                align={element.align}
                wrap="word"
                listening={true}
                hitStrokeWidth={8}
                draggable={!element.locked && !isEditing}
                onClick={handleClick}
                onTap={handleClick}
                onDblClick={handleDoubleClick}
                onDblTap={handleDoubleClick}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                opacity={element.opacity}
                visible={!isEditing}
            />
            {isSelected && !isEditing && (
                <Transformer
                    ref={trRef}
                    enabledAnchors={[
                        'top-left', 'top-right',
                        'bottom-left', 'bottom-right',
                        'middle-left', 'middle-right'
                    ]}
                    rotateEnabled={true}
                    borderStroke="#3B82F6"
                    borderStrokeWidth={2}
                    anchorFill="#fff"
                    anchorStroke="#3B82F6"
                    anchorSize={10}
                    anchorCornerRadius={2}
                    boundBoxFunc={(oldBox, newBox) => {
                        // Limit minimum size
                        if (newBox.width < 30 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}

// Background Image Element (full frame)
function BackgroundImageElement({
    x,
    y,
    width,
    height,
    imageUrl,
    isActive,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    imageUrl: string;
    isActive: boolean;
}) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (img.width > 0 && img.height > 0) {
                setImage(img);
            }
        };
        img.onerror = () => {
            console.error('Failed to load background image:', imageUrl);
            setImage(null);
        };
        img.src = imageUrl;
    }, [imageUrl]);

    if (!image) {
        // Show placeholder while loading
        return (
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#333333"
                cornerRadius={8}
            />
        );
    }



    return (
        <Image
            x={x}
            y={y}
            image={image}
            width={width}
            height={height}
            cornerRadius={8}
        />
    );
}

// // Image Element with proper resizing  (original code)
function ImageCanvasElement({
    element,
    isSelected,
    onSelect,
    onUpdate,
}: {
    element: ImageElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<ImageElement>) => void;
}) {
    const imageRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.onload = () => {
            // Only set image if it has valid dimensions
            if (img.width > 0 && img.height > 0) {
                setImage(img);
            }
        };
        img.onerror = () => {
            console.error('Failed to load image:', element.src);
            setImage(null);
        };
        img.src = element.src;
    }, [element.src]);

    useEffect(() => {
        if (isSelected && trRef.current && imageRef.current) {
            trRef.current.nodes([imageRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        onUpdate({
            position: { x: e.target.x(), y: e.target.y() }
        });
    };

    const handleTransformEnd = () => {
        const node = imageRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        const newWidth = Math.max(20, node.width() * scaleX);
        const newHeight = Math.max(20, node.height() * scaleY);

        // Ensure dimensions are valid
        if (newWidth > 0 && newHeight > 0) {
            onUpdate({
                position: { x: node.x(), y: node.y() },
                size: {
                    width: newWidth,
                    height: newHeight,
                },
            });
        }
    };

    // Don't render if image is not loaded or has invalid dimensions
    if (!image || image.width === 0 || image.height === 0) {
        return null;
    }

    // Ensure element size is valid
    const validWidth = Math.max(1, element.size.width);
    const validHeight = Math.max(1, element.size.height);

    return (
        <>
            <Image
                ref={imageRef}
                x={element.position.x}
                y={element.position.y}
                image={image}
                width={validWidth}
                height={validHeight}
                draggable={!element.locked}
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                opacity={element.opacity}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    borderStroke="#3B82F6"
                    borderStrokeWidth={2}
                    anchorFill="#fff"
                    anchorStroke="#3B82F6"
                    anchorSize={10}
                    anchorCornerRadius={2}
                    keepRatio={true}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}



// Shape Element with proper resizing
function ShapeCanvasElement({
    element,
    isSelected,
    onSelect,
    onUpdate,
}: {
    element: ShapeElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<ShapeElement>) => void;
}) {
    const shapeRef = useRef<Konva.Shape | Konva.Group | Konva.Rect | Konva.Circle>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        onUpdate({
            position: { x: e.target.x(), y: e.target.y() }
        });
    };

    const handleTransformEnd = () => {
        const node = shapeRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        if (element.shapeType === 'circle') {
            const newRadius = Math.max(10, (element.size.width / 2) * scaleX);
            onUpdate({
                position: { x: node.x() - newRadius, y: node.y() - newRadius },
                size: { width: newRadius * 2, height: newRadius * 2 },
            });
        } else if (node instanceof Konva.Group) {
            // Handle Group-based shapes (triangle, diamond, pentagon)
            const newWidth = Math.max(20, element.size.width * scaleX);
            const newHeight = Math.max(20, element.size.height * scaleY);
            onUpdate({
                position: { x: node.x(), y: node.y() },
                size: { width: newWidth, height: newHeight },
            });
        } else {
            // Handle Rect-based shapes (rectangle, rounded-rect)
            onUpdate({
                position: { x: node.x(), y: node.y() },
                size: {
                    width: Math.max(20, node.width() * scaleX),
                    height: Math.max(20, node.height() * scaleY),
                },
            });
        }
    };

    // Helper function to render custom shapes using Line
    const renderCustomShape = (points: number[], closed: boolean = true) => {
        return (
            <Group
                ref={shapeRef as any}
                x={element.position.x}
                y={element.position.y}
                draggable={!element.locked}
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                opacity={element.opacity}
            >
                <Line
                    points={points}
                    closed={closed}
                    fill={element.fill}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                />
            </Group>
        );
    };

    // Calculate shape points based on type
    const getShapePoints = () => {
        const { width, height } = element.size;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;

        switch (element.shapeType) {
            case 'triangle-up':
                return [0, height, centerX, 0, width, height];

            case 'triangle-down':
                return [0, 0, centerX, height, width, 0];

            case 'diamond':
                return [centerX, 0, width, centerY, centerX, height, 0, centerY];

            case 'pentagon':
                const pentagonPoints: number[] = [];
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    pentagonPoints.push(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
                }
                return pentagonPoints;

            case 'hexagon':
                const hexPoints: number[] = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 2 * Math.PI) / 6 - Math.PI / 6;
                    hexPoints.push(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
                }
                return hexPoints;

            case 'octagon':
                const octPoints: number[] = [];
                for (let i = 0; i < 8; i++) {
                    const angle = (i * 2 * Math.PI) / 8 - Math.PI / 8;
                    octPoints.push(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
                }
                return octPoints;

            case 'star-5':
                const star5Points: number[] = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2;
                    const r = i % 2 === 0 ? radius : radius * 0.4;
                    star5Points.push(centerX + r * Math.cos(angle), centerY + r * Math.sin(angle));
                }
                return star5Points;

            case 'star-10':
                const star10Points: number[] = [];
                for (let i = 0; i < 20; i++) {
                    const angle = (i * Math.PI) / 10 - Math.PI / 2;
                    const r = i % 2 === 0 ? radius : radius * 0.4;
                    star10Points.push(centerX + r * Math.cos(angle), centerY + r * Math.sin(angle));
                }
                return star10Points;

            case 'star-12':
                const star12Points: number[] = [];
                for (let i = 0; i < 24; i++) {
                    const angle = (i * Math.PI) / 12 - Math.PI / 2;
                    const r = i % 2 === 0 ? radius : radius * 0.4;
                    star12Points.push(centerX + r * Math.cos(angle), centerY + r * Math.sin(angle));
                }
                return star12Points;

            case 'arrow-right':
                return [
                    0, centerY,
                    width * 0.7, 0,
                    width * 0.7, height * 0.3,
                    width, centerY,
                    width * 0.7, height * 0.7,
                    width * 0.7, height
                ];

            case 'arrow-left':
                return [
                    width, centerY,
                    width * 0.3, 0,
                    width * 0.3, height * 0.3,
                    0, centerY,
                    width * 0.3, height * 0.7,
                    width * 0.3, height
                ];

            case 'arrow-flag':
                return [
                    0, 0,
                    width * 0.8, 0,
                    width * 0.8, height * 0.3,
                    width, centerY,
                    width * 0.8, height * 0.7,
                    width * 0.8, height,
                    0, height
                ];

            case 'banner':
                const notchSize = Math.min(width, height) * 0.15;
                return [
                    notchSize, 0,
                    width - notchSize, 0,
                    width, centerY,
                    width - notchSize, height,
                    notchSize, height,
                    0, centerY
                ];

            case 'speech-bubble-rect':
                const bubbleWidth = width * 0.8;
                const bubbleHeight = height * 0.8;
                const tailSize = Math.min(width, height) * 0.2;
                return [
                    0, 0,
                    bubbleWidth, 0,
                    bubbleWidth, bubbleHeight,
                    bubbleWidth * 0.6, bubbleHeight,
                    bubbleWidth * 0.5, height,
                    bubbleWidth * 0.4, bubbleHeight,
                    0, bubbleHeight
                ];

            case 'speech-bubble-oval':
                const ovalW = width * 0.8;
                const ovalH = height * 0.8;
                const tail = Math.min(width, height) * 0.2;
                const ovalPoints: number[] = [];
                // Create oval shape
                for (let i = 0; i < 16; i++) {
                    const angle = (i * 2 * Math.PI) / 16;
                    const x = ovalW / 2 + (ovalW / 2) * Math.cos(angle);
                    const y = ovalH / 2 + (ovalH / 2) * Math.sin(angle);
                    ovalPoints.push(x, y);
                }
                // Add tail
                ovalPoints.push(ovalW * 0.5, ovalH);
                ovalPoints.push(ovalW * 0.4, height);
                ovalPoints.push(ovalW * 0.3, ovalH);
                return ovalPoints;

            case 'heart':
                const heartPoints: number[] = [];
                for (let i = 0; i < 20; i++) {
                    const t = (i / 19) * 2 * Math.PI;
                    const x = centerX + 16 * Math.pow(Math.sin(t), 3);
                    const y = centerY - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    heartPoints.push(x, y);
                }
                return heartPoints;

            case 'parallelogram':
                const skew = width * 0.2;
                return [
                    0, 0,
                    width - skew, 0,
                    width, height,
                    skew, height
                ];

            case 'trapezoid-up':
                const topWidth = width * 0.7;
                return [
                    (width - topWidth) / 2, 0,
                    (width + topWidth) / 2, 0,
                    width, height,
                    0, height
                ];

            case 'trapezoid-down':
                const bottomWidth = width * 0.7;
                return [
                    0, 0,
                    width, 0,
                    (width + bottomWidth) / 2, height,
                    (width - bottomWidth) / 2, height
                ];

            case 'rounded-bottom':
                const rbRadius = Math.min(width, height) * 0.3;
                const rbPoints: number[] = [];
                // Top straight line
                rbPoints.push(0, 0, width, 0);
                // Rounded bottom
                for (let i = 0; i <= 8; i++) {
                    const angle = (i / 8) * Math.PI;
                    rbPoints.push(width - rbRadius + rbRadius * Math.cos(angle), height - rbRadius + rbRadius * Math.sin(angle));
                }
                for (let i = 8; i >= 0; i--) {
                    const angle = (i / 8) * Math.PI;
                    rbPoints.push(rbRadius - rbRadius * Math.cos(angle), height - rbRadius + rbRadius * Math.sin(angle));
                }
                return rbPoints;

            case 'rounded-top':
                const rtRadius = Math.min(width, height) * 0.3;
                const rtPoints: number[] = [];
                // Rounded top
                for (let i = 0; i <= 8; i++) {
                    const angle = Math.PI + (i / 8) * Math.PI;
                    rtPoints.push(rtRadius - rtRadius * Math.cos(angle), rtRadius - rtRadius * Math.sin(angle));
                }
                for (let i = 8; i >= 0; i--) {
                    const angle = Math.PI + (i / 8) * Math.PI;
                    rtPoints.push(width - rtRadius + rtRadius * Math.cos(angle), rtRadius - rtRadius * Math.sin(angle));
                }
                // Bottom straight line
                rtPoints.push(width, height, 0, height);
                return rtPoints;

            case 'pill-vertical':
                const pillRadius = Math.min(width, height) / 2;
                const pillPoints: number[] = [];
                // Top rounded
                for (let i = 0; i <= 8; i++) {
                    const angle = Math.PI + (i / 8) * Math.PI;
                    pillPoints.push(centerX + pillRadius * Math.cos(angle), pillRadius + pillRadius * Math.sin(angle));
                }
                // Bottom rounded
                for (let i = 0; i <= 8; i++) {
                    const angle = (i / 8) * Math.PI;
                    pillPoints.push(centerX + pillRadius * Math.cos(angle), height - pillRadius + pillRadius * Math.sin(angle));
                }
                return pillPoints;

            default:
                return [];
        }
    };

    if (element.shapeType === 'circle') {
        return (
            <>
                <Circle
                    ref={shapeRef as React.RefObject<Konva.Circle>}
                    x={element.position.x + element.size.width / 2}
                    y={element.position.y + element.size.height / 2}
                    radius={element.size.width / 2}
                    fill={element.fill}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                    draggable={!element.locked}
                    onClick={onSelect}
                    onTap={onSelect}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                    opacity={element.opacity}
                />
                {isSelected && (
                    <Transformer
                        ref={trRef}
                        rotateEnabled={true}
                        borderStroke="#3B82F6"
                        borderStrokeWidth={2}
                        anchorFill="#fff"
                        anchorStroke="#3B82F6"
                        anchorSize={10}
                        anchorCornerRadius={2}
                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                        keepRatio={true}
                    />
                )}
            </>
        );
    }

    // Render custom shapes (all non-rect/circle shapes)
    const customShapes = ['triangle-up', 'triangle-down', 'diamond', 'pentagon', 'hexagon', 'octagon',
        'star-5', 'star-10', 'star-12', 'arrow-right', 'arrow-left', 'arrow-flag', 'banner',
        'speech-bubble-rect', 'speech-bubble-oval', 'heart', 'parallelogram',
        'trapezoid-up', 'trapezoid-down', 'rounded-bottom', 'rounded-top', 'pill-vertical'];

    if (customShapes.includes(element.shapeType)) {
        const points = getShapePoints();
        return (
            <>
                {renderCustomShape(points)}
                {isSelected && (
                    <Transformer
                        ref={trRef}
                        rotateEnabled={true}
                        borderStroke="#3B82F6"
                        borderStrokeWidth={2}
                        anchorFill="#fff"
                        anchorStroke="#3B82F6"
                        anchorSize={10}
                        anchorCornerRadius={2}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 20 || newBox.height < 20) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                )}
            </>
        );
    }

    // Render rectangle and rounded-rect
    return (
        <>
            <Rect
                ref={shapeRef as React.RefObject<Konva.Rect>}
                x={element.position.x}
                y={element.position.y}
                width={element.size.width}
                height={element.size.height}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                cornerRadius={element.cornerRadius || 0}
                draggable={!element.locked}
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                opacity={element.opacity}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    borderStroke="#3B82F6"
                    borderStrokeWidth={2}
                    anchorFill="#fff"
                    anchorStroke="#3B82F6"
                    anchorSize={10}
                    anchorCornerRadius={2}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}

// Main Canvas Element dispatcher
function CanvasElement({
    element,
    isSelected,
    onSelect,
    onUpdate,
}: {
    element: EditorElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<EditorElement>) => void;
}) {
    if (element.type === 'text') {
        return (
            <TextCanvasElement
                element={element as TextElement}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate as (updates: Partial<TextElement>) => void}
            />
        );
    }

    if (element.type === 'image') {
        return (
            <ImageCanvasElement
                element={element as ImageElement}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate as (updates: Partial<ImageElement>) => void}
            />
        );
    }

    if (element.type === 'shape') {
        return (
            <ShapeCanvasElement
                element={element as ShapeElement}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate as (updates: Partial<ShapeElement>) => void}
            />
        );
    }

    if (element.type === 'pen') {
        return (
            <PenCanvasElement
                element={element as PenElement}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate as (updates: Partial<PenElement>) => void}
            />
        );
    }

    return null;
}

// Pen Element renderer
function PenCanvasElement({
    element,
    isSelected,
    onSelect,
    onUpdate,
}: {
    element: PenElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<PenElement>) => void;
}) {
    const lineRef = useRef<Konva.Line>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && trRef.current && lineRef.current) {
            trRef.current.nodes([lineRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Line
                ref={lineRef}
                points={element.points}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                tension={element.tension || 0.5}
                lineCap={element.lineCap || 'round'}
                lineJoin={element.lineJoin || 'round'}
                draggable={!element.locked}
                onClick={onSelect}
                onTap={onSelect}
                opacity={element.opacity}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    borderStroke="#3B82F6"
                    borderStrokeWidth={2}
                    anchorFill="#fff"
                    anchorStroke="#3B82F6"
                    anchorSize={10}
                    anchorCornerRadius={2}
                />
            )}
        </>
    );
}

export default forwardRef<EditorCanvasRef, EditorCanvasProps>(function EditorCanvas({
    screenshots,
    activeScreenshotIndex,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    isPenMode = false,
    isEraserMode = false,
    penColor = '#000000',
    penWeight = 5,
    onAddPenElement,
    onRemoveElement,
    zoom = 1,
    isPreviewMode = false,
}: EditorCanvasProps, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPoints, setCurrentPoints] = useState<number[]>([]);
    const currentPenElementRef = useRef<string | null>(null);

    // Calculate stage dimensions (ResizeObserver so we get size after layout)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateSize = () => {
            const { width, height } = el.getBoundingClientRect();
            if (width > 0 && height > 0) {
                setStageSize({ width, height });
            }
        };

        updateSize();
        const ro = new ResizeObserver(() => {
            updateSize();
        });
        ro.observe(el);
        window.addEventListener('resize', updateSize);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateSize);
        };
    }, []);

    // Calculate total content dimensions
    const scaledWidth = SCREENSHOT_WIDTH * CANVAS_SCALE;
    const scaledHeight = SCREENSHOT_HEIGHT * CANVAS_SCALE;
    const gap = 20;

    // Zoom-based centering offsets
    const totalWidth = screenshots.length * scaledWidth + (screenshots.length - 1) * gap;
    const stageX = (stageSize.width - totalWidth * zoom) / 2;
    const stageY = (stageSize.height - scaledHeight * zoom) / 2;

    // Expose export function
    useImperativeHandle(ref, () => ({
        exportImage: (screenshotIndex: number, format: 'png' | 'jpg' = 'png', quality: number = 1.0) => {
            if (!stageRef.current) return null;

            const stage = stageRef.current;
            // Find the group for the specific screenshot
            const group = stage.findOne(`#screenshot-group-${screenshotIndex}`);

            if (!group) return null;

            // Export just that group
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
            return group.toDataURL({
                pixelRatio: 2 / CANVAS_SCALE, // High res export
                mimeType,
                quality: format === 'jpg' ? quality : undefined,
            });
        },
        exportAllImages: (format: 'png' | 'jpg' = 'png', quality: number = 1.0) => {
            if (!stageRef.current) return [];

            const stage = stageRef.current;
            const results: Array<{ index: number; dataUri: string }> = [];

            screenshots.forEach((_, index) => {
                const group = stage.findOne(`#screenshot-group-${index}`);
                if (group) {
                    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
                    const dataUri = group.toDataURL({
                        pixelRatio: 2 / CANVAS_SCALE,
                        mimeType,
                        quality: format === 'jpg' ? quality : undefined,
                    });
                    results.push({ index, dataUri });
                }
            });

            return results;
        }
    }));

    // Helper to get logical position from pointer event
    const getLogicalPosition = (stage: Konva.Stage) => {
        const transform = stage.getAbsoluteTransform().copy();
        transform.invert();
        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return null;
        return transform.point(pointerPos);
    };

    // Eraser handler - find and remove elements under cursor
    const handleEraser = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isEraserMode || !onRemoveElement) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const activeScreenshot = screenshots[activeScreenshotIndex];
        const pos = getLogicalPosition(stage);
        if (!pos) return;

        // Find elements that intersect with eraser area
        const eraserRadius = penWeight / CANVAS_SCALE;

        // Calculate offset for active screenshot within the logical space
        const screenshotOffset = activeScreenshotIndex * (scaledWidth + gap);

        // Coordinates relative to the active screenshot (unscaled)
        const relativeX = (pos.x - screenshotOffset) / CANVAS_SCALE;
        const relativeY = pos.y / CANVAS_SCALE;

        // Check bounds
        if (relativeX < 0 || relativeX > SCREENSHOT_WIDTH || relativeY < 0 || relativeY > SCREENSHOT_HEIGHT) {
            return;
        }

        // Find elements that intersect with eraser
        activeScreenshot.elements.forEach((element) => {
            if (element.type === 'pen') {
                const penElement = element as PenElement;
                // Check if any point in pen stroke is within eraser radius
                for (let i = 0; i < penElement.points.length; i += 2) {
                    const px = penElement.points[i];
                    const py = penElement.points[i + 1];
                    const distance = Math.sqrt(Math.pow(px - relativeX, 2) + Math.pow(py - relativeY, 2));
                    if (distance < eraserRadius) {
                        onRemoveElement(element.id);
                        return;
                    }
                }
            } else {
                // For other elements, check if cursor is within bounds
                const elemX = element.position.x;
                const elemY = element.position.y;
                let elemWidth = 0;
                let elemHeight = 0;

                if (element.type === 'text') {
                    elemWidth = (element as TextElement).width;
                    elemHeight = (element as TextElement).fontSize * 1.2;
                } else if (element.type === 'image') {
                    elemWidth = (element as ImageElement).size.width;
                    elemHeight = (element as ImageElement).size.height;
                } else if (element.type === 'shape') {
                    elemWidth = (element as ShapeElement).size.width;
                    elemHeight = (element as ShapeElement).size.height;
                }

                if (relativeX >= elemX && relativeX <= elemX + elemWidth &&
                    relativeY >= elemY && relativeY <= elemY + elemHeight) {
                    onRemoveElement(element.id);
                }
            }
        });
    };

    // Drawing handlers
    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isEraserMode) {
            handleEraser(e);
            return;
        }

        if (!isPenMode || !onAddPenElement) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const activeScreenshot = screenshots[activeScreenshotIndex];
        const pos = getLogicalPosition(stage);
        if (!pos) return;

        const screenshotOffset = activeScreenshotIndex * (scaledWidth + gap);
        const relativeX = (pos.x - screenshotOffset) / CANVAS_SCALE;
        const relativeY = pos.y / CANVAS_SCALE;

        // Check click is within bounds
        if (relativeX < 0 || relativeX > SCREENSHOT_WIDTH || relativeY < 0 || relativeY > SCREENSHOT_HEIGHT) {
            return;
        }

        setIsDrawing(true);
        const initialPoints = [relativeX, relativeY];
        setCurrentPoints(initialPoints);

        // Create new pen element
        const penElement: PenElement = {
            id: uuidv4(),
            type: 'pen',
            position: { x: 0, y: 0 },
            rotation: 0,
            opacity: 1,
            locked: false,
            points: initialPoints,
            stroke: penColor,
            strokeWidth: penWeight,
            tension: 0.5,
            lineCap: 'round',
            lineJoin: 'round',
        };

        currentPenElementRef.current = penElement.id;
        onAddPenElement(penElement);
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isEraserMode && e.evt.buttons === 1) {
            handleEraser(e);
            return;
        }

        if (!isPenMode || !isDrawing || !onAddPenElement) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const activeScreenshot = screenshots[activeScreenshotIndex];
        const pos = getLogicalPosition(stage);
        if (!pos) return;

        const screenshotOffset = activeScreenshotIndex * (scaledWidth + gap);
        const relativeX = (pos.x - screenshotOffset) / CANVAS_SCALE;
        const relativeY = pos.y / CANVAS_SCALE;

        // Check bounds
        if (relativeX < 0 || relativeX > SCREENSHOT_WIDTH || relativeY < 0 || relativeY > SCREENSHOT_HEIGHT) {
            return;
        }

        const newPoints = [...currentPoints, relativeX, relativeY];
        setCurrentPoints(newPoints);

        // Update the pen element
        if (currentPenElementRef.current) {
            onUpdateElement(
                activeScreenshot.id,
                currentPenElementRef.current,
                { points: newPoints }
            );
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            currentPenElementRef.current = null;
            setCurrentPoints([]);
        }
    };

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // If clicking on empty area, deselect (only if not in pen mode)
        if (!isPenMode && e.target === e.target.getStage()) {
            onSelectElement(null);
        }
    };

    // Don't render Stage until we have valid dimensions
    const hasSize = stageSize.width > 0 && stageSize.height > 0;

    return (
        <div ref={containerRef} className="canvas-container relative w-full h-full bg-[#1e1e1e] overflow-hidden flex items-center justify-center" style={{ minHeight: 0 }}>
            {!hasSize ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
                    Loading canvas...
                </div>
            ) : (
            <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                scale={{ x: zoom, y: zoom }}
                x={stageX}
                y={stageY}
                onMouseDown={handleStageMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleStageClick}
                style={{
                    cursor: isPenMode ? 'crosshair' : isEraserMode ? 'grab' : 'default'
                }}
            >
                {!isPreviewMode && <GridLayer width={stageSize.width} height={stageSize.height} scale={zoom} />}

                <Layer>
                    {screenshots.map((screenshot, index) => {
                        const x = index * (scaledWidth + gap);
                        const isActive = index === activeScreenshotIndex;

                        return (
                            <Group
                                key={screenshot.id}
                                id={`screenshot-group-${index}`}
                            >
                                {/* Screenshot background */}
                                {(() => {
                                    const bgColor = screenshot.backgroundColor;
                                    
                                    // Check if it's a gradient
                                    if (bgColor.includes('gradient')) {
                                        
                                        // Parse gradient string
                                        const gradientMatch = bgColor.match(/linear-gradient\(to (right|bottom|bottom right|top right), (#[0-9A-Fa-f]{6}), (#[0-9A-Fa-f]{6})\)|radial-gradient\(circle, (#[0-9A-Fa-f]{6}), (#[0-9A-Fa-f]{6})\)/);
                                        if (gradientMatch) {
                                            let color1, color2, direction;
                                            if (bgColor.includes('radial')) {
                                                color1 = gradientMatch[4];
                                                color2 = gradientMatch[5];
                                                direction = 'radial';
                                            } else {
                                                color1 = gradientMatch[2];
                                                color2 = gradientMatch[3];
                                                direction = gradientMatch[1];
                                            }

                                            // Convert to Konva gradient
                                            let startPoint = { x: 0, y: 0 };
                                            let endPoint = { x: scaledWidth, y: 0 };

                                            if (direction === 'radial') {
                                                return (
                                                    <Rect
                                                        x={x}
                                                        y={0}
                                                        width={scaledWidth}
                                                        height={scaledHeight}
                                                        fillRadialGradientStartPoint={{ x: scaledWidth / 2, y: scaledHeight / 2 }}
                                                        fillRadialGradientStartRadius={0}
                                                        fillRadialGradientEndPoint={{ x: scaledWidth / 2, y: scaledHeight / 2 }}
                                                        fillRadialGradientEndRadius={Math.max(scaledWidth, scaledHeight) / 2}
                                                        fillRadialGradientColorStops={[0, color1, 1, color2]}
                                                        cornerRadius={8}
                                                        stroke={isActive ? '#3B82F6' : 'transparent'}
                                                        strokeWidth={isActive ? 3 : 0}
                                                    />
                                                );
                                            } else {
                                                if (direction === 'bottom') {
                                                    endPoint = { x: 0, y: scaledHeight };
                                                } else if (direction === 'bottom right') {
                                                    endPoint = { x: scaledWidth, y: scaledHeight };
                                                } else if (direction === 'top right') {
                                                    endPoint = { x: scaledWidth, y: 0 };
                                                }

                                                return (
                                                    <Rect
                                                        x={x}
                                                        y={0}
                                                        width={scaledWidth}
                                                        height={scaledHeight}
                                                        fillLinearGradientStartPoint={startPoint}
                                                        fillLinearGradientEndPoint={endPoint}
                                                        fillLinearGradientColorStops={[0, color1, 1, color2]}
                                                        cornerRadius={8}
                                                        stroke={isActive ? '#3B82F6' : 'transparent'}
                                                        strokeWidth={isActive ? 3 : 0}
                                                    />
                                                );
                                            }
                                        }
                                    }

                                    // Solid color fallback
                                    return (
                                        <Rect
                                            x={x}
                                            y={0}
                                            width={scaledWidth}
                                            height={scaledHeight}
                                            fill={bgColor}
                                            cornerRadius={8}
                                            stroke={isActive ? '#3B82F6' : 'transparent'}
                                            strokeWidth={isActive ? 3 : 0}
                                        />
                                    );
                                })()}

                                {/* Elements scaled and positioned within screenshot */}
                                <Group
                                    x={x}
                                    y={0}
                                    scaleX={CANVAS_SCALE}
                                    scaleY={CANVAS_SCALE}
                                    clipX={0}
                                    clipY={0}
                                    clipWidth={SCREENSHOT_WIDTH}
                                    clipHeight={SCREENSHOT_HEIGHT}
                                >
                                    {/* Background image (full frame, rendered first) */}
                                    {screenshot.backgroundImage && (
                                        <BackgroundImageElement
                                            x={0}
                                            y={0}
                                            width={SCREENSHOT_WIDTH}
                                            height={SCREENSHOT_HEIGHT}
                                            imageUrl={screenshot.backgroundImage}
                                            isActive={isActive}
                                        />
                                    )}
                                    
                                    {[...screenshot.elements]
                                        .sort((a, b) => (a.type === 'text' ? 1 : 0) - (b.type === 'text' ? 1 : 0))
                                        .map(element => (
                                        <CanvasElement
                                            key={element.id}
                                            element={element}
                                            isSelected={selectedElementId === element.id && isActive}
                                            onSelect={() => onSelectElement(element.id)}
                                            onUpdate={(updates) => onUpdateElement(screenshot.id, element.id, updates)}
                                        />
                                    ))}
                                </Group>

                                {/* Screenshot number label */}
                                <Text
                                    x={x}
                                    y={scaledHeight + 10}
                                    width={scaledWidth}
                                    text={`#${index + 1}`}
                                    fontSize={14}
                                    fill="#888"
                                    align="center"
                                />

                                {/* Dimensions label */}
                                <Text
                                    x={x}
                                    y={scaledHeight + 28}
                                    width={scaledWidth}
                                    text={`${SCREENSHOT_WIDTH}px × ${SCREENSHOT_HEIGHT}px`}
                                    fontSize={11}
                                    fill="#666"
                                    align="center"
                                />
                            </Group>
                        );
                    })}
                </Layer>
            </Stage>
            )}
        </div>
    );
});


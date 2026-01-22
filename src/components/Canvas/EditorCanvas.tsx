'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Image, Circle, Group, Transformer } from 'react-konva';
import {
    Screenshot,
    EditorElement,
    TextElement,
    ImageElement,
    ShapeElement,
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

    const handleDoubleClick = () => {
        const textNode = textRef.current;
        if (!textNode) return;

        setIsEditing(true);

        // Hide transformer during editing
        if (trRef.current) {
            trRef.current.nodes([]);
        }

        // Get stage and create textarea for editing
        const stage = textNode.getStage();
        if (!stage) return;

        const stageContainer = stage.container();
        const textPosition = textNode.getAbsolutePosition();
        const stageBox = stageContainer.getBoundingClientRect();

        // Create textarea
        const textarea = document.createElement('textarea');
        stageContainer.appendChild(textarea);

        textarea.value = element.content;
        textarea.style.position = 'absolute';
        textarea.style.top = `${stageBox.top + textPosition.y}px`;
        textarea.style.left = `${stageBox.left + textPosition.x}px`;
        textarea.style.width = `${textNode.width() * textNode.scaleX() + 20}px`;
        textarea.style.height = `${textNode.height() * textNode.scaleY() + 20}px`;
        textarea.style.fontSize = `${element.fontSize * CANVAS_SCALE}px`;
        textarea.style.fontFamily = element.fontFamily;
        textarea.style.fontWeight = element.fontWeight;
        textarea.style.border = '2px solid #3B82F6';
        textarea.style.borderRadius = '4px';
        textarea.style.padding = '4px 8px';
        textarea.style.margin = '0';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'rgba(255,255,255,0.95)';
        textarea.style.color = '#000';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = '1.2';
        textarea.style.transformOrigin = 'left top';
        textarea.style.zIndex = '1000';

        textarea.focus();
        textarea.select();

        const removeTextarea = () => {
            if (textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
            }
            setIsEditing(false);

            // Re-attach transformer
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
        });

        // Delay adding click listener to prevent immediate trigger
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        }, 100);
    };

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
                draggable={!element.locked && !isEditing}
                onClick={onSelect}
                onTap={onSelect}
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

// Image Element with proper resizing
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
        img.src = element.src;
        img.onload = () => setImage(img);
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

        onUpdate({
            position: { x: node.x(), y: node.y() },
            size: {
                width: Math.max(20, node.width() * scaleX),
                height: Math.max(20, node.height() * scaleY),
            },
        });
    };

    if (!image) return null;

    return (
        <>
            <Image
                ref={imageRef}
                x={element.position.x}
                y={element.position.y}
                image={image}
                width={element.size.width}
                height={element.size.height}
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
    const shapeRef = useRef<Konva.Shape>(null);
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
        } else {
            onUpdate({
                position: { x: node.x(), y: node.y() },
                size: {
                    width: Math.max(20, node.width() * scaleX),
                    height: Math.max(20, node.height() * scaleY),
                },
            });
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

    return null;
}

export default function EditorCanvas({
    screenshots,
    activeScreenshotIndex,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
}: EditorCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

    // Calculate stage dimensions
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setStageSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const scaledWidth = SCREENSHOT_WIDTH * CANVAS_SCALE;
    const scaledHeight = SCREENSHOT_HEIGHT * CANVAS_SCALE;
    const gap = 20;

    // Calculate total content width
    const totalWidth = screenshots.length * scaledWidth + (screenshots.length - 1) * gap;

    // Center the screenshots
    const startX = Math.max(40, (stageSize.width - totalWidth) / 2);
    const startY = 40;

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // If clicking on empty area, deselect
        if (e.target === e.target.getStage()) {
            onSelectElement(null);
        }
    };

    return (
        <div ref={containerRef} className="canvas-container">
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
            >
                <Layer>
                    {screenshots.map((screenshot, index) => {
                        const x = startX + index * (scaledWidth + gap);
                        const isActive = index === activeScreenshotIndex;

                        return (
                            <Group key={screenshot.id}>
                                {/* Screenshot background */}
                                <Rect
                                    x={x}
                                    y={startY}
                                    width={scaledWidth}
                                    height={scaledHeight}
                                    fill={screenshot.backgroundColor}
                                    cornerRadius={8}
                                    shadowColor="rgba(0,0,0,0.15)"
                                    shadowBlur={10}
                                    shadowOffset={{ x: 0, y: 4 }}
                                    stroke={isActive ? '#3B82F6' : 'transparent'}
                                    strokeWidth={isActive ? 3 : 0}
                                />

                                {/* Elements scaled and positioned within screenshot */}
                                <Group
                                    x={x}
                                    y={startY}
                                    scaleX={CANVAS_SCALE}
                                    scaleY={CANVAS_SCALE}
                                    clipX={0}
                                    clipY={0}
                                    clipWidth={SCREENSHOT_WIDTH}
                                    clipHeight={SCREENSHOT_HEIGHT}
                                >
                                    {screenshot.elements.map(element => (
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
                                    y={startY + scaledHeight + 10}
                                    width={scaledWidth}
                                    text={`#${index + 1}`}
                                    fontSize={14}
                                    fill="#888"
                                    align="center"
                                />

                                {/* Dimensions label */}
                                <Text
                                    x={x}
                                    y={startY + scaledHeight + 28}
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
        </div>
    );
}

'use client';

import { v4 as uuidv4 } from 'uuid';
import { Square, Circle, RectangleHorizontal, Triangle, Diamond, Pentagon, Hexagon, Octagon, Star, ArrowRight, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import { ShapeElement } from '@/types/editor';

interface ElementsControlProps {
    onAddElement: (element: ShapeElement) => void;
}

export default function ElementsControl({ onAddElement }: ElementsControlProps) {
    const addRectangle = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'rectangle',
            position: { x: 100, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 200, height: 100 },
            fill: '#D4FF4F',
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    const addCircle = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'circle',
            position: { x: 150, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 100, height: 100 },
            fill: '#87CEEB',
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    const addRoundedRect = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'rounded-rect',
            position: { x: 100, y: 600 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 250, height: 60 },
            fill: '#D4FF4F',
            stroke: '#000000',
            strokeWidth: 0,
            cornerRadius: 30,
        };
        onAddElement(element);
    };

    const addTriangleUp = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'triangle-up',
            position: { x: 150, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 100, height: 100 },
            fill: '#FFB6C1',
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    const addTriangleDown = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'triangle-down',
            position: { x: 150, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 100, height: 100 },
            fill: '#98FB98',
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    const addDiamond = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'diamond',
            position: { x: 150, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 100, height: 100 },
            fill: '#DDA0DD',
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    const addPentagon = () => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType: 'pentagon',
            position: { x: 150, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width: 100, height: 100 },
            fill: '#F0E68C',
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    const createShape = (shapeType: ShapeElement['shapeType'], color: string, width: number = 100, height: number = 100) => {
        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType,
            position: { x: 150, y: 500 },
            rotation: 0,
            opacity: 1,
            locked: false,
            size: { width, height },
            fill: color,
            stroke: '#000000',
            strokeWidth: 0,
        };
        onAddElement(element);
    };

    return (
        <div className="control-section">
            <h3 className="control-title">Elements</h3>

            <div className="elements-grid">
                <button className="element-btn" onClick={addRectangle} title="Rectangle">
                    <Square size={24} />
                    <span>Rectangle</span>
                </button>

                <button className="element-btn" onClick={addRoundedRect} title="Rounded Rectangle">
                    <RectangleHorizontal size={24} />
                    <span>Rounded</span>
                </button>

                <button className="element-btn" onClick={addCircle} title="Circle">
                    <Circle size={24} />
                    <span>Circle</span>
                </button>

                <button className="element-btn" onClick={addTriangleUp} title="Triangle Up">
                    <Triangle size={24} />
                    <span>Triangle ↑</span>
                </button>

                <button className="element-btn" onClick={addTriangleDown} title="Triangle Down">
                    <Triangle size={24} style={{ transform: 'rotate(180deg)' }} />
                    <span>Triangle ↓</span>
                </button>

                <button className="element-btn" onClick={addDiamond} title="Diamond">
                    <Diamond size={24} />
                    <span>Diamond</span>
                </button>

                <button className="element-btn" onClick={addPentagon} title="Pentagon">
                    <Pentagon size={24} />
                    <span>Pentagon</span>
                </button>

                <button className="element-btn" onClick={() => createShape('hexagon', '#87CEEB')} title="Hexagon">
                    <Hexagon size={24} />
                    <span>Hexagon</span>
                </button>

                <button className="element-btn" onClick={() => createShape('octagon', '#98FB98')} title="Octagon">
                    <Octagon size={24} />
                    <span>Octagon</span>
                </button>

                <button className="element-btn" onClick={() => createShape('star-5', '#FFB6C1')} title="5-Point Star">
                    <Star size={24} />
                    <span>Star 5</span>
                </button>

                <button className="element-btn" onClick={() => createShape('star-10', '#DDA0DD')} title="10-Point Star">
                    <Star size={24} />
                    <span>Star 10</span>
                </button>

                <button className="element-btn" onClick={() => createShape('star-12', '#F0E68C')} title="12-Point Star">
                    <Star size={24} />
                    <span>Star 12</span>
                </button>

                <button className="element-btn" onClick={() => createShape('arrow-right', '#E6E6FA', 120, 60)} title="Arrow Right">
                    <ArrowRight size={24} />
                    <span>Arrow →</span>
                </button>

                <button className="element-btn" onClick={() => createShape('arrow-left', '#E6E6FA', 120, 60)} title="Arrow Left">
                    <ArrowLeft size={24} />
                    <span>Arrow ←</span>
                </button>

                <button className="element-btn" onClick={() => createShape('arrow-flag', '#D4FF4F', 150, 60)} title="Flag Arrow">
                    <ArrowRight size={24} />
                    <span>Flag</span>
                </button>

                <button className="element-btn" onClick={() => createShape('banner', '#87CEEB', 150, 60)} title="Banner">
                    <RectangleHorizontal size={24} />
                    <span>Banner</span>
                </button>

                <button className="element-btn" onClick={() => createShape('speech-bubble-rect', '#98FB98', 120, 80)} title="Speech Bubble Rect">
                    <MessageSquare size={24} />
                    <span>Bubble R</span>
                </button>

                <button className="element-btn" onClick={() => createShape('speech-bubble-oval', '#FFB6C1', 120, 80)} title="Speech Bubble Oval">
                    <MessageSquare size={24} />
                    <span>Bubble O</span>
                </button>

                <button className="element-btn" onClick={() => createShape('heart', '#FF69B4')} title="Heart">
                    <Heart size={24} />
                    <span>Heart</span>
                </button>

                <button className="element-btn" onClick={() => createShape('parallelogram', '#DDA0DD', 120, 80)} title="Parallelogram">
                    <Square size={24} style={{ transform: 'skewX(-20deg)' }} />
                    <span>Parallelogram</span>
                </button>

                <button className="element-btn" onClick={() => createShape('trapezoid-up', '#F0E68C', 120, 80)} title="Trapezoid Up">
                    <Square size={24} />
                    <span>Trapezoid ↑</span>
                </button>

                <button className="element-btn" onClick={() => createShape('trapezoid-down', '#E6E6FA', 120, 80)} title="Trapezoid Down">
                    <Square size={24} />
                    <span>Trapezoid ↓</span>
                </button>

                <button className="element-btn" onClick={() => createShape('rounded-bottom', '#87CEEB', 120, 80)} title="Rounded Bottom">
                    <RectangleHorizontal size={24} />
                    <span>Rounded ↓</span>
                </button>

                <button className="element-btn" onClick={() => createShape('rounded-top', '#98FB98', 120, 80)} title="Rounded Top">
                    <RectangleHorizontal size={24} />
                    <span>Rounded ↑</span>
                </button>

                <button className="element-btn" onClick={() => createShape('pill-vertical', '#FFB6C1', 60, 120)} title="Pill Vertical">
                    <RectangleHorizontal size={24} style={{ transform: 'rotate(90deg)' }} />
                    <span>Pill |</span>
                </button>
            </div>
        </div>
    );
}

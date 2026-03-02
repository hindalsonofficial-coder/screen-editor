'use client';

import { v4 as uuidv4 } from 'uuid';
import {
    Square,
    Circle,
    RectangleHorizontal,
    Triangle,
    Diamond,
    Pentagon,
    Hexagon,
    Octagon,
    Star,
    ArrowRight,
    ArrowLeft,
    Heart,
    MessageSquare
} from 'lucide-react';

import {
    ShapeElement,
    SCREENSHOT_WIDTH,
    SCREENSHOT_HEIGHT
} from '@/types/editor';

interface ElementsControlProps {
    onAddElement: (element: ShapeElement) => void;
}

export default function ElementsControl({ onAddElement }: ElementsControlProps) {

    /* ===============================
       DEFAULT CONFIG
    =============================== */

    const DEFAULT_SIZE = 350; // Increased size

    const createCenteredShape = (
        shapeType: ShapeElement['shapeType'],
        width: number = DEFAULT_SIZE,
        height: number = DEFAULT_SIZE
    ): ShapeElement => {

        const element: ShapeElement = {
            id: uuidv4(),
            type: 'shape',
            shapeType,

            // CENTER POSITION
            position: {
                x: SCREENSHOT_WIDTH / 2 - width / 2,
                y: SCREENSHOT_HEIGHT / 2 - height / 2,
            },

            rotation: 0,
            opacity: 1,
            locked: false,

            size: { width, height },

            // TRANSPARENT BY DEFAULT
            fill: 'transparent',

            // Visible white border
            stroke: '#ffffff',
            strokeWidth: 6,

            cornerRadius: shapeType === 'rounded-rect' ? 40 : undefined,
        };

        return element;
    };

    return (
        <div className="control-section">
            <h3 className="control-title">Elements</h3>

            <div className="elements-grid">

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('rectangle'))}>
                    <Square size={24} />
                    <span>Rectangle</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('rounded-rect', 350, 150))}>
                    <RectangleHorizontal size={24} />
                    <span>Rounded</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('circle'))}>
                    <Circle size={24} />
                    <span>Circle</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('triangle-up'))}>
                    <Triangle size={24} />
                    <span>Triangle ↑</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('triangle-down'))}>
                    <Triangle size={24} style={{ transform: 'rotate(180deg)' }} />
                    <span>Triangle ↓</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('diamond'))}>
                    <Diamond size={24} />
                    <span>Diamond</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('pentagon'))}>
                    <Pentagon size={24} />
                    <span>Pentagon</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('hexagon'))}>
                    <Hexagon size={24} />
                    <span>Hexagon</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('octagon'))}>
                    <Octagon size={24} />
                    <span>Octagon</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('star-5'))}>
                    <Star size={24} />
                    <span>Star 5</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('star-10'))}>
                    <Star size={24} />
                    <span>Star 10</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('star-12'))}>
                    <Star size={24} />
                    <span>Star 12</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('arrow-right', 400, 150))}>
                    <ArrowRight size={24} />
                    <span>Arrow →</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('arrow-left', 400, 150))}>
                    <ArrowLeft size={24} />
                    <span>Arrow ←</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('arrow-flag', 450, 180))}>
                    <ArrowRight size={24} />
                    <span>Flag</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('banner', 450, 180))}>
                    <RectangleHorizontal size={24} />
                    <span>Banner</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('speech-bubble-rect', 350, 250))}>
                    <MessageSquare size={24} />
                    <span>Bubble R</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('speech-bubble-oval', 350, 250))}>
                    <MessageSquare size={24} />
                    <span>Bubble O</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('heart'))}>
                    <Heart size={24} />
                    <span>Heart</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('parallelogram', 350, 200))}>
                    <Square size={24} style={{ transform: 'skewX(-20deg)' }} />
                    <span>Parallelogram</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('trapezoid-up', 350, 200))}>
                    <Square size={24} />
                    <span>Trapezoid ↑</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('trapezoid-down', 350, 200))}>
                    <Square size={24} />
                    <span>Trapezoid ↓</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('rounded-bottom', 350, 200))}>
                    <RectangleHorizontal size={24} />
                    <span>Rounded ↓</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('rounded-top', 350, 200))}>
                    <RectangleHorizontal size={24} />
                    <span>Rounded ↑</span>
                </button>

                <button className="element-btn"
                    onClick={() => onAddElement(createCenteredShape('pill-vertical', 200, 400))}>
                    <RectangleHorizontal size={24} style={{ transform: 'rotate(90deg)' }} />
                    <span>Pill |</span>
                </button>

            </div>
        </div>
    );
}

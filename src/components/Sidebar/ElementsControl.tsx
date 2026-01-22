'use client';

import { v4 as uuidv4 } from 'uuid';
import { Square, Circle, RectangleHorizontal } from 'lucide-react';
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

    return (
        <div className="control-section">
            <h3 className="control-title">Elements</h3>

            <div className="elements-grid">
                <button className="element-btn" onClick={addRectangle} title="Rectangle">
                    <Square size={24} />
                    <span>Rectangle</span>
                </button>

                <button className="element-btn" onClick={addCircle} title="Circle">
                    <Circle size={24} />
                    <span>Circle</span>
                </button>

                <button className="element-btn" onClick={addRoundedRect} title="Rounded Rectangle">
                    <RectangleHorizontal size={24} />
                    <span>Pill Shape</span>
                </button>
            </div>
        </div>
    );
}

'use client';

import { v4 as uuidv4 } from 'uuid';
import { Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TextElement } from '@/types/editor';

interface TextControlProps {
    onAddText: (element: TextElement) => void;
}

export default function TextControl({ onAddText }: TextControlProps) {
    const handleAddHeadline = () => {
        const newText: TextElement = {
            id: uuidv4(),
            type: 'text',
            content: 'Your headline here',
            position: { x: 100, y: 200 },
            rotation: 0,
            opacity: 1,
            locked: false,
            fontSize: 72,
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontStyle: 'normal',
            fill: '#000000',
            align: 'left',
            width: 400,
        };
        onAddText(newText);
    };

    const handleAddSubtext = () => {
        const newText: TextElement = {
            id: uuidv4(),
            type: 'text',
            content: 'Add your subtext here',
            position: { x: 100, y: 350 },
            rotation: 0,
            opacity: 1,
            locked: false,
            fontSize: 36,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fill: '#333333',
            align: 'left',
            width: 400,
        };
        onAddText(newText);
    };

    return (
        <div className="control-section">
            <h3 className="control-title">Text</h3>

            <div className="text-buttons">
                <button className="add-text-btn" onClick={handleAddHeadline}>
                    <Type size={20} />
                    <span>Add Headline</span>
                </button>

                <button className="add-text-btn secondary" onClick={handleAddSubtext}>
                    <Type size={16} />
                    <span>Add Subtext</span>
                </button>
            </div>

            <div className="text-align-group">
                <span className="control-label">Alignment</span>
                <div className="align-buttons">
                    <button className="align-btn" title="Align Left">
                        <AlignLeft size={16} />
                    </button>
                    <button className="align-btn" title="Align Center">
                        <AlignCenter size={16} />
                    </button>
                    <button className="align-btn" title="Align Right">
                        <AlignRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

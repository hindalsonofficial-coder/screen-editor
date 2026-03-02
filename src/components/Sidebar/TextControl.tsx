'use client';

import { v4 as uuidv4 } from 'uuid';
import { Type } from 'lucide-react';
import {
  TextElement,
  SCREENSHOT_WIDTH,
  SCREENSHOT_HEIGHT,
} from '@/types/editor';

interface TextControlProps {
  onAddText: (element: TextElement) => void;
}



export default function TextControl({ onAddText }: TextControlProps) {
  const createCenteredText = (
    content: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold'
  ): TextElement => {
    const defaultWidth = SCREENSHOT_WIDTH * 0.8;

    return {
      id: uuidv4(),
      type: 'text',

      content,

      // CENTER POSITION
      position: {
        x: (SCREENSHOT_WIDTH - defaultWidth) / 2,
        y: SCREENSHOT_HEIGHT / 2 - fontSize,
      },

      rotation: 0,
      opacity: 1,
      locked: false,

      // BIGGER DEFAULT SIZE
      fontSize,

      fontFamily: 'Arial',
      fontWeight,
      fontStyle: 'normal',

      // DEFAULT COLOR WHITE
      fill: '#ffffff',

      align: 'center',

      width: defaultWidth,
    };
  };

  const handleAddHeadline = () => {
    const newText = createCenteredText(
      'Your headline here',
      110, // increased size
      'bold'
    );

    onAddText(newText);
  };

  const handleAddSubtext = () => {
    const newText = createCenteredText(
      'Add your subtext here',
      60, // bigger than before
      'normal'
    );

    onAddText(newText);
  };

  return (
    <div className="control-section">
      <h3 className="control-title">Text</h3>

      <div className="text-buttons">
        <button
          className="add-text-btn"
          onClick={handleAddHeadline}
        >
          <Type size={20} />
          <span>Add Headline</span>
        </button>

        <button
          className="add-text-btn secondary"
          onClick={handleAddSubtext}
        >
          <Type size={16} />
          <span>Add Subtext</span>
        </button>
      </div>
    </div>
  );
}


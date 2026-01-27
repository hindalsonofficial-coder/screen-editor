'use client';

<<<<<<< HEAD
import { useEffect, useCallback, useMemo, useState } from 'react';
=======
import { useEffect, useCallback, useMemo } from 'react';
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73
import dynamic from 'next/dynamic';
import TopBar from '@/components/TopBar/TopBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import ScreenshotList from '@/components/ScreenshotList/ScreenshotList';
import { useEditorState } from '@/hooks/useEditorState';
<<<<<<< HEAD
import { TextElement, ImageElement, ShapeElement, PenElement, EditorElement } from '@/types/editor';
=======
import { TextElement, ImageElement, ShapeElement, EditorElement } from '@/types/editor';
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73

// Dynamic import for Konva to avoid SSR issues
const EditorCanvas = dynamic(
  () => import('@/components/Canvas/EditorCanvas'),
  { ssr: false }
);

export default function Home() {
  const {
    projectName,
    screenshots,
    activeScreenshotIndex,
    selectedElementId,
    setProjectName,
    addScreenshot,
    removeScreenshot,
<<<<<<< HEAD
    duplicateScreenshot,
    moveScreenshotLeft,
    moveScreenshotRight,
=======
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73
    setActiveScreenshot,
    updateScreenshotBackground,
    addElement,
    updateElement,
    removeElement,
    selectElement,
  } = useEditorState();

  const activeScreenshot = screenshots[activeScreenshotIndex];

<<<<<<< HEAD
  // Pen tool state
  const [penColor, setPenColor] = useState('#0000FF');
  const [penWeight, setPenWeight] = useState(27);
  const [isPenMode, setIsPenMode] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);

=======
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73
  // Find the selected element
  const selectedElement = useMemo(() => {
    if (!selectedElementId || !activeScreenshot) return null;
    return activeScreenshot.elements.find(el => el.id === selectedElementId) || null;
  }, [selectedElementId, activeScreenshot]);

  // Handle keyboard delete for selected element
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
      // Don't delete if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      removeElement(activeScreenshot.id, selectedElementId);
    }
  }, [selectedElementId, activeScreenshot?.id, removeElement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAddText = (element: TextElement) => {
    addElement(activeScreenshot.id, element);
  };

  const handleAddImage = (element: ImageElement) => {
    addElement(activeScreenshot.id, element);
  };

  const handleAddShape = (element: ShapeElement) => {
    addElement(activeScreenshot.id, element);
  };

  const handleBackgroundChange = (color: string) => {
    updateScreenshotBackground(activeScreenshot.id, color);
  };

  const handleDeleteSelectedElement = () => {
    if (selectedElementId) {
      removeElement(activeScreenshot.id, selectedElementId);
    }
  };

  const handleUpdateSelectedElement = (updates: Partial<EditorElement>) => {
    if (selectedElementId && activeScreenshot) {
      updateElement(activeScreenshot.id, selectedElementId, updates);
    }
  };

  return (
    <div className="editor-layout">
      <TopBar
        projectName={projectName}
        onProjectNameChange={setProjectName}
      />

      <div className="editor-main">
        <div className="canvas-area">
          <EditorCanvas
            screenshots={screenshots}
            activeScreenshotIndex={activeScreenshotIndex}
            selectedElementId={selectedElementId}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
<<<<<<< HEAD
            isPenMode={isPenMode}
            isEraserMode={isEraserMode}
            penColor={penColor}
            penWeight={penWeight}
            onAddPenElement={(element) => addElement(activeScreenshot.id, element)}
            onRemoveElement={(elementId) => removeElement(activeScreenshot.id, elementId)}
=======
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73
          />

          <ScreenshotList
            screenshots={screenshots}
            activeIndex={activeScreenshotIndex}
            onSelect={setActiveScreenshot}
            onAdd={addScreenshot}
            onDelete={removeScreenshot}
<<<<<<< HEAD
            onDuplicate={duplicateScreenshot}
            onMoveLeft={moveScreenshotLeft}
            onMoveRight={moveScreenshotRight}
=======
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73
          />
        </div>

        <Sidebar
          currentBackgroundColor={activeScreenshot.backgroundColor}
          onBackgroundChange={handleBackgroundChange}
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onAddShape={handleAddShape}
          selectedElement={selectedElement}
          onDeleteElement={handleDeleteSelectedElement}
          onUpdateSelectedElement={handleUpdateSelectedElement}
<<<<<<< HEAD
          penColor={penColor}
          penWeight={penWeight}
          onPenColorChange={setPenColor}
          onPenWeightChange={setPenWeight}
          isPenMode={isPenMode}
          onPenModeChange={setIsPenMode}
          isEraserMode={isEraserMode}
          onEraserModeChange={setIsEraserMode}
=======
>>>>>>> a989eabaafb1dbde69e8536cb0b42df59b1ace73
        />
      </div>
    </div>
  );
}

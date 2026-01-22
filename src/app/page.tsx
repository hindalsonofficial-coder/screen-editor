'use client';

import { useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import TopBar from '@/components/TopBar/TopBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import ScreenshotList from '@/components/ScreenshotList/ScreenshotList';
import { useEditorState } from '@/hooks/useEditorState';
import { TextElement, ImageElement, ShapeElement, EditorElement } from '@/types/editor';

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
    setActiveScreenshot,
    updateScreenshotBackground,
    addElement,
    updateElement,
    removeElement,
    selectElement,
  } = useEditorState();

  const activeScreenshot = screenshots[activeScreenshotIndex];

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
          />

          <ScreenshotList
            screenshots={screenshots}
            activeIndex={activeScreenshotIndex}
            onSelect={setActiveScreenshot}
            onAdd={addScreenshot}
            onDelete={removeScreenshot}
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
        />
      </div>
    </div>
  );
}

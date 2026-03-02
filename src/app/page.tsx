// 'use client';
// import dynamic from 'next/dynamic';
// import { useEffect, useCallback, useMemo, useState, useRef } from 'react';

// import TopBar from '@/components/TopBar/TopBar';
// import Sidebar from '@/components/Sidebar/Sidebar';
// import ScreenshotList from '@/components/ScreenshotList/ScreenshotList';
// import { useEditorState } from '@/hooks/useEditorState';
// import { TextElement, ImageElement, ShapeElement, PenElement, EditorElement } from '@/types/editor';
// import ZoomControls from '@/components/Canvas/ZoomControls';
// import DashboardTemplates from '@/components/DashboardTemplates/DashboardTemplates';
// import { EyeOff } from 'lucide-react';

// // Dynamic import for Konva to avoid SSR issues
// const EditorCanvas = dynamic(
//   () => import('@/components/Canvas/EditorCanvas'),
//   { ssr: false }
// );


// import type { EditorCanvasRef } from '@/components/Canvas/EditorCanvas';
// // import { EditorCanvasRef } from '@/components/Canvas/EditorCanvas';
// import { downloadURI, downloadMultipleFiles } from '@/utils/exportUtils';
// import type { ExportOptions as ExportOptionsType } from '@/components/TopBar/ExportOptions';
// import { prefetchTemplates } from '@/utils/templatesCache';

// export default function Home() {
//   const {
//     projectName,
//     screenshots,
//     activeScreenshotIndex,
//     selectedElementId,
//     setProjectName,
//     addScreenshot,
//     removeScreenshot,
//     duplicateScreenshot,
//     moveScreenshotLeft,
//     moveScreenshotRight,
//     setActiveScreenshot,
//     updateScreenshotBackground,
//     updateScreenshotBackgroundImage,
//     addElement,
//     updateElement,
//     removeElement,
//     replaceElementWithText,
//     selectElement,
//     zoom,
//     zoomIn,
//     zoomOut,
//     resetZoom,
//     applyTemplate,
//     undo,
//     redo,
//     canUndo,
//     canRedo,
//   } = useEditorState();

//   const activeScreenshot = screenshots[activeScreenshotIndex];

//   // Pen tool state
//   const [penColor, setPenColor] = useState('#0000FF');
//   const [penWeight, setPenWeight] = useState(27);
//   const [isPenMode, setIsPenMode] = useState(false);
//   const [isEraserMode, setIsEraserMode] = useState(false);
//   const [isPreviewMode, setIsPreviewMode] = useState(false);

//   const canvasRef = useRef<EditorCanvasRef>(null);

//   useEffect(() => {
//     prefetchTemplates();
//   }, []);

//   const handleExport = async (options: ExportOptionsType) => {
//     if (!canvasRef.current) return;

//     try {
//       if (options.exportAll) {
//         // Batch export all screenshots
//         const exports = canvasRef.current.exportAllImages(options.format, options.quality);
        
//         if (exports.length === 0) {
//           alert('No screenshots to export');
//           return;
//         }

//         // Convert format if needed
//         const files = await Promise.all(
//           exports.map(async (exp) => {
//             let finalDataUri = exp.dataUri;
            
//             // If format conversion needed (already done in export, but double-check)
//             const extension = options.format === 'jpg' ? 'jpg' : 'png';
//             const fileName = `${projectName.replace(/\s+/g, '-').toLowerCase()}-screen-${exp.index + 1}.${extension}`;
            
//             return {
//               dataUri: finalDataUri,
//               fileName,
//             };
//           })
//         );

//         // Download all files with delay to avoid browser blocking
//         await downloadMultipleFiles(files, 300);
//       } else {
//         // Export single screenshot
//         let dataUri = canvasRef.current.exportImage(activeScreenshotIndex, options.format, options.quality);
        
//         if (!dataUri) {
//           alert('Failed to export screenshot');
//           return;
//         }

//         const extension = options.format === 'jpg' ? 'jpg' : 'png';
//         const fileName = `${projectName.replace(/\s+/g, '-').toLowerCase()}-screen-${activeScreenshotIndex + 1}.${extension}`;
//         downloadURI(dataUri, fileName);
//       }
//     } catch (error) {
//       console.error('Export error:', error);
//       alert('Failed to export screenshots');
//     }
//   };

//   const handleSaveTemplate = async () => {
//     if (!activeScreenshot) return;

//     const defaultName = `${projectName} - Screen ${activeScreenshotIndex + 1}`;
//     const name = window.prompt('Template name', defaultName);
//     if (!name || !name.trim()) return;

//     try {
//       const res = await fetch('/api/templates', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: name.trim(),
//           backgroundColor: activeScreenshot.backgroundColor,
//           elements: activeScreenshot.elements,
//           category: 'Custom',
//         }),
//       });

//       if (!res.ok) {
//         alert('Template save nahi ho paya.');
//         return;
//       }

//       alert('Template save ho gaya. Templates list mein mil jayega.');
//     } catch (error) {
//       console.error('Save template error:', error);
//       alert('Template save nahi ho paya.');
//     }
//   };

//   // Find the selected element
//   const selectedElement = useMemo(() => {
//     if (!selectedElementId || !activeScreenshot) return null;
//     return activeScreenshot.elements.find(el => el.id === selectedElementId) || null;
//   }, [selectedElementId, activeScreenshot]);

//   // Shape/image par click = turant usi jagah editable text (koi button nahi)
//   useEffect(() => {
//     if (!selectedElement || !activeScreenshot) return;
//     if (selectedElement.type === 'shape' || selectedElement.type === 'image') {
//       replaceElementWithText(activeScreenshot.id, selectedElement.id);
//     }
//   }, [selectedElement?.id, selectedElement?.type, activeScreenshot?.id, replaceElementWithText]);

//   // Handle keyboard delete for selected element
//   const handleKeyDown = useCallback((e: KeyboardEvent) => {
//     if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
//       // Don't delete if user is typing in an input
//       if ((e.target as HTMLElement).tagName === 'INPUT' ||
//         (e.target as HTMLElement).tagName === 'TEXTAREA') {
//         return;
//       }
//       e.preventDefault();
//       removeElement(activeScreenshot.id, selectedElementId);
//     }
//   }, [selectedElementId, activeScreenshot?.id, removeElement]);

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [handleKeyDown]);

//   const handleAddText = (element: TextElement) => {
//     addElement(activeScreenshot.id, element);
//   };

//   const handleAddImage = (element: ImageElement) => {
//     addElement(activeScreenshot.id, element);
//   };

//   const handleAddShape = (element: ShapeElement) => {
//     addElement(activeScreenshot.id, element);
//   };

//   const handleBackgroundChange = (color: string) => {
//     updateScreenshotBackground(activeScreenshot.id, color);
//   };

//   const handleUploadScreenshot = (imageUrl: string) => {
//     updateScreenshotBackgroundImage(activeScreenshot.id, imageUrl);
//   };

//   const handleRemoveBackgroundImage = () => {
//     updateScreenshotBackgroundImage(activeScreenshot.id, null);
//   };

//   const handleDeleteSelectedElement = () => {
//     if (selectedElementId) {
//       removeElement(activeScreenshot.id, selectedElementId);
//     }
//   };

//   const handleUpdateSelectedElement = (updates: Partial<EditorElement>) => {
//     if (selectedElementId && activeScreenshot) {
//       updateElement(activeScreenshot.id, selectedElementId, updates);
//     }
//   };

//   return (
//     <div className="editor-layout">
//       {!isPreviewMode && (
//           <TopBar
//           projectName={projectName}
//           onProjectNameChange={setProjectName}
//           onExport={handleExport}
//           onSaveTemplate={handleSaveTemplate}
//           onTogglePreview={() => setIsPreviewMode(true)}
//           onUndo={undo}
//           onRedo={redo}
//           canUndo={canUndo}
//           canRedo={canRedo}
//           screenshotCount={screenshots.length}
//         />
//       )}

//       {isPreviewMode && (
//         <div className="absolute top-4 right-4 z-50">
//           <button
//             onClick={() => setIsPreviewMode(false)}
//             className="flex items-center gap-2 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-full shadow-xl hover:bg-gray-800 transition-colors"
//           >
//             <EyeOff size={16} />
//             <span>Exit Preview</span>
//           </button>
//         </div>
//       )}

//       <div className="editor-main">
//         <div className="canvas-area">
//           <EditorCanvas
//             // @ts-ignore
//             ref={canvasRef}
//             screenshots={screenshots}
//             activeScreenshotIndex={activeScreenshotIndex}
//             selectedElementId={isPreviewMode ? null : selectedElementId}
//             onSelectElement={selectElement}
//             onUpdateElement={updateElement}
//             isPenMode={isPenMode}
//             isEraserMode={isEraserMode}
//             penColor={penColor}
//             penWeight={penWeight}
//             onAddPenElement={(element) => addElement(activeScreenshot.id, element)}
//             onRemoveElement={(elementId) => removeElement(activeScreenshot.id, elementId)}
//             zoom={zoom}
//             isPreviewMode={isPreviewMode}
//           />

//           <ZoomControls
//             zoom={zoom}
//             onZoomIn={zoomIn}
//             onZoomOut={zoomOut}
//             onResetZoom={resetZoom}
//           />

//           {!isPreviewMode && (
//             <DashboardTemplates onApplyTemplate={applyTemplate} />
//           )}

//           {!isPreviewMode && (
//             <ScreenshotList
//               screenshots={screenshots}
//               activeIndex={activeScreenshotIndex}
//               onSelect={setActiveScreenshot}
//               onAdd={addScreenshot}
//               onDelete={removeScreenshot}
//               onDuplicate={duplicateScreenshot}
//               onMoveLeft={moveScreenshotLeft}
//               onMoveRight={moveScreenshotRight}
//             />
//           )}
//         </div>

//         {!isPreviewMode && (
//           <Sidebar
//             currentBackgroundColor={activeScreenshot.backgroundColor}
//             onBackgroundChange={handleBackgroundChange}
//             onAddText={handleAddText}
//             onAddImage={handleAddImage}
//             onAddShape={handleAddShape}
//             selectedElement={selectedElement}
//             onDeleteElement={handleDeleteSelectedElement}
//             onUpdateSelectedElement={handleUpdateSelectedElement}
//             penColor={penColor}
//             penWeight={penWeight}
//             onPenColorChange={setPenColor}
//             onPenWeightChange={setPenWeight}
//             isPenMode={isPenMode}
//             onPenModeChange={setIsPenMode}
//             isEraserMode={isEraserMode}
//             onEraserModeChange={setIsEraserMode}
//             onApplyTemplate={applyTemplate}
//             onUploadScreenshot={handleUploadScreenshot}
//             hasBackgroundImage={!!activeScreenshot.backgroundImage}
//             onRemoveBackgroundImage={handleRemoveBackgroundImage}
//           />
//         )}
//       </div>
//     </div>
//   );
// }




// new code 
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';

import TopBar from '@/components/TopBar/TopBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import ScreenshotList from '@/components/ScreenshotList/ScreenshotList';
import { useEditorState } from '@/hooks/useEditorState';
import { TextElement, ImageElement, ShapeElement, PenElement, EditorElement } from '@/types/editor';
import ZoomControls from '@/components/Canvas/ZoomControls';
import DashboardTemplates from '@/components/DashboardTemplates/DashboardTemplates';
import { EyeOff } from 'lucide-react';

const EditorCanvas = dynamic(
  () => import('@/components/Canvas/EditorCanvas'),
  { ssr: false }
);

import type { EditorCanvasRef } from '@/components/Canvas/EditorCanvas';
import { downloadURI, downloadMultipleFiles } from '@/utils/exportUtils';
import type { ExportOptions as ExportOptionsType } from '@/components/TopBar/ExportOptions';
import { prefetchTemplates } from '@/utils/templatesCache';

export default function Home() {
  const {
    projectName,
    screenshots,
    activeScreenshotIndex,
    selectedElementId,
    setProjectName,
    addScreenshot,
    removeScreenshot,
    duplicateScreenshot,
    moveScreenshotLeft,
    moveScreenshotRight,
    setActiveScreenshot,
    updateScreenshotBackground,
    updateScreenshotBackgroundImage,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    applyTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorState();

  const activeScreenshot = screenshots[activeScreenshotIndex];
  if (!activeScreenshot) return null;

  const [penColor, setPenColor] = useState('#0000FF');
  const [penWeight, setPenWeight] = useState(27);
  const [isPenMode, setIsPenMode] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const canvasRef = useRef<EditorCanvasRef>(null);

  useEffect(() => {
    prefetchTemplates();
  }, []);

  const handleExport = async (options: ExportOptionsType) => {
    if (!canvasRef.current) return;

    try {
      if (options.exportAll) {
        const exports = canvasRef.current.exportAllImages(options.format, options.quality);

        if (exports.length === 0) {
          alert('No screenshots to export');
          return;
        }

        const files = await Promise.all(
          exports.map(async (exp) => {
            const extension = options.format === 'jpg' ? 'jpg' : 'png';
            const fileName = `${projectName.replace(/\s+/g, '-').toLowerCase()}-screen-${exp.index + 1}.${extension}`;

            return {
              dataUri: exp.dataUri,
              fileName,
            };
          })
        );

        await downloadMultipleFiles(files, 300);
      } else {
        const dataUri = canvasRef.current.exportImage(activeScreenshotIndex, options.format, options.quality);

        if (!dataUri) {
          alert('Failed to export screenshot');
          return;
        }

        const extension = options.format === 'jpg' ? 'jpg' : 'png';
        const fileName = `${projectName.replace(/\s+/g, '-').toLowerCase()}-screen-${activeScreenshotIndex + 1}.${extension}`;
        downloadURI(dataUri, fileName);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export screenshots');
    }
  };

  const handleSaveTemplate = async () => {
    const defaultName = `${projectName} - Screen ${activeScreenshotIndex + 1}`;
    const name = window.prompt('Template name', defaultName);
    if (!name || !name.trim()) return;

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          backgroundColor: activeScreenshot.backgroundColor,
          elements: activeScreenshot.elements,
          category: 'Custom',
        }),
      });

      if (!res.ok) {
        alert('Template save nahi ho paya.');
        return;
      }

      alert('Template save ho gaya. Templates list mein mil jayega.');
    } catch (error) {
      console.error('Save template error:', error);
      alert('Template save nahi ho paya.');
    }
  };

  const selectedElement = useMemo(() => {
    if (!selectedElementId) return null;
    return activeScreenshot.elements.find(el => el.id === selectedElementId) || null;
  }, [selectedElementId, activeScreenshot]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
      if ((e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      removeElement(activeScreenshot.id, selectedElementId);
    }
  }, [selectedElementId, activeScreenshot.id, removeElement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleUpdateSelectedElement = (updates: Partial<EditorElement>) => {
    if (!selectedElementId) return;

    const cleanUpdates: Partial<EditorElement> = { ...updates };

    if ('fontSize' in updates && updates.fontSize !== undefined) {
      (cleanUpdates as any).fontSize = Number(updates.fontSize);
    }

    updateElement(activeScreenshot.id, selectedElementId, cleanUpdates);
  };

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

  const handleUploadScreenshot = (imageUrl: string) => {
    updateScreenshotBackgroundImage(activeScreenshot.id, imageUrl);
  };

  const handleRemoveBackgroundImage = () => {
    updateScreenshotBackgroundImage(activeScreenshot.id, null);
  };

  const handleDeleteSelectedElement = () => {
    if (selectedElementId) {
      removeElement(activeScreenshot.id, selectedElementId);
    }
  };

  return (
    <div className="editor-layout">
      {!isPreviewMode && (
        <TopBar
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onExport={handleExport}
          onSaveTemplate={handleSaveTemplate}
          onTogglePreview={() => setIsPreviewMode(true)}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          screenshotCount={screenshots.length}
        />
      )}

      {isPreviewMode && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center gap-2 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-full shadow-xl hover:bg-gray-800 transition-colors"
          >
            <EyeOff size={16} />
            <span>Exit Preview</span>
          </button>
        </div>
      )}

      <div className="editor-main">
        <div className="canvas-area">
          <EditorCanvas
            ref={canvasRef}
            screenshots={screenshots}
            activeScreenshotIndex={activeScreenshotIndex}
            selectedElementId={isPreviewMode ? null : selectedElementId}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
            isPenMode={isPenMode}
            isEraserMode={isEraserMode}
            penColor={penColor}
            penWeight={penWeight}
            onAddPenElement={(element: PenElement) =>
              addElement(activeScreenshot.id, element)
            }
            onRemoveElement={(elementId) =>
              removeElement(activeScreenshot.id, elementId)
            }
            zoom={zoom}
            isPreviewMode={isPreviewMode}
          />

          <ZoomControls
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
          />

          {!isPreviewMode && (
            <DashboardTemplates
              onApplyTemplate={(template) =>
                applyTemplate({
                  backgroundColor: template.backgroundColor ?? activeScreenshot.backgroundColor,
                  elements: template.elements,
                })
              }
            />
          )}

          {!isPreviewMode && (
            <ScreenshotList
              screenshots={screenshots}
              activeIndex={activeScreenshotIndex}
              onSelect={setActiveScreenshot}
              onAdd={addScreenshot}
              onDelete={removeScreenshot}
              onDuplicate={duplicateScreenshot}
              onMoveLeft={moveScreenshotLeft}
              onMoveRight={moveScreenshotRight}
            />
          )}
        </div>

        {!isPreviewMode && (
          <Sidebar
            currentBackgroundColor={activeScreenshot.backgroundColor}
            onBackgroundChange={handleBackgroundChange}
            onAddText={handleAddText}
            onAddImage={handleAddImage}
            onAddShape={handleAddShape}
            selectedElement={selectedElement}
            onDeleteElement={handleDeleteSelectedElement}
            onUpdateSelectedElement={handleUpdateSelectedElement}
            penColor={penColor}
            penWeight={penWeight}
            onPenColorChange={setPenColor}
            onPenWeightChange={setPenWeight}
            isPenMode={isPenMode}
            onPenModeChange={setIsPenMode}
            isEraserMode={isEraserMode}
            onEraserModeChange={setIsEraserMode}
            onApplyTemplate={(template) =>
              applyTemplate({
                backgroundColor: template.backgroundColor ?? activeScreenshot.backgroundColor,
                elements: template.elements,
              })
            }
            onUploadScreenshot={handleUploadScreenshot}
            hasBackgroundImage={!!activeScreenshot.backgroundImage}
            onRemoveBackgroundImage={handleRemoveBackgroundImage}
          />
        )}
      </div>
    </div>
  );
}
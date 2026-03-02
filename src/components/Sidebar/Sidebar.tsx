// 'use client';

// import {
//     Palette,
//     Type,
//     Image as ImageIcon,
//     Shapes,
//     Pen,
//     ChevronDown,
//     ChevronRight,
//     Trash2,
//     Minus,
//     Plus,
//     Sparkles,
//     Languages
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { prefetchTemplates } from '@/utils/templatesCache';
// import BackgroundControl from './BackgroundControl';
// import TextControl from './TextControl';
// import ImageControl from './ImageControl';
// import ElementsControl from './ElementsControl';
// import PenControl from './PenControl';
// import FontPicker from './FontPicker';
// import TemplatesControl from './TemplatesControl';
// import { TextElement, ImageElement, ShapeElement, PenElement, EditorElement } from '@/types/editor';

// interface SidebarProps {
//     currentBackgroundColor: string;
//     onBackgroundChange: (color: string) => void;
//     onAddText: (element: TextElement) => void;
//     onAddImage: (element: ImageElement) => void;
//     onAddShape: (element: ShapeElement) => void;
//     selectedElement: EditorElement | null;
//     onDeleteElement: () => void;
//     onUpdateSelectedElement: (updates: Partial<EditorElement>) => void;
//     penColor: string;
//     penWeight: number;
//     onPenColorChange: (color: string) => void;
//     onPenWeightChange: (weight: number) => void;
//     isPenMode: boolean;
//     onPenModeChange: (enabled: boolean) => void;
//     isEraserMode: boolean;
//     onEraserModeChange: (enabled: boolean) => void;
//     onApplyTemplate: (template: any) => void;
//     onUploadScreenshot: (imageUrl: string) => void;
//     hasBackgroundImage: boolean;
//     onRemoveBackgroundImage: () => void;
// }

// type SectionKey = 'templates' | 'background' | 'text' | 'image' | 'elements' | 'pen';

// export default function Sidebar({
//     currentBackgroundColor,
//     onBackgroundChange,
//     onAddText,
//     onAddImage,
//     onAddShape,
//     selectedElement,
//     onDeleteElement,
//     onUpdateSelectedElement,
//     penColor,
//     penWeight,
//     onPenColorChange,
//     onPenWeightChange,
//     isPenMode,
//     onPenModeChange,
//     isEraserMode,
//     onEraserModeChange,
//     onApplyTemplate,
//     onUploadScreenshot,
//     hasBackgroundImage,
//     onRemoveBackgroundImage,
// }: SidebarProps) {
//     const [openSections, setOpenSections] = useState<Set<SectionKey>>(
//         new Set(['templates', 'background', 'text', 'image', 'elements', 'pen'])
//     );

//     useEffect(() => {
//         prefetchTemplates();
//     }, []);

//     const toggleSection = (section: SectionKey) => {
//         setOpenSections(prev => {
//             const next = new Set(prev);
//             if (next.has(section)) {
//                 next.delete(section);
//             } else {
//                 next.add(section);
//             }
//             return next;
//         });
//     };

//     const sections = [
//         { key: 'pen' as SectionKey, icon: Pen, label: 'Pen' },
//         { key: 'elements' as SectionKey, icon: Shapes, label: 'Elements' },
//         { key: 'text' as SectionKey, icon: Type, label: 'Text' },
//         { key: 'background' as SectionKey, icon: Palette, label: 'Background' },
//         { key: 'image' as SectionKey, icon: ImageIcon, label: 'Uploads' },
//         { key: 'templates' as SectionKey, icon: Sparkles, label: 'Templates' },
//     ];

//     const isTextSelected = selectedElement?.type === 'text';
//     const textElement = isTextSelected ? (selectedElement as TextElement) : null;

//     const handleFontSizeChange = (delta: number) => {
//         if (textElement) {
//             const newSize = Math.max(12, Math.min(200, textElement.fontSize + delta));
//             onUpdateSelectedElement({ fontSize: newSize });
//         }
//     };

//     const handleFontSizeInput = (value: string) => {
//         const size = parseInt(value, 10);
//         if (!isNaN(size) && size >= 12 && size <= 200 && textElement) {
//             onUpdateSelectedElement({ fontSize: size });
//         }
//     };

//     const handleTextColorChange = (color: string) => {
//         if (textElement) {
//             onUpdateSelectedElement({ fill: color });
//         }
//     };

//     const handleFontWeightToggle = () => {
//         if (textElement) {
//             onUpdateSelectedElement({
//                 fontWeight: textElement.fontWeight === 'bold' ? 'normal' : 'bold'
//             });
//         }
//     };

//     const handleFontStyleToggle = () => {
//         if (textElement) {
//             onUpdateSelectedElement({
//                 fontStyle: textElement.fontStyle === 'italic' ? 'normal' : 'italic'
//             });
//         }
//     };

//     const handleAlignChange = (align: 'left' | 'center' | 'right') => {
//         if (textElement) {
//             onUpdateSelectedElement({ align });
//         }
//     };

//     const handleFontFamilyChange = (fontFamily: string) => {
//         if (textElement) {
//             onUpdateSelectedElement({ fontFamily });
//         }
//     };

//     const [translateLang, setTranslateLang] = useState('Hindi');
//     const [translating, setTranslating] = useState(false);
//     const handleTranslate = async () => {
//         if (!textElement?.content?.trim()) return;
//         setTranslating(true);
//         try {
//             const res = await fetch('/api/translate', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ text: textElement.content, targetLang: translateLang }),
//             });
//             if (!res.ok) throw new Error('Translate failed');
//             const data = await res.json();
//             if (data.translated != null) {
//                 onUpdateSelectedElement({ content: data.translated });
//             }
//         } catch (e) {
//             console.error(e);
//             alert('Translation failed. Try again.');
//         } finally {
//             setTranslating(false);
//         }
//     };

//     const translateLanguages = ['Hindi', 'Spanish', 'French', 'German', 'Chinese (Simplified)', 'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Italian', 'English'];

//     return (
//         <aside className="sidebar">
//             <div className="sidebar-header">
//                 <h2>Editor</h2>
//             </div>

//             {/* Selected Element Actions */}
//             {selectedElement && (
//                 <div className="selected-element-panel">
//                     <div className="selected-element-header">
//                         <span className="selected-type">
//                             {selectedElement.type === 'text' && '📝 Text'}
//                             {selectedElement.type === 'image' && '🖼️ Image'}
//                             {selectedElement.type === 'shape' && '⬜ Shape'}
//                         </span>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                             <button
//                                 className="delete-element-btn-small"
//                                 onClick={onDeleteElement}
//                                 title="Delete Element (Del)"
//                             >
//                                 <Trash2 size={14} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Text-specific controls */}
//                     {isTextSelected && textElement && (
//                         <div className="text-properties">
//                             {/* Font Family */}
//                             <div className="property-row">
//                                 <label className="property-label">Font</label>
//                                 <FontPicker
//                                     currentFont={textElement.fontFamily}
//                                     onFontChange={handleFontFamilyChange}
//                                 />
//                             </div>

//                             {/* Font Size */}
//                             <div className="property-row">
//                                 <label className="property-label">Size</label>
//                                 <div className="font-size-control">
//                                     <button
//                                         className="size-btn"
//                                         onClick={() => handleFontSizeChange(-4)}
//                                     >
//                                         <Minus size={14} />
//                                     </button>
//                                     <input
//                                         type="number"
//                                         className="size-input"
//                                         value={textElement.fontSize}
//                                         onChange={(e) => handleFontSizeInput(e.target.value)}
//                                         min={12}
//                                         max={200}
//                                     />
//                                     <button
//                                         className="size-btn"
//                                         onClick={() => handleFontSizeChange(4)}
//                                     >
//                                         <Plus size={14} />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Font Style */}
//                             <div className="property-row">
//                                 <label className="property-label">Style</label>
//                                 <div className="style-buttons">
//                                     <button
//                                         className={`style-btn ${textElement.fontWeight === 'bold' ? 'active' : ''}`}
//                                         onClick={handleFontWeightToggle}
//                                         title="Bold"
//                                     >
//                                         <strong>B</strong>
//                                     </button>
//                                     <button
//                                         className={`style-btn ${textElement.fontStyle === 'italic' ? 'active' : ''}`}
//                                         onClick={handleFontStyleToggle}
//                                         title="Italic"
//                                     >
//                                         <em>I</em>
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Text Alignment */}
//                             <div className="property-row">
//                                 <label className="property-label">Align</label>
//                                 <div className="align-buttons-row">
//                                     <button
//                                         className={`align-btn-small ${textElement.align === 'left' ? 'active' : ''}`}
//                                         onClick={() => handleAlignChange('left')}
//                                         title="Align Left"
//                                     >
//                                         ≡
//                                     </button>
//                                     <button
//                                         className={`align-btn-small ${textElement.align === 'center' ? 'active' : ''}`}
//                                         onClick={() => handleAlignChange('center')}
//                                         title="Align Center"
//                                     >
//                                         ≡
//                                     </button>
//                                     <button
//                                         className={`align-btn-small ${textElement.align === 'right' ? 'active' : ''}`}
//                                         onClick={() => handleAlignChange('right')}
//                                         title="Align Right"
//                                     >
//                                         ≡
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Text Color */}
//                             <div className="property-row">
//                                 <label className="property-label">Color</label>
//                                 <div className="color-input-row">
//                                     <input
//                                         type="color"
//                                         className="color-picker-small"
//                                         value={textElement.fill}
//                                         onChange={(e) => handleTextColorChange(e.target.value)}
//                                     />
//                                     <input
//                                         type="text"
//                                         className="color-hex-input"
//                                         value={textElement.fill}
//                                         onChange={(e) => handleTextColorChange(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Editable text content */}
//                             <div className="property-row property-row-content">
//                                 <label className="property-label">Content (editable)</label>
//                                 <textarea
//                                     className="text-content-input"
//                                     value={textElement.content}
//                                     onChange={(e) => onUpdateSelectedElement({ content: e.target.value })}
//                                     placeholder="Yahan type karo ya change karo..."
//                                     rows={Math.min(12, Math.max(4, Math.ceil((textElement.content?.length || 0) / 60)))}
//                                 />
//                             </div>

//                             {/* Translate - AppLaunchpad style */}
//                             <div className="property-row translate-section">
//                                 <label className="property-label">
//                                     <Languages size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
//                                     Translate
//                                 </label>
//                                 <select
//                                     className="translate-select"
//                                     value={translateLang}
//                                     onChange={(e) => setTranslateLang(e.target.value)}
//                                 >
//                                     {translateLanguages.map((lang) => (
//                                         <option key={lang} value={lang}>{lang}</option>
//                                     ))}
//                                 </select>
//                                 <button
//                                     type="button"
//                                     className="translate-btn"
//                                     onClick={handleTranslate}
//                                     disabled={translating || !textElement.content?.trim()}
//                                 >
//                                     {translating ? '...' : 'Translate'}
//                                 </button>
//                             </div>

//                             <p className="edit-hint">Content yahan edit karo ya canvas par text par click karo</p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             <div className="sidebar-content">
//                 {sections.map(({ key, icon: Icon, label }) => (
//                     <div key={key} className="sidebar-section">
//                         <button
//                             className="section-header"
//                             onClick={() => toggleSection(key)}
//                         >
//                             <div className="section-header-left">
//                                 <Icon size={18} />
//                                 <span>{label}</span>
//                             </div>
//                             {openSections.has(key) ? (
//                                 <ChevronDown size={16} />
//                             ) : (
//                                 <ChevronRight size={16} />
//                             )}
//                         </button>

//                         {openSections.has(key) && (
//                             <div className="section-content">
//                                 {key === 'templates' && (
//                                     <TemplatesControl onApplyTemplate={onApplyTemplate} />
//                                 )}
//                                 {key === 'background' && (
//                                     <BackgroundControl
//                                         currentColor={currentBackgroundColor}
//                                         onColorChange={onBackgroundChange}
//                                     />
//                                 )}
//                                 {key === 'text' && (
//                                     <TextControl onAddText={onAddText} />
//                                 )}
//                                 {key === 'image' && (
//                                     <ImageControl 
//                                         onAddImage={onAddImage}
//                                         onUploadScreenshot={onUploadScreenshot}
//                                         hasBackgroundImage={hasBackgroundImage}
//                                         onRemoveBackgroundImage={onRemoveBackgroundImage}
//                                     />
//                                 )}
//                                 {key === 'elements' && (
//                                     <ElementsControl onAddElement={onAddShape} />
//                                 )}
//                                 {key === 'pen' && (
//                                     <PenControl
//                                         penColor={penColor}
//                                         penWeight={penWeight}
//                                         onColorChange={onPenColorChange}
//                                         onWeightChange={onPenWeightChange}
//                                         onPenModeChange={onPenModeChange}
//                                         onEraserModeChange={onEraserModeChange}
//                                         isPenMode={isPenMode}
//                                         isEraserMode={isEraserMode}
//                                     />
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </aside>
//     );
// }


'use client';

import {
  Palette,
  Type,
  Image as ImageIcon,
  Shapes,
  Pen,
  ChevronDown,
  ChevronRight,
  Trash2,
  Minus,
  Plus,
  Sparkles,
  Languages,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { prefetchTemplates } from '@/utils/templatesCache';

import BackgroundControl from './BackgroundControl';
import TextControl from './TextControl';
import ImageControl from './ImageControl';
import ElementsControl from './ElementsControl';
import PenControl from './PenControl';
import FontPicker from './FontPicker';
import TemplatesControl from './TemplatesControl';

import {
  TextElement,
  ImageElement,
  ShapeElement,
  PenElement,
  EditorElement,
} from '@/types/editor';

interface SidebarProps {
  currentBackgroundColor: string;
  onBackgroundChange: (color: string) => void;

  onAddText: (element: TextElement) => void;
  onAddImage: (element: ImageElement) => void;
  onAddShape: (element: ShapeElement) => void;

  selectedElement: EditorElement | null;
  onDeleteElement: () => void;
  onUpdateSelectedElement: (updates: Partial<EditorElement>) => void;

  penColor: string;
  penWeight: number;
  onPenColorChange: (color: string) => void;
  onPenWeightChange: (weight: number) => void;
  isPenMode: boolean;
  onPenModeChange: (enabled: boolean) => void;
  isEraserMode: boolean;
  onEraserModeChange: (enabled: boolean) => void;

  onApplyTemplate: (template: any) => void;

  onUploadScreenshot: (imageUrl: string) => void;
  hasBackgroundImage: boolean;
  onRemoveBackgroundImage: () => void;
}

type SectionKey =
  | 'templates'
  | 'background'
  | 'text'
  | 'image'
  | 'elements'
  | 'pen';

export default function Sidebar({
  currentBackgroundColor,
  onBackgroundChange,
  onAddText,
  onAddImage,
  onAddShape,
  selectedElement,
  onDeleteElement,
  onUpdateSelectedElement,
  penColor,
  penWeight,
  onPenColorChange,
  onPenWeightChange,
  isPenMode,
  onPenModeChange,
  isEraserMode,
  onEraserModeChange,
  onApplyTemplate,
  onUploadScreenshot,
  hasBackgroundImage,
  onRemoveBackgroundImage,
}: SidebarProps) {
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set(['templates', 'background', 'text', 'image', 'elements', 'pen'])
  );

  useEffect(() => {
    prefetchTemplates();
  }, []);

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const sections = [
    { key: 'pen' as SectionKey, icon: Pen, label: 'Pen' },
    { key: 'elements' as SectionKey, icon: Shapes, label: 'Elements' },
    { key: 'text' as SectionKey, icon: Type, label: 'Text' },
    { key: 'background' as SectionKey, icon: Palette, label: 'Background' },
    { key: 'image' as SectionKey, icon: ImageIcon, label: 'Uploads' },
    { key: 'templates' as SectionKey, icon: Sparkles, label: 'Templates' },
  ];

  const isTextSelected = selectedElement?.type === 'text';
  const textElement = isTextSelected
    ? (selectedElement as TextElement)
    : null;

  /* ================= TEXT CONTROLS ================= */

  const handleFontSizeChange = (delta: number) => {
    if (!textElement) return;
    const newSize = Math.max(
      12,
      Math.min(300, textElement.fontSize + delta)
    );
    onUpdateSelectedElement({ fontSize: newSize });
  };

  const handleFontSizeInput = (value: string) => {
    if (!textElement) return;
    const size = parseInt(value, 10);
    if (!isNaN(size) && size >= 12 && size <= 300) {
      onUpdateSelectedElement({ fontSize: size });
    }
  };

  const handleFontWeightToggle = () => {
    if (!textElement) return;
    onUpdateSelectedElement({
      fontWeight:
        textElement.fontWeight === 'bold' ? 'normal' : 'bold',
    });
  };

  const handleFontStyleToggle = () => {
    if (!textElement) return;
    onUpdateSelectedElement({
      fontStyle:
        textElement.fontStyle === 'italic'
          ? 'normal'
          : 'italic',
    });
  };

  const handleAlignChange = (
    align: 'left' | 'center' | 'right'
  ) => {
    if (!textElement) return;
    onUpdateSelectedElement({ align });
  };

  const handleFontFamilyChange = (font: string) => {
    if (!textElement) return;
    onUpdateSelectedElement({ fontFamily: font });
  };

  const handleColorChange = (color: string) => {
    if (!textElement) return;
    onUpdateSelectedElement({ fill: color });
  };

  /* ================= UI ================= */

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Editor</h2>
      </div>

      {/* Selected Element Panel */}
      {selectedElement && (
        <div className="selected-element-panel">
          <div className="selected-element-header">
            <span>
              {selectedElement.type === 'text' && '📝 Text'}
              {selectedElement.type === 'image' && '🖼️ Image'}
              {selectedElement.type === 'shape' && '⬜ Shape'}
              {selectedElement.type === 'pen' && '✏️ Pen'}
            </span>

            <button
              onClick={onDeleteElement}
              className="delete-element-btn-small"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* TEXT PROPERTIES */}
          {isTextSelected && textElement && (
            <div className="text-properties">
              <div className="property-row">
                <label>Font</label>
                <FontPicker
                  currentFont={textElement.fontFamily}
                  onFontChange={handleFontFamilyChange}
                />
              </div>

              <div className="property-row">
                <label>Size</label>
                <div className="font-size-control">
                  <button
                    onClick={() => handleFontSizeChange(-4)}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={textElement.fontSize}
                    onChange={(e) =>
                      handleFontSizeInput(e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleFontSizeChange(4)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="property-row">
                <label>Style</label>
                <div className="style-buttons">
                  <button
                    onClick={handleFontWeightToggle}
                    className={
                      textElement.fontWeight === 'bold'
                        ? 'active'
                        : ''
                    }
                  >
                    B
                  </button>
                  <button
                    onClick={handleFontStyleToggle}
                    className={
                      textElement.fontStyle === 'italic'
                        ? 'active'
                        : ''
                    }
                  >
                    I
                  </button>
                </div>
              </div>

              <div className="property-row">
                <label>Align</label>
                <div className="align-buttons-row">
                  <button
                    onClick={() =>
                      handleAlignChange('left')
                    }
                  >
                    L
                  </button>
                  <button
                    onClick={() =>
                      handleAlignChange('center')
                    }
                  >
                    C
                  </button>
                  <button
                    onClick={() =>
                      handleAlignChange('right')
                    }
                  >
                    R
                  </button>
                </div>
              </div>

              <div className="property-row">
                <label>Color</label>
                <input
                  type="color"
                  value={textElement.fill}
                  onChange={(e) =>
                    handleColorChange(e.target.value)
                  }
                />
              </div>

              <div className="property-row">
                <label>Content</label>
                <textarea
                  value={textElement.content}
                  onChange={(e) =>
                    onUpdateSelectedElement({
                      content: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="sidebar-content">
        {sections.map(({ key, icon: Icon, label }) => (
          <div key={key} className="sidebar-section">
            <button
              className="section-header"
              onClick={() => toggleSection(key)}
            >
              <div>
                <Icon size={18} />
                <span>{label}</span>
              </div>
              {openSections.has(key) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openSections.has(key) && (
              <div className="section-content">
                {key === 'templates' && (
                  <TemplatesControl
                    onApplyTemplate={onApplyTemplate}
                  />
                )}

                {key === 'background' && (
                  <BackgroundControl
                    currentColor={currentBackgroundColor}
                    onColorChange={onBackgroundChange}
                  />
                )}

                {key === 'text' && (
                  <TextControl onAddText={onAddText} />
                )}

                {key === 'image' && (
                  <ImageControl
                    onAddImage={onAddImage}
                    onUploadScreenshot={onUploadScreenshot}
                    hasBackgroundImage={hasBackgroundImage}
                    onRemoveBackgroundImage={
                      onRemoveBackgroundImage
                    }
                  />
                )}

                {key === 'elements' && (
                  <ElementsControl
                    onAddElement={onAddShape}
                  />
                )}

                {key === 'pen' && (
                  <PenControl
                    penColor={penColor}
                    penWeight={penWeight}
                    onColorChange={onPenColorChange}
                    onWeightChange={onPenWeightChange}
                    onPenModeChange={onPenModeChange}
                    onEraserModeChange={onEraserModeChange}
                    isPenMode={isPenMode}
                    isEraserMode={isEraserMode}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
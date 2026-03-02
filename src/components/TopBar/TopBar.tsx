'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Undo2,
    Redo2,
    Eye,
    Save
} from 'lucide-react';
import ExportOptions, { ExportOptions as ExportOptionsType } from './ExportOptions';

interface TopBarProps {
    projectName: string;
    onProjectNameChange: (name: string) => void;
    onExport: (options: ExportOptionsType) => void;
    onTogglePreview: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    screenshotCount: number;
    onSaveTemplate: () => void;
}

export default function TopBar({ 
    projectName, 
    onProjectNameChange, 
    onExport, 
    onTogglePreview,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    screenshotCount,
    onSaveTemplate
}: TopBarProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(projectName);

    const handleSubmit = () => {
        onProjectNameChange(editValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setEditValue(projectName);
            setIsEditing(false);
        }
    };

    return (
        <header className="top-bar">
            <div className="top-bar-left">
                <button className="top-bar-nav-btn" title="Back">
                    <ChevronLeft size={20} />
                </button>

                {isEditing ? (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="project-name-input"
                        autoFocus
                    />
                ) : (
                    <h1
                        className="project-name"
                        onClick={() => setIsEditing(true)}
                        title="Click to edit project name"
                    >
                        {projectName}
                    </h1>
                )}
            </div>

            <div className="top-bar-center">
                <button 
                    className="top-bar-action-btn" 
                    title="Undo (Ctrl+Z)" 
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    <Undo2 size={18} />
                </button>
                <button 
                    className="top-bar-action-btn" 
                    title="Redo (Ctrl+Y)" 
                    onClick={onRedo}
                    disabled={!canRedo}
                >
                    <Redo2 size={18} />
                </button>
            </div>

            <div className="top-bar-right">
                <button
                    className="top-bar-action-btn"
                    title="Preview Mode"
                    onClick={onTogglePreview}
                >
                    <Eye size={18} />
                </button>
                <button
                    className="top-bar-action-btn"
                    title="Save current screen as template"
                    onClick={onSaveTemplate}
                >
                    <Save size={16} />
                </button>
                <ExportOptions 
                    onExport={onExport}
                    screenshotCount={screenshotCount}
                />
                <button className="top-bar-nav-btn" title="Next">
                    <ChevronRight size={20} />
                </button>
            </div>
        </header>
    );
}

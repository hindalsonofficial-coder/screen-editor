'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Undo2,
    Redo2
} from 'lucide-react';

interface TopBarProps {
    projectName: string;
    onProjectNameChange: (name: string) => void;
}

export default function TopBar({ projectName, onProjectNameChange }: TopBarProps) {
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
                <button className="top-bar-action-btn" title="Undo" disabled>
                    <Undo2 size={18} />
                </button>
                <button className="top-bar-action-btn" title="Redo" disabled>
                    <Redo2 size={18} />
                </button>
            </div>

            <div className="top-bar-right">
                <button className="export-btn" title="Export (Coming soon)" disabled>
                    <Download size={18} />
                    <span>Export</span>
                </button>
                <button className="top-bar-nav-btn" title="Next">
                    <ChevronRight size={20} />
                </button>
            </div>
        </header>
    );
}

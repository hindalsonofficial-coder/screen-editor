import React from 'react';
import { Layer, Line } from 'react-konva';

interface GridLayerProps {
    width: number;
    height: number;
    scale: number;
}

export default function GridLayer({ width, height, scale }: GridLayerProps) {
    // We want a fixed grid size regardless of zoom, but transforming with the stage. 
    // Actually, simple grid is often better if it stays static or scales.
    // Let's implement a large grid that covers the viewport.

    // Grid spacing
    const gridSize = 40;

    // Calculate start/end based on viewport isn't strictly necessary if we just draw a huge grid,
    // but optimized is better. For now, let's draw a grid that is large enough.
    // However, since this is inside the Stage which transforms, we need to be careful.
    // If we put it in a separate Layer that DOES NOT scale, it's a static overlay.
    // If we put it in the same Stage, it scales.
    // Generally, editors have grids that scale with content.

    const lines = [];

    // Calculate logical bounds visible
    // This is complex to perfect. Let's do a simple large grid centered around 0,0 
    // or just cover the expected area.

    const maxDimension = Math.max(width, height) / scale * 3; // buffer
    const start = -maxDimension;
    const end = maxDimension;

    for (let i = start; i <= end; i += gridSize) {
        lines.push(
            <Line
                key={`v-${i}`}
                points={[i, start, i, end]}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={1}
            />
        );
        lines.push(
            <Line
                key={`h-${i}`}
                points={[start, i, end, i]}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={1}
            />
        );
    }

    return (
        <Layer listening={false}>
            {lines}
        </Layer>
    );
}

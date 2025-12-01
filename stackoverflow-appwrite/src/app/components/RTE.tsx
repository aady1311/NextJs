"use client";

import dynamic from "next/dynamic";

const RTE = dynamic(
    () => import("@uiw/react-md-editor") as Promise<any>,
    { ssr: false }
);

// Simple markdown preview component
export const MarkdownPreview = ({ source, className }: { source: string; className?: string }) => {
    return (
        <div className={`prose max-w-none ${className || ''}`}>
            <div dangerouslySetInnerHTML={{ __html: source.replace(/\n/g, '<br>') }} />
        </div>
    );
};

export default RTE;

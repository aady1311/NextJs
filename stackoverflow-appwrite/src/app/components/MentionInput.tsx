"use client";
import { useState, useRef, KeyboardEvent } from 'react';

interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    onMention?: (mentions: string[]) => void;
}

export default function MentionInput({ 
    value, 
    onChange, 
    placeholder = "Type your message... Use @ to mention someone",
    className = "",
    onMention
}: MentionInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        
        // Extract mentions and notify parent
        if (onMention) {
            const mentions = extractMentions(newValue);
            onMention(mentions);
        }
    };

    const extractMentions = (text: string): string[] => {
        const mentionRegex = /@(\w+(?:\.\w+)*@?\w*\.?\w*)/g;
        const mentions: string[] = [];
        let match;
        
        while ((match = mentionRegex.exec(text)) !== null) {
            mentions.push(match[1]);
        }
        
        return mentions;
    };

    const renderHighlightedText = () => {
        if (!value) return null;
        
        const parts = value.split(/(@\w+(?:\.\w+)*@?\w*\.?\w*)/g);
        
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return (
                    <span key={index} className="text-blue-400 font-medium">
                        {part}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="relative">
            {/* Highlighted text overlay */}
            <div 
                className={`absolute inset-0 p-3 text-transparent pointer-events-none whitespace-pre-wrap break-words ${className}`}
                style={{ 
                    font: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit'
                }}
            >
                {renderHighlightedText()}
            </div>
            
            {/* Actual textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={`relative bg-transparent resize-none ${className}`}
                style={{ caretColor: 'white' }}
            />
            
            {/* Mention hint */}
            {value.includes('@') && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300">
                    💡 Tip: Type @username or @email to mention someone
                </div>
            )}
        </div>
    );
}
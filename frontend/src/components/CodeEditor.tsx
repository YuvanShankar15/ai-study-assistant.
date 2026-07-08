'use client';

import React from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  height?: string;
}

export function CodeEditor({ language, value, onChange, height = '400px' }: CodeEditorProps) {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      // We could add custom theme or configurations here in the future
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#00000000', // Transparent or match site's dark mode
        },
      });
      monaco.editor.setTheme('vs-dark');
    }
  }, [monaco]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black/40 backdrop-blur-md">
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontLigatures: true,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
        }}
        loading={<div className="flex items-center justify-center h-full text-white/50">Loading editor...</div>}
      />
    </div>
  );
}

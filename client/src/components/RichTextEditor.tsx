import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Start typing..."}
        className="bg-background text-foreground"
      />
      
      <style>{`
        .rich-text-editor .ql-toolbar {
          background: oklch(0.14 0.02 240);
          border: 1px solid oklch(0.28 0.02 240);
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .rich-text-editor .ql-container {
          background: oklch(0.10 0.015 240);
          border: 1px solid oklch(0.28 0.02 240);
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: Inter, system-ui, sans-serif;
          font-size: 14px;
          min-height: 200px;
        }
        
        .rich-text-editor .ql-editor {
          color: oklch(0.92 0.01 240);
          min-height: 200px;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: oklch(0.60 0.02 240);
          font-style: italic;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: oklch(0.75 0.01 240);
        }
        
        .rich-text-editor .ql-fill {
          fill: oklch(0.75 0.01 240);
        }
        
        .rich-text-editor .ql-picker-label {
          color: oklch(0.75 0.01 240);
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: oklch(0.75 0.18 195);
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: oklch(0.75 0.18 195);
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: oklch(0.75 0.18 195);
        }
      `}</style>
    </div>
  );
}

import React, { useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  HiBold, HiOutlinePhotograph,
} from "react-icons/hi";

// ─── Toolbar Button ────────────────────────────────────────────────
const ToolBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className={`p-1.5 rounded-lg transition-all text-sm font-medium select-none
      ${active
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
  >
    {children}
  </button>
);

// ─── Icon helpers (inline SVG so no extra deps needed) ─────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
);

const ICONS = {
  bold:       "M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z",
  italic:     "M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z",
  underline:  "M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z",
  strike:     "M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.69 1.23 1.64 1.3 2.95H15c-.09-.68-.32-1.2-.7-1.59-.49-.51-1.35-.82-2.35-.82-1.91 0-2.99.97-2.99 2.17 0 .52.21.97.63 1.33.72.61 2.03.87 3.15 1.07 2.59.47 4.26 1.37 4.26 3.64 0 2.26-1.84 3.97-5.18 3.97-1.72 0-3.28-.49-4.2-1.36C6.85 14.8 6.44 13.8 6.4 12.5H8c.09.84.36 1.42.8 1.85.57.55 1.57.89 2.92.89 2.09 0 3.18-.93 3.18-2.14 0-.63-.25-1.13-.74-1.51-.57-.45-1.46-.71-2.44-.87-2.6-.46-4.83-1.32-4.83-3.64M5 11h14v2H5z",
  h1:         "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v4H6V7h2v4h4V7h2v10z",
  h2:         "M3 17v2h6v-2H3zm6.5-7h-2v1h2c.55 0 1 .45 1 1s-.45 1-1 1h-2v1h2c1.1 0 2-.9 2-2s-.9-2-2-2zM19 17h-2v-4H13v4h-2V7h2v4h4V7h2v10z",
  ul:         "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z",
  ol:         "M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-8v2h14V3H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z",
  blockquote: "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z",
  code:       "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  link:       "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  alignL:     "M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z",
  alignC:     "M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z",
  alignR:     "M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z",
  image:      "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  undo:       "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
  redo:       "M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z",
};

// ─── Main Component ────────────────────────────────────────────────
const RichTextEditor = ({ value, onChange, label = "Content *" }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── exec helper ─────────────────────────────────────────────────
  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    // sync content back
    onChange(editorRef.current?.innerHTML || "");
  }, [onChange]);

  // ── query helper ────────────────────────────────────────────────
  const is = (cmd) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  // ── insert image (imgBB upload) ──────────────────────────────────
  const handleImageFile = useCallback(async (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) { toast.error("Only JPG, PNG, WebP, GIF allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be < 5MB"); return; }

    const toastId = toast.loading("Uploading image…");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/upload/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );
      const url = res.data.data.url;
      editorRef.current?.focus();
      document.execCommand("insertHTML", false,
        `<img src="${url}" alt="uploaded" style="max-width:100%;border-radius:8px;margin:8px 0;" />`
      );
      onChange(editorRef.current?.innerHTML || "");
      toast.success("Image inserted!", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed", { id: toastId });
    }
  }, [onChange]);

  // ── drag-drop images into editor ─────────────────────────────────
  const handleDrop = useCallback((e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file?.type?.startsWith("image/")) {
      e.preventDefault();
      handleImageFile(file);
    }
  }, [handleImageFile]);

  // ── paste images ─────────────────────────────────────────────────
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        handleImageFile(item.getAsFile());
        return;
      }
    }
  }, [handleImageFile]);

  // ── insert link ──────────────────────────────────────────────────
  const insertLink = useCallback(() => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  }, [exec]);

  // ── set alignment (needs block-level wrapper) ────────────────────
  const align = useCallback((direction) => {
    exec("justify" + direction);
  }, [exec]);

  // ── sync on input ────────────────────────────────────────────────
  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML || "");
  }, [onChange]);

  // ── set initial HTML ─────────────────────────────────────────────
  // Only set once on mount / when value changes externally (avoid cursor jump)
  const lastExternal = useRef(value);
  if (editorRef.current && value !== lastExternal.current && value !== editorRef.current.innerHTML) {
    editorRef.current.innerHTML = value || "";
    lastExternal.current = value;
  }

  return (
    <div className="w-full space-y-1.5">
      <label className="block text-xs font-medium text-slate-400">{label}</label>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="bg-slate-800 border border-slate-700 rounded-t-xl px-3 py-2 flex flex-wrap items-center gap-1">
        {/* Text style */}
        <ToolBtn onClick={() => exec("bold")}      active={is("bold")}      title="Bold (Ctrl+B)">
          <Icon d={ICONS.bold} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("italic")}    active={is("italic")}    title="Italic (Ctrl+I)">
          <Icon d={ICONS.italic} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("underline")} active={is("underline")} title="Underline (Ctrl+U)">
          <Icon d={ICONS.underline} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("strikeThrough")} active={is("strikeThrough")} title="Strikethrough">
          <Icon d={ICONS.strike} />
        </ToolBtn>

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Headings */}
        <ToolBtn onClick={() => exec("formatBlock", "h1")} title="Heading 1">
          <Icon d={ICONS.h1} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("formatBlock", "h2")} title="Heading 2">
          <Icon d={ICONS.h2} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("formatBlock", "p")}  title="Paragraph">
          <span className="text-xs font-medium px-0.5">¶</span>
        </ToolBtn>

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Lists */}
        <ToolBtn onClick={() => exec("insertUnorderedList")} active={is("insertUnorderedList")} title="Bullet List">
          <Icon d={ICONS.ul} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("insertOrderedList")} active={is("insertOrderedList")} title="Numbered List">
          <Icon d={ICONS.ol} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("formatBlock", "blockquote")} title="Blockquote">
          <Icon d={ICONS.blockquote} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("formatBlock", "pre")} title="Code Block">
          <Icon d={ICONS.code} />
        </ToolBtn>

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Alignment */}
        <ToolBtn onClick={() => align("Left")}   title="Align Left">
          <Icon d={ICONS.alignL} />
        </ToolBtn>
        <ToolBtn onClick={() => align("Center")} title="Align Center">
          <Icon d={ICONS.alignC} />
        </ToolBtn>
        <ToolBtn onClick={() => align("Right")}  title="Align Right">
          <Icon d={ICONS.alignR} />
        </ToolBtn>

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Link */}
        <ToolBtn onClick={insertLink} title="Insert Link">
          <Icon d={ICONS.link} />
        </ToolBtn>

        {/* Image upload */}
        <ToolBtn onClick={() => fileInputRef.current?.click()} title="Insert Image (uploads to imgBB)">
          <Icon d={ICONS.image} />
        </ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleImageFile(e.target.files[0])}
        />

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Undo / Redo */}
        <ToolBtn onClick={() => exec("undo")} title="Undo (Ctrl+Z)">
          <Icon d={ICONS.undo} />
        </ToolBtn>
        <ToolBtn onClick={() => exec("redo")} title="Redo (Ctrl+Y)">
          <Icon d={ICONS.redo} />
        </ToolBtn>
      </div>

      {/* ── Editable area ──────────────────────────────────────── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onDrop={handleDrop}
        onPaste={handlePaste}
        spellCheck
        className={`
          min-h-[400px] w-full bg-slate-800 border border-t-0 border-slate-700 rounded-b-xl
          px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500
          transition-all overflow-y-auto
          prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-p:text-slate-200
          prose-a:text-blue-400 prose-a:underline
          prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-300
          prose-code:bg-slate-900 prose-code:text-emerald-400 prose-code:rounded prose-code:px-1
          prose-pre:bg-slate-900 prose-pre:text-emerald-400 prose-pre:rounded-xl prose-pre:p-4
          prose-img:rounded-xl prose-img:max-w-full
          [&_img]:cursor-move
        `}
        style={{ lineHeight: 1.8 }}
        data-placeholder="Write your blog content here… Drag & drop or paste images directly!"
      />

      {/* placeholder via CSS */}
      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #64748b;
          pointer-events: none;
        }
        [contenteditable] img { display: inline-block; }
        [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #cbd5e1;
          font-style: italic;
        }
        [contenteditable] pre {
          background: #0f172a;
          color: #34d399;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.85em;
          margin: 0.5rem 0;
        }
        [contenteditable] h1 { font-size: 1.75rem; font-weight: 700; margin: 0.75rem 0; color: white; }
        [contenteditable] h2 { font-size: 1.35rem; font-weight: 600; margin: 0.6rem 0; color: white; }
        [contenteditable] a  { color: #60a5fa; text-decoration: underline; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; }
        [contenteditable] li { margin: 0.2rem 0; color: #e2e8f0; }
      `}</style>

      <p className="text-xs text-slate-600">
        Drag & drop or paste images — they auto-upload to imgBB.
        Supports bold, italic, headings, lists, code blocks, alignment &amp; more.
      </p>
    </div>
  );
};

export default RichTextEditor;

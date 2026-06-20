import { useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

export default function Editor({
  code,
  setCode,
  language,
  setSelectedRange,
  highlightedRange,
}) {
  const editorRef = useRef(null);

  const handleEditorMount = (
    editor,
    monaco
  ) => {
    editorRef.current = editor;

    editor.onDidChangeCursorSelection(
      (event) => {
        const selection =
          event.selection;

        if (
          selection.startLineNumber ===
            selection.endLineNumber &&
          selection.startColumn ===
            selection.endColumn
        ) {
          setSelectedRange(
            null
          );
          return;
        }

        setSelectedRange({
          startLine:
            selection.startLineNumber,
          endLine:
            selection.endLineNumber,
        });
      }
    );
  };

  useEffect(() => {
    if (
      !highlightedRange ||
      !editorRef.current
    )
      return;

    editorRef.current.revealLineInCenter(
      highlightedRange.startLine
    );

    editorRef.current.setSelection(
      {
        startLineNumber:
          highlightedRange.startLine,

        startColumn: 1,

        endLineNumber:
          highlightedRange.endLine,

        endColumn: 1,
      }
    );

    editorRef.current.focus();
  }, [highlightedRange]);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) =>
        setCode(value || "")
      }
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        automaticLayout: true,
      }}
      onMount={
        handleEditorMount
      }
    />
  );
}
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
  const decorationsRef = useRef([]);

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

    const editor =
      editorRef.current;

    editor.revealLineInCenter(
      highlightedRange.startLine
    );

    decorationsRef.current =
      editor.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: {
              startLineNumber:
                highlightedRange.startLine,

              startColumn: 1,

              endLineNumber:
                highlightedRange.endLine,

              endColumn: 1,
            },

            options: {
              isWholeLine: true,
              className:
                "comment-highlight",
            },
          },
        ]
      );
  }, [highlightedRange]);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs"
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
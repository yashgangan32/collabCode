import MonacoEditor from "@monaco-editor/react";

export default function Editor({
  code,
  setCode,
  language, setSelectedRange,
}) {


  //handling actions in editor box
const handleEditorMount = (
  editor,
  monaco
) => {
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
      setSelectedRange(null);
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
      onMount={handleEditorMount}
    />
  );
}
import MonacoEditor from "@monaco-editor/react";

export default function Editor({
  code,
  setCode,
  language,
}) {
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
    />
  );
}
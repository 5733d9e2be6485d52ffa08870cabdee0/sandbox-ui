import React, { useCallback, VoidFunctionComponent } from "react";
import * as monacoEditor from "monaco-editor";
import MonacoEditor from "./camelDSLutils";
import "./CamelDSLCodeEditor.css";

export interface CamelDSLCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  width?: string | number;
  height?: string | number;
}

interface Range {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}

interface Suggestion {
  label: string;
  kind: number;
  documentation: string;
  insertText: string;
  range: Range;
}

const CamelDSLCodeEditor: VoidFunctionComponent<CamelDSLCodeEditorProps> = (
  props
) => {
  const { code, onChange, width = "100%", height = "500" } = props;

  const createToProposals = useCallback((range: Range): Suggestion[] => {
    return [
      {
        label: '"mySinkName"',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        documentation: "This is a sink I created before.",
        insertText: '"mySinkName"',
        range: range,
      },
      {
        label: '"mySecondSinkName"',
        kind: monacoEditor.languages.CompletionItemKind.Function,
        documentation: "This is a sink I created before.",
        insertText: '"mySecondSinkName"',
        range: range,
      },
    ];
  }, []);

  const onEditorWillMount = useCallback(
    (editorInstance: typeof monacoEditor): void => {
      editorInstance.languages.registerCompletionItemProvider("yaml", {
        provideCompletionItems: function (model, position) {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          const match = textUntilPosition.match(/to\s*:\s("[^"]*"\s*)?$/);
          if (!match) {
            return { suggestions: [] };
          }
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: createToProposals(range),
          };
        },
      });
    },
    [createToProposals]
  );

  const onEditorMount = useCallback(
    (editorInstance: monacoEditor.editor.IStandaloneCodeEditor): void => {
      const model = editorInstance.getModel();
      if (model) {
        model.updateOptions({ tabSize: 2 });
      }
    },
    []
  );

  return (
    <div className="camel-editor">
      <MonacoEditor
        width={width}
        height={height}
        language="yaml"
        value={code}
        options={{
          scrollbar: { alwaysConsumeMouseWheel: false },
        }}
        onChange={onChange}
        editorWillMount={onEditorWillMount}
        editorDidMount={onEditorMount}
      />
    </div>
  );
};

export default CamelDSLCodeEditor;

import React, {
  useCallback,
  useEffect,
  useRef,
  VoidFunctionComponent,
} from "react";
import * as monacoEditor from "monaco-editor";
import MonacoEditor from "./camelDSLutils";
import "./CamelDSLCodeEditor.css";

export interface CamelDSLCodeEditorProps {
  /** The initial content of the code editor */
  code: string;
  /** Callback for changes in the code */
  onChange: (value: string) => void;
  /** Width of the code editor */
  width?: string | number;
  /** Height of the code editor */
  height?: string | number;
  /** Sink names to use as suggested values for the 'to' property */
  sinkConnectorsNames: string[];
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
  const {
    code,
    onChange,
    width = "100%",
    height = "100%",
    sinkConnectorsNames,
  } = props;

  const completionProvider = useRef<monacoEditor.IDisposable>();

  const createToProposals = useCallback(
    (range: Range): Suggestion[] => {
      return (sinkConnectorsNames ?? []).map((name) => ({
        label: `"${name}"`,
        kind: monacoEditor.languages.CompletionItemKind.Function,
        documentation: "This is a sink I created before.",
        insertText: `"${name}"`,
        range: range,
      }));
    },
    [sinkConnectorsNames]
  );

  useEffect(() => {
    // disposing the completion provider on component unmount to avoid duplicated suggestions
    return () => {
      completionProvider.current?.dispose();
    };
  });

  const onEditorWillMount = useCallback(
    (editorInstance: typeof monacoEditor): void => {
      completionProvider.current =
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
      <div className="camel-editor-inner">
        <MonacoEditor
          width={width}
          height={height}
          language="yaml"
          value={code}
          options={{
            scrollbar: { alwaysConsumeMouseWheel: false },
            scrollBeyondLastLine: false,
          }}
          onChange={onChange}
          editorWillMount={onEditorWillMount}
          editorDidMount={onEditorMount}
        />
      </div>
    </div>
  );
};

export default CamelDSLCodeEditor;

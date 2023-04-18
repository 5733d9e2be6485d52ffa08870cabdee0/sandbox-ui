import React, {
  useCallback,
  useEffect,
  useRef,
  VoidFunctionComponent,
} from "react";
import * as monacoEditor from "monaco-editor";
import { CodeEditor, Language } from "./camelDSLutils";
import "./CamelDSLCodeEditor.css";

export interface CamelDSLCodeEditorProps {
  /** The initial content of the code editor */
  code: string;
  /** Callback for changes in the code */
  onChange: (value: string) => void;
  /** Callback for changes in the validation status */
  onValidate: (errorsCount: number, warningsCount: number) => void;
  /** Width of the code editor */
  width?: string | number;
  /** Height of the code editor */
  height?: string | number;
  /** Editor is Read-only */
  readOnly: boolean;
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
  const { code, onChange, onValidate, readOnly, sinkConnectorsNames } = props;

  const completionProvider = useRef<monacoEditor.IDisposable>();

  const updateErrorStatus = useCallback(
    (errorCount: number, warningsCount: number): void => {
      onValidate(errorCount, warningsCount);
    },
    [onValidate]
  );

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
    (
      editor: monacoEditor.editor.IStandaloneCodeEditor,
      editorInstance: typeof monacoEditor
    ): void => {
      editor.addCommand(
        editorInstance.KeyMod.Shift | editorInstance.KeyCode.Tab,
        () => {
          void editor.getAction("editor.action.outdentLines")?.run();
          console.log("doing a shift tab");
        }
      );
      completionProvider.current =
        editorInstance.languages.registerCompletionItemProvider("yaml", {
          provideCompletionItems: function (model, position) {
            const textUntilPosition = model.getValueInRange({
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            const match = textUntilPosition.match(
              /to\s*:\s*uri\s*:\s("[^"]*"\s*)?$/
            );
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

  useEffect(() => {
    const onMarkersChange = monacoEditor.editor.onDidChangeMarkers(
      ([resource]) => {
        const markers: monacoEditor.editor.IMarker[] =
          monacoEditor.editor.getModelMarkers({ resource });
        const errors = markers.filter(
          (marker) => marker.severity === monacoEditor.MarkerSeverity.Error
        );
        const warnings = markers.filter(
          (marker) => marker.severity === monacoEditor.MarkerSeverity.Warning
        );
        updateErrorStatus(errors.length, warnings.length);
      }
    );
    return () => {
      onMarkersChange.dispose();
    };
  }, [updateErrorStatus]);

  return (
    <div className="camel-editor">
      <div className="camel-editor-inner">
        <CodeEditor
          width={"100%"}
          height={"100%"}
          language={Language.yaml}
          code={code}
          options={{
            scrollbar: { alwaysConsumeMouseWheel: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly,
            tabSize: 2,
          }}
          onChange={onChange}
          onEditorDidMount={onEditorWillMount}
          isLanguageLabelVisible={true}
          isDownloadEnabled={true}
          isCopyEnabled={true}
        />
      </div>
    </div>
  );
};

export default CamelDSLCodeEditor;

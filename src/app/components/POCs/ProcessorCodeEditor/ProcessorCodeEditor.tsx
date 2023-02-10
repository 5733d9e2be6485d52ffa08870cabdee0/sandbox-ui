import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent,
} from "react";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";
import {
  Alert,
  Button,
  Flex,
  FlexItem,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import "./ProcessorCodeEditor.css";

export interface ProcessorCodeEditorProps {
  code: string;
  onGuideClick: () => void;
  onChange: (value: string) => void;
  onValidate: (errorsCount: number) => void;
  sinkConnectorsNames: string[];
  errors?: number;
  readOnly?: boolean;
}

const ProcessorCodeEditor: VoidFunctionComponent<ProcessorCodeEditorProps> = (
  props
) => {
  const {
    code,
    onChange,
    onValidate,
    onGuideClick,
    readOnly = false,
    sinkConnectorsNames,
    errors,
  } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const [codeInitialValue, setCodeInitialValue] = useState(code);

  const handleChange = useCallback(
    (value: string): void => {
      onChange?.(value);
    },
    [onChange]
  );

  const handleValidation = useCallback(
    (errors: number, warnings: number): void => {
      onValidate?.(errors + warnings);
    },
    [onValidate]
  );

  const editor = useMemo(
    () => (
      <CamelDSLCodeEditor
        code={codeInitialValue}
        onChange={handleChange}
        onValidate={handleValidation}
        readOnly={readOnly}
        sinkConnectorsNames={sinkConnectorsNames}
        height={"100%"}
      />
    ),
    [
      codeInitialValue,
      handleChange,
      handleValidation,
      readOnly,
      sinkConnectorsNames,
    ]
  );

  useEffect(() => {
    if (readOnly) {
      setCodeInitialValue(code);
    }
  }, [readOnly, code]);

  return (
    <Flex
      className={"processor-code-editor"}
      direction={{ default: "column" }}
      flexWrap={{ default: "nowrap" }}
    >
      <FlexItem>
        <Split>
          <SplitItem isFilled={true}>
            <Button variant="link" isInline={true} onClick={onGuideClick}>
              {t("processor.processorYAMLGuide")}
            </Button>
          </SplitItem>
          {errors !== undefined && (
            <SplitItem>
              {errors > 0 ? (
                <Alert
                  variant="danger"
                  isInline
                  isPlain
                  title={t("processor.issuesFound", {
                    count: errors,
                  })}
                />
              ) : (
                <span>{t("processor.noIssuesFound")}</span>
              )}
            </SplitItem>
          )}
        </Split>
      </FlexItem>
      <FlexItem
        className={"processor-code-editor__editing-container"}
        flex={{ default: "flex_2" }}
      >
        {editor}
      </FlexItem>
    </Flex>
  );
};

export default ProcessorCodeEditor;

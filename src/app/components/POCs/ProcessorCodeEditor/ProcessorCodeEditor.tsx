import React, { useCallback, VoidFunctionComponent } from "react";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import "./ProcessorCodeEditor.css";

export interface ProcessorCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onValidate: (isValid: boolean) => void;
  onGuideClick: () => void;
  sinkConnectorsNames: string[];
}

const ProcessorCodeEditor: VoidFunctionComponent<ProcessorCodeEditorProps> = (
  props
) => {
  const { code, onChange, onValidate, onGuideClick, sinkConnectorsNames } =
    props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const handleChange = useCallback(
    (value: string): void => {
      onChange(value);
    },
    [onChange]
  );

  const handleValidation = useCallback(
    (errors: number, warnings: number): void => {
      onValidate(errors + warnings === 0);
    },
    [onValidate]
  );

  return (
    <Flex
      className={"processor-code-editor"}
      direction={{ default: "column" }}
      flexWrap={{ default: "nowrap" }}
    >
      <FlexItem>
        <Button variant="link" onClick={onGuideClick}>
          {t("processor.processorYAMLGuide")}
        </Button>
      </FlexItem>
      <FlexItem
        className={"processor-code-editor__editing-container"}
        flex={{ default: "flex_2" }}
      >
        <CamelDSLCodeEditor
          code={code}
          onChange={handleChange}
          onValidate={handleValidation}
          sinkConnectorsNames={sinkConnectorsNames}
          height={"100%"}
        />
      </FlexItem>
    </Flex>
  );
};

export default ProcessorCodeEditor;

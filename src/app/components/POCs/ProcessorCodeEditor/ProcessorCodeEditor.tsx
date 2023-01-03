import React, { useCallback, VoidFunctionComponent } from "react";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

export interface ProcessorCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onValidate: (isValid: boolean) => void;
}

const ProcessorCodeEditor: VoidFunctionComponent<ProcessorCodeEditorProps> = (
  props
) => {
  const { code, onChange, onValidate } = props;
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
      direction={{ default: "column" }}
      style={{ height: "100%" }}
      flexWrap={{ default: "nowrap" }}
    >
      <FlexItem>
        <Button variant="link">{t("processor.processorYAMLGuide")}</Button>
      </FlexItem>
      <FlexItem flex={{ default: "flex_2" }} style={{ minHeight: 0 }}>
        <CamelDSLCodeEditor
          code={code}
          onChange={handleChange}
          onValidate={handleValidation}
          sinkConnectorsNames={[]}
          height={"100%"}
        />
      </FlexItem>
    </Flex>
  );
};

export default ProcessorCodeEditor;

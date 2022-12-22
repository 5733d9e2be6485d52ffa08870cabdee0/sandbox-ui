import React, { VoidFunctionComponent } from "react";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

export interface ProcessorCodeEditorProps {
  code: string;
}

const ProcessorCodeEditor: VoidFunctionComponent<ProcessorCodeEditorProps> = (
  props
) => {
  const { code } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const onChange = (value: string): void => {
    console.log(value);
  };

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
          onChange={onChange}
          sinkConnectorsNames={[]}
          height={"100%"}
        />
      </FlexItem>
    </Flex>
  );
};

export default ProcessorCodeEditor;
